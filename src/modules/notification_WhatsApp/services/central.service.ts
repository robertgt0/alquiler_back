// src/modules/notification_WhatsApp/services/central.service.ts
import { v4 as uuidv4 } from "uuid";
import { notificacionWhatsAppController } from "../../../controllers/notificacionWhatsApp.controller";
import connectDB from "../../../config/database";
import {
  InvalidNotificationDataError,
  NotificationProviderError,
} from "../errors/notification.errors";
import { sendTextViaEvolution } from "../providers/evolution.api";
import dns from "dns"; // opcional si validas dominio en correos, lo dejamos por consistencia

// ======================
// INTERFACES
// ======================
interface Destination {
  name?: string;
  phone: string;
}

interface CreateNotificationInput {
  message: string;
  destinations: Destination[];
}

// ======================
// CONFIGURACIONES BASE
// ======================
const phoneRegex = /^[0-9]{7,15}$/; // 7–15 dígitos

// ======================
// SERVICIO CENTRAL
// ======================
export class CentralNotificationService {
  async receiveAndSend(data: CreateNotificationInput) {
    // 0️⃣ Conexión asegurada
    await connectDB();

    // 1️⃣ Validar el payload
    this.validatePayload(data);

    const transactionId = uuidv4();
    const results: any[] = [];

    // 2️⃣ Verificar provider base
    const baseUrl = process.env.EVOLUTION_API_BASE_URL;
    if (!baseUrl) {
      throw new NotificationProviderError("EVOLUTION_API_BASE_URL no configurado en .env");
    }

    // 3️⃣ Iterar destinos
    for (const dest of data.destinations) {
      try {
        const phone = dest.phone;
        if (!phone || !phoneRegex.test(String(phone))) {
          throw new InvalidNotificationDataError({
            message: "Número inválido para WhatsApp",
            details: { phone },
          });
        }

        const text = data.message;

        // --- Envío al proveedor (Evolution API)
        const sendRes = await sendTextViaEvolution({
          number: String(phone),
          text,
        });

        const status = sendRes.success ? "sent" : "failed";

        // --- Registrar notificación usando el controlador
        const notificationData = {
          transactionId,
          message: {
            type: "whatsapp",
            content: text,
            createdAt: new Date(),
          },
          destinations: [dest],
          channel: "whatsapp-api",
          status,
          meta: {
            provider: "evolution",
            createdAt: new Date(),
          },
          providerResponse: sendRes,
          sentAt: new Date(),
        };

        // Simulación de req/res (como hicimos en Gmail)
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

        await notificacionWhatsAppController.create(mockReq, mockRes);
        const notification = mockRes.jsonData;

        results.push({
          phone,
          status,
          providerResponse: sendRes.data ?? sendRes.error,
          notificationId: notification?._id,
        });
      } catch (err: any) {
        // --- Registrar fallo también
        const failNotificationData = {
          transactionId,
          message: {
            type: "whatsapp",
            content: data.message,
            createdAt: new Date(),
          },
          destinations: [dest],
          channel: "whatsapp-api",
          status: "failed",
          meta: {
            provider: "evolution",
            error: err.message ?? String(err),
          },
          sentAt: new Date(),
        };

        const mockReq: any = { body: failNotificationData };
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

        await notificacionWhatsAppController.create(mockReq, mockRes);

        results.push({
          phone: dest.phone,
          status: "failed",
          error: err.message,
        });
      }
    }

    // 4️⃣ Retornar resumen
    return {
      success: true,
      transactionId,
      total: results.length,
      results,
    };
  }

  // ======================
  // VALIDACIÓN DEL PAYLOAD
  // ======================
  private validatePayload(data: CreateNotificationInput): void {
    if (!data) {
      throw new InvalidNotificationDataError({ message: "Payload cannot be empty" });
    }

    const errors: Record<string, string> = {};

    if (!data.message || typeof data.message !== "string") {
      errors.message = "Message is required and must be a string";
    }

    if (!Array.isArray(data.destinations) || data.destinations.length === 0) {
      errors.destinations = "At least one destination is required";
    } else {
      data.destinations.forEach((d, index) => {
        if (!d.phone) {
          errors[`destinations[${index}]`] = "Destination must contain a phone number";
        } else if (!phoneRegex.test(String(d.phone))) {
          errors[`destinations[${index}].phone`] = "Phone format invalid (only digits, 7–15)";
        }
      });
    }

    if (Object.keys(errors).length > 0) {
      throw new InvalidNotificationDataError({
        message: "Invalid payload",
        details: errors,
      });
    }
  }
}
