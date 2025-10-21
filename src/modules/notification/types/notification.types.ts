// src/modules/notifications/types/notification.types.ts

/**
 * Canales posibles para envío de notificaciones.
 * Incluye 'n8n' y 'desconocido' para evitar errores de asignación.
 */
export type NotificationChannel = 'email' | 'sms' | 'push' | 'n8n' | 'desconocido';

/**
 * Estructura de datos para una notificación individual.
 * Compatible con los controladores, servicios y workflows actuales.
 */
export interface NotificationData {
  _id?: string;                   // ID interno en base de datos (Mongoose)
  to: string;                     // Email o destinatario según canal
  subject: string;                // Asunto del mensaje
  message: string;                // Contenido del mensaje
  channel?: NotificationChannel;  // Canal utilizado (email, sms, n8n, etc.)
  type?: string;                  // Tipo de notificación (alerta, recordatorio, etc.)
  meta?: Record<string, any>;     // Datos adicionales o contexto

  // Campos de seguimiento y control
  status?: 'draft' | 'pending' | 'sent' | 'failed';  // Estado actual
  externalId?: string | null;                        // ID externo (por ejemplo, Gmail ID)
  error?: string | null;                             // Mensaje de error si falla
}
