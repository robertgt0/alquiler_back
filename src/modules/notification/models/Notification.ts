// src/modules/notification/models/Notification.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IMessageData {
  id?: string;
  type: 'email' | 'sms' | 'push';
  subject?: string;
  content: string;
  template?: string;
  variables?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDestination {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  deviceToken?: string;
  preferences?: {
    channels?: ('email'|'sms'|'push')[];
    language?: string;
    timezone?: string;
  };
}

export interface INotificationPackage extends Document {
  id?: string;
  source: 'system' | 'user';
  message: IMessageData;
  destinations: IDestination[];
  priority?: 'low'|'medium'|'high';
  status: 'draft'|'pending'|'sent'|'failed';
  createdAt: Date;
  scheduledFor?: Date | null;
}

const MessageSchema = new Schema<IMessageData>({
  type: { type: String, required: true },
  subject: String,
  content: { type: String, required: true },
  template: String,
  variables: { type: Schema.Types.Mixed },
  createdAt: Date,
  updatedAt: Date
}, { _id: false });

const DestinationSchema = new Schema<IDestination>({
  id: String,
  name: String,
  email: String,
  phone: String,
  deviceToken: String,
  preferences: { type: Schema.Types.Mixed }
}, { _id: false });

const NotificationSchema = new Schema<INotificationPackage>({
  id: String,
  source: { type: String, enum: ['system','user'], default: 'user' },
  message: { type: MessageSchema, required: true },
  destinations: { type: [DestinationSchema], required: true },
  priority: { type: String, enum: ['low','medium','high'], default: 'medium' },
  status: { type: String, enum: ['draft','pending','sent','failed'], default: 'pending' },
  createdAt: { type: Date, default: () => new Date() },
  scheduledFor: Date
});

export const NotificationModel = mongoose.models.Notification || mongoose.model<INotificationPackage>('Notification', NotificationSchema);
