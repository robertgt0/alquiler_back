// src/modules/notifications/types/notification.types.ts

/**
 * Destino individual dentro de una notificación.
 */
export interface Destination {
  email: string;
  name?: string;
}

/**
 * Canales posibles para envío de notificaciones.
 */
export type NotificationChannel = 'email' | 'sms' | 'push' | 'n8n' | 'desconocido';

/**
 * Estructura principal para una notificación.
 * Incluye campos opcionales para tracking y respuesta del proveedor (Gmail / n8n).
 */
export interface NotificationData {
  _id?: string;
  transactionId?: string;
  to?: string;
  destinations?: Destination[];
  subject: string;
  message: string;
  channel?: NotificationChannel;
  type?: string;
  meta?: Record<string, any>;
  status?: 'draft' | 'pending' | 'sent' | 'failed';
  attempts?: number;
  sentAt?: Date | string | null;
  providerResponse?: any;
  externalId?: string | null;
  error?: string | null;
}
