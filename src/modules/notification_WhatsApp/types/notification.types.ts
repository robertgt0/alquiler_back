/**
 * 📦 Tipo base de destinatario
 */
export interface Destination {
  email: string;
  name?: string;
}

/**
 * 🚀 Canales posibles de envío
 */
export type NotificationChannel = "gmail-api" | "sms" | "push" | "n8n" | "webhook" | "desconocido";

/**
 * 📨 Estructura general de notificación
 */
export interface NotificationData {
  _id?: string;
  transactionId?: string;
  to?: string | string[];
  destinations?: Destination[];
  subject: string;
  message: string;
  html?: string;
  channel?: NotificationChannel;
  type?: string;
  meta?: Record<string, any>;
  status?: "draft" | "pending" | "sent" | "failed";
  attempts?: number;
  sentAt?: Date | string | null;
  providerResponse?: any;
  externalId?: string | null;
  error?: string | null;
}