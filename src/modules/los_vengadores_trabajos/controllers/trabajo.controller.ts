// src/modules/los_vengadores_trabajos/controllers/trabajo.controller.ts
import { Request, Response, NextFunction } from 'express';
import {
  crearTrabajo,
  obtenerTrabajos,
  obtenerTrabajoPorId,
  eliminarTrabajo,
  getTrabajosProveedorService, // 1. ¡IMPORTAMOS LA FUNCIÓN DEL SERVICIO!
  getTrabajosClienteService,  // 1. ¡IMPORTAMOS LA FUNCIÓN DEL SERVICIO!
} from '../services/trabajo.service';

// --- NUEVA FUNCIÓN PARA HU 1.7 (VISTA PROVEEDOR) ---
export const getTrabajosProveedor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // ID de prueba de un proveedor que SÍ existe en tu BD (Juan D)
    const proveedorId = '6902c43438df4e88b6680640'; 
    
    const estado = req.query.estado as string | undefined;

    // 2. ¡AQUÍ USAMOS LA FUNCIÓN DEL SERVICIO!
    const trabajos = await getTrabajosProveedorService(proveedorId, estado);
    res.json(trabajos);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener trabajos del proveedor', error: error.message });
  }
};

// --- NUEVA FUNCIÓN PARA HU 1.8 (VISTA CLIENTE) ---
export const getTrabajosCliente = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { clienteId } = req.params;
    const estado = req.query.estado as string | undefined;

    const trabajos = await getTrabajosClienteService(clienteId, estado);
    res.json(trabajos);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener trabajos del cliente', error: error.message });
  }
};

// --- TUS FUNCIONES EXISTENTES ---

export const crearTrabajoController = async (req: Request, res: Response) => {
  try {
    const trabajo = await crearTrabajo(req.body);
    res.status(201).json(trabajo);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al crear trabajo', error: error.message });
  }
};

export const obtenerTrabajosController = async (req: Request, res: Response) => {
  try {
    const trabajos = await obtenerTrabajos();
    res.json(trabajos);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener trabajos', error: error.message });
  }
};

export const obtenerTrabajoPorIdController = async (req: Request, res: Response) => {
  try {
    const trabajo = await obtenerTrabajoPorId(req.params.id);
    if (!trabajo) return res.status(404).json({ message: 'Trabajo no encontrado' });
    res.json(trabajo);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener trabajo', error: error.message });
  }
};

export const eliminarTrabajoController = async (req: Request, res: Response) => {
  try {
    const trabajoEliminado = await eliminarTrabajo(req.params.id);
    if (!trabajoEliminado) return res.status(404).json({ message: 'Trabajo no encontrado' });
    res.json({ message: 'Trabajo eliminado correctamente' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al eliminar trabajo', error: error.message });
  }
};