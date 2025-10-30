import { Request, Response } from 'express';
import { crearSolicitudService } from '../services/trabajo-solicitado.service';

export const crearTrabajoSolicitado = async (req: Request, res: Response) => {
  try {
    const { proveedor, cliente, fecha, hora_inicio, hora_fin, estado } = req.body;

    if (!fecha || !hora_inicio || !hora_fin) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios: fecha, hora_inicio, hora_fin',
      });
    }

    const nuevo = await crearSolicitudService({
      proveedor: proveedor ?? null,
      cliente: cliente ?? null,
      fecha,
      hora_inicio,
      hora_fin,
      estado: estado ?? 'pendiente',
    });

    return res.status(201).json({
      success: true,
      message: 'Trabajo solicitado guardado correctamente',
      data: nuevo,
    });
  } catch (err) {
    console.error('crearTrabajoSolicitado error:', err);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};
