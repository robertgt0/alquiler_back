import nodemailer, { Transporter } from 'nodemailer';
import { google } from 'googleapis';
import dotenv from "dotenv"

dotenv.config();

const OAuth2 = google.auth.OAuth2;

const {
  NOTIFICATIONS_GMAIL_MODE,
  NOTIFICATIONS_GMAIL_USER,
  NOTIFICATIONS_GMAIL_APP_PASS,
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REFRESH_TOKEN,
} = process.env;

let transporter: Transporter | null = null;

/**
 * Crea (o devuelve) un transporter nodemailer configurado
 */
async function createTransporter(): Promise<Transporter> {
  if (transporter) return transporter;

  if (NOTIFICATIONS_GMAIL_MODE === 'oauth2') {
    if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN || !NOTIFICATIONS_GMAIL_USER) {
      throw new Error('Faltan variables para OAuth2: GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, NOTIFICATIONS_GMAIL_USER');
    }

    const oauth2Client = new OAuth2(
      GMAIL_CLIENT_ID,
      GMAIL_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });

    const accessTokenResponse = await oauth2Client.getAccessToken();
    const accessToken =
      accessTokenResponse && typeof accessTokenResponse === 'object'
        ? (accessTokenResponse as any).token
        : accessTokenResponse;

    if (!accessToken) {
      throw new Error('No se pudo obtener access token desde refresh token (verifica GMAIL_REFRESH_TOKEN)');
    }

    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: NOTIFICATIONS_GMAIL_USER,
        clientId: GMAIL_CLIENT_ID,
        clientSecret: GMAIL_CLIENT_SECRET,
        refreshToken: GMAIL_REFRESH_TOKEN,
        accessToken,
      },
    });
  } else {
    // Fallback SMTP con App Password
    if (!NOTIFICATIONS_GMAIL_USER || !NOTIFICATIONS_GMAIL_APP_PASS) {
      throw new Error('Faltan variables para SMTP: NOTIFICATIONS_GMAIL_USER, NOTIFICATIONS_GMAIL_APP_PASS');
    }

    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: NOTIFICATIONS_GMAIL_USER,
        pass: NOTIFICATIONS_GMAIL_APP_PASS,
      },
    });
  }

  try {
    await transporter.verify();
    return transporter;
  } catch (err) {
    transporter = null;
    throw err;
  }
}

/**
 * Envía correo con las opciones dadas
 */
export async function sendMail(opts: {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: any[];
}) {
  const { to, subject, text, html, from, cc, bcc, attachments } = opts;
  const transport = await createTransporter();

  const mailOptions = {
    from: from || NOTIFICATIONS_GMAIL_USER,
    to,
    subject,
    text,
    html,
    cc,
    bcc,
    attachments,
  };

  try {
    const info = await transport.sendMail(mailOptions);
    return { success: true, info };
  } catch (error) {
    transporter = null;
    throw error;
  }
}

/**
 * Verifica si el transporte está funcional
 */
export async function verifyTransport() {
  try {
    const t = await createTransporter();
    await t.verify();
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || String(err) };
  }
}
