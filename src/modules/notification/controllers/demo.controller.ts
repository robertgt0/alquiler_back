import { Request, Response } from 'express';
import { processNotification } from '../workflows/notification.workflow';  // Ajusta la ruta según tu estructura
import { NotificationData } from '../types/notification.types';  // Ajusta la ruta según tu estructura

export const demoNotification = async (req: Request, res: Response) => {
  const notificationData: NotificationData = {
    to: 'test@example.com',
    subject: 'Demo Notification',
    message: 'Este es un mensaje de prueba para el demo.',
    channel: 'email', // o 'n8n' dependiendo del flujo
  };

  try {
    const result = await processNotification(notificationData);
    res.status(200).json({ message: 'Notificación procesada correctamente', result });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: 'Error al procesar la notificación', error: errorMessage });
  }
};
