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

