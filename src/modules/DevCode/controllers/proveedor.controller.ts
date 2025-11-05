import { Request, Response } from 'express';
import { ProveedorService } from '../services/proveedor.service';

export class ProveedorController {
  static async crear(req: Request, res: Response) {
    try {
      const nuevo = await ProveedorService.crearProveedor(req.body);
      res.status(201).json(nuevo);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async listar(req: Request, res: Response) {
    try {
      const proveedores = await ProveedorService.listarProveedores();
      res.json(proveedores);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async obtener(req: Request, res: Response) {
    try {
      const proveedor = await ProveedorService.obtenerProveedor(req.params.id);
      if (!proveedor) return res.status(404).json({ error: 'Proveedor no encontrado' });
      res.json(proveedor);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async disponibilidad(req: Request, res: Response) {
    try {
      const { fechaInicio, fechaFin } = req.query;
      const disponibilidad = await ProveedorService.obtenerDisponibilidad(
        req.params.id,
        fechaInicio as string,
        fechaFin as string
      );
      res.json(disponibilidad);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async guardarHorarioLaboral(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const horario = req.body;

      const proveedor = await ProveedorService.guardarHorarioLaboral(id, horario);

      return res.status(200).json({
        mensaje: 'Horario laboral guardado exitosamente',
        datos: proveedor.horarioLaboral
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
      return res.status(400).json({ // 🟢 ¡Cambiado de 500 a 400!
        mensaje: 'Error al guardar el horario laboral',
        error: errorMessage
      });
    }
  }
}
