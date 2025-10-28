// src/modules/notifications/controllers/central.controller.ts
import { Request, Response } from "express";
import { CentralNotificationService } from "../services/central.service";
import { isEmailSent, addSentEmail } from "../utils/sendLogRegistry"; // puedes renombrar luego a sendLogRegistryPhone si quieres

/**
 * Controlador central para recepción y envío de notificaciones vía Evolution API (WhatsApp)
 */

declare global {
  // 🔸 Registro temporal en memoria de números enviados (para evitar duplicados)
  // eslint-disable-next-line no-var
  var _sentPhones: Set<string> | undefined;
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

    const { message, destinations, fromName, isRegistration, channel } = payload;

    if (!message || !Array.isArray(destinations) || destinations.length === 0) {
      return res.status(400).json({ ok: false, error: "Campos faltantes o inválidos" });
    }

    const phone = destinations?.[0]?.phone?.trim();

    // 🧩 Validar duplicados solo si es registro
    if (isRegistration && phone) {
      const alreadySentPersistent = await isEmailSent(phone);
      const alreadySentMemory = !!(globalThis._sentPhones && globalThis._sentPhones.has(phone));

      if (alreadySentPersistent || alreadySentMemory) {
        return res.status(400).json({
          ok: false,
          error: `El número ${phone} ya fue registrado previamente.`,
        });
      }
    }

    // 🚀 Enviar notificación por Evolution API
    const { transactionId, results } = await service.receiveAndSend({
      message,
      destinations,
      fromName,
      channel: channel || "whatsapp",
    } as any);

    // 🧠 Guardar en registro si es un registro nuevo
    if (isRegistration && phone) {
      try {
        await addSentEmail(phone);
        if (!globalThis._sentPhones) globalThis._sentPhones = new Set();
        globalThis._sentPhones.add(phone);
      } catch (err) {
        console.warn("⚠️ No se pudo registrar número en send_log:", err);
      }
    }

    return res.status(200).json({
      ok: true,
      transactionId,
      results,
    });
  } catch (err: any) {
    console.error("❌ [receiveNotificationHandler] Error:", err);

    return res.status(500).json({
      ok: false,
      error: "Error interno del servidor",
      details: err.message,
    });
  }
};
