// src/modules/notifications/types/notification.types.ts
export type NotificationChannel = 'email' | 'console' | 'webhook';

export interface NotificationData {
  to: string;             // email o identificador según canal
  subject: string;
  message: string;
  channel?: NotificationChannel;
  meta?: Record<string, any>; // opcional datos extra
}

