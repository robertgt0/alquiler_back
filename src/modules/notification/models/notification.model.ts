// src/modules/notifications/models/notification.model.ts

import mongoose, { Schema, Document, Model } from "mongoose";
import { NotificationDoc } from "./notification.types";

export interface INotificationDocument extends NotificationDoc, Document {}

const DestinationSchema = new Schema(
  {
    email: { type: String, required: function () { return this.channel === "email"; } },
    phone: { type: String },
    name: { type: String },
  },
  { _id: false }
);

const NotificationSchema = new Schema<INotificationDocument>(
  {
    transactionId: { type: String, required: true, unique: true, index: true },

    // Payload
    message: { type: String, required: true, maxlength: 500 },
    subject: { type: String, required: true },
    destinations: { type: [DestinationSchema], required: true, validate: [(v: any) => v.length > 0, "At least one destination required"] },
    type: { type: String, default: "generic" },
    channel: { type: String, enum: ["email", "sms", "push"], default: "email" },
    metadata: { type: Schema.Types.Mixed, default: {} },

    // Tracing
    status: { type: String, enum: ["pending", "sent", "failed"], default: "pending", index: true },
    attempts: { type: Number, default: 0 },
    lastError: { type: String, default: null },
    providerResponse: { type: Schema.Types.Mixed, default: null },

    // timestamps
    sentAt: { type: Date, default: null },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Indexes to support queries by date, recipient and status
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ "destinations.email": 1 });
NotificationSchema.index({ status: 1, createdAt: -1 });

export const NotificationModel: Model<INotificationDocument> =
  mongoose.models.Notification || mongoose.model<INotificationDocument>("Notification", NotificationSchema);
