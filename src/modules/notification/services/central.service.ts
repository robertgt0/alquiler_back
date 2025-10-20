// src/modules/notifications/services/central.service.ts
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "../providers/email.provider";
import { NotificationModel } from "../models/notification.model";
import fs from "fs";
import path from "path";
import { ValidationError, ProviderError } from "../errors/CustomError";
import { retry } from "../utils/retry";

const logFile = path.join(process.cwd(), "logs", "email.log");

function writeLog(entry: any) {
  try {
    fs.mkdirSync(path.dirname(logFile), { recursive: true });
    fs.appendFileSync(logFile, JSON.stringify({ ts: new Date().toISOString(), ...entry }) + "\n");
  } catch (err) {
    console.error("Error al escribir log:", err);
  }
}

interface Destination {
  email: string;
  name?: string;
}

interface CreateNotificationInput {
  subject: string;
  message: string;
  destinations: Destination[];
}

/**
 * Servicio central encargado de:
 * - Validar el paquete entrante
 * - Controlar reintentos (max 3)
 * - Registrar en BD + logs
 */
export class CentralNotificationService {
  private maxRetries = Number(process.env.NOTIFICATION_MAX_RETRIES || 3);
  private retryDelayBaseMs = Number(process.env.NOTIFICATION_RETRY_DELAY_MS || 1000);

  async receiveAndSend(data: CreateNotificationInput, fromName?: string) {
    // 1) Validaciones
    this.validatePayload(data);

    const transactionId = uuidv4();
    const toEmails = data.destinations.map((d) => d.email);

    // 2) Guardar registro inicial (pending)
    const notification = await NotificationModel.create({
      transactionId,
      subject: data.subject,
      message: data.message,
      destinations: data.destinations,
      channel: "email",
      status: "pending",
      attempts: 0,
      providerResponse: null,
      sentAt: null,
    });

    // 3) Intentar envío usando el util de reintentos central
    let sendResult: any = null;

    while (attempt < this.maxRetries) {
      attempt++;
      try {
        // Llamamos al provider (sendEmail) que devuelve { success, messageId, accepted, rejected } o { success:false, error }
        sendResult = await sendEmail({
          to: toEmails,
          subject: data.subject,
          html: data.message,
          fromName,
        });

        // Actualizamos attempts
        await NotificationModel.findByIdAndUpdate(notification._id, {
          $inc: { attempts: 1 },
        });

        if (sendResult.success) {
          // Éxito
          await NotificationModel.findByIdAndUpdate(notification._id, {
            status: "sent",
            providerResponse: sendResult,
            messageId: sendResult.messageId || null,
            sentAt: new Date(),
            attempts: attempt,
          });

      writeLog({
        level: "INFO",
        action: "email-sent",
        transactionId,
        to: toEmails,
        subject: data.subject,
        providerResponse: sendResult,
      });

      return { transactionId, notification: await NotificationModel.findById(notification._id) };
    } catch (err: any) {
      // Falló después de reintentos
      const lastError = err?.message || err;
      await NotificationModel.findByIdAndUpdate(notification._id, {
        status: "failed",
        lastError: String(lastError),
        providerResponse: sendResult || null,
        // attempts: could be set to maxRetries
      });

      writeLog({
        level: "ERROR",
        action: "email-final-failed",
        transactionId,
        to: toEmails,
        subject: data.subject,
        attempts: this.maxRetries,
        lastError,
      });

      return { transactionId, notification: await NotificationModel.findById(notification._id) };
    }
  }

  validatePayload(data: CreateNotificationInput) {
    const errors: any[] = [];
    if (!data) errors.push({ message: 'Payload vacío' });
    if (!data?.subject || typeof data.subject !== "string") errors.push({ field: 'subject', message: 'subject is required' });
    if (!data?.message || typeof data.message !== "string") errors.push({ field: 'message', message: 'message is required' });
    if (data?.message && data.message.length > 500) errors.push({ field: 'message', message: 'message exceeds 500 characters' });
    if (!Array.isArray(data?.destinations) || data?.destinations.length === 0)
      errors.push({ field: 'destinations', message: 'destinations must be a non-empty array' });

    // validar emails básicos
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const d of data?.destinations || []) {
      if (!d.email || !emailRegex.test(d.email)) {
        errors.push({ field: 'destinations', message: `Invalid email in destinations: ${d.email}` });
      }
    }

    if (errors.length > 0) throw new ValidationError(errors);
  }
}
