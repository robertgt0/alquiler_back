// src/modules/notifications/controllers/central.controller.ts
import { Request, Response } from "express";
import { CentralNotificationService } from "../services/central.service";
//import { NotificationModel } from "../models/Notification";

declare global {
  // eslint-disable-next-line no-var
  var _sentEmails: Set<string> | undefined;
}


const service = new CentralNotificationService();

/**
 * POST /api/notifications
 * Body esperado:
 * {
 *   "subject": "Prueba desde Postman con el servicio central",
 *   "message": "Este es un mensaje de prueba del servicio de notificaciones.",
 *   "destinations": [
 *     { "email": "tucorreo@gmail.com", "name": "Adrián" }
 *   ],
 *   "fromName": "Servicio Central"
 * }
 * 
 * Encabezado requerido: x-api-key: <API_KEY>
 */
export const receiveNotificationHandler = async (req: Request, res: Response) => {
  try {
    const apiKeyHeader = (req.headers["x-api-key"] || "") as string;
    if (!apiKeyHeader || apiKeyHeader !== process.env.API_KEY) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }

    const payload = req.body;

    // ✅ Validación básica
    if (!payload || typeof payload !== "object") {
      return res.status(400).json({ ok: false, error: "Invalid body" });
    }

    const { subject, message, destinations, fromName } = payload;

    // ✅ Validación de campos requeridos
    if (!subject || !message || !Array.isArray(destinations) || destinations.length === 0) {
      return res.status(400).json({ ok: false, error: "Campos faltantes o inválidos" });
    }
    
   // ✅ Evitar correos duplicados (versión funcional con memoria temporal)
const email = destinations?.[0]?.email?.trim().toLowerCase();

if (email) {
  if (!globalThis._sentEmails) globalThis._sentEmails = new Set();

  if (globalThis._sentEmails.has(email)) {
    return res.status(400).json({
      ok: false,
      error: `El correo ${email} ya fue registrado previamente.`,
    });
  }

  globalThis._sentEmails.add(email);
}



    // ✅ Llamada al servicio central
    const { transactionId, status, response } = await service.receiveAndSend({
      subject,
      message,
      destinations,
      fromName,
    });

    return res.status(200).json({
      ok: true,
      transactionId,
      status,
      response,
    });
  } catch (err: any) {
    console.error("❌ receiveNotificationHandler error:", err);
    return res.status(500).json({ ok: false, error: err.message || "Server error" });
  }
};
