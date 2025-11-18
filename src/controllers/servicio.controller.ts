import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { Servicio } from "../models/servicio.model";

export class ServicioController extends BaseController {
  constructor() {
    super(Servicio);
  }

  // Buscar servicios por Fixer
  async findByProveedor(req: Request, res: Response): Promise<void> {
    try {
      const { proveedorId } = req.params;
      const servicios = await this.model.find({ proveedorId });
      if (!servicios.length) {
        res.status(404).json({ message: "No se encontraron servicios para este fixer" });
        return;
      }
      res.json(servicios);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // Buscar servicios por nombre (búsqueda parcial)
  async searchByNombre(req: Request, res: Response): Promise<void> {
    try {
      const { nombre } = req.query;
      if (!nombre) {
        res.status(400).json({ error: "Debe proporcionar un nombre para buscar" });
        return;
      }

      const servicios = await this.model.find({
        nombre: { $regex: nombre, $options: "i" },
      });

      res.json(servicios);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // Calcular promedio de rating
  async promedioRating(req: Request, res: Response): Promise<void> {
    try {
      const promedio = await this.model.aggregate([
        { $group: { _id: null, promedioRating: { $avg: "$rating" } } },
      ]);

      res.json({ promedioRating: promedio[0]?.promedioRating || 0 });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const servicioController = new ServicioController();
