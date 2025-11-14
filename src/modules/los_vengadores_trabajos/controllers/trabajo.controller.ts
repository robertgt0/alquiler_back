import { Request, Response, NextFunction } from 'express';
import {
  crearTrabajo,
  obtenerTrabajos,
  obtenerTrabajoPorId,
  eliminarTrabajo,
  getTrabajosProveedorService,
  getTrabajosClienteService,
  confirmarTrabajoService,
  rechazarTrabajoService,
  obtenerDetallesTrabajoService,
  cancelarTrabajoProveedorService
} from '../services/trabajo.service';

import { DetallesTrabajo, CancelacionTrabajo, TerminarTrabajo } from "../services/cancelar-trabajo.service";
import TrabajoModel from "../models/trabajo.model"; // ✅ Import movido arriba

// --- NUEVAS FUNCIONES PARA HU 1 (Confirmar / Rechazar) ---
export const confirmarTrabajoController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resultado = await confirmarTrabajoService(id);
    res.status(200).json({
      success: true,
      message: resultado.message,
      data: resultado.data,
    });
  } catch (error: any) {
    console.error("❌ Error al confirmar trabajo:", error);
    res.status(404).json({
      success: false,
      message: error.message || "Error al confirmar trabajo",
    });
  }
};

export const rechazarTrabajoController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resultado = await rechazarTrabajoService(id);
    res.status(200).json({
      success: true,
      message: resultado.message,
      data: resultado.data,
    });
  } catch (error: any) {
    console.error("❌ Error al rechazar trabajo:", error);
    res.status(404).json({
      success: false,
      message: error.message || "Error al rechazar trabajo",
    });
  }
};

// --- HU 1.7 (VISTA PROVEEDOR - LISTA) ---
export const getTrabajosProveedor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const proveedorId = '6902c43438df4e88b6680640'; 
    const estado = req.query.estado as string | undefined;
    const trabajos = await getTrabajosProveedorService(proveedorId, estado);
    res.json(trabajos);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener trabajos del proveedor', error: error.message });
  }
};

// --- HU 1.8 (VISTA CLIENTE - LISTA) ---
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

// --- HU 1.6 / 1.7 (VER DETALLES Y CANCELAR) ---
export const getDetallesTrabajoController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const trabajo = await obtenerDetallesTrabajoService(id);
    
    const respuestaFrontend = {
      Id: (trabajo as any)._id,
      cliente: (trabajo as any).id_cliente?.nombre || 'Cliente Desconocido',
      proveedor: (trabajo as any).id_proveedor?.nombre || 'Proveedor Desconocido',
      fecha: (trabajo as any).fecha,
      horario: `${(trabajo as any).hora_inicio} - ${(trabajo as any).hora_fin}`,
      descripcion: (trabajo as any).descripcion_trabajo,
      costo: (trabajo as any).costo,
      estado: (trabajo as any).estado,
      justificacion_cancelacion: (trabajo as any).justificacion_cancelacion,
      cancelado_por: (trabajo as any).cancelado_por
    };

    res.json(respuestaFrontend);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener detalles', error: error.message });
  }
};

export const cancelarTrabajoProveedorController = async (req: Request, res: Response) => {
  try {
    const { trabajoId } = req.params;
    const { justificacion } = req.body;

    if (!justificacion) {
      return res.status(400).json({ message: 'La justificación es requerida' });
    }

    const trabajoCancelado = await cancelarTrabajoProveedorService(trabajoId, justificacion);
    res.json({ message: 'Trabajo cancelado exitosamente', trabajo: trabajoCancelado });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al cancelar el trabajo', error: error.message });
  }
};

// --- FUNCIONES CRUD BÁSICAS ---
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

// --- CONTROLADORES DE OTROS COMPAÑEROS ---
export const obtenerTrabajoProveedorController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resultado = await DetallesTrabajo.obtenerTrabajoVistaProveedor(id);
    if ("mensaje" in resultado) return res.status(404).json({ message: resultado.mensaje });
    res.status(200).json(resultado);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener detalles del trabajo", error: error.message });
  }
};

export const obtenerTrabajoClienteController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resultado = await DetallesTrabajo.obtenerTrabajoVistaCliente(id);
    if ("mensaje" in resultado) return res.status(404).json({ message: resultado.mensaje });
    res.status(200).json(resultado);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener detalles del trabajo", error: error.message });
  }
};

export const cancelarTrabajoClienteController = async (req: Request, res: Response) => {
  try {
    const { trabajoId } = req.params;
    const { justificacion } = req.body;
    if (!justificacion || justificacion.trim() === "") return res.status(400).json({ mensaje: "Debe ingresar una justificación." });

    const trabajoCancelado = await CancelacionTrabajo.cancelarTrabajoCliente(trabajoId, justificacion);
    if (!trabajoCancelado) return res.status(404).json({ mensaje: "Trabajo no encontrado." });

    res.json({ mensaje: "Tu cancelación ha sido enviada al proveedor correctamente." });
  } catch (error: any) {
    res.status(500).json({ mensaje: "Error al procesar la cancelación.", error: error.message });
  }
};

export const TerminarTrabajoController = async (req: Request, res: Response) => {
  try {
    const { trabajoId } = req.params;
    const trabajoTerminado = await TerminarTrabajo.marcarComoTerminado(trabajoId);
    if (!trabajoTerminado) return res.status(404).json({ mensaje: "Trabajo no encontrado." });
    res.json({ mensaje: "El trabajo ha sido marcado como terminado correctamente." });
  } catch (error: any) {
    res.status(500).json({ mensaje: "Error al marcar el trabajo como terminado.", error: error.message });
  }
};

// --- NUEVAS FUNCIONES DE CALIFICACIÓN ---
export const getCalificacionesPorProveedorController = async (req: Request, res: Response) => {
  const { proveedorId } = req.params;

  try {
    const trabajos = await TrabajoModel.find({ 
      id_proveedor: proveedorId,
      estado: "Terminado" 
    })
    .populate("id_cliente", "nombre")
    .exec();

    if (!trabajos || trabajos.length === 0) {
      return res.status(404).json({ success: false, message: "No hay calificaciones" });
    }

    const calificaciones = trabajos
      .filter(t => t.numero_estrellas !== undefined)
      .map(t => {
        const cliente = t.id_cliente as unknown as { nombre: string } | null;
        return {
          id: t._id,
          client: cliente?.nombre || "Desconocido",
          score: t.numero_estrellas,
          comment: t.comentario_calificacion,
          date: t.fecha,
        };
      });

    res.json({ success: true, calificaciones });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al obtener calificaciones", error });
  }
};

export const guardarCalificacionController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { numero_estrellas, comentario_calificacion } = req.body;

  try {
    const trabajo = await TrabajoModel.findById(id);

    if (!trabajo) {
      return res.status(404).json({ success: false, message: "Trabajo no encontrado" });
    }

    trabajo.numero_estrellas = numero_estrellas;
    trabajo.comentario_calificacion = comentario_calificacion;
    trabajo.estado = "Terminado";

    await trabajo.save();

    res.json({
      success: true,
      message: "Calificación guardada",
      trabajo
    });
  } catch (error: any) {
    console.error("Error al guardar calificación:", error);
    res.status(500).json({
      success: false,
      message: "Error al guardar calificación",
      error: error.message || String(error),
    });
  }
};