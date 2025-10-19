import { sendEmailNotification } from '../services/notification.service';
import { NotificationData } from '../types/notification.types';

export async function processNotification(notification: NotificationData) {
  try {
    console.log('🟢 Iniciando procesamiento de notificación...');

    if (!notification.to || !notification.subject || !notification.message) {
      throw new Error('Datos incompletos en la notificación');
    }

    const channel = notification.channel || 'email';

    switch (channel) {
      case 'email':
        await sendEmailNotification(notification);
        break;
      case 'console':
        console.log('📣 Notificación de consola:', notification.message);
        break;
      default:
        throw new Error(`Canal desconocido: ${channel}`);
    }

    console.log('✅ Notificación procesada con éxito');
    return { success: true, message: 'Notificación procesada correctamente' };
  } catch (error: any) {
    console.error('❌ Error al procesar notificación:', error.message);
    return { success: false, message: error.message };
  }
}

