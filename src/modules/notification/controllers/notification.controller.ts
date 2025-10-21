// src/modules/notifications/controllers/notification.controller.ts
import { Request, Response } from "express";
import { CentralNotificationService } from "../services/central.service";

const central = new CentralNotificationService();

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