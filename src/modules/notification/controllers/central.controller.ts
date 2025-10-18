// src/modules/notifications/controllers/central.controller.ts
import { Request, Response } from "express";
import { CentralNotificationService } from "../services/central.service";

const service = new CentralNotificationService();

/**
POST /api/notifications
Body esperado:
 
 
 {
  "subject": "Prueba desde Postman con el servicio central",
  "message": "Este es un mensaje de prueba del servicio de notificaciones.",
  "destinations": [
    { "email": "tucorreo@gmail.com", "name": "Adrián" }
  ],
  "fromName": "Servicio Central"
}

Encabezado requerido: x-api-key: <API_KEY>
 */
export const receiveNotificationHandler = async (req: Request, res: Response) => {
  try {
    const apiKeyHeader = (req.headers["x-api-key"] || "") as string;
    if (!apiKeyHeader || apiKeyHeader !== process.env.API_KEY) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }

    const payload = req.body;

    // Validation - basic (more strict checks in service)
    if (!payload || typeof payload !== "object") {
      return res.status(400).json({ ok: false, error: "Invalid body" });
    }

    const { subject, message, destinations, fromName } = payload;

    // Hand off to service
    const { transactionId, notification } = await service.receiveAndSend(
      { subject, message, destinations },
      fromName
    );

    return res.status(200).json({ ok: true, transactionId, notification });
  } catch (err: any) {
    console.error("receiveNotificationHandler error:", err);
    return res.status(500).json({ ok: false, error: err.message || "Server error" });
  }
};
