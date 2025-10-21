// src/modules/notification/workflows/notification.workflow.ts
import { NotificationData } from '../types/notification.types';
import { sendEmailNotification } from '../services/notification.service';
import { triggerN8nWebhook } from '../services/n8n.service';
import { saveNotification } from '../models/notification.model';

export async function processNotification(notification: NotificationData) {
  try {
    console.log('🟢 [Workflow] Iniciando procesamiento de notificación');

    // 🧩 Validaciones básicas
    if (!notification.to || !notification.subject || !notification.message) {
      throw new Error('Faltan campos obligatorios: to, subject o message');
    }

    // 🧭 Canal por defecto: "email" (más lógico que "n8n", pero puedes cambiarlo)
    const channel = notification.channel ?? 'email';

    // 🗃️ Guardar pre-registro (pendiente)
    const dbEntry = await saveNotification({
      to: notification.to,
      subject: notification.subject,
      message: notification.message,
      channel,
      status: 'pending',
      meta: { createdAt: new Date() },
    });

    let result: any;

    switch (channel) {
      case 'n8n': {
        // 🚀 Llamada al webhook de n8n
        result = await triggerN8nWebhook({
          to: notification.to,
          subject: notification.subject,
          message: notification.message,
          id: dbEntry?._id?.toString?.(),
          type: notification.type ?? 'generic',
        });

        const isSuccess = result?.success ?? false;

        await saveNotification({
          ...dbEntry,
          status: isSuccess ? 'sent' : 'failed',
          externalId:
            result?.data?.data?.gmailId ??
            result?.data?.gmailId ??
            null,
          error: isSuccess ? null : result?.message ?? JSON.stringify(result),
        });

        break;
      }

      case 'email': {
        // ✉️ Envío directo por correo
        await sendEmailNotification({
          to: notification.to,
          subject: notification.subject,
          message: notification.message,
        });

        await saveNotification({ ...dbEntry, status: 'sent' });
        result = { success: true };
        break;
      }

      default:
        throw new Error(`Canal desconocido o no soportado: ${channel}`);
    }

    console.log('✅ [Workflow] Notificación procesada con éxito');
    return { success: true, message: 'Notificación procesada correctamente', result };

  } catch (error: any) {
    console.error('❌ [Workflow] Error en procesamiento:', error.message ?? error);

    // 🔄 Intenta registrar el error si existe información de destinatario
    try {
      if (notification?.to) {
        await saveNotification({
          to: notification.to,
          subject: notification.subject ?? '(sin asunto)',
          message: notification.message ?? '(sin mensaje)',
          channel: notification.channel ?? 'desconocido',
          status: 'failed',
          error: error.message ?? JSON.stringify(error),
          meta: { failedAt: new Date() },
        });
      }
    } catch (innerErr) {
      console.warn('⚠️ No se pudo registrar el error en BD:', innerErr);
    }

    return { success: false, message: error.message ?? 'Error desconocido' };
  }
}
