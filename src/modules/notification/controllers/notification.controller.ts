// src/modules/notifications/controllers/notification.controller.ts
import { Request, Response } from "express";
import { CentralNotificationService } from "../services/central.service";

const central = new CentralNotificationService();

export async function createNotification(req: Request, res: Response) {
  try {
    const payload = req.body;

    // ✅ Validación de correo electrónico (siempre verifica el campo email)
    const email = payload.fixerEmail || (payload.destinations && payload.destinations[0]?.email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Correo electrónico no válido. Ejemplo válido: usuario@gmail.com",
      });
    }

    // 🔁 Si el correo es válido, continúa con el flujo normal
    const result = await central.receiveAndSend({
      subject: payload.subject,
      message: payload.message,
      destinations: payload.destinations || [{ email: payload.fixerEmail }],
      type: payload.type,
    });

    return res.status(result.success ? 200 : 400).json(result);
  } catch (err: any) {
    console.error("createNotification error:", err);
    return res.status(500).json({
      success: false,
      message: err.message ?? "Error interno",
    });
  }
}
