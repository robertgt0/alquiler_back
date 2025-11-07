import { Response } from 'express';

export const handleError = (error: any, res: Response): void => {
  console.error('Error:', error);

  if (error.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: error.errors,
    });
    return;
  }

  if (error.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: 'ID inválido',
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: error.message || 'Error interno del servidor',
  });
};