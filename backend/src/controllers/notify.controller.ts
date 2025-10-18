import { Request, Response } from 'express';
import { sendEmail } from '../services/notify.service';
import { NotifyPayload } from '../types/notify';

export const sendNotification = async (req: Request, res: Response) => {
  const payload: NotifyPayload = req.body;

  if (!payload.type || !payload.recipient?.email || !payload.data?.message) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  try {
    await sendEmail(payload);
    res.json({ status: 'ok', message: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({ error: 'Error enviando correo' });
  }
};
