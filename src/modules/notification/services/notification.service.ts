import { v4 as uuidv4 } from "uuid";
import { logger } from "../../../utils/logger";
import { GmailProvider } from "../providers/email.provider";
import { NotificationModel } from "../models/notification.model";
import { NotificationPayload } from "../models/notification.types";

const MAX_ATTEMPTS = 3;

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export class NotificationService {
  private provider: GmailProvider;

  constructor() {
    const mode = (process.env.NOTIFICATIONS_GMAIL_MODE || "smtp") as any;
    this.provider = new GmailProvider({
      mode,
      user: process.env.NOTIFICATIONS_GMAIL_USER || "",
      pass: process.env.NOTIFICATIONS_GMAIL_APP_PASS,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    });
  }

  /**
   * Crea y envía la notificación.
   * Retorna el documento guardado (actualizado) y el resultado.
   */
  async createAndSend(payload: NotificationPayload, fromName?: string) {
    // Genera transactionId
    const transactionId = uuidv4();

    // Crea registro inicial en DB (status pending)
    const doc = await NotificationModel.create({
      transactionId,
      ...payload,
      status: "pending",
      attempts: 0,
      lastError: null,
      providerResponse: null,
    });

    // Intentos con reintentos
    let attempt = 0;
    let lastError: any = null;
    let providerResponse: any = null;

    // Para este PoC asumimos channel=email y una lista de destinations
    for (const dest of payload.destinations) {
      attempt = 0;
      let sent = false;

      while (attempt < MAX_ATTEMPTS && !sent) {
        attempt++;
        try {
          logger.info(`Intent ${attempt} - transaction ${transactionId} - sending to ${dest.email}`);
          // Llamada real al provider
          providerResponse = await this.provider.send(dest.email!, payload.subject, payload.message, fromName);

          // Éxito -> actualizar DB
          await NotificationModel.findByIdAndUpdate(doc._id, {
            $set: {
              status: "sent",
              sentAt: new Date(),
              providerResponse,
            },
            $inc: { attempts: attempt },
            $setOnInsert: { transactionId },
          }, { new: true });

          logger.info(`Sent OK transaction=${transactionId} to=${dest.email} info=${providerResponse?.messageId}`);
          sent = true;
        } catch (err: any) {
          lastError = err?.message || String(err);
          logger.error(`Attempt ${attempt} failed transaction=${transactionId} to=${dest.email} error=${lastError}`);

          // Actualiza doc con intento fallido parcial
          await NotificationModel.findByIdAndUpdate(doc._id, {
            $inc: { attempts: 1 },
            $set: { lastError, providerResponse: err },
          }, { new: true });

          if (attempt < MAX_ATTEMPTS) {
            // Backoff exponencial (500ms * 2^(attempt-1))
            const backoff = 500 * Math.pow(2, attempt - 1);
            await sleep(backoff);
          } else {
            // marcar como fallido
            await NotificationModel.findByIdAndUpdate(doc._id, {
              $set: { status: "failed", lastError, providerResponse: err },
            }, { new: true });

            logger.error(`Finalizado con error transaction=${transactionId} to=${dest.email}`);
          }
        }
      } // end while
    } // end for

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
    if (filter.fromDate || filter.toDate) {
      q.createdAt = {};
      if (filter.fromDate) q.createdAt.$gte = new Date(filter.fromDate);
      if (filter.toDate) q.createdAt.$lte = new Date(filter.toDate);
    }

    const items = await NotificationModel.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
    const total = await NotificationModel.countDocuments(q);
    return { items, total, page, limit };
  }
}
