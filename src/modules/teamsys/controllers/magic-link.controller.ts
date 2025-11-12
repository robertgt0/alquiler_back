import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { handleError } from "../errors/errorHandler";
import { SessionService } from "../services/session.service";
import mongoose from "mongoose";
import teamsysService from "../services/teamsys.service";
import { emailService } from '../services/email.service';

export class MagicLinkController {
  private authService: AuthService;
  private sessionService: SessionService;

  constructor() {
    this.authService = new AuthService();
    this.sessionService = new SessionService();
  }

  /**
   * Solicitar magic link
   * POST /api/magic-link/request
   */
  requestMagicLink = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          success: false,
          message: 'El correo electrónico es requerido'
        });
        return;
      }

      const token = await this.authService.generateMagicLinkToken(email);
      // URL del frontend donde el usuario hará clic
    //const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const frontendUrl=process.env.URL_FRONTEND??'http://localhost:3000';
    const magicLink = `${frontendUrl}/auth/magic-link?token=${token}`;
    //const magicLink = `http://localhost:3000/api/teamsys/magic-link/verify?token=${token}`;
    //const magicLink = `http://localhost:3000/auth/magic-link?token=${token}`;-----------------------

      // Aquí deberías integrar con tu servicio de email
      // Por ahora solo devolvemos el token para pruebas
      //const magicLink = `http://localhost:3000/api/teamsys/magic-link/verify?token=${token}`;
      await emailService.sendMagicLink(email, magicLink);
      console.log('🔗 Magic Link generado:', magicLink);
      //await emailService.sendMagicLink(email, magicLink);

      res.status(200).json({
        success: true,
        message: 'Se ha enviado el enlace mágico a tu correo',
        // Solo para desarrollo - quitar en producción
        magicLink: process.env.NODE_ENV === 'production' ? undefined : magicLink
      });

    } catch (error: any) {
      if (error.message === 'Correo no registrado') {
        console.log("correo no esta en la BD");
        res.status(404).json({
          success: false,
          message: 'Correo no registrado en el sistema'
        });
        return;
      }
      handleError(error, res);
    }
  }

  /**
   * Verificar magic link y hacer login
   * ........................................................GET /api/magic-link/verify?token=...
   * POST /api/teamsys/magic-link/verify
   */
   verifyMagicLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const{token}=req.body;
    /*
    let token: string | undefined;
    
    // Buscar token en query parameters (GET) o body (POST)
    if (req.method === 'GET') {
      token = req.query.token as string;
    } else if (req.method === 'POST') {
      token = req.body.token;
    }
    */
    //if (!token || typeof token !== 'string') {
    if(!token){
      res.status(400).json({
        success: false,
        message: 'Token es requerido'
      });
      return;
    }

    const payload = await this.authService.verifyMagicLinkToken(token);

    // Obtener usuario completo usando teamsysService
    const user = await teamsysService.getUserByEmail(payload.email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Crear sesión (como en login normal)
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ip = (req.ip || req.socket.remoteAddress || 'Unknown').replace('::ffff:', '');
    const tokens = this.authService.generateTokens(user);
    
    await this.sessionService.create(
      (user._id as mongoose.Types.ObjectId).toString(),
      userAgent,
      ip,
      tokens.accessToken,
      tokens.refreshToken
    );

    res.status(200).json({
      success: true,
      message: 'Login exitoso con magic link',
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: user._id,
          nombre: user.nombre,
          correo: user.correo,
          fotoPerfil: user.fotoPerfil
        }
      }
    });

  } catch (error) {
    handleError(error, res);
  }
}
}

export const magicLinkController = new MagicLinkController();