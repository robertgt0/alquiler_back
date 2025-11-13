import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { Cliente } from "../models/cliente.model";

export class ClienteController extends BaseController {
  constructor() {
    super(Cliente); // hereda las funciones CRUD del BaseController
  }

  /**
   * Ejemplo: Buscar cliente por correo
   */
  async findByCorreo(req: Request, res: Response): Promise<void> {
    try {
      const { correo } = req.params;
      const cliente = await this.model.findOne({ correo });
      if (!cliente) {
        res.status(404).json({ message: "Cliente no encontrado" });
        return;
      }
      res.json(cliente);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * Crear cliente con validación mínima
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { nombre, correo, telefono, contraseña } = req.body;

      if (!nombre || !correo || !telefono || !contraseña) {
        res.status(400).json({ error: "Faltan campos obligatorios" });
        return;
      }

      const existe = await this.model.findOne({ correo });
      if (existe) {
        res.status(409).json({ error: "El correo ya está registrado" });
        return;
      }

      const nuevoCliente = await this.model.create(req.body);
      res.status(201).json(nuevoCliente);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const clienteController = new ClienteController();
