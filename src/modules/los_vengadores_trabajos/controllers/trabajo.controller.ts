// src/modules/los_vengadores_trabajos/controllers/trabajo.controller.ts
import { Request, Response, NextFunction } from 'express';
import { getTrabajosProveedorService, getTrabajosClienteService } from '../services/trabajo.service';
import { TrabajoStatus } from '../models/trabajo.model';

// Controlador para la HU 1.7 (Vista del Proveedor)
export const getTrabajosProveedor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simulación: Más adelante, este ID vendrá de un sistema de autenticación (ej. un token JWT)
    const proveedorId = 'proveedor1'; 
    const estado = req.query.estado as TrabajoStatus | undefined;
    
    const trabajos = await getTrabajosProveedorService(proveedorId, estado);
    res.json(trabajos);
  } catch (err) {
    // En un futuro, aquí se manejarían los errores de forma más robusta
    next(err);
  }
};

// Controlador para la HU 1.8 (Vista del Cliente)
export const getTrabajosCliente = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Tomamos el ID del cliente directamente de los parámetros de la URL
    const { clienteId } = req.params;
    const estado = req.query.estado as TrabajoStatus | undefined;

    const trabajos = await getTrabajosClienteService(clienteId, estado);
    res.json(trabajos);
  } catch (err) {
    next(err);
  }
};