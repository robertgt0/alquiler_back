import { v4 as uuidv4 } from "uuid";
import { GmailProvider } from "../providers/email.provider";
import { NotificationModel } from "../models/notification.model";
import { NotificationPayload } from "../models/notification.types";
import { logNotification } from "../../../utils/logger";

const MAX_ATTEMPTS = 3;

export class NotificationService {
  private createProvider() {
    return new GmailProvider({
      mode: process.env.NOTIFICATIONS_GMAIL_MODE as any,
      user: process.env.NOTIFICATIONS_GMAIL_USER!,
      pass: process.env.NOTIFICATIONS_GMAIL_APP_PASS,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    });
  }

  async createAndSend(payload: NotificationPayload, fromName?: string) {
    const transactionId = uuidv4();

    // 1️⃣ Crear registro inicial en la base de datos (estado: pending)
    const doc = await NotificationModel.create({
      transactionId,
      ...payload,
      status: "pending",
      attempts: 0,
      lastError: null,
      createdAt: new Date(),
    });

    const provider = this.createProvider();

    // 2️⃣ Enviar a cada destinatario con reintentos
    for (const dest of payload.destinations) {
      let attempt = 0;
      let success = false;

      while (attempt < MAX_ATTEMPTS && !success) {
        attempt++;
        try {
          const info = await provider.send(
            dest.email!,
            payload.subject,
            payload.message,
            fromName
          );

          // ✅ Actualizar base de datos al éxito
          await NotificationModel.findByIdAndUpdate(doc._id, {
            $set: {
              status: "sent",
              sentAt: new Date(),
              providerResponse: info,
            },
            $inc: { attempts: 1 },
          });

          // 🧾 Log de éxito
          logNotification(dest.email!, "OK", transactionId);

          success = true;
        } catch (err: any) {
          const lastError = err.message || String(err);

          // ❌ Registrar intento fallido
          await NotificationModel.findByIdAndUpdate(doc._id, {
            $inc: { attempts: 1 },
            $set: { lastError, providerResponse: err },
          });

          // 🧾 Log de fallo
          logNotification(dest.email!, "FALLIDO", transactionId, lastError);

          if (attempt < MAX_ATTEMPTS) {
            const backoff = 500 * Math.pow(2, attempt - 1);
            await new Promise((r) => setTimeout(r, backoff));
          } else {
            // 🚨 Marcar como fallido tras agotar intentos
            await NotificationModel.findByIdAndUpdate(doc._id, {
              $set: { status: "failed", lastError },
            });
          }
        }
      }
    }

    // 3️⃣ Retornar el estado final del registro
    const updated = await NotificationModel.findOne({ transactionId });
    return { transactionId, notification: updated };
  }

  async getByTransactionId(transactionId: string) {
    return NotificationModel.findOne({ transactionId }).lean();
  }

  async list(filter: any = {}, limit = 20, page = 1) {
    const skip = (page - 1) * limit;
    const q: any = {};

    if (filter.status) q.status = filter.status;
    if (filter.to) q["destinations.email"] = filter.to;

    if (filter.fromDate || filter.toDate) q.createdAt = {};
    if (filter.fromDate) q.createdAt.$gte = new Date(filter.fromDate);
    if (filter.toDate) q.createdAt.$lte = new Date(filter.toDate);

    const items = await NotificationModel.find(q)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await NotificationModel.countDocuments(q);
    return { items, total, page, limit };
  }
}
