import { Request, Response, NextFunction } from 'express';

// Middleware de ejemplo para validación
export const validateData = (req: Request, res: Response, next: NextFunction): void => {
  const { nombre } = req.body;

  if (!nombre) {
    res.status(400).json({
      success: false,
      message: 'El campo nombre es requerido',
    });
    return;
  }

  // Agrega más validaciones según necesites

  next();
};

// Puedes agregar más middlewares aquí
export const otroMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Lógica del middleware
  next();
};