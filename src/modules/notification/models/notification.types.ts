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
  // Identificadores
  _id?: string;                 // id de la BD (si aplica)
  transactionId?: string;       // id que genera tu servicio (uuid)

  // Contenido
  to?: string;                  // destinatario principal (legacy)
  destinations?: Destination[]; // lista de destinos (recomendado)
  subject: string;
  message: string;

  // Metadatos / routing
  channel?: NotificationChannel;
  type?: string;
  meta?: Record<string, any>;

  // Tracking / estado
  status?: 'draft' | 'pending' | 'sent' | 'failed';
  attempts?: number;
  sentAt?: Date | null;
  providerResponse?: any;       // respuesta cruda del proveedor (n8n / gmail)
  externalId?: string | null;   // id del proveedor (ej. gmailId)
  error?: string | null;
}
