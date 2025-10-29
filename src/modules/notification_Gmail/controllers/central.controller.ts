// src/modules/notification_Gmail/controllers/central.controller.ts
import { Request, Response } from "express";
import { CentralNotificationService } from "../services/central.service";
import { isEmailSent, addSentEmail } from "../utils/sendLogRegistry";

/**
 * Controlador central para recepción y envío de notificaciones vía Gmail API
 * (sin conexiones externas como n8n o Abstract API)
 */

declare global {
  // 🔸 Registro temporal en memoria de correos enviados (control de duplicados)
  // eslint-disable-next-line no-var
  var _sentEmails: Set<string> | undefined;
}

const service = new CentralNotificationService();

export const receiveNotificationHandler = async (req: Request, res: Response) => {
  try {
    // 🔐 Validar encabezado de seguridad
    const apiKeyHeader = (req.headers["x-api-key"] || "") as string;
    if (!apiKeyHeader || apiKeyHeader !== process.env.API_KEY) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }

    // 🔎 Validación básica del body
    const payload = req.body;
    if (!payload || typeof payload !== "object") {
      return res.status(400).json({ ok: false, error: "Invalid body" });
    }

    const { subject, message, destinations, fromName, isRegistration } = payload;

    if (!subject || !message || !Array.isArray(destinations) || destinations.length === 0) {
      return res.status(400).json({ ok: false, error: "Campos faltantes o inválidos" });
    }

    const email = destinations?.[0]?.email?.trim().toLowerCase();

    // 🧩 Validar duplicados solo en registro
    if (isRegistration && email) {
      const alreadySentPersistent = await isEmailSent(email);
      const alreadySentMemory = !!(globalThis._sentEmails && globalThis._sentEmails.has(email));

      if (alreadySentPersistent || alreadySentMemory) {
        return res.status(400).json({
          ok: false,
          error: `El correo ${email} ya fue registrado previamente.`,
        });
      }
    }

    // 🚀 Enviar notificación a través del servicio interno (Gmail API)
    const { transactionId, status, response } = await service.receiveAndSend({
      subject,
      message,
      destinations,
      fromName,
    });

    // 🧠 Guardar en registro si es un registro nuevo
    if (isRegistration && email) {
      try {
        await addSentEmail(email);
        if (!globalThis._sentEmails) globalThis._sentEmails = new Set();
        globalThis._sentEmails.add(email);
      } catch (err) {
        console.warn("⚠️ No se pudo registrar email en send_log:", err);
      }
    }

    return res.status(200).json({
      ok: true,
      transactionId,
      status,
      response,
    });
  } catch (err: any) {
    console.error("❌ [receiveNotificationHandler] Error:", err);

    if (err.statusCode && err.code) {
      return res.status(err.statusCode).json({
        ok: false,
        error: err.details?.message || err.message || "Error en la notificación",
        code: err.code,
        details: err.details,
      });
    }

    return res.status(500).json({
      ok: false,
      error: "Error interno del servidor",
      details: err.message,
    });
  }
};
