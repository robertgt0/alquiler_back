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
