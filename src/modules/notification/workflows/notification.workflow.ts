import { sendEmail } from "../providers/email.provider";
import { NotificationData } from "../types/notification.types";

/**
 * Flujo base de procesamiento de notificaciones
 * Responsable de enviar correos y manejar diferentes canales.
 */
export async function processNotificationWorkflow(data: NotificationData) {
  console.log("📨 Iniciando flujo de procesamiento de notificación...");

  try {
    // ✅ Validar datos requeridos
    if (!data.channel || !data.to || !data.subject || !data.message) {
      throw new Error("Datos de notificación incompletos");
    }

    // ✅ Procesar según el canal
    switch (data.channel) {
      case "email":
        console.log("📧 Enviando correo...");
        const result = await sendEmail({
          to: Array.isArray(data.to) ? data.to : [data.to],
          subject: data.subject,
          html: data.html || data.message,
          fromName: "Sistema de Alquiler de Servicios", // puedes cambiarlo
        });

        if (!result.success) {
          throw new Error(result.error || "Error al enviar el correo");
        }

        console.log("✅ Correo enviado correctamente:", result.messageId);
        break;

      case "webhook":
        console.log("🌐 Notificación vía webhook:", data);
        break;

      default:
        throw new Error(`Canal no soportado: ${data.channel}`);
    }

    return { ok: true, message: "Notificación procesada exitosamente" };
  } catch (error: any) {
    console.error("❌ Error en el flujo de notificaciones:", error.message);
    return { ok: false, error: error.message };
  }
}
