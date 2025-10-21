// src/modules/notifications/services/notification.service.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { NotificationData } from '../types/notification.types';

dotenv.config();

// 📩 Variables desde .env
const MODE = process.env.NOTIFICATIONS_GMAIL_MODE ?? 'smtp';
const GMAIL_USER = process.env.NOTIFICATIONS_GMAIL_USER;
const GMAIL_APP_PASS = process.env.NOTIFICATIONS_GMAIL_APP_PASS;

const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

if (!GMAIL_USER) {
  console.warn('⚠️ NOTIFICATIONS_GMAIL_USER no está configurado. El envío de correos no funcionará.');
}

/**
 * Envía una notificación por correo usando nodemailer.
 * Soporta autenticación por contraseña de aplicación (SMTP) o OAuth2 (modo futuro).
 */
export async function sendEmailNotification(data: NotificationData) {
  if (!GMAIL_USER) throw new Error('Falta la cuenta de Gmail (NOTIFICATIONS_GMAIL_USER)');

  let transporter;

  if (MODE === 'smtp') {
    if (!GMAIL_APP_PASS) {
      throw new Error('Falta NOTIFICATIONS_GMAIL_APP_PASS para modo SMTP');
    }

    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASS,
      },
    });
  } else if (MODE === 'oauth2') {
    if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
      throw new Error('Faltan credenciales OAuth2 (CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN)');
    }

    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: GMAIL_USER,
        clientId: GMAIL_CLIENT_ID,
        clientSecret: GMAIL_CLIENT_SECRET,
        refreshToken: GMAIL_REFRESH_TOKEN,
      },
    });
  } else {
    throw new Error(`Modo de autenticación no soportado: ${MODE}`);
  }

  const mailOptions = {
    from: `"Sistema de Notificaciones" <${GMAIL_USER}>`,
    to: data.to,
    subject: data.subject,
    html: data.message.includes('<html') ? data.message : `<p>${data.message}</p>`,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 Email enviado correctamente a ${data.to}. ID: ${info.messageId}`);

  return info;
}
