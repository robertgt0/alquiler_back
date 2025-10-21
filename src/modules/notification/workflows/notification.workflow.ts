import { NotificationData } from "../types/notification.types";
import { triggerN8nWebhook } from "../providers/n8n.provider";
import { sendEmailOAuth2 } from "../providers/gmail.api";
import { saveNotification } from "../models/notification.model";

/**
 * 🔄 Flujo principal de procesamiento de notificaciones
 * Compatible con Gmail API (OAuth2) y n8n
 */
export async function processNotification(notification: NotificationData) {
  try {
    console.log("🟢 [Workflow] Iniciando procesamiento de notificación");

    if (!notification.to || !notification.subject || !notification.message) {
      throw new Error("Faltan campos obligatorios: to, subject o message");
    }

    const channel = notification.channel ?? "email";
    const dbEntry = await saveNotification({
      to: notification.to,
      subject: notification.subject,
      message: notification.message,
      channel,
      status: "pending",
      meta: { createdAt: new Date() },
    });

    let result: any;

    switch (channel) {
      case "n8n":
      case "webhook": {
        result = await triggerN8nWebhook({
          to: Array.isArray(notification.to) ? notification.to.join(",") : notification.to,
          subject: notification.subject,
          message: notification.message,
          id: dbEntry?._id?.toString?.(),
          type: notification.type ?? "generic",
        });


        const isSuccess = result?.success ?? false;
        await saveNotification({
          ...dbEntry,
          status: isSuccess ? "sent" : "failed",
          externalId: result?.data?.gmailId ?? null,
          error: isSuccess ? null : result?.message ?? JSON.stringify(result),
        });
        break;
      }

      case "email": {
        await sendEmailOAuth2({
          to: Array.isArray(notification.to) ? notification.to.join(",") : notification.to!,
          subject: notification.subject,
          html: notification.html || notification.message,
        });

        await saveNotification({ ...dbEntry, status: "sent" });
        result = { success: true };
        break;
      }

      default:
        throw new Error(`Canal desconocido o no soportado: ${channel}`);
    }

    console.log("✅ [Workflow] Notificación procesada correctamente");
    return { success: true, message: "Notificación procesada correctamente", result };

  } catch (error: any) {
    console.error("❌ [Workflow] Error en procesamiento:", error.message ?? error);

    try {
      if (notification?.to) {
        await saveNotification({
          to: notification.to,
          subject: notification.subject ?? "(sin asunto)",
          message: notification.message ?? "(sin mensaje)",
          channel: notification.channel ?? "desconocido",
          status: "failed",
          error: error.message ?? JSON.stringify(error),
          meta: { failedAt: new Date() },
        });
      }
    } catch (innerErr) {
      console.warn("⚠️ No se pudo registrar el error en BD:", innerErr);
    }

    return { success: false, message: error.message ?? "Error desconocido" };
  }
}
