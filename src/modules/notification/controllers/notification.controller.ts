import { Request, Response } from "express";
import { CentralNotificationService } from "../services/central.service";
import { NotificationService } from "../services/notification.service";

const central = new CentralNotificationService();
const service = new NotificationService();

/**
 * 📩 Procesa notificaciones generales del sistema (flujo central)
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
    console.error("createNotification error:", err);
    return res.status(500).json({ success: false, message: err.message ?? "Error interno" });
  }
}

/**
 * 💌 Enviar correo con plantilla de reserva (T12)
 */
export const sendBookingTemplateHandler = async (req: Request, res: Response) => {
  try {
    const { to, userName, serviceName, date, price } = req.body;

    const result = await service.sendBookingNotification({
      to,
      userName,
      serviceName,
      date,
      price,
    });

    return res.status(200).json({
      ok: true,
      message: "Correo con template enviado correctamente",
      result,
    });
  } catch (err: any) {
    console.error("sendBookingTemplateHandler error:", err);
    return res.status(500).json({
      ok: false,
      error: err.message || "Error al enviar el correo con template",
    });
  }
};
