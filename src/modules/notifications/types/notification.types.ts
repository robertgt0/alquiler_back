export interface NotificationData {
  to: string;
  subject: string;
  message: string;
  channel?: 'email' | 'console';
}

