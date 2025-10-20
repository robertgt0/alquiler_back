// src/modules/notification/services/central.service.ts
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "../providers/email.provider";
import { NotificationModel } from "../models/notification.model";
import fs from "fs";
import path from "path";
import { triggerN8n } from "../providers/n8n.provider";

const logFile = path.join(process.cwd(), "logs", "email.log");

function writeLog(entry: any) {
    try {
        fs.mkdirSync(path.dirname(logFile), { recursive: true });
        fs.appendFileSync(
            logFile,
            JSON.stringify({ ts: new Date().toISOString(), ...entry }) + "\n"
        );
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

        // 3) Intentar envío con reintentos
        let attempt = 0;
        let lastError: any = null;
        let sendResult: any = null;

        while (attempt < this.maxRetries) {
            attempt++;
            try {
                // Enviar
                sendResult = await sendEmail({
                    to: toEmails,
                    subject: data.subject,
                    html: data.message,
                    fromName,
                });

                // Actualizar attempts en BD
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

                    // 🔹 Disparar flujo en n8n (no rompe si falla)
                    try {
                        const payload = {
                            transactionId,
                            event: "notification.sent",
                            subject: data.subject,
                            to: toEmails,
                            attempts: attempt,
                            providerResponse: sendResult,
                            fromName: fromName || null,
                        };
                        const n8nRes = await triggerN8n(payload);

                        writeLog({
                            level: n8nRes.success ? "INFO" : "WARN",
                            action: "n8n-trigger",
                            transactionId,
                            status: n8nRes.success ? n8nRes.status : "error",
                            reason: n8nRes.success ? undefined : n8nRes.reason,
                        });
                    } catch (e) {
                        writeLog({
                            level: "WARN",
                            action: "n8n-trigger-failed",
                            transactionId,
                            error: String(e),
                        });
                    }

                    // Log local
                    writeLog({
                        level: "INFO",
                        action: "email-sent",
                        transactionId,
                        to: toEmails,
                        subject: data.subject,
                        attempt,
                        providerResponse: sendResult,
                    });

                    return {
                        transactionId,
                        notification: await NotificationModel.findById(notification._id),
                    };
                } else {
                    // Error conocido, reintentar
                    lastError = sendResult.error || "unknown";
                    writeLog({
                        level: "WARN",
                        action: "send-error",
                        transactionId,
                        to: toEmails,
                        subject: data.subject,
                        attempt,
                        error: lastError,
                        providerResponse: sendResult,
                    });
                }
            } catch (err: any) {
                lastError = err?.message || err;
                writeLog({
                    level: "ERROR",
                    action: "send-exception",
                    transactionId,
                    to: toEmails,
                    subject: data.subject,
                    attempt,
                    error: lastError,
                });
            }

            // Backoff exponencial
            if (attempt < this.maxRetries) {
                const wait = this.retryDelayBaseMs * Math.pow(2, attempt - 1);
                await new Promise((res) => setTimeout(res, wait));
            }
        }

        // 4) Falló tras reintentos
        await NotificationModel.findByIdAndUpdate(notification._id, {
            status: "failed",
            lastError: String(lastError),
            providerResponse: sendResult || null,
            attempts: attempt,
        });

        writeLog({
            level: "ERROR",
            action: "email-final-failed",
            transactionId,
            to: toEmails,
            subject: data.subject,
            attempts: attempt,
            lastError,
        });

        // (Opcional) avisar a n8n los fallos
        // try {
        //   await triggerN8n({
        //     transactionId,
        //     event: "notification.failed",
        //     subject: data.subject,
        //     to: toEmails,
        //     attempts: attempt,
        //     error: String(lastError),
        //     providerResponse: sendResult || null,
        //     fromName: fromName || null,
        //   });
        // } catch {}

        return { transactionId, notification: await NotificationModel.findById(notification._id) };
    }

    validatePayload(data: CreateNotificationInput) {
        if (!data) throw new Error("Payload vacío");
        if (!data.subject || typeof data.subject !== "string") throw new Error("subject is required");
        if (!data.message || typeof data.message !== "string") throw new Error("message is required");
        if (data.message.length > 500) throw new Error("message exceeds 500 characters");
        if (!Array.isArray(data.destinations) || data.destinations.length === 0)
            throw new Error("destinations must be a non-empty array");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        for (const d of data.destinations) {
            if (!d.email || !emailRegex.test(d.email)) {
                throw new Error(`Invalid email in destinations: ${d.email}`);
            }
        }
    }
}
