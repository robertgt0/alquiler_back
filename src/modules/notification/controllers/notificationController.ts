/*
Esto deben modificarlo en base a lo que estamos haciendo de notificaciones
LO QUE ESTA AQUI PARECE SER ALGO GENERICO!!! atte:Adrian
*/


/*
import { Request, Response } from 'express';
import ejemploService from '../services/gmailService';
import { ApiResponse } from '../types';
import { handleError } from '../errors/errorHandler';

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await ejemploService.getAll();
    const response: ApiResponse<any> = {
      success: true,
      count: data.length,
      data: data,
    };
    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await ejemploService.getById(req.params.id);
    if (!data) {
      res.status(404).json({
        success: false,
        message: 'Registro no encontrado',
      });
      return;
    }
    const response: ApiResponse<any> = {
      success: true,
      data: data,
    };
    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await ejemploService.create(req.body);
    const response: ApiResponse<any> = {
      success: true,
      data: data,
      message: 'Registro creado exitosamente'
    };
    res.status(201).json(response);
  } catch (error) {
    handleError(error, res);
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await ejemploService.update(req.params.id, req.body);
    if (!data) {
      res.status(404).json({
        success: false,
        message: 'Registro no encontrado',
      });
      return;
    }
    const response: ApiResponse<any> = {
      success: true,
      data: data,
      message: 'Registro actualizado exitosamente'
    };
    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await ejemploService.delete(req.params.id);
    if (!data) {
      res.status(404).json({
        success: false,
        message: 'Registro no encontrado',
      });
      return;
    }
    res.json({
      success: true,
      message: 'Registro eliminado correctamente',
    });
  } catch (error) {
    handleError(error, res);
  }
};*/
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
