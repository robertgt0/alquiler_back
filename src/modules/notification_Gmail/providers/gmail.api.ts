// src/modules/notification_Gmail/providers/gmail.api.ts

import { google } from "googleapis";
import { NotificationProviderError } from "../errors/notification.errors";

/**
 * Crea y retorna un cliente autenticado de Gmail usando OAuth2.
 * Se reutiliza la instancia para evitar reconexiones innecesarias.
 */
let gmailClient: ReturnType<typeof google.gmail> | null = null;

export function getGmailClient() {
  try {
    const clientId = process.env.GMAIL_CLIENT_ID;
    const clientSecret = process.env.GMAIL_CLIENT_SECRET;
    const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
    const redirectUri =
      process.env.GMAIL_REDIRECT_URI || "https://developers.google.com/oauthplayground";

    // ✅ Validación de variables obligatorias
    if (!clientId || !clientSecret || !refreshToken) {
      throw new NotificationProviderError("GMAIL", {
        message: "Faltan credenciales OAuth2 en las variables de entorno.",
        missing: {
          GMAIL_CLIENT_ID: !!clientId,
          GMAIL_CLIENT_SECRET: !!clientSecret,
          GMAIL_REFRESH_TOKEN: !!refreshToken,
        },
      });
    }

    if (!gmailClient) {
      const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
      oAuth2Client.setCredentials({ refresh_token: refreshToken });
      gmailClient = google.gmail({ version: "v1", auth: oAuth2Client });
      console.log("📨 Cliente Gmail OAuth2 inicializado correctamente");
    }

    return gmailClient;
  } catch (error: any) {
    console.error("❌ Error al inicializar cliente Gmail:", error);
    throw new NotificationProviderError("GMAIL", error);
  }
}

/**
 * Envía un correo electrónico mediante la API de Gmail usando OAuth2.
 * Incluye codificación UTF-8 y soporte completo para emojis ✅
 */
export async function sendEmailOAuth2({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  try {
    const gmail = getGmailClient();
    const from = process.env.NOTIFICATIONS_GMAIL_USER;

    if (!from) {
      throw new NotificationProviderError("GMAIL", {
        message: "Variable NOTIFICATIONS_GMAIL_USER no definida en .env",
      });
    }

    // ✅ Validación básica
    if (!to || !subject || (!text && !html)) {
      throw new NotificationProviderError("GMAIL", {
        message: "Datos de envío incompletos: to, subject, text/html requeridos",
        details: { to, subject },
      });
    }

    // 🧩 Corrección: Construcción MIME con codificación UTF-8 + emojis seguros
    const encodedSubject = `=?utf-8?B?${Buffer.from(subject, "utf-8").toString("base64")}?=`;
    const bodyContent = html
      ? Buffer.from(html, "utf-8").toString("base64")
      : Buffer.from(text || "", "utf-8").toString("base64");

    const messageParts = [
      `From: ${from}`,
      `To: ${to}`,
      `Subject: ${encodedSubject}`,
      "MIME-Version: 1.0",
      html
        ? "Content-Type: text/html; charset=UTF-8"
        : "Content-Type: text/plain; charset=UTF-8",
      "Content-Transfer-Encoding: base64",
      "",
      bodyContent,
    ];

    const rawMessage = messageParts.join("\n");

    const encodedMessage = Buffer.from(rawMessage)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // 🚀 Enviar el correo
    const res = await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedMessage },
    });

    console.log(`✅ Correo enviado correctamente a ${to} (Message ID: ${res.data.id})`);

    return {
      success: true,
      messageId: res.data.id,
      threadId: res.data.threadId,
      labelIds: res.data.labelIds,
    };
  } catch (error: any) {
    console.error("❌ Error al enviar correo por Gmail API:", error);

    // ⚠️ Manejo detallado de errores comunes
    if (error.code === 401 || error.code === 403) {
      throw new NotificationProviderError("GMAIL", {
        message: "Error de autenticación con Gmail API (token inválido o expirado).",
        details: error,
      });
    }

    if (error.code === 429) {
      throw new NotificationProviderError("GMAIL", {
        message: "Límite de envío de Gmail API excedido.",
        details: error,
      });
    }

    // Error genérico
    throw new NotificationProviderError("GMAIL", error);
  }
}
