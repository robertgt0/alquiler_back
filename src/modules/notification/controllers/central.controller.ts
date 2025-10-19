// src/modules/notifications/controllers/central.controller.ts
import { Request, Response,NextFunction } from "express";
import { CentralNotificationService } from "../services/central.service";
import { ValidationError, NotFoundError, ProviderError } from "../errors/CustomError";

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
export const receiveNotificationHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKeyHeader = (req.headers["x-api-key"] || "") as string;
    if (!apiKeyHeader || apiKeyHeader !== process.env.API_KEY) {
      throw new ValidationError({ field: "x-api-key", message: "API key inválida o ausente" });
    }

    const payload = req.body;

    // Validation - basic (more strict checks in service)
    if (!payload || typeof payload !== "object") {
      throw new ValidationError({ body: "El cuerpo de la petición es inválido" });
    }

    const { subject, message, destinations, fromName } = payload;

    // Hand off to service
    const { transactionId, notification } = await service.receiveAndSend(
      { subject, message, destinations },
      fromName
    );

    return res.status(200).json({ ok: true, transactionId, notification });
  } catch (err: any) {
    next(err);
  }
};
