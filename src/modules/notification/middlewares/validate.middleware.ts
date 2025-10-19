import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors/CustomError';

// Middleware de ejemplo para validación
export const validateData = (req: Request, _res: Response, next: NextFunction): void => {
  const { nombre } = req.body;

  if (!nombre) {
    // Usar error centralizado
    return next(new ValidationError([{ field: 'nombre', message: 'El campo nombre es requerido' }]));
  }

  // Agrega más validaciones según necesites

  next();
};

// Puedes agregar más middlewares aquí
export const otroMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  // Lógica del middleware
  next();
};