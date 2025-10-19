import { NotificationData } from '../types/notification.types';

export async function sendEmailNotification(data: NotificationData) {
  // Esto es un placeholder: en producción usarías nodemailer
  console.log(`📨 Enviando email a: ${data.to}`);
  console.log(`Asunto: ${data.subject}`);
  console.log(`Mensaje: ${data.message}`);
}

