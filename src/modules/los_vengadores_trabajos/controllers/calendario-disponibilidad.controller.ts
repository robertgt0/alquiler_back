//src/modules/los_vengadores_trabajos/controllers/calendario-disponibilidad.controller.ts
import { Request, Response } from 'express';
import { DisponibilidadService } from '../services/calendario-disponibilidad.service';

export const DisponibilidadController = {
  
  // Endpoint 1: Obtener calendario mensual
  async obtenerCalendario(req: Request, res: Response) {
    try {
      const { proveedorId } = req.params;
      const { mes, anio } = req.query;

      // Validaciones simples
      if (!mes || !anio) {
        return res.status(400).json({ 
          error: "Parámetros mes y anio son requeridos",
          ejemplo: "/api/disponibilidad/juan-perez/calendario?mes=9&anio=2025"
        });
      }

      const calendario = await DisponibilidadService.obtenerCalendarioMensual(
        proveedorId,
        parseInt(mes as string),
        parseInt(anio as string)
      );

      res.json({
        proveedorId,
        mes: parseInt(mes as string),
        anio: parseInt(anio as string),
        dias: calendario
      });
    } catch (error) {
      let mensaje = 'Error desconocido';
      if (error instanceof Error) {
        mensaje = error.message;
      }
      res.status(500).json({ 
        error: "Error al cargar calendario",
        mensaje
      });
    }
  },

  // Endpoint 2: Obtener horarios de un día
  async obtenerHorariosDia(req: Request, res: Response) {
    try {
      const { proveedorId, fecha } = req.params;

      // Validar formato de fecha (YYYY-MM-DD)
      if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return res.status(400).json({ 
          error: "Formato de fecha inválido",
          ejemplo: "Use YYYY-MM-DD (2025-09-29)"
        });
      }

      const resultado = await DisponibilidadService.obtenerHorariosDia(proveedorId, fecha);

      res.json(resultado);
    } catch (error) {
      let mensaje = 'Error desconocido';
      if (error instanceof Error) {
        mensaje = error.message;
      }
      res.status(500).json({ 
        error: "Error al cargar horarios",
        mensaje
      });
    }
  },

  // Endpoint extra: Info del proveedor
  async obtenerInfoProveedor(req: Request, res: Response) {
    try {
      const { proveedorId } = req.params;
      const info = await DisponibilidadService.obtenerInfoProveedor(proveedorId);
      res.json(info);
    } catch (error) {
      let mensaje = 'Error desconocido';
      if (error instanceof Error) {
        mensaje = error.message;
      }
      res.status(500).json({ 
        error: "Error al obtener informacion del proveedor",
        mensaje
      });
    }
  }
};