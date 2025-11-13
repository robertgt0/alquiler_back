import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { Fixer } from "../models/fixer.model";

export class FixerController extends BaseController {
  constructor() {
    super(Fixer); // Reutiliza toda la lógica CRUD base
  }

  /**
   * Buscar Fixer por correo electrónico
   */
  async findByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      const fixer = await this.model.findOne({ email }).populate([
        "categorias",
        "especialidades",
        "servicios",
      ]);
      if (!fixer) {
        res.status(404).json({ message: "Fixer no encontrado" });
        return;
      }
      res.json(fixer);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Crear nuevo Fixer con validación básica
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { nombre, usuario, email, hash_password } = req.body;

      if (!nombre || !usuario || !email || !hash_password) {
        res.status(400).json({ error: "Faltan campos obligatorios" });
        return;
      }

      const existe = await this.model.findOne({ email });
      if (existe) {
        res.status(409).json({ error: "El correo ya está registrado" });
        return;
      }

      const nuevoFixer = await this.model.create({
        ...req.body,
        fecha_registro: new Date(),
        activo: true,
      });

      res.status(201).json(nuevoFixer);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Actualizar estado de disponibilidad del Fixer
   */
  async actualizarDisponibilidad(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { disponible, desde, hasta } = req.body;

      const actualizado = await this.model.findByIdAndUpdate(
        id,
        { disponibilidad: { disponible, desde, hasta } },
        { new: true }
      );

      if (!actualizado) {
        res.status(404).json({ message: "Fixer no encontrado" });
        return;
      }

      res.json(actualizado);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const fixerController = new FixerController();
