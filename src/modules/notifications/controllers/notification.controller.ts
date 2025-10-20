// src/modules/notifications/controllers/notification.controller.ts
import { Request, Response } from 'express';
import { processNotification } from '../workflows/notification.workflow';
import { NotificationData } from '../types/notification.types';

export async function createNotification(req: Request, res: Response) {
  const payload: NotificationData = req.body;
  const result = await processNotification(payload);
  res.status(result.success ? 200 : 400).json(result);
}

/**
 * testWebhook: ejemplo de endpoint que recibe datos y a su vez llama al webhook de n8n
 * (opcional, sirve para enviar eventos a n8n desde backend)
 */
export async function testWebhook(req: Request, res: Response) {
  const payload = req.body;
  // si N8N_WEBHOOK_URL definido, reenvía
  const n8nUrl = process.env.N8N_WEBHOOK_URL;
  if (!n8nUrl) {
    return res.status(500).json({ success: false, message: 'N8N_WEBHOOK_URL no configurado' });
  }

  try {
    // Node 18+ tiene fetch global; si no, instala node-fetch
    // @ts-ignore
    const fetchFn = (global as any).fetch ?? (await import('node-fetch')).default;
    await fetchFn(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return res.json({ success: true, message: 'Evento reenviado a n8n' });
  } catch (err: any) {
    console.error('Error enviando a n8n:', err?.message ?? err);
    return res.status(500).json({ success: false, message: 'Error enviando a n8n' });
  }
}

