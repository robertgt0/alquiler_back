// src/modules/notifications/services/notification.service.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { NotificationData } from '../types/notification.types';

dotenv.config();

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;

if (!GMAIL_USER || !GMAIL_PASS) {
  console.warn('⚠️ GMAIL_USER o GMAIL_PASS no configurados en .env. Email no funcionará hasta configurarlos.');
}

export async function sendEmailNotification(data: NotificationData) {
  if (!GMAIL_USER || !GMAIL_PASS) {
    throw new Error('Credenciales de Gmail no configuradas');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Sistema" <${GMAIL_USER}>`,
    to: data.to,
    subject: data.subject,
    text: data.message,
  };

  await transporter.sendMail(mailOptions);
  console.log(`📧 Email enviado a ${data.to}`);
}

