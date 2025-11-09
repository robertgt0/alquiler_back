import { Request, Response } from "express";
import FixerModel from "../models/Fixer";
import { sendWhatsApp } from "../services/notificacion.service";

export const notificarSaldoBajo = async (req: Request, res: Response) => {
  try {
    const { usuario, saldo } = req.body;

    const fixer = await FixerModel.findOne({ usuario });
    if (!fixer) {
      return res.status(404).json({ success: false, message: "Fixer no encontrado" });
    }

    const mensaje = `⚠️ Hola ${fixer.nombre}, tu cuenta ha sido restringida porque tu saldo de Bs. ${saldo} es inferior al límite permitido por la plataforma.`;

    await sendWhatsApp(fixer.telefono, mensaje);

    return res.json({
      success: true,
      message: "Notificación de WhatsApp enviada correctamente.",
    });
  } catch (error) {
    console.error("Error al enviar notificación:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno al enviar notificación de WhatsApp.",
    });
  }
};
