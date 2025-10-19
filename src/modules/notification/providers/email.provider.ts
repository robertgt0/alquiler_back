import nodemailer from "nodemailer";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { ProviderError } from "../errors/CustomError";

const logFile = path.join(process.cwd(), "logs", "email.log");

/**
 * Escribe una entrada en el log local (logs/email.log)
 */
function writeLog(entry: any) {
  try {
    fs.mkdirSync(path.dirname(logFile), { recursive: true });
    fs.appendFileSync(
      logFile,
      JSON.stringify({ ts: new Date().toISOString(), ...entry }) + "\n"
    );
  } catch (err) {
    console.error("Error al escribir log:", err);
  }
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  fromName?: string;
}
/**
 * Envía un correo electrónico usando Gmail API (OAuth2)
 * y registra el resultado en un archivo de logs.
 */
export async function sendEmail(options: EmailOptions) {
  const { to, subject, html, text, from, fromName } = options;

  try {
    // ✅ Crear cliente OAuth2
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      "https://developers.google.com/oauthplayground" // Redirect URI estándar
    );

    oAuth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    });

    // ✅ Obtener access token válido
    const accessToken = await oAuth2Client.getAccessToken();

    if (!accessToken?.token) {
      throw new ProviderError("No se pudo obtener el access token de Google OAuth2.");
    }

    // ✅ Configurar el transporter con OAuth2
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.NOTIFICATIONS_GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    // ✅ Enviar el correo
    const info = await transporter.sendMail({
      from: fromName
        ? `"${fromName}" <${from || process.env.NOTIFICATIONS_GMAIL_USER}>`
        : from || process.env.NOTIFICATIONS_GMAIL_USER,
      to,
      subject,
      html,
      text,
    });

    // ✅ Registrar en log
    writeLog({
      level: "INFO",
      action: "send",
      to,
      accepted: info.accepted,
      rejected: info.rejected,
      messageId: info.messageId,
    });

    return {
      success: true,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    };
  } catch (error: any) {
    writeLog({
      level: "ERROR",
      action: "send",
      to: options.to,
      error: error.message,
    });

    // Propagar error centralizado para que el servicio lo maneje (reintentos/catch)
    throw new ProviderError(error.message || 'Error sending email', { original: error });
  }
}
