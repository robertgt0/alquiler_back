import { google } from "googleapis";

const CLIENT_ID = process.env.GMAIL_CLIENT_ID!;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET!;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN!;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

export async function checkIfDeliveryFailed(toEmail: string): Promise<boolean> {
  const res = await gmail.users.messages.list({
    userId: "me",
    q: `from:mailer-daemon OR from:"Mail Delivery Subsystem" newer_than:1d`,
    maxResults: 10,
  });

  const messages = res.data.messages || [];

  for (const msg of messages) {
    const message = await gmail.users.messages.get({ userId: "me", id: msg.id! });
    const body = Buffer.from(message.data.snippet || "", "utf8").toString();

    if (body.includes(toEmail) && body.match(/(undeliverable|failed|address not found|does not exist)/i)) {
      return true; // rebote detectado
    }
  }
  return false;
}
