import { Request, Response, NextFunction } from "express";
import Usuario from "../models/teamsys";

const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutos

/**
 * Middleware que expira la sesión si hubo 15 minutos de inactividad.
 * Requiere que el usuario esté autenticado y que exista en la base de datos.
 */
export async function sessionTimeout(req: Request, res: Response, next: NextFunction) {
  try {
    //  Verifica que haya usuario en la request
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "No autenticado" });
    }

    //  Busca el usuario en la base de datos
    const user = await Usuario.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    //  Verifica última actividad
    const now = Date.now();
    const lastActivity = user.lastActivity ? user.lastActivity.getTime() : 0;

    if (now - lastActivity > INACTIVITY_LIMIT) {
      return res.status(440).json({
        success: false,
        message: "Sesión expirada por inactividad",
      });
    }

    //  Actualiza la última actividad del usuario
    user.lastActivity = new Date();
    await user.save();

    next();
  } catch (error) {
    console.error("Error en sessionTimeout middleware:", error);
    res.status(500).json({
      success: false,
      message: "Error interno en la validación de sesión",
    });
  }
}