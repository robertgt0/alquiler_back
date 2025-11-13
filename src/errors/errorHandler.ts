// src/errors/errorHandler.ts
import { Response } from 'express';

/**
 * Manejador de errores centralizado para los controladores.
 * Envía una respuesta JSON estandarizada.
 */
export const handleError = (error: any, res: Response) => {
  // Imprime el error en la consola del backend para debugging
  console.error('[ERROR HANDLER]:', error);

  // Define un código de estado (default 500)
  const statusCode = error.statusCode || 500;

  // Define un mensaje de error
  const message = error.message || 'Error interno del servidor';

  // Envía la respuesta
  res.status(statusCode).json({
    success: false,
    message: message,
  });
};