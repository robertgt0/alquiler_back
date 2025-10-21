import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { bookingConfirmationTemplate } from "../templates";
import { NotificationData } from "../types/notification.types";

dotenv.config();

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;

if (!GMAIL_USER || !GMAIL_PASS) {
  console.warn("⚠️ GMAIL_USER o GMAIL_PASS no configurados en .env");
}

export class NotificationService {
  /**
   * ✉️ Enviar correo base usando nodemailer
   */
  async sendEmailNotification(data: NotificationData) {
    if (!GMAIL_USER || !GMAIL_PASS) {
      throw new Error("Credenciales de Gmail no configuradas");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER, pass: GMAIL_PASS },
    });

    const mailOptions = {
      from: `"Sistema de Servicios" <${GMAIL_USER}>`,
      to: data.to,
      subject: data.subject,
      html: data.html || data.message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email enviado a ${data.to} (ID: ${info.messageId})`);

    return { success: true, messageId: info.messageId, transactionId: uuidv4() };
  }

  /**
   * 📘 Enviar una notificación con template de reserva (T12)
   */
  async sendBookingNotification(data: {
    to: string;
    userName: string;
    serviceName: string;
    date: string;
    price: number;
  }) {
    const html = bookingConfirmationTemplate(data);

    const payload: NotificationData = {
      subject: "Confirmación de Reserva",
      message: html,
      html,
      to: data.to,
      channel: "email",
    };

    return this.sendEmailNotification(payload);
  }
}
