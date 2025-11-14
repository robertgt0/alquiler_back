import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { Trabajo } from "../models/trabajo.model";

export class TrabajoController extends BaseController {
  constructor() {
    super(Trabajo);
  }

  // Buscar trabajos por estado
  async findByEstado(req: Request, res: Response): Promise<void> {
    try {
      const { estado } = req.params;
      const trabajos = await this.model.find({ estado });
      res.json(trabajos);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // Buscar trabajos por fixer
  async findByFixer(req: Request, res: Response): Promise<void> {
    try {
      const { fixerId } = req.params;
      const trabajos = await this.model.find({ fixer_id: fixerId });
      res.json(trabajos);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // Buscar trabajos por cliente
  async findByCliente(req: Request, res: Response): Promise<void> {
    try {
      const { clienteId } = req.params;
      const trabajos = await this.model.find({ id_cliente: clienteId });
      res.json(trabajos);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const trabajoController = new TrabajoController();
