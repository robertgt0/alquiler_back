<<<<<<< HEAD
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
=======
// src/modules/notifications/workflows/notification.workflow.ts
import { NotificationData } from '../types/notification.types';
import { sendEmailNotification } from '../services/notification.service';
import { saveNotification } from '../models/notification.model';

export async function processNotification(notification: NotificationData) {
  try {
    console.log('🟢 [Workflow] Iniciando procesamiento de notificación');

    // Validaciones básicas
    if (!notification.subject || !notification.message) {
      throw new Error('Faltan subject o message');
    }

    const channel = notification.channel ?? 'email';

    // Guardado previo (ejemplo: persistencia mínima)
    await saveNotification({ ...notification, channel });

    // Enrutamiento por canal
    switch (channel) {
      case 'email':
        if (!notification.to) throw new Error('Campo "to" requerido para email');
        await sendEmailNotification(notification);
        break;

      case 'console':
        console.log('📣 [Console Channel] ->', notification.message);
        break;

      case 'webhook':
        // Aquí podrías llamar a otro webhook (por ejemplo n8n)
        console.log('🔗 [Webhook Channel] ->', notification.meta?.webhookUrl ?? 'sin webhookUrl');
        break;

      default:
        throw new Error(`Canal desconocido: ${channel}`);
    }

    console.log('✅ [Workflow] Notificación procesada con éxito');
    return { success: true, message: 'Notificación procesada correctamente' };
  } catch (error: any) {
    console.error('❌ [Workflow] Error:', error.message ?? error);
    return { success: false, message: error.message ?? 'Error desconocido' };
  }
}

>>>>>>> origin/dev/recode
