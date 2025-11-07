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
import { DetallesTrabajo, CancelacionTrabajo,TerminarTrabajo} from "../services/cancelar-trabajo.service";

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

  //controllers para la HU2 y hu3 del segundo sprint
  // controller para obtener los detalles del trabajo para el proveedor
  export const obtenerTrabajoProveedorController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resultado = await DetallesTrabajo.obtenerTrabajoProveedor(id);

    if ("mensaje" in resultado) {
      return res.status(404).json({ message: resultado.mensaje });
    }

    res.status(200).json(resultado);
  } catch (error: any) {
    console.error("Error al obtener detalles del trabajo:", error.message);
    res.status(500).json({
      message: "Error al obtener detalles del trabajo",
      error: error.message,
    });
  }
};
// controller para obtener los detalles del trabajo para el cliente
  export const obtenerTrabajoClienteController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resultado = await DetallesTrabajo.obtenerTrabajoCliente(id);

    if ("mensaje" in resultado) {
      return res.status(404).json({ message: resultado.mensaje });
    }

    res.status(200).json(resultado);
  } catch (error: any) {
    console.error("Error al obtener detalles del trabajo:", error.message);
    res.status(500).json({
      message: "Error al obtener detalles del trabajo",
      error: error.message,
    });
  }
};
//Cancelar trabajo por parte del proveedor
export const cancelarTrabajoProveedorController = async (req: Request, res: Response) => {
  try {
    const { trabajoId } = req.params;
    const { justificacion } = req.body;

    if (!justificacion || justificacion.trim() === "") {
      return res.status(400).json({ mensaje: "Debe ingresar una justificación antes de cancelar." });
    }

    const trabajoCancelado = await CancelacionTrabajo.cancelarTrabajoProveedor(trabajoId, justificacion);

    if (!trabajoCancelado) {
      return res.status(404).json({ mensaje: "Trabajo no encontrado." });
    }

    //Mensaje de confirmación al frontend
    res.json({
      mensaje: "Tu cancelación ha sido enviada al proveedor correctamente.",
    });

  } catch (error: any) {
    console.error("Error al cancelar trabajo:", error);
    res.status(500).json({ mensaje: "Error al procesar la cancelación.", error: error.message });
  }
};
//Cancelar trabajo por parte del cliente
export const cancelarTrabajoClienteController = async (req: Request, res: Response) => {
  try {
    const { trabajoId } = req.params;
    const { justificacion } = req.body;

    if (!justificacion || justificacion.trim() === "") {
      return res.status(400).json({ mensaje: "Debe ingresar una justificación antes de cancelar." });
    }

    const trabajoCancelado = await CancelacionTrabajo.cancelarTrabajoCliente(trabajoId, justificacion);

    if (!trabajoCancelado) {
      return res.status(404).json({ mensaje: "Trabajo no encontrado." });
    }

    //Mensaje de confirmación al frontend
    res.json({
      mensaje: "Tu cancelación ha sido enviada al proveedor correctamente.",
    });

  } catch (error: any) {
    console.error("Error al cancelar trabajo:", error);
    res.status(500).json({ mensaje: "Error al procesar la cancelación.", error: error.message });
  }
};

//terminar un trabajo
export const TerminarTrabajoController = async (req: Request, res: Response) => {
  try {
    const { trabajoId } = req.params;

    const trabajoTerminado = await TerminarTrabajo.marcarComoTerminado(trabajoId);

    if (!trabajoTerminado) {
      return res.status(404).json({ mensaje: "Trabajo no encontrado." });
    }

    res.json({
      mensaje: "El trabajo ha sido marcado como terminado correctamente."
    });
  } catch (error: any) {
    console.error("Error al finalizar trabajo:", error);
    res.status(500).json({
      mensaje: "Error al marcar el trabajo como terminado.",
      error: error.message
    });
  }
};
