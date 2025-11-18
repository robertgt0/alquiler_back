import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { Especialidad } from "../models/especialidad.model";

export class EspecialidadController extends BaseController {
  constructor() {
    super(Especialidad);
  }

  // Ejemplo adicional: buscar por nombre
  async findByNombre(req: Request, res: Response): Promise<void> {
    try {
      const { nombre } = req.params;
      const especialidad = await this.model.findOne({
        nombre: new RegExp(nombre, "i"),
      });
      if (!especialidad) {
        res.status(404).json({ message: "Especialidad no encontrada" });
        return;
      }
      res.json(especialidad);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const especialidadController = new EspecialidadController();
