import { Request, Response } from 'express';
import { processNotification } from '../workflows/notification.workflow';

export async function createNotification(req: Request, res: Response) {
  const result = await processNotification(req.body);
  res.status(result.success ? 200 : 400).json(result);
}

