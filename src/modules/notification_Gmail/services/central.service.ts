// src/modules/notification_Gmail/services/central.service.ts
import { v4 as uuidv4 } from "uuid";
import { notificacionGmailController } from "../../../controllers/notificacionGmail.controller";
import connectDB from "../../../config/database";
import {
  InvalidNotificationDataError,
  NotificationCreationError,
  NotificationProviderError,
} from "../errors/notification.errors";
import dns from "dns";
import { sendEmailOAuth2 } from "../providers/gmail.api"; // ✅ Reemplazo directo del flujo de n8n/Abstract

// ======= Interfaces principales =======
interface Destination {
  email: string;
  name?: string;
}

interface CreateNotificationInput {
  subject: string;
  message: string;
  destinations: Destination[];
  type?: string;
  fromName?: string;
}

// ✅ Estructura esperada de la respuesta del proveedor (Gmail)
interface GmailSendResponse {
  success: boolean;
  messageId?: string;
  threadId?: string;
  labelIds?: string[];
  [key: string]: any;
}

// =======================================

export class CentralNotificationService {
  async receiveAndSend(data: CreateNotificationInput) {
     // 🔹 0️⃣ Asegurar conexión antes de cualquier operación con MongoD
    await connectDB();

    // --- 1️⃣ Validar estructura del payload
    this.validatePayload(data);

    const transactionId = uuidv4();
    const toEmails = data.destinations.map((d) => d.email);
    const to = toEmails[0];

    // --- 2️⃣ Validación previa del email ---
    try {
      await this.basicValidateEmail(to);
    } catch (err) {
      throw new InvalidNotificationDataError({
        message: "Error en validación del correo",
        details: { email: to, reason: (err as Error).message },
      });
    }

    // --- 3️⃣ Envío con Gmail OAuth2 ---
    let notification; // Declaración única
    try {
      const gmailResult = await this.sendViaGmail({
        to,
        subject: data.subject,
        message: data.message,
      });

      // --- 4️⃣ Registrar en la base de datos ---
      const notificationData = {
        transactionId,
        message: {
          subject: data.subject,
          content: data.message,
        },
        destinations: data.destinations,
        channel: "gmail-api",
        status: gmailResult.success ? "sent" : "failed",
        meta: { createdAt: new Date() },
        attempts: 1,
        providerResponse: gmailResult,
        sentAt: new Date(),
      };

      // Creamos mocks de req y res para invocar al controlador interno
      const mockReq: any = { body: notificationData };
      const mockRes: any = {
        statusCode: 200,
        jsonData: null,
        status(code: number) {
          this.statusCode = code;
          return this;
        },
        json(data: any) {
          this.jsonData = data;
          return this;
        },
      };

      // Llamar directamente al método create del controlador base
      await notificacionGmailController.create(mockReq, mockRes);

      // Recuperamos la notificación creada (respuesta del controlador)
      notification = mockRes.jsonData;

      // --- 5️⃣ Retornar resumen de la operación ---
      return {
        success: gmailResult.success,
        transactionId,
        status: notification.status,
        response: gmailResult,
      };
    } catch (error) {
      throw new NotificationProviderError(
        "gmail-api",
        error instanceof Error ? error.message : "Unknown Gmail API error"
      );
    }
  }

  // --- helper: validación básica (formato + dominio + MX) ---
  private async basicValidateEmail(email: string): Promise<void> {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!email || !gmailRegex.test(email)) {
      throw new InvalidNotificationDataError({
        message: "Solo se permiten correos válidos de dominio @gmail.com",
        details: { email },
      });
    }

    const domain = email.split("@")[1];
    try {
      const mx = await dns.promises.resolveMx(domain);
      if (!mx || mx.length === 0) {
        throw new Error("No MX records found");
      }
    } catch {
      throw new InvalidNotificationDataError({
        message: "No se logra decifrar el dominio del correo",
        details: { domain },
      });
    }
  }

  // --- helper: envío real con Gmail API ---
  private async sendViaGmail({
    to,
    subject,
    message,
  }: {
    to: string;
    subject: string;
    message: string;
  }): Promise<GmailSendResponse> {
    try {
      const res = await sendEmailOAuth2({
        to,
        subject,
        html: message,
      });

      return {
        success: true,
        messageId: res.messageId ?? undefined, // ✅ Evita error de tipo null
        threadId: res.threadId ?? undefined,
        labelIds: res.labelIds ?? [],
      };
    } catch (err: any) {
      console.error("❌ Error al enviar correo con Gmail API:", err.message);
      return {
        success: false,
        error: err.message,
      };
    }
  }

  // --- helper: validación estructural del payload ---
  private validatePayload(data: CreateNotificationInput): void {
    if (!data) {
      throw new InvalidNotificationDataError({
        message: "Payload cannot be empty",
      });
    }

    const errors: Record<string, string> = {};

    if (!data.subject || typeof data.subject !== "string") {
      errors.subject = "Subject is required and must be a string";
    }

    if (!data.message || typeof data.message !== "string") {
      errors.message = "Message is required and must be a string";
    }

    if (!Array.isArray(data.destinations) || data.destinations.length === 0) {
      errors.destinations = "At least one destination is required";
    } else {
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

      data.destinations.forEach((d, index) => {
        if (!d.email || !gmailRegex.test(d.email)) {
          errors[`destinations[${index}].email`] =
            "Solo se permiten correos @gmail.com válidos";
        }
      });
    }

    if (Object.keys(errors).length > 0) {
      throw new InvalidNotificationDataError({
        message: "Dominio no reconocido, intente '@gmail.com'",
        details: errors,
      });
    }
  }
}
