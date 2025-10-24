// src/modules/notification/services/central.service.ts
import { v4 as uuidv4 } from "uuid";
import { saveNotification } from "../models/notification.model";
import { triggerN8nWebhook } from "./n8n.service";
import {
  InvalidNotificationDataError,
  NotificationCreationError,
  NotificationProviderError,
} from "../errors/notification.errors";
import dns from "dns";

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

// ✅ Estructura esperada de la respuesta del webhook
interface N8nWebhookResponse {
  success: boolean;
  is_smtp_valid?: boolean;
  details?: any;
  [key: string]: any;
}

// =======================================

export class CentralNotificationService {
  private ABSTRACT_API_KEY = "461d7a6858124c719fc58d8f20da5170";
  private ABSTRACT_TIMEOUT_MS = 5000;

  async receiveAndSend(data: CreateNotificationInput) {
    this.validatePayload(data);

    const transactionId = uuidv4();
    const toEmails = data.destinations.map((d) => d.email);
    const to = toEmails[0];

    // --------------- Verificación previa del email ----------------
    try {
      await this.basicValidateEmail(to);

      if (this.ABSTRACT_API_KEY) {
        const isValid = await this.verifyEmailWithProvider(to);
        if (!isValid) {
          throw new InvalidNotificationDataError({
            message: "El correo parece no ser entregable, o no existente",
            details: { email: to },
          });
        }
      }
    } catch (err) {
      if (err instanceof InvalidNotificationDataError) throw err;

      throw new InvalidNotificationDataError({
        message: "Error en validación del correo",
        details: { email: to, reason: (err as Error).message },
      });
    }
    // ----------------------------------------------------------------

    let notification; // ✅ Declaración única fuera del bloque

    try {
      const result: N8nWebhookResponse = await triggerN8nWebhook({
        email: to,
        subject: data.subject,
        message: data.message,
        id: transactionId,
        type: data.type ?? "generic",
      });

      if (result.is_smtp_valid === false) {
        throw new InvalidNotificationDataError({
          message: "El correo fue rechazado por validación SMTP",
          details: { email: to },
        });
      }

      // ✅ Registro de notificación solo si fue válida
      notification = await saveNotification({
        transactionId,
        subject: data.subject,
        message: data.message,
        destinations: data.destinations,
        channel: "n8n",
        status: result.success ? "sent" : "failed",
        meta: { createdAt: new Date() },
        attempts: 1,
        providerResponse: result,
        sentAt: new Date(),
      });

      return {
        success: result.success,
        transactionId,
        status: notification.status,
        response: result,
      };
    } catch (error) {
      if (error instanceof InvalidNotificationDataError) throw error;

      throw new NotificationProviderError(
        "n8n",
        error instanceof Error ? error.message : "Unknown provider error"
      );
    }
  }

  // --- helper: validación básica (formato + dominio + MX) ---
  private async basicValidateEmail(email: string): Promise<void> {
    // ✅ Solo permite correos que terminen en "@gmail.com"
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
        throw new Error("No MX records");
      }
    } catch {
      throw new InvalidNotificationDataError({
        message: "No se logra decifrar el dominio",
        details: { domain },
      });
    }
  }

  // --- helper: verificación con proveedor externo (Abstract API) ---
  private async verifyEmailWithProvider(email: string): Promise<boolean> {
    const apiKey = this.ABSTRACT_API_KEY;
    if (!apiKey) return true;

    const url = `https://emailreputation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(
      email
    )}`;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.ABSTRACT_TIMEOUT_MS);

    try {
      const res = await fetch(url, { method: "GET", signal: controller.signal });
      clearTimeout(id);
      if (!res.ok) {
        console.warn("Abstract API error status:", res.status);
        return true;
      }

      const body: any = await res.json();

      const smtpValid =
        (body?.is_smtp_valid &&
          (body.is_smtp_valid.value === true ||
            body.is_smtp_valid === true)) ||
        (body?.email_deliverability &&
          (body.email_deliverability.status === "deliverable" ||
            body.email_deliverability.status === "DELIVERABLE")) ||
        (body?.deliverability &&
          (body.deliverability === "DELIVERABLE" ||
            body.deliverability === "deliverable"));

      const disposable =
        (body?.is_disposable &&
          (body.is_disposable.value === true ||
            body.is_disposable === true)) ||
        (body?.email_quality && body.email_quality.is_disposable === true);

      if (disposable) return false;
      if (smtpValid) return true;

      return false;
    } catch (err: any) {
      clearTimeout(id);
      console.warn("Abstract API check failed:", err.message ?? err);
      return true;
    }
  }

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
      // ✅ Usa el mismo filtro estricto de @gmail.com
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
