import { Request, Response } from "express";
import { ApiResponse } from "@/types";
import { TokenResponse } from "../types/token.types";
import { AuthService, getUserService } from "../services/auth.service";
import { handleError } from "../errors/errorHandler";
import UsuarioService from '../../teamsys/services/teamsys.services';
import bcrypt from 'bcryptjs';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  googleCallback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code } = req.body;

      if (! code || typeof code !== 'string') {
        res.status(400).json({
          message: 'Authorizaction code is required'
        })
        // throw new Error('Authorizaction code is required');
      }

      const result  = await this.authService.loginWithGoogle(code as string);

      res.status(200).json({
          success: true,
          data: result,
          message: 'Usuario registrado correctamente!',
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  getCurrentUser() {
    
  }
  /** Registrar un nuevo usuario */
async register(req: Request, res: Response) {
  try {
    const data = req.body;

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);

    const nuevoUsuario = await UsuarioService.create(data);
    return res.status(201).json({ success: true, usuario: nuevoUsuario });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

/** Iniciar sesión */
async login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Correo y contraseña son requeridos' });
    }

    const usuario = await UsuarioService.getByEmail(email);
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const coincide = await bcrypt.compare(password, usuario.password);
    if (!coincide) {
      return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    }

    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      usuario,
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
}

/** Verificar si una cuenta Google ya está registrada */
async verificarGoogle(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Correo es requerido' });

    const usuario = await UsuarioService.getByEmail(email);
    if (usuario) {
      return res.status(200).json({ success: true, message: 'Cuenta registrada', usuario });
    } else {
      return res.status(404).json({ success: false, message: 'Cuenta no registrada' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error verificando cuenta Google' });
  }
}
}

export const authController = new AuthController();
