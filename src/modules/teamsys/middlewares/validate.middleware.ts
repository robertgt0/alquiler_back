import { Request, Response, NextFunction } from 'express';
import { CrearUsuarioDto } from '../types';

export const validateData = (req: Request, res: Response, next: NextFunction): void => {
  const { nombre, correoElectronico, telefono, password, terminosYCondiciones }: CrearUsuarioDto = req.body;

  const nombreValido = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,50}$/;
  const telefonoValido = /^[1-9][0-9]{7}$/;
  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!nombre || typeof nombre !== 'string' || !nombreValido.test(nombre)) {
    res.status(400).json({ success: false, message: 'El campo nombre es requerido y debe ser texto y debe tener entre 2 y 50 letras' });
    return;
  }

  if (!correoElectronico || typeof correoElectronico !== 'string'|| !correoValido.test(correoElectronico)) {
    res.status(400).json({ success: false, message: 'El correo electrónico es requerido y corrige si metiste un correo chafa' });
    return;
  }

  if (!telefono || typeof telefono !== 'string'||!telefonoValido.test(telefono)) {
    res.status(400).json({ success: false, message: 'El teléfono es requerido y debe tener 8 digitos y no comenzar con 0' });
    return;
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