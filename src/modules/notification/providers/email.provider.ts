// src/modules/notifications/providers/email.provider.ts
import nodemailer from "nodemailer";
import { google } from "googleapis";

export type GmailMode = "smtp" | "oauth2";

export interface GmailProviderConfig {
  mode?: GmailMode;
  user?: string;
  pass?: string; // app password (smtp)
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
}

export class GmailProvider {
  private transporter?: nodemailer.Transporter;
  private mode: GmailMode;
  private user: string;

  constructor(cfg?: GmailProviderConfig) {
    this.mode = cfg?.mode || (process.env.NOTIFICATIONS_GMAIL_MODE as GmailMode) || "smtp";
    this.user = cfg?.user || process.env.NOTIFICATIONS_GMAIL_USER || "";
    // No crear transporter aquí, lo hacemos en ensureTransporter()
  }

  private ensureTransporter(): nodemailer.Transporter {
    if (this.transporter) return this.transporter;

    if (this.mode === "oauth2") {
      const clientId = process.env.GMAIL_CLIENT_ID;
      const clientSecret = process.env.GMAIL_CLIENT_SECRET;
      const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
      if (!clientId || !clientSecret || !refreshToken || !this.user) {
        throw new Error("Missing OAuth2 credentials for GmailProvider");
      }
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: this.user,
          clientId,
          clientSecret,
          refreshToken,
        },
      });
    } else {
      const pass = process.env.NOTIFICATIONS_GMAIL_APP_PASS;
      if (!this.user || !pass) throw new Error("Missing SMTP app password for GmailProvider");
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: this.user,
          pass,
        },
      });
    }

    return this.transporter!;
  }

  async send(to: string, subject: string, body: string, fromName?: string) {
    const transporter = this.ensureTransporter();
    const mailOptions = {
      from: fromName ? `${fromName} <${this.user}>` : this.user,
      to,
      subject,
      text: body,
      html: body,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  }
}
