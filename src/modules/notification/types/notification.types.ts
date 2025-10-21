<<<<<<< HEAD
export interface Destination {
  email: string;
  name?: string;
}

export interface NotificationData {
  subject: string;
  message: string;
  html?: string;
  to?: string | string[];
  channel?: "email" | "webhook";
  destinations?: Destination[];
}
=======
// src/modules/notifications/types/notification.types.ts
export type NotificationChannel = 'email' | 'console' | 'webhook';

export interface NotificationData {
  to: string;             // email o identificador según canal
  subject: string;
  message: string;
  channel?: NotificationChannel;
  meta?: Record<string, any>; // opcional datos extra
}

>>>>>>> origin/dev/recode
