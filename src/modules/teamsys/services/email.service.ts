// src/modules/teamsys/services/email.service.ts
import axios from "axios";
import "dotenv/config";

export class EmailService {
  private apiKey: string | null;
  private from: string;

  constructor() {
    this.apiKey = process.env.BREVO_API_KEY ?? null;
    this.from = process.env.EMAIL_FROM ?? "TeamSys <no-reply@example.com>";

    if (!this.apiKey) {
      console.warn("⚠️ BREVO_API_KEY no configurada. Modo dev (no se enviará a Brevo).");
    } else {
      console.log("📨 EmailService inicializado con Brevo");
    }
  }

  /**
   * Envía el magic link por correo.
   * Si no hay API key o hay error al enviar,
   * NO rompe el endpoint: solo hace fallback por consola.
   */
  async sendMagicLink(email: string, magicLink: string): Promise<void> {
    const html = this.getEmailTemplate(magicLink);

    // Modo DEV: sin API key, solo loguea
    if (!this.apiKey) {
      console.log("\n📧 DEV Fallback - Magic Link (sin Brevo)");
      console.log("Para:", email);
      console.log("Link:", magicLink);
      console.log("-----------------------------------\n");
      return;
    }

    try {
      await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: {
            email: this.extractEmailFromFrom(this.from),
            name: this.extractNameFromFrom(this.from),
          },
          to: [{ email }],
          subject: "🔗 Tu enlace mágico para TeamSys",
          htmlContent: html,
        },
        {
          headers: {
            "api-key": this.apiKey,
            "Content-Type": "application/json",
            accept: "application/json",
          },
        }
      );

      console.log("✅ Magic link enviado con Brevo a", email);
    } catch (err: any) {
      console.error("❌ Error enviando con Brevo:", err?.response?.data ?? err?.message ?? err);

      // Fallback: NO lanzamos error para no devolver 500
      console.log("\n📧 Fallback - Magic Link (error Brevo)");
      console.log("Para:", email);
      console.log("Link:", magicLink);
      console.log("-----------------------------------\n");
      return;
    }
  }

  // "Nombre <correo@x.com>" -> "correo@x.com"
  private extractEmailFromFrom(from: string): string {
    const match = from.match(/<(.+?)>/);
    return match ? match[1] : from;
  }

  // "Nombre <correo@x.com>" -> "Nombre"
  private extractNameFromFrom(from: string): string {
    const match = from.match(/^(.*?)</);
    return match ? match[1].trim() : from;
    }

  // Usa aquí tu template de correo para el enlace mágico
  private getEmailTemplate(magicLink: string): string {
    return `
      <html>
        <body>
          <p>Hola,</p>
          <p>Haz clic para iniciar sesión en TeamSys:</p>
          <p><a href="${magicLink}">Iniciar sesión</a></p>
          <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
          <p>${magicLink}</p>
          <br />
          <p>Si no solicitaste este correo, puedes ignorarlo.</p>
        </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();
