// controllers/base.controller.ts
import { Request, Response } from "express";

export class BaseController {
  protected model: any;

  constructor(model: any) {
    this.model = model;
  }

  // Obtener todos los registros
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.model.find();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // Obtener por ID
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.model.findById(req.params.id);
      if (!data) {
        res.status(404).json({ message: "No encontrado" });
        return;
      }
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // Crear nuevo
  async create(req: Request, res: Response): Promise<void> {
    try {
      const newData = await this.model.create(req.body);
      res.status(201).json(newData);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // Actualizar por ID
  async update(req: Request, res: Response): Promise<void> {
    try {
      const updated = await this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // Eliminar por ID
  async delete(req: Request, res: Response): Promise<void> {
    try {
      await this.model.findByIdAndDelete(req.params.id);
      res.json({ message: "Eliminado correctamente" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
