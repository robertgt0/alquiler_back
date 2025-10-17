import { sendMail } from "../providers/email.provider";
import { NotificationModel } from "../models/notification.model";
import { v4 as uuidv4 } from "uuid";

interface Destination {
  email: string;
  name?: string;
}

interface NotificationPayload {
  subject: string;
  message: string;
  destinations: Destination[];
  fromName?: string;
}

export class NotificationService {
  /**
   * Crea una notificación, la envía y la guarda en base de datos.
   */
  async createAndSend(payload: NotificationPayload, fromName?: string) {
    const transactionId = uuidv4();
    const { subject, message, destinations } = payload;

    if (!subject || !message || !destinations?.length) {
      throw new Error("Datos de notificación incompletos");
    }

    const toEmails = destinations.map((d) => d.email);

    const from =
      fromName && process.env.NOTIFICATIONS_GMAIL_USER
        ? `"${fromName}" <${process.env.NOTIFICATIONS_GMAIL_USER}>`
        : process.env.NOTIFICATIONS_GMAIL_USER;

    const result = await sendMail({
      to: toEmails,
      subject,
      html: message,
      from,
    });

    const notification = await NotificationModel.create({
      transactionId,
      subject,
      message,
      destinations, // 👈 este es el campo correcto del schema
      channel: "email",
      status: result.success ? "sent" : "failed",
      providerResponse: result.info,
      sentAt: new Date(),
    });
    return { transactionId, notification };
  }

  async getByTransactionId(id: string) {
    return NotificationModel.findOne({ transactionId: id });
  }

  async list(filters: any, limit = 20, page = 1) {
    const query: any = {};

    if (filters.status) query.status = filters.status;
    if (filters.to) query.to = { $in: [filters.to] };
    if (filters.fromDate || filters.toDate) {
      query.createdAt = {};
      if (filters.fromDate) query.createdAt.$gte = new Date(filters.fromDate);
      if (filters.toDate) query.createdAt.$lte = new Date(filters.toDate);
    }

    const items = await NotificationModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await NotificationModel.countDocuments(query);

    return { items, total };
  }
}
