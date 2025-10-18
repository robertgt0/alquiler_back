import { Router, Request, Response } from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const router = Router();

router.post('/send-email', async (req: Request, res: Response) => {
  try {
    const { to } = req.body as { to?: string };

    if (!to) {
      return res.status(400).json({ success: false, message: 'Falta el destinatario (to).' });
    }

    // Configurar el transportador
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Configuración del correo
    const mailOptions = {
      from: `"Sistema de Solicitudes" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Tienes una solicitud de trabajo 💼',
      text: 'Tienes una solicitud de trabajo',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 10px;">
          <h2 style="color: #0070f3;">📢 Tienes una solicitud de trabajo</h2>
          <p>Por favor, revisa tu cuenta para ver los detalles de la solicitud.</p>
          <hr/>
          <p style="font-size: 12px; color: #777;">Este correo fue enviado automáticamente por el sistema.</p>
        </div>
      `,
    };

    // Enviar el correo
    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Correo enviado:', info.messageId);
    return res.json({ success: true, message: 'Correo enviado correctamente.' });
  } catch (error) {
    console.error('❌ Error al enviar correo:', error);
    return res.status(500).json({ success: false, message: 'Error al enviar el correo.' });
  }
});

export default router;

