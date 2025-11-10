import { NextFunction, Request, Response } from "express";
import { TwoFactorService } from "../services/twofactor.service";
import { JWTPayload } from "../types/auth.types";
import teamsysService from "../services/teamsys.service";

export class TwoFactorController {
  constructor(
    private twoFactorService: TwoFactorService,
  ) { }

  /**
   * POST /api/2fa/setup
   * Genera el secreto y QR code para configurar 2FA
   */
  setupTwoFactor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.authuser as JWTPayload;
      const user = await teamsysService.getById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      const setup = await this.twoFactorService.generateTwoFactorSecret(user);

      res.status(200).json({
        success: true,
        message: 'Two-factor authentication setup initiated',
        data: {
          secret: setup.secret,
          qrCode: setup.qrCode,
          backupCodes: setup.backupCodes,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/2fa/verify
   * Verifica el token y habilita 2FA
   */
  verifyAndEnable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // if (!req.body.token || !req.body.secret) {
      //   throw new Error('token and secret are required');
      // }

      const { token, secret } = req.body;

      await this.twoFactorService.enableTwoFactor(secret, token);

      // Guardar el secreto en la base de datos
      await teamsysService.updateTwoFactorSecret(
        req.authuser!.userId,
        secret,
        true
      );

      res.status(200).json({
        success: true,
        message: 'Two-factor authentication enabled successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/2fa/disable
   * Deshabilita 2FA
   */
  disableTwoFactor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.body;

      const { email, userId } = req.authuser as JWTPayload;
      const user = await teamsysService.getById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      await this.twoFactorService.disableTwoFactor(user, token);
      await teamsysService.disableTwoFactor(user._id.toString());

      res.status(200).json({
        success: true,
        message: 'Two-factor authentication disabled successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/2fa/verify-login
   * Verifica el token 2FA durante el login
   */
  verifyLoginToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token, userId } = req.body;
      const user = await teamsysService.getById(userId);

      if (!user || !user.twoFactorSecret) {
        throw new Error('User not found or 2FA not configured');
      }

      this.twoFactorService.verifyToken(user.twoFactorSecret, token);

      res.status(200).json({
        success: true,
        message: 'Token verified successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/2fa/status
   * Obtiene el estado de 2FA del usuario
   */
  getTwoFactorStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, userId } = req.authuser as JWTPayload;
      const user = await teamsysService.getById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      res.status(200).json({
        success: true,
        data: {
          enabled: user.twoFactorEnabled,
        },
      });
    } catch (error) {
      next(error);
    }
  };
  
}

export const twofactorController = new TwoFactorController(new TwoFactorService());