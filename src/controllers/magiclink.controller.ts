import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { MagicLink } from "../models/magiclink.model";

export class MagicLinkController extends BaseController {
  constructor() {
    super(MagicLink);
  }

  // 📧 Buscar MagicLink por token
  async findByToken(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.params;
      const link = await this.model.findOne({ token });
      if (!link) {
        res.status(404).json({ message: "Enlace mágico no encontrado" });
        return;
      }
      res.json(link);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // ✅ Marcar un MagicLink como usado
  async markAsUsed(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.params;
      const link = await this.model.findOneAndUpdate(
        { token },
        { used: true },
        { new: true }
      );
      if (!link) {
        res.status(404).json({ message: "Token no encontrado" });
        return;
      }
      res.json({ message: "Token marcado como usado", link });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // 🧹 Eliminar MagicLinks expirados manualmente (opcional)
  async cleanExpired(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.model.deleteMany({ expiresAt: { $lt: new Date() } });
      res.json({ message: "Enlaces expirados eliminados", deleted: result.deletedCount });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const magicLinkController = new MagicLinkController();
