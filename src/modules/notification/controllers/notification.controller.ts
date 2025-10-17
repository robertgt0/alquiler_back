// src/modules/notifications/controllers/notification.controller.ts
import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";

let _service: NotificationService | null = null;
function getService() {
  if (!_service) _service = new NotificationService();
  return _service;
}

/**
 * Controlador principal para crear y enviar notificaciones por correo.
 * Soporta SMTP o OAuth2 según la configuración en variables de entorno.
 */
export const createNotificationHandler = async (req: Request, res: Response) => {
  try {
    const payload = req.body;

/*
ESTRUCTURA ESPERADA:
    {
      "subject": "Prueba SMTP con OAUTH2 exitosa",
      "message": "<h2>Hola!</h2><p>Mensaje de prueba usando SMTP</p>",
      "destinations": [
        { "type": "email", "to": "correo@gmail.com" }
      ],
      "fromName": "Sistema Alquiler"
    }
    */

    const { message, subject, destinations, fromName } = payload;

    // Validación robusta de estructura antes de continuar
    if (
      !message ||
      !subject ||
      !Array.isArray(destinations) ||
      destinations.length === 0 ||
      !destinations.every((d) => d.email || d.to)
    ) {
      return res.status(400).json({
        ok: false,
        error:
          "Estructura inválida. Se requiere: { subject, message, destinations: [{ email }] }",
      });
    }

    // Normalizar destinos (acepta tanto 'email' como 'to')
    const normalizedDestinations = destinations.map((d: any) => ({
      email: d.email || d.to,
      name: d.name,
    }));

    const service = getService();

    // Enviar y registrar la notificación
    const { transactionId, notification } = await service.createAndSend(
      { subject, message, destinations: normalizedDestinations },
      fromName
    );

    return res.status(200).json({
      ok: true,
      transactionId,
      notification,
      message: "Correo enviado correctamente usando SMTP u OAuth2",
    });
  } catch (err: any) {
    console.error("createNotificationHandler error:", err);
    return res.status(500).json({
      ok: false,
      error: err.message || "Error interno del servidor al enviar el correo",
    });
  }
};

/**
 * Obtiene una notificación específica por su transactionId
 */
export const getNotificationHandler = async (req: Request, res: Response) => {
  try {
    const service = getService();
    const { id } = req.params;
    const record = await service.getByTransactionId(id);

    if (!record) {
      return res.status(404).json({ ok: false, error: "Notificación no encontrada" });
    }

    return res.json({ ok: true, notification: record });
  } catch (err: any) {
    console.error("getNotificationHandler error:", err);
    return res.status(500).json({ ok: false, error: err.message || err });
  }
};

/**
 * Lista las notificaciones con filtros opcionales
 */
export const listNotificationsHandler = async (req: Request, res: Response) => {
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
    console.error("listNotificationsHandler error:", err);
    return res.status(500).json({ ok: false, error: err.message || err });
  }
};
