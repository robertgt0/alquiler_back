<<<<<<< HEAD
import { sendEmail } from "../providers/email.provider";
import { NotificationModel } from "../models/notification.model";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { bookingConfirmationTemplate } from "../templates";
import { NotificationData } from "../types/notification.types";
=======
// src/modules/notifications/services/notification.service.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { NotificationData } from '../types/notification.types';
>>>>>>> origin/dev/recode

dotenv.config();

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;

if (!GMAIL_USER || !GMAIL_PASS) {
  console.warn('⚠️ GMAIL_USER o GMAIL_PASS no configurados en .env. Email no funcionará hasta configurarlos.');
}

<<<<<<< HEAD
interface Destination {
  email: string;
  name?: string;
}

interface CreateNotificationInput {
  subject: string;
  message: string;
  destinations: Destination[];
}

export class NotificationService {
  async createAndSend(data: NotificationData, fromName?: string)
 {
  const { subject, message, destinations, to } = data;
const toEmails: string[] =
  destinations && destinations.length > 0
    ? destinations.map((d) => d.email)
    : to
    ? Array.isArray(to)
      ? to
      : [to]
    : [];


    const transactionId = uuidv4();

    // ✅ Enviar correo vía SMTP
    const result = await sendEmail({
      to: toEmails,
      subject,
      html: message,
      fromName,
    });

    const success = result.success;
    const messageId = result.messageId || null;

    // ✅ Registrar en base de datos
    const notification = await NotificationModel.create({
      transactionId,
      subject,
      message,
      destinations,
      channel: "email",
      status: success ? "sent" : "failed",
      providerResponse: result,
      messageId,
      sentAt: success ? new Date() : null,
    });

    return { transactionId, notification };
=======
export async function sendEmailNotification(data: NotificationData) {
  if (!GMAIL_USER || !GMAIL_PASS) {
    throw new Error('Credenciales de Gmail no configuradas');
>>>>>>> origin/dev/recode
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS,
    },
  });

<<<<<<< HEAD
  async list(filters: any, limit = 20, page = 1) {
    const skip = (page - 1) * limit;
    const items = await NotificationModel.find(filters)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await NotificationModel.countDocuments(filters);
    return { items, total };
  }
  /**
  * Enviar una notificación con template de reserva (T12)
   */
  async sendBookingNotification(data: {
    to: string;
    userName: string;
    serviceName: string;
    date: string;
    price: number;
  }) {
    const html = bookingConfirmationTemplate(data);

    const input: NotificationData = {
      subject: "Confirmación de Reserva",
      message: html, // se envía como HTML
      destinations: [{ email: data.to, name: data.userName }],
    };

    return this.createAndSend(input, "Sistema de Servicios");
  }
}
=======
  const mailOptions = {
    from: `"Sistema" <${GMAIL_USER}>`,
    to: data.to,
    subject: data.subject,
    text: data.message,
  };

  await transporter.sendMail(mailOptions);
  console.log(`📧 Email enviado a ${data.to}`);
}

>>>>>>> origin/dev/recode
