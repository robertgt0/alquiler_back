import { Request, Response } from "express";
import { ApiResponse } from "@/types";
import { TokenResponse } from "../types/token.types";
import { AuthService } from "../services/auth.service";
import { handleError } from "../errors/errorHandler";

export class AuthController {
  private authService: AuthService;

  constructor() {
    console.log('🔄 Inicializando AuthController...');
    this.authService = new AuthService();
    console.log('✅ AuthController inicializado');
  }

  googleCallback = async (req: Request, res: Response): Promise<void> => {
    console.log('🔄 ========= INICIANDO GOOGLE CALLBACK =========');
    
    try {
      const { code, authType = 'register' } = req.body;

      console.log('📥 Request body recibido:', { 
        authType,
        code: code ? `${code.substring(0, 30)}...` : 'NO CODE'
      });

      if (!code || typeof code !== 'string') {
        console.error('❌ Código no válido recibido');
        res.status(400).json({
          success: false,
          message: 'Authorization code is required and must be a string'
        });
        return;
      }

      console.log('🚀 Llamando a authService.loginWithGoogle...');
      const result = await this.authService.loginWithGoogle(code, authType);
      
      console.log('📊 Resultado de loginWithGoogle:', {
        result: result ? 'SUCCESS_WITH_DATA' : 'USER_ALREADY_EXISTS',
        authType
      });

      if (result === null) {
        if (authType === 'register') {
          console.log('ℹ️ Enviando respuesta: usuario ya registrado');
          res.status(400).json({
            success: false,
            message: 'usuario ya registrado',
            data: null
          });
        } else {
          console.log('❌ Enviando respuesta: usuario no encontrado');
          res.status(400).json({
            success: false,
            message: 'usuario no encontrado',
            data: null
          });
        }
        return;
      }

      console.log('✅ Enviando respuesta exitosa al cliente');
      res.status(200).json({
        success: true,
        data: result,
        message: 'Usuario autenticado correctamente!',
      });

    } catch (error: any) {
      console.error('❌ ========= ERROR EN GOOGLE CALLBACK =========');
      console.error('📝 Error message:', error.message);
      
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    } finally {
      console.log('✅ ========= GOOGLE CALLBACK FINALIZADO =========');
    }
  }

  getCurrentUser() {
    // Implementación existente
  }
}

export const authController = new AuthController();