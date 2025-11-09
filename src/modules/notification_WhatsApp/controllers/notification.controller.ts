// src/modules/notifications/controllers/notification.controller.ts
import { Request, Response } from "express";
import { CentralNotificationService } from "../services/central.service";
import { InvalidNotificationDataError } from "../errors/notification.errors";

/**
 * Controlador para crear y enviar notificaciones vía Evolution API (WhatsApp)
 */
const central = new CentralNotificationService();

/**
 * 📩 Crea una notificación y la envía usando Evolution API (WhatsApp)
 */
export async function createNotification(req: Request, res: Response) {
  try {
    const payload = req.body;

    if (!payload?.message || (!payload?.phone && !payload?.destinations)) {
      return res.status(400).json({
        success: false,
        message: "El mensaje o el número de destino son obligatorios.",
      });
    }

    const input = {
      subject: payload.subject || "Notificación del Sistema",
      message: payload.message,
      destinations: payload.destinations || [{ phone: payload.phone }],
      fromName: payload.fromName || "Sistema",
      channel: payload.channel || "whatsapp",
    };

    const result = await central.receiveAndSend(input);

    return res.status(200).json({
      success: true,
      message: "Notificación enviada correctamente vía Evolution API (WhatsApp)",
      result,
    });
  } catch (err: any) {
    console.error("❌ [createNotification] Error:", err);

    if (err instanceof InvalidNotificationDataError) {
      return res.status(400).json({
        success: false,
        message: "Número de teléfono inválido o falta información.",
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
 * 📅 Envía una plantilla de confirmación de reserva (ejemplo para WhatsApp)
 */
export const sendBookingTemplateHandler = async (req: Request, res: Response) => {
  try {
    const { phone, userName, serviceName, date, price } = req.body;

    if (!phone || !userName || !serviceName || !date || !price) {
      return res.status(400).json({
        ok: false,
        error: "Faltan datos para enviar la confirmación de reserva.",
      });
    }

    const message = `
✅ *Confirmación de Reserva*
Hola ${userName},
Tu reserva para el servicio *${serviceName}* fue confirmada.
📅 *Fecha:* ${date}
💰 *Precio:* ${price} Bs
Gracias por confiar en nosotros.
    `.trim();

    const result = await central.receiveAndSend({
      subject: "Confirmación de Reserva",
      message,
      destinations: [{ phone }],
      fromName: "Sistema",
      channel: "whatsapp",
    }as any);

    return res.status(200).json({
      ok: true,
      message: "Mensaje de confirmación enviado correctamente vía Evolution API",
      result,
    });
  } catch (err: any) {
    console.error("❌ [sendBookingTemplateHandler] Error:", err);

    return res.status(500).json({
      ok: false,
      error: err.message || "Error al enviar el mensaje de confirmación",
    });
  }
};
