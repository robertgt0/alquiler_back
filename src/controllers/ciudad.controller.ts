import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { Ciudad } from "../models/ciudad.model";

export class CiudadController extends BaseController {
  constructor() {
    super(Ciudad);
  }

  async findByNombre(req: Request, res: Response): Promise<void> {
    try {
      const { nombre } = req.params;
      const ciudad = await this.model.findOne({ nombre: new RegExp(nombre, "i") });
      if (!ciudad) {
        res.status(404).json({ message: "Ciudad no encontrada" });
        return;
      }
      res.json(ciudad);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const ciudadController = new CiudadController();
