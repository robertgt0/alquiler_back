export interface Recipient {
  email: string;
  name: string;
}

export interface NotifyData {
  message: string;
}

export interface NotifyPayload {
  type: string;
  recipient: Recipient;
  data: NotifyData;
}
