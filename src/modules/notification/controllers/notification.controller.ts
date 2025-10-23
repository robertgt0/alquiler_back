import { Request, Response } from "express";
import { CentralNotificationService } from "../services/central.service";
import { NotificationService } from "../services/notification.service";

const central = new CentralNotificationService();
const service = new NotificationService();

/**
 * 💌 Enviar correo con plantilla de reserva (T12)
 */
export const sendBookingTemplateHandler = async (req: Request, res: Response) => {
  try {
    const { to, userName, serviceName, date, price } = req.body;

    // ✅ Validación del formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({
        ok: false,
        error: "Correo electrónico no válido. Ejemplo válido: usuario@dominio.com",
      });
    }

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
