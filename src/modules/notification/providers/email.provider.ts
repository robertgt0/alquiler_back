// src/modules/notifications/providers/email.provider.ts
import nodemailer from "nodemailer";
import { google } from "googleapis";

export type GmailMode = "smtp" | "oauth2";

export interface GmailProviderConfig {
  mode: GmailMode;
  user: string;
  pass?: string; // app password (smtp)
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
}

export class GmailProvider {
  private transporter: nodemailer.Transporter;
  private user: string;

  constructor(private cfg: GmailProviderConfig) {
    this.user = cfg.user;

    if (cfg.mode === "oauth2") {
      if (!cfg.clientId || !cfg.clientSecret || !cfg.refreshToken) {
        throw new Error("Missing OAuth2 credentials for GmailProvider");
      }
      const oAuth2Client = new google.auth.OAuth2(cfg.clientId, cfg.clientSecret, "https://developers.google.com/oauthplayground");
      oAuth2Client.setCredentials({ refresh_token: cfg.refreshToken });

      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: this.user,
          clientId: cfg.clientId,
          clientSecret: cfg.clientSecret,
          refreshToken: cfg.refreshToken,
        },
      });
    } else {
      // SMTP with App Password
      if (!cfg.pass) throw new Error("Missing SMTP app password for GmailProvider");
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: this.user,
          pass: cfg.pass,
        },
      });
    }
  }

  async send(to: string, subject: string, body: string, fromName?: string) {
    const mailOptions = {
      from: fromName ? `${fromName} <${this.user}>` : this.user,
      to,
      subject,
      text: body,
      html: body,
    };

    const info = await this.transporter.sendMail(mailOptions);
    // info can be large; return it for persistence
    return info;
  }
}
