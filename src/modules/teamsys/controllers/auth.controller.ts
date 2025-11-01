import { Request, Response } from "express";
import { ApiResponse } from "@/types";
import { TokenResponse } from "../types/token.types";
import { AuthService} from "../services/auth.service";
import { handleError } from "../errors/errorHandler";
import { JWTPayload } from "../types/auth.types";
import teamsysService from "../services/teamsys.service";

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

      const result  = await this.authService.loginWithGoogle(code as string)
      if (result==null){
        res.status(400).json({
          success: false,
          data: result,
          message: 'usuario ya registrado',
      });

      } 
      res.status(200).json({
          success: true,
          data: result,
          message: 'Usuario registrado correctamente!',
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    const { email, userId } = req.user as JWTPayload;

    const user = await teamsysService.getById(userId);

    res.status(200).json({
        success: true,
        data: user,
        message: 'Usuario recuperado correctamente!',
    });
  }
}

export const authController = new AuthController();
