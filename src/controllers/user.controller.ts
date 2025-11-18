
/*
TOMAR EN CUENTA QUE LA LOGICA DE CADA CONTROLADOR VA DEPENDER DEL CASO QUE SE 
REQUIERA ABORDAR, SINO TENDRA LAS FUNCIONALIDADES BASICAS DE 'CRUD' crear, editar, añadir, borrar
*/

import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { User } from "../models/user.model";

export class UserController extends BaseController {
  constructor() {
    super(User); // Reutiliza toda la lógica CRUD del controlador base
  }

  /**
   * Ejemplo de método adicional para personalizar la lógica de usuarios.
   * Este método no reemplaza los CRUD del BaseController, solo los complementa.
   */
  async findByCorreo(req: Request, res: Response): Promise<void> {
    try {
      const { correo } = req.params;
      const user = await this.model.findOne({ correo });
      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }
      res.json(user);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Ejemplo: crear usuario con lógica adicional
   * (por ejemplo, si luego deseas encriptar la contraseña o validar rol)
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { correo, nombre, rol, fotoPerfil, ubicacion } = req.body;

      // Validación mínima
      if (!correo || !nombre || !rol || !fotoPerfil || !ubicacion) {
        res.status(400).json({ error: "Faltan campos obligatorios" });
        return;
      }

      const existe = await this.model.findOne({ correo });
      if (existe) {
        res.status(409).json({ error: "El correo ya está registrado" });
        return;
      }

      // Usa la creación del modelo directamente
      const newUser = await this.model.create(req.body);
      res.status(201).json(newUser);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const userController = new UserController();
