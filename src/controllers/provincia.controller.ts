import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { Provincia } from "../models/provincia.model";

export class ProvinciaController extends BaseController {
  constructor() {
    super(Provincia);
  }

  // Buscar provincias por id_ciudad (relación con Ciudad)
  async findByCiudad(req: Request, res: Response): Promise<void> {
    try {
      const { id_ciudad } = req.params;
      const provincias = await this.model.find({ id_ciudad });
      res.json(provincias);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const provinciaController = new ProvinciaController();
