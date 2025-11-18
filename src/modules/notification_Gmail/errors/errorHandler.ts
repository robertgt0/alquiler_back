// src/modules/notification_Gmail/errors/errorHandler.ts
import { Response, NextFunction } from "express";
import { AppError } from "./AppError";

/**
 * Middleware global de manejo de errores del módulo notification_Gmail.
 * Captura excepciones de tipo AppError y las traduce en respuestas JSON uniformes.
 */
export const errorHandler = (error: Error, _req: any, res: Response, _next: NextFunction): void => {
  console.error("❌ [ErrorHandler] Error capturado:", error);

  // 🧩 Errores definidos del dominio (AppError)
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      code: error.code,
      message: error.message,
      ...(error.details && { details: error.details }),
    });
    return;
  }

  // 🧱 Errores de validación (mongoose, etc.)
  if (error.name === "ValidationError") {
    res.status(400).json({
      success: false,
      code: "VALIDATION_ERROR",
      message: "Error de validación",
      details: error.message,
    });
    return;
  }

  if (error.name === "CastError") {
    res.status(400).json({
      success: false,
      code: "INVALID_ID",
      message: "ID inválido",
    });
    return;
  }

  // 🧩 Error de clave duplicada en Mongo
  if ((error as any).name === "MongoError" && (error as any).code === 11000) {
    res.status(409).json({
      success: false,
      code: "DUPLICATE_KEY",
      message: "Error: registro duplicado en la base de datos",
      details: error.message,
    });
    return;
  }

  // ⚙️ Error inesperado (no manejado)
  console.error("⚠️ [ErrorHandler] Error no manejado:", error);
  res.status(500).json({
    success: false,
    code: "INTERNAL_SERVER_ERROR",
    message: "Error interno del servidor",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

/**
 * Helper: wrap async controllers to catch rejected Promises
 */
export const asyncHandler = (fn: Function) =>
  (req: any, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
