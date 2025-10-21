import { Request, Response, NextFunction } from 'express';
import { CrearUsuarioDto } from '../types';
import { limpiarInput, validarPassword, validarCorreoElectronico, validarImagen } from '../utils/validaciones';

export const validateData = (req: Request, res: Response, next: NextFunction): void => {
  const { nombre, correoElectronico, telefono, password, terminosYCondiciones }: CrearUsuarioDto = limpiarInput(req.body)as CrearUsuarioDto;

  if (!nombre || typeof nombre !== 'string') {
    res.status(400).json({ success: false, message: 'El campo nombre es requerido y debe ser texto' });
    return;
  }

  if (nombre.length < 2) {
  res.status(400).json({ success: false, message: 'El nombre debe tener al menos 2 caracteres' });
  return;
  }

  if (nombre.length > 15) {
  res.status(400).json({ success: false, message: 'El nombre no puede tener más de 10 caracteres' });
  return;
  }

  if (!correoElectronico || typeof correoElectronico !== 'string') {
    res.status(400).json({ success: false, message: 'El correo electrónico es requerido y debe ser texto' });
    return;
  }

  const correoValido = await validarCorreoElectronico(correoElectronico);
  if (!correoValido) {
    res.status(400).json({ success: false, message: 'El correo electrónico no tiene un formato válido' });
    return;
  }

  if (!telefono || typeof telefono !== 'string') {
    res.status(400).json({ success: false, message: 'El teléfono es requerido y debe ser texto' });
    return;g
  }

  if (!/^\d{8}$/.test(telefono)) {
    res.status(400).json({ success: false, message: 'El teléfono debe tener exactamente 8 dígitos' });
    return;
  }

  if (!password || typeof password !== 'string') {
    res.status(400).json({ success: false, message: 'La contraseña es requerida y debe ser texto' });
    return;
  }

  if (!validarPassword(password)) {
    res.status(400).json({ success: false, message: 'La contraseña no cumple con los requisitos de seguridad' });
    return;

    
  if (!validarImagen(req.file.buffer)) {
      return res.status(400).json({ message: 'Solo se permiten imágenes PNG o JPG menores a 1MB' });
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
