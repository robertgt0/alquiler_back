// src/modules/notifications/services/notification.service.ts
import { sendEmail } from "../providers/email.provider";
import { v4 as uuidv4 } from "uuid";

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
  async createAndSend(data: CreateNotificationInput, fromName?: string) {
    const { subject, message, destinations } = data;

    const toEmails = destinations.map((d) => d.email);
    const transactionId = uuidv4();

    const result = await sendEmail({
      to: toEmails,
      subject,
      html: message,
      fromName,
    });

    const notification = {
      transactionId,
      to: toEmails,
      subject,
      message,
      status: result.success ? "SENT" : "FAILED",
      messageId: result.messageId || null,
      error: result.error || null,
      createdAt: new Date().toISOString(),
    };

    return { transactionId, notification };
  }

  async getByTransactionId(id: string) {
    // Aquí podrías buscar en BD si implementas persistencia
    return null;
  }

  async list(filters: any, limit = 20, page = 1) {
    // Simula listado
    return { items: [], total: 0 };
  }
}
