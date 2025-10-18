import { google } from "googleapis";

const CLIENT_ID = process.env.GMAIL_CLIENT_ID!;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET!;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN!;

// ✅ Helper para obtener cliente Gmail autenticado SIEMPRE con refresh token
export function getGmailClient() {
  const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  return google.gmail({ version: "v1", auth: oAuth2Client });
}

// ✅ Tipo para un mensaje detectado como rebote
export interface BounceMessage {
  bouncedTo: string | null;
  reason: string | null;
  messageId: string | null;
  gmailMessageId: string;
}

/**
 * Busca mensajes recientes de tipo "Delivery Status Notification"
 * y devuelve info sobre rebotes detectados.
 */
export async function fetchRecentBounceNotifications(
  sinceMinutes = 60
): Promise<BounceMessage[]> {
  const gmail = getGmailClient(); // ✅ usa cliente fresco cada vez

  const q = `from:(mailer-daemon OR "Mail Delivery Subsystem" OR postmaster) newer_than:${Math.ceil(
    sinceMinutes / 60
  )}h`;

  const listRes = await gmail.users.messages.list({ userId: "me", q, maxResults: 50 });
  const msgs = listRes.data.messages || [];
  const results: BounceMessage[] = [];

  for (const m of msgs) {
    try {
      const full = await gmail.users.messages.get({
        userId: "me",
        id: m.id!,
        format: "full",
      });
      const gmailMessageId = m.id!;
      const snippet = full.data.snippet || "";
      let body = snippet;

      // Decodificar body
      const payload = full.data.payload;
      if (payload?.parts) {
        for (const p of payload.parts) {
          if (p?.body?.data) {
            body += "\n" + Buffer.from(p.body.data, "base64").toString("utf8");
          }
          if (p?.parts) {
            for (const sp of p.parts) {
              if (sp?.body?.data) {
                body += "\n" + Buffer.from(sp.body.data, "base64").toString("utf8");
              }
            }
          }
        }
      }

      // Buscar destinatario rebotado
      const emailMatch = body.match(
        /(?:Final-Recipient: rfc822;|Delivery to the following recipient failed.*?:|\s+<)([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i
      );
      const bouncedTo = emailMatch ? emailMatch[1] : null;

      // Buscar razón del rebote
      const reasonMatch = body.match(
        /(does not exist|user unknown|address not found|undeliverable|delivery failed|recipient not found|550|5\.1\.[12])/i
      );
      const reason = reasonMatch ? reasonMatch[0] : null;

      // Message-ID original
      const messageIdMatch =
        body.match(/Message-ID:\s*<?([^>\s]+)>?/i) ||
        body.match(/Message-ID:\s*"?([^"\s]+)"?/i);
      const originalMessageId = messageIdMatch ? messageIdMatch[1] : null;

      results.push({
        bouncedTo,
        reason,
        messageId: originalMessageId,
        gmailMessageId,
      });
    } catch (err) {
      console.error("fetchRecentBounceNotifications: error leyendo mensaje", m.id, err);
    }
  }

  return results;
}

// ✅ Tipo para el resultado general de la búsqueda de rebotes
export interface BounceResult {
  found: boolean;
  bouncedTo?: string | null;
  reason?: string | null;
  messageId?: string | null;
  gmailMessageId?: string;
}

/**
 * Verifica si hay un rebote que mencione el correo `toEmail` en las últimas X horas.
 */
export async function findBounceForRecipient(
  toEmail: string,
  lookbackHours = 24
): Promise<BounceResult> {
  const results: BounceMessage[] = await fetchRecentBounceNotifications(lookbackHours * 60);
  const lower = (toEmail || "").toLowerCase();

  for (const r of results) {
    if (r.bouncedTo && r.bouncedTo.toLowerCase().includes(lower)) {
      return {
        found: true,
        bouncedTo: r.bouncedTo,
        reason: r.reason,
        messageId: r.messageId,
        gmailMessageId: r.gmailMessageId,
      };
    }
  }

  return { found: false };
}
