import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { IUser } from '../interfaces/user.interface';
import { TwoFactorSetupResponse } from '../types/twofactor.types';
import { UserDocument } from '../models/teamsys';
export class TwoFactorService {
  private readonly APP_NAME = 'Servineo';
  private readonly TOTP_WINDOW = 2;

  /**
   * Genera un secreto para 2FA y el código QR
   */
  async generateTwoFactorSecret(user: IUser | UserDocument): Promise<TwoFactorSetupResponse> {
    if (user.twoFactorEnabled) {
      throw new Error('Two-factor authentication is already enabled');
    }

    const secret = speakeasy.generateSecret({
      name: `${this.APP_NAME} (${user.correo})`,
      length: 32,
    });

    const qrCodeUrl = await this.generateQRCode(secret.otpauth_url!);
    const backupCodes = this.generateBackupCodes();

    return {
      secret: secret.base32,
      qrCode: qrCodeUrl,
      backupCodes,
    };
  }

  /**
   * Verifica el token TOTP proporcionado por el usuario
   */
  verifyToken(secret: string, token: string): boolean {
    if (!token || token.length !== 6) {
      throw new Error('Invalid token format');
    }

    const isValid = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: this.TOTP_WINDOW,
    });


    if (!isValid) {
      throw new Error('Invalid two-factor authentication token');
    }

    return isValid;
  }

  /**
   * Habilita 2FA después de verificar el token inicial
   */
  async enableTwoFactor(secret: string, token: string): Promise<{ verified: boolean }> {
    this.verifyToken(secret, token);

    return { verified: true };
  }

  /**
   * Deshabilita 2FA con verificación
   */
  async disableTwoFactor(user: IUser | UserDocument, token: string): Promise<{ disabled: boolean }> {
    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      throw new Error('Two-factor authentication is not enabled');
    }

    this.verifyToken(user.twoFactorSecret, token);

    return { disabled: true };
  }

  /**
   * Genera código QR como data URL
   */
  private async generateQRCode(otpauthUrl: string): Promise<string> {
    try {
      return await QRCode.toDataURL(otpauthUrl);
    } catch (error) {
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Genera códigos de respaldo para recuperación
   */
  private generateBackupCodes(count: number = 8): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();

      codes.push(code);
    }

    return codes;
  }

  /**
   * Verifica un código de respaldo
   */
  verifyBackupCode(user: IUser, code: string): boolean {
    // Implementar lógica para verificar y marcar como usado
    // Este es un ejemplo simplificado
    return code.length === 8;
  }
}