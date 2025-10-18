import { Router } from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const router = Router();

router.post('/send-email', async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message,
    });

    console.log('✅ Correo enviado correctamente a:', to);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error al enviar correo:', error);
    res.status(500).json({ success: false });
  }
});

export default router;
