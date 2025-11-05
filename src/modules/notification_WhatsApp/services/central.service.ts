import { v4 as uuidv4 } from "uuid";
import { saveNotification } from "../models/notification.model";
import {
  InvalidNotificationDataError,
  NotificationProviderError,
} from "../errors/notification.errors";
import { sendTextViaEvolution } from "../providers/evolution.api";

/* ======= INTERFACES ======= */
interface Destination {
  name?: string;
  phone: string;
}

interface CreateNotificationInput {
  message: string;
  destinations: Destination[];
}

/* ======= VALIDACIÓN SIMPLE ======= */
const phoneRegex = /^[0-9]{7,15}$/; // 7–15 dígitos

export class CentralNotificationService {
  async receiveAndSend(data: CreateNotificationInput) {
    this.validatePayload(data);

    const transactionId = uuidv4();
    const results: any[] = [];

    const baseUrl = process.env.EVOLUTION_API_BASE_URL;
    if (!baseUrl) {
      throw new NotificationProviderError("EVOLUTION_API_BASE_URL no configurado en .env");
    }

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

        // ✅ Enviar directamente con la URL completa (ya incluye instancia)
        const sendRes = await sendTextViaEvolution({
          number: String(phone),
          text,
        });

        const status = sendRes.success ? "sent" : "failed";

        // ✅ Guardar registro
        await saveNotification({
          transactionId,
          message: {
            type: "whatsapp",
            content: text,
            createdAt: new Date(),
          },
          destinations: [dest],
          status,
          meta: { provider: "evolution" },
          sentAt: new Date(),
        });

        results.push({
          phone,
          status,
          providerResponse: sendRes.data ?? sendRes.error,
        });
      } catch (err: any) {
        // ❌ Registrar fallo
        await saveNotification({
          transactionId,
          message: {
            type: "whatsapp",
            content: data.message,
            createdAt: new Date(),
          },
          destinations: [dest],
          status: "failed",
          meta: { error: err.message ?? String(err) },
          sentAt: new Date(),
        });

        results.push({ phone: dest.phone, status: "failed", error: err.message });
      }
    }

    return { ok: true, transactionId, results };
  }

  /* ======= VALIDACIÓN DEL PAYLOAD ======= */
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
          errors[`destinations[${index}].phone`] =
            "Phone format invalid (only digits, 7–15)";
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
