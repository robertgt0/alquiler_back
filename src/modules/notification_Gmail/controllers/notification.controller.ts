// src/modules/notification_Gmail/controllers/notification.controller.ts
import { Request, Response } from "express";
import { CentralNotificationService } from "../services/central.service";
import { InvalidNotificationDataError } from "../errors/notification.errors";

/**
 * Controlador para crear y enviar notificaciones a través de Gmail API OAuth2
 */
const central = new CentralNotificationService();

/**
 * 📩 Crea una notificación y la envía usando Gmail API
 */
export async function createNotification(req: Request, res: Response) {
  try {
    const payload = req.body;

    const result = await central.receiveAndSend({
      subject: payload.subject,
      message: payload.message,
      destinations: payload.destinations || [{ email: payload.fixerEmail }],
      type: payload.type,
    });

    return res.status(result.success ? 200 : 400).json(result);
  } catch (err: any) {
    console.error("❌ [createNotification] Error:", err);

    if (err instanceof InvalidNotificationDataError) {
      return res.status(400).json({
        success: false,
        message: "El correo no es válido o no existe.",
        details: err.details,
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message ?? "Error interno del servidor",
    });
  }
}

/**
 * 📅 Envía un correo con plantilla de confirmación de reserva (booking)
 */
export const sendBookingTemplateHandler = async (req: Request, res: Response) => {
  try {
    const { to, userName, serviceName, date, price } = req.body;

    const result = await central.receiveAndSend({
      subject: "Confirmación de Reserva",
      message: `
        <h2>Hola ${userName}</h2>
        <p>Tu reserva para el servicio <strong>${serviceName}</strong> fue confirmada.</p>
        <p><b>Fecha:</b> ${date}</p>
        <p><b>Precio:</b> ${price} Bs</p>
      `,
      destinations: [{ email: to }],
      type: "booking",
    });

    return res.status(result.success ? 200 : 400).json({
      ok: result.success,
      message: result.success
        ? "Correo con template enviado correctamente (vía Gmail API)"
        : "Error al enviar correo",
      result,
    });
  } catch (err: any) {
    console.error("❌ [sendBookingTemplateHandler] Error:", err);

    return res.status(500).json({
      ok: false,
      error: err.message || "Error al enviar el correo con template",
    });
  }
};
