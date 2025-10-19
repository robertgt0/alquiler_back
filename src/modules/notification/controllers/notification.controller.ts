import { NextFunction, Request, Response } from "express";
import { NotificationService } from "../services/notification.service";
import { ValidationError, ProviderError, NotFoundError } from "../errors/CustomError";

let _service: NotificationService | null = null;
function getService() {
  if (!_service) _service = new NotificationService();
  return _service;
}

/**
 * Controlador principal para crear y enviar notificaciones por correo.
 * Usa la API de Gmail con OAuth2 según la configuración del entorno.
 */
export const createNotificationHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    const { message, subject, destinations, fromName } = payload;

    /*
      ESTRUCTURA ESPERADA DEL BODY:

     {
          "subject": "Prueba exitosa",
          "message": "<h2>Hola!</h2><p>Mensaje de prueba usando gmail :)</p>",
          "destinations": [
              { "type": "email", "to": "tugmail@gmail.com" }
          ],
          "fromName": "Sistema Alquiler"
      }

    */
   

    // Validación de estructura
    if (
      !message ||
      !subject ||
      !Array.isArray(destinations) ||
      destinations.length === 0 ||
      !destinations.every((d) => d.email || d.to)
    ) {
      throw new ValidationError({
        message: "Estructura inválida",
        expected: "{ subject, message, destinations: [{ email }] }",
      });
    }


    // Normalizar destinos
    const normalizedDestinations = destinations.map((d: any) => ({
      email: d.email || d.to,
      name: d.name || null,
    }));

    const service = getService();

    // Enviar correo
    const { transactionId, notification } = await service.createAndSend(
      { subject, message, destinations: normalizedDestinations },
      fromName
    );

    return res.status(200).json({
      ok: true,
      transactionId,
      notification,
      message: "Correo enviado correctamente mediante Gmail API (OAuth2).",
    });
  } catch (err: any) {
    console.error("createNotificationHandler error:", err);

    if (err.message?.includes("Invalid login") || err.code === "EAUTH") {
      console.error("⚠️ Error de autenticación con Gmail OAuth2. Verifica tu refresh token o client_id/secret.");
    }

    // Delegar al middleware central
    return next(err);
  }
};

/**
 * Obtiene una notificación específica por su transactionId
 */
export const getNotificationHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = getService();
    const { id } = req.params;
    const record = await service.getByTransactionId(id);

    if (!record) {
      throw new NotFoundError(`Notificación con ID ${id} no encontrada`);
    }

    return res.json({ ok: true, notification: record });
  } catch (err: any) {
    next(err);
  }
};

/**
 * Lista las notificaciones con filtros opcionales
 */
export const listNotificationsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = getService();
    const { status, to, fromDate, toDate, limit = 20, page = 1 } = req.query;

    const { items, total } = await service.list(
      { status, to, fromDate, toDate },
      Number(limit),
      Number(page)
    );

    return res.json({
      ok: true,
      items,
      total,
      page: Number(page),
    });
  } catch (err: any) {
    next(err);
  }
};
