// src/modules/los_vengadores_trabajos/controllers/trabajo.controller.ts
import { Request, Response, NextFunction } from 'express';
import { getTrabajosProveedorService, getTrabajosClienteService } from '../services/trabajo.service';
import { TrabajoStatus } from '../models/trabajo.model';

export const getTrabajosProveedor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const proveedorId = 'proveedor_123'; //id que con consida con losd atos falsos
    const estado = req.query.estado as string | undefined;

    const trabajos = await getTrabajosProveedorService(proveedorId, estado);
    res.json(trabajos);
  } catch (err) {
    next(err);
  }
};

// controlador para la HU 1.8 (Vista del Cliente)
export const getTrabajosCliente = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Tomamos el ID del cliente 
    const { clienteId } = req.params;
    const estado = req.query.estado as TrabajoStatus | undefined;

    const trabajos = await getTrabajosClienteService(clienteId, estado);
    res.json(trabajos);
  } catch (err) {
    next(err);
  }
};