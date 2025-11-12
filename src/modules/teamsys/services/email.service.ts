// src/modules/teamsys/services/email.service.ts
import nodemailer from 'nodemailer';
import 'dotenv/config';

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    const user = (process.env.GMAIL_USER ?? '').trim();
    const pass = (process.env.GMAIL_APP_PASSWORD ?? '').trim();

    if (!user || !pass) {
      console.warn('⚠️ GMAIL_USER o GMAIL_APP_PASSWORD no configurados. Modo dev (no se enviará a Gmail).');
      return; // ← deja transporter en null
    }

    // TLS directo (465). Alternativa: STARTTLS (587) cambiando port/secure.
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
    });
  }

  async sendMagicLink(email: string, magicLink: string): Promise<void> {
    const from = process.env.EMAIL_FROM ?? `TeamSys <${process.env.GMAIL_USER}>`;
    const html = this.getEmailTemplate(magicLink);

    if (!this.transporter) {
      // Modo dev: no rompas el endpoint si quieres
      console.log('\n📧 DEV Fallback - Magic Link');
      console.log('Para:', email);
      console.log('Link:', magicLink);
      console.log('-----------------------------------\n');
      return;
    }

    try {
      const info = await this.transporter.sendMail({
        from,
        to: email,
        subject: '🔗 Tu enlace mágico para TeamSys',
        html,
      });
      console.log('✅ Email enviado (Gmail) -> MessageID:', info.messageId);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('❌ Error enviando con Gmail SMTP:', msg);

      // Fallback dev visible en consola
      console.log('\n📧 DEV Fallback - Magic Link');
      console.log('Para:', email);
      console.log('Link:', magicLink);
      console.log('-----------------------------------\n');

      // Si no quieres romper el endpoint, no hagas throw:
      // return;

      throw new Error('No se pudo enviar el email: ' + msg);
    }
  }

  private getEmailTemplate(magicLink: string): string {
    return `
      <html>
        <body>
          <p>Hola,</p>
          <p>Haz clic para iniciar sesión:</p>
          <p><a href="${magicLink}">Iniciar sesión</a></p>
          <p>Si no funciona, copia y pega: ${magicLink}</p>
        </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();
