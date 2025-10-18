// src/modules/notification/controllers/notificationController.ts
import { Request, Response } from 'express';
import { processNotification } from '../services/notificationService';

export async function createNotification(req: Request, res: Response) {
  try {
    const pkg = req.body;
    // Validación mínima
    if (!pkg?.message?.content) {
      return res.status(400).json({ ok: false, error: 'message.content es obligatorio' });
    }
    if (!Array.isArray(pkg?.destinations) || pkg.destinations.length === 0) {
      return res.status(400).json({ ok: false, error: 'destinations es obligatorio' });
    }

    // Normalizar fechas si vienen en iso strings
    if (pkg.createdAt) pkg.createdAt = new Date(pkg.createdAt);
    if (pkg.scheduledFor) pkg.scheduledFor = new Date(pkg.scheduledFor);

    const saved = await processNotification(pkg);
    return res.status(201).json({ ok: true, id: saved.id, savedId: saved._id, status: saved.status });
  } catch (err) {
    console.error('createNotification error', err);
    return res.status(500).json({ ok: false, error: 'error interno' });
  }
}

export async function listNotifications(_req: Request, res: Response) {
  try {
    const items = await (await import('../models/Notification')).NotificationModel.find().sort({ createdAt: -1 }).limit(50).lean();
    return res.status(200).json({ ok: true, total: items.length, items });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'error interno' });
  }
}
