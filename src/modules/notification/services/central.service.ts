import { v4 as uuidv4 } from "uuid";
import { saveNotification, listNotifications } from "../models/notification.model";
import { triggerN8nWebhook } from "../services/n8n.service";

interface Destination {
  email: string;
  name?: string;
}

interface CreateNotificationInput {
  subject: string;
  message: string;
  destinations: Destination[];
  type?: string; // tipo de evento, ej: "nuevo_cliente", "asignacion_fixer"
}

/**
 * Servicio central actualizado:
 * - Valida el payload
 * - Guarda registro en memoria
 * - Dispara el webhook de n8n
 * - Controla errores de manera segura
 */
export class CentralNotificationService {
  async receiveAndSend(data: CreateNotificationInput) {
    this.validatePayload(data);

    const transactionId = uuidv4();
    const toEmails = data.destinations.map((d) => d.email);

    // 1️⃣ Guardar en memoria como "pending"
    const notification = await saveNotification({
      transactionId,
      subject: data.subject,
      message: data.message,
      destinations: data.destinations,
      channel: "n8n",
      status: "pending",
      createdAt: new Date(),
    });

    try {
      // 2️⃣ Disparar webhook n8n
      const result = await triggerN8nWebhook({
        fixerEmail: toEmails[0],
        subject: data.subject,
        message: data.message,
        id: notification.transactionId,
        type: data.type ?? "generic",
      });

      // 3️⃣ Actualizar estado (solo en memoria, simulado)
      notification.status = result.success ? "sent" : "failed";
      notification.providerResponse = result;
      notification.sentAt = new Date();

      console.log(
        `📤 [CentralService] Notificación ${notification.status.toUpperCase()} para ${toEmails.join(", ")}`
      );

      return {
        success: result.success,
        transactionId,
        status: notification.status,
        response: result,
      };
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);

      notification.status = "failed";
      notification.error = error;

      console.error("❌ [CentralService] Error al enviar notificación:", error);

      return {
        success: false,
        transactionId,
        message: error ?? "Error desconocido en webhook n8n",
      };
    }
  }

  private validatePayload(data: CreateNotificationInput) {
    if (!data) throw new Error("Payload vacío");
    if (!data.subject || typeof data.subject !== "string")
      throw new Error("El campo 'subject' es obligatorio");
    if (!data.message || typeof data.message !== "string")
      throw new Error("El campo 'message' es obligatorio");
    if (!Array.isArray(data.destinations) || data.destinations.length === 0)
      throw new Error("Debe haber al menos un destino válido");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const d of data.destinations) {
      if (!d.email || !emailRegex.test(d.email)) {
        throw new Error(`Correo inválido en 'destinations': ${d.email}`);
      }
    }
  }
}
