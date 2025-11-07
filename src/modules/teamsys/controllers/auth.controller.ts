import { Request, Response } from "express";
import { ApiResponse } from "@/types";
import { TokenResponse } from "../types/token.types";
import { AuthService} from "../services/auth.service";
import { handleError } from "../errors/errorHandler";
import { JWTPayload } from "../types/auth.types";
import teamsysService from "../services/teamsys.service";
import { SessionService } from '../services/session.service';

export class AuthController {
  private authService: AuthService;
  private sessionService: SessionService;

  constructor() {
    this.authService = new AuthService();
    this.sessionService = new SessionService();
  }

  googleCallback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code } = req.body;

      if (! code || typeof code !== 'string') {
        res.status(400).json({
          message: 'Authorizaction code is required'
        })
          throw new Error('Authorizaction code is required');
      }

      const result  = await this.authService.loginWithGoogle(code as string)
      if (result.user.terminosYCondiciones && result.user.correo!=null){
        const usuario=await teamsysService.verificarCorreo(result.user.correo)
        if(usuario==null){
          res.status(500).json({
          success: false,
          data: result,
          message: 'error en la back',
      });
      return;
        }
        const userAgent = req.headers['user-agent'] || 'Unknown';
            const ip = (req.ip || req.socket.remoteAddress || 'Unknown').replace('::ffff:', '');
            const { accessToken, refreshToken } = this.authService.generateTokens(usuario);
            await this.sessionService.create(usuario._id.toString(), userAgent, ip, accessToken, refreshToken);
        

        res.status(200).json({
          success: false,
          data: {accessToken: accessToken,
                refreshToken: refreshToken,
                user:usuario},
          message: 'usuario ya registrado',
      });
      return;
      } 
      res.status(200).json({
          success: true,
          data: result,
          message: 'Usuario registrado correctamente!',
      });
      return;
    } catch (error) {
      handleError(error, res);
    }
  }

  getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    const { email, userId } = req.authuser as JWTPayload;

    const user = await teamsysService.getById(userId);

    res.status(200).json({
        success: true,
        data: user,
        message: 'Usuario recuperado correctamente!',
    });
  }
}

export const authController = new AuthController();
