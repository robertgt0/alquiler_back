/*
Esto deben modificarlo en base a lo que estamos haciendo de notificaciones
LO QUE ESTA AQUI PARECE SER ALGO GENERICO!!! atte:Adrian
*/

import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";
import { validationResult } from "express-validator";

const service = new NotificationService();

export const createNotificationHandler = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const payload = req.body;
  try {
    // createAndSend creates DB record and attempts send (con reintentos)
    const { transactionId, notification } = await service.createAndSend(payload, payload.fromName);

    // Si quieres comportamiento asíncrono cambia a 202 y procesa en background
    return res.status(200).json({ ok: true, transactionId, notification });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err.message || err });
  }
};

export const getNotificationHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const record = await service.getByTransactionId(id);
  if (!record) return res.status(404).json({ ok: false, error: "Not found" });
  return res.json({ ok: true, notification: record });
};

export const listNotificationsHandler = async (req: Request, res: Response) => {
  const { status, to, fromDate, toDate, limit = 20, page = 1 } = req.query;
  const { items, total } = await service.list({ status, to, fromDate, toDate }, Number(limit), Number(page));
  return res.json({ ok: true, items, total, page: Number(page) });
};
