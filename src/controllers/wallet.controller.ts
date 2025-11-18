import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { Wallet } from "../models/wallet.model";

export class WalletController extends BaseController {
  constructor() {
    super(Wallet);
  }

  // Obtener wallet por fixer_id
  async findByFixer(req: Request, res: Response): Promise<void> {
    try {
      const { fixerId } = req.params;
      const wallet = await this.model.findOne({ fixer_id: fixerId });
      if (!wallet) {
        res.status(404).json({ error: "Wallet no encontrada" });
        return;
      }
      res.json(wallet);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // Actualizar saldo (por ejemplo, cuando se realiza un pago)
  async actualizarSaldo(req: Request, res: Response): Promise<void> {
    try {
      const { fixerId } = req.params;
      const { monto } = req.body;

      if (typeof monto !== "number") {
        res.status(400).json({ error: "Monto inválido" });
        return;
      }

      const wallet = await this.model.findOneAndUpdate(
        { fixer_id: fixerId },
        {
          $inc: { saldo: monto },
          $set: { fecha_actualizacion: new Date() },
        },
        { new: true }
      );

      if (!wallet) {
        res.status(404).json({ error: "Wallet no encontrada" });
        return;
      }

      res.json(wallet);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // Bloquear o activar una wallet
  async cambiarEstado(req: Request, res: Response): Promise<void> {
    try {
      const { fixerId } = req.params;
      const { estado } = req.body;

      if (!["activa", "bloqueada"].includes(estado)) {
        res.status(400).json({ error: "Estado inválido" });
        return;
      }

      const wallet = await this.model.findOneAndUpdate(
        { fixer_id: fixerId },
        { estado, fecha_actualizacion: new Date() },
        { new: true }
      );

      if (!wallet) {
        res.status(404).json({ error: "Wallet no encontrada" });
        return;
      }

      res.json(wallet);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const walletController = new WalletController();
