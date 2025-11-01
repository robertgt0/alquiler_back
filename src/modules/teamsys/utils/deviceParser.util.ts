import { IDeviceInfo } from '../interfaces/session.interface';

export class DeviceParser {
  /**
   * Parsea el User-Agent para extraer información del dispositivo
   */
  static parseUserAgent(userAgent: string): Partial<IDeviceInfo> {
    const info: Partial<IDeviceInfo> = {
      userAgent,
    };

    // Detectar navegador
    if (userAgent.includes('Chrome')) info.browser = 'Chrome';
    else if (userAgent.includes('Firefox')) info.browser = 'Firefox';
    else if (userAgent.includes('Safari')) info.browser = 'Safari';
    else if (userAgent.includes('Edge')) info.browser = 'Edge';
    else info.browser = 'Unknown';

    // Detectar sistema operativo
    if (userAgent.includes('Windows')) info.os = 'Windows';
    else if (userAgent.includes('Mac OS')) info.os = 'MacOS';
    else if (userAgent.includes('Linux')) info.os = 'Linux';
    else if (userAgent.includes('Android')) info.os = 'Android';
    else if (userAgent.includes('iOS')) info.os = 'iOS';
    else info.os = 'Unknown';

    // Detectar tipo de dispositivo
    if (userAgent.includes('Mobile')) info.device = 'Mobile';
    else if (userAgent.includes('Tablet')) info.device = 'Tablet';
    else info.device = 'Desktop';

    return info;
  }

  /**
   * Crea el objeto deviceInfo completo
   */
  static createDeviceInfo(userAgent: string, ip: string): IDeviceInfo {
    const parsed = this.parseUserAgent(userAgent);
    
    return {
      userAgent,
      ip,
      browser: parsed.browser,
      os: parsed.os,
      device: parsed.device,
    };
  }
}