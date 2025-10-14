import { Request, Response, NextFunction } from 'express';
import { CrearUsuarioDto } from '../types';
import { limpiarInput } from '../utils/validaciones';

export const validateData = (req: Request, res: Response, next: NextFunction): void => {
  const { nombre, correoElectronico, telefono, password, terminosYCondiciones }: CrearUsuarioDto = limpiarInput(req.body)as CrearUsuarioDto;

  if (!nombre || typeof nombre !== 'string') {
    res.status(400).json({ success: false, message: 'El campo nombre es requerido y debe ser texto' });
    return;
  }

  if (!correoElectronico || typeof correoElectronico !== 'string') {
    res.status(400).json({ success: false, message: 'El correo electrónico es requerido y debe ser texto' });
    return;
  }

  if (!telefono || typeof telefono !== 'string') {
    res.status(400).json({ success: false, message: 'El teléfono es requerido y debe ser texto' });
    return;g
  }

  if (!password || typeof password !== 'string') {
    res.status(400).json({ success: false, message: 'La contraseña es requerida y debe ser texto' });
    return;
  }

  if (terminosYCondiciones !== true) {
    res.status(400).json({ success: false, message: 'Debes aceptar los términos y condiciones' });
    return;
  }

  next();
};


/*import { Request, Response, NextFunction } from 'express';

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
*/