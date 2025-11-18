import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { UserAuth } from "../models/userAuth.model";

export class UserAuthController extends BaseController {
  constructor() {
    super(UserAuth); // Hereda CRUD básico
  }

  /**
   * Ejemplo de método adicional:
   * Buscar autenticación por ID de usuario
   */
  async findByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const authData = await this.model.findOne({ userId });
      if (!authData) {
        res.status(404).json({ message: "Registro de autenticación no encontrado" });
        return;
      }
      res.json(authData);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Ejemplo adicional: crear registro con validación
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { userId, authProvider } = req.body;

      if (!userId) {
        res.status(400).json({ error: "Falta el userId" });
        return;
      }

      // Verificar si ya existe un registro de autenticación
      const existe = await this.model.findOne({ userId });
      if (existe) {
        res.status(409).json({ error: "El usuario ya tiene registro de autenticación" });
        return;
      }

      const newAuth = await this.model.create({
        userId,
        authProvider: authProvider || "local",
        mapaModificacion: 3,
      });

      res.status(201).json(newAuth);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const userAuthController = new UserAuthController();
