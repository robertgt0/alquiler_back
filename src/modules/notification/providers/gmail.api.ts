import { google } from "googleapis";

/**
 * Crea un cliente autenticado de Gmail usando OAuth2.
 */
export function getGmailClient() {
  const clientId = process.env.GMAIL_CLIENT_ID!;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET!;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN!;
  const redirectUri = "https://developers.google.com/oauthplayground";

  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  oAuth2Client.setCredentials({ refresh_token: refreshToken });

  return google.gmail({ version: "v1", auth: oAuth2Client });
}

/**
 * Envía un correo electrónico mediante la API de Gmail usando OAuth2.
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
  const gmail = getGmailClient();
  const from = process.env.NOTIFICATIONS_GMAIL_USER!;
  
  // Crear mensaje MIME
  const messageParts = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=utf-8",
    "",
    html || text || "",
  ];

  const message = messageParts.join("\n");
  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  // Enviar mensaje
  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    },
  });

  return {
    messageId: res.data.id,
    threadId: res.data.threadId,
    labelIds: res.data.labelIds,
  };
}
