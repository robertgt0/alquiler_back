import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { Cita } from "../models/cita.model";

export class CitaController extends BaseController {
  constructor() {
    super(Cita);
  }

  // Buscar citas por cliente
  async findByCliente(req: Request, res: Response): Promise<void> {
    try {
      const { clienteId } = req.params;
      const citas = await this.model
        .find({ clienteId })
        .populate("proveedorId servicioId");
      res.json(citas);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // Buscar citas por proveedor (Fixer)
  async findByProveedor(req: Request, res: Response): Promise<void> {
    try {
      const { proveedorId } = req.params;
      const citas = await this.model
        .find({ proveedorId })
        .populate("clienteId servicioId");
      res.json(citas);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // Cambiar estado de cita
  async updateEstado(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      if (!["pendiente", "confirmada", "cancelada"].includes(estado)) {
        res.status(400).json({ error: "Estado inválido" });
        return;
      }

      const cita = await this.model.findByIdAndUpdate(
        id,
        { estado, updatedAt: new Date() },
        { new: true }
      );

      if (!cita) {
        res.status(404).json({ message: "Cita no encontrada" });
        return;
      }

      res.json({ message: "Estado actualizado", cita });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // Buscar citas por fecha
  async findByFecha(req: Request, res: Response): Promise<void> {
    try {
      const { fecha } = req.query;
      if (!fecha) {
        res.status(400).json({ error: "Debe proporcionar una fecha" });
        return;
      }

      const citas = await this.model.find({ fecha }).populate("proveedorId clienteId servicioId");
      res.json(citas);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const citaController = new CitaController();
