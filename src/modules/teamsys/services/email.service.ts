import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';

// Cargar .env directamente aquí
dotenv.config({ path: path.join(process.cwd(), '.env') });

export class EmailService {
  private resend: Resend | null = null;

  constructor() {
    console.log('🔍 RESEND_API_KEY en servicio:', process.env.RESEND_API_KEY || 'NO ENCONTRADA');
    //const apiKey = process.env.RESEND_API_KEY || 're_i4uEcUvo_13cHEErvSFdNKnj51Jp4HSrL' ;
    //const apiKey = process.env.RESEND_API_KEY  ;

    
    //if (apiKey) {
    if (process.env.RESEND_API_KEY) {
    //if (apiKey && apiKey !== 'tu_api_key_aqui_directamente') {
      console.log('✅ Resend configurado con API key');
      //this.resend = new Resend(apiKey);
      this.resend = new Resend(process.env.RESEND_API_KEY);
    }else{
      console.warn('⚠️ RESEND_API_KEY no configurada. Usando modo desarrollo.');
    }
    
  }

  async sendMagicLink(email: string, magicLink: string): Promise<void> {
    // Verificar si tenemos API key configurada
    if (!this.resend) {
      console.log('\n📧 MODO DESARROLLO - Magic Link:');
      console.log('Para:', email);
      console.log('Link:', magicLink);
      console.log('-----------------------------------\n');
      return;
    }

    try {
      console.log('📤 Enviando email a:', email);
      
      const { data, error } = await this.resend.emails.send({
        from: 'TeamSys <onboarding@resend.dev>', // Email temporal de Resend
        to: email,
        subject: '🔗 Tu enlace mágico para TeamSys',
        html: this.getEmailTemplate(magicLink),
      });

      if (error) {
        console.error('❌ Error Resend:', error);
        throw error;
      }

      console.log('✅ Email enviado exitosamente via Resend!');
      console.log('📧 Email ID:', data?.id);
      
    } catch (error: any) {
      console.error('❌ Error enviando email:', error.message);
      
      // Fallback a modo desarrollo
      console.log('\n🔗 MODO DESARROLLO (fallback):');
      console.log('Para:', email);
      console.log('Link:', magicLink);
      console.log('-----------------------------------\n');
      
      throw new Error('No se pudo enviar el email: ' + error.message);
    }
  }

  private getEmailTemplate(magicLink: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { 
            font-family: 'Arial', sans-serif; 
            background-color: #f8f9fa; 
            margin: 0; 
            padding: 20px; 
            color: #333;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            padding: 40px; 
            border-radius: 15px; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          }
          .header { 
            text-align: center; 
            margin-bottom: 40px;
            border-bottom: 2px solid #007bff;
            padding-bottom: 20px;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 10px;
          }
          .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white; 
            padding: 16px 40px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-size: 18px; 
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,123,255,0.3);
            transition: all 0.3s ease;
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,123,255,0.4);
          }
          .link-box {
            background: #f8f9fa; 
            padding: 20px; 
            border-radius: 8px; 
            border-left: 4px solid #007bff;
            margin: 25px 0;
            word-break: break-all;
          }
          .footer { 
            margin-top: 40px; 
            padding-top: 20px; 
            border-top: 1px solid #e9ecef; 
            color: #6c757d; 
            font-size: 14px; 
            text-align: center;
          }
          .security-note {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🔐 TeamSys</div>
            <p style="color: #6c757d; margin: 0; font-size: 16px;">Inicio de sesión seguro</p>
          </div>
          
          <h2 style="color: #333; margin-bottom: 10px;">¡Hola!</h2>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            Has solicitado iniciar sesión con enlace mágico. Haz clic en el botón below para acceder 
            a tu cuenta de manera segura y rápida.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${magicLink}" class="button">🚀 Iniciar Sesión Automático</a>
          </div>
          
          <p style="margin-bottom: 15px; font-weight: bold;">Si el botón no funciona, copia y pega este enlace:</p>
          <div class="link-box">
            <code style="color: #007bff; font-size: 14px;">${magicLink}</code>
          </div>
          
          <div class="security-note">
            <strong>🔒 Seguridad:</strong> Este enlace es personal e intransferible. 
            Expirará en <strong>5 minutos</strong> y solo puede ser usado <strong>una vez</strong>.
          </div>
          
          <div class="footer">
            <p style="margin: 0 0 10px 0;">
              <strong>TeamSys</strong> - Plataforma de gestión de equipos
            </p>
            <p style="margin: 0; font-size: 12px;">
              Si no solicitaste este enlace, por favor ignora este mensaje.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();