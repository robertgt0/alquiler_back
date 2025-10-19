import { Request, Response, NextFunction } from 'express';
import { CustomError } from './CustomError';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('[notification] error:', err?.message || err);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        status: err.statusCode,
        details: err.details,
      },
    });
  }

  if (err?.name === 'ValidationError' || err?.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err?.message || 'Error de validación',
        status: 400,
        details: err?.errors || null,
      },
    });
  }

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: err?.message || 'Error interno del servidor',
      status: 500,
    },
  });
}