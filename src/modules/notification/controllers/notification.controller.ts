// src/modules/notifications/controllers/notification.controller.ts
import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";

let _service: NotificationService | null = null;
function getService() {
  if (!_service) _service = new NotificationService();
  return _service;
}

export const createNotificationHandler = async (req: Request, res: Response) => {
  const payload = req.body;

  // Validación de estructura básica del paquete recibido
  const { message, subject, destinations } = payload;
  if (!message || !subject || !destinations || !destinations[0].email) {
    return res.status(400).json({ ok: false, error: "Estructura inválida" });
  }

  try {
    const service = getService();
    const { transactionId, notification } = await service.createAndSend(payload, payload.fromName);
    return res.status(200).json({ ok: true, transactionId, notification });
  } catch (err: any) {
    console.error("createNotificationHandler error:", err);
    return res.status(500).json({ ok: false, error: err.message || err });
  }
};

export const getNotificationHandler = async (req: Request, res: Response) => {
  try {
    const service = getService();
    const { id } = req.params;
    const record = await service.getByTransactionId(id);
    if (!record) return res.status(404).json({ ok: false, error: "Not found" });
    return res.json({ ok: true, notification: record });
  } catch (err: any) {
    console.error("getNotificationHandler error:", err);
    return res.status(500).json({ ok: false, error: err.message || err });
  }
};

export const listNotificationsHandler = async (req: Request, res: Response) => {
  try {
    const service = getService();
    const { status, to, fromDate, toDate, limit = 20, page = 1 } = req.query;
    const { items, total } = await service.list({ status, to, fromDate, toDate }, Number(limit), Number(page));
    return res.json({ ok: true, items, total, page: Number(page) });
  } catch (err: any) {
    console.error("listNotificationsHandler error:", err);
    return res.status(500).json({ ok: false, error: err.message || err });
  }
};
