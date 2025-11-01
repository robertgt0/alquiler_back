import mongoose, { Model, Schema } from "mongoose";
import { ISession } from "../interfaces/session.interface";


const sessionSchema = new Schema<ISession>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'User id is required'],
			index: true,
		},
		token: {
			type: String,
			required: [true, 'Token is required'],
			unique: true,
			index: true,
		},
		refreshToken: {
			type: String,
			sparse: true,
			index: true,
		},
		deviceInfo: {
			userAgent: {
				type: String,
				required: [true, 'user agent is required'],
			},
			ip: {
				type: String,
				required: [true, 'IP is required'],
			},
			browser: {
				type: String,
			},
			os: {
				type: String,
			},
			device: {
				type: String,
			},
		},
		location: {
			country: {
				type: String,
			},
			city: {
				type: String,
			},
		},
		isActive: {
			type: Boolean,
			default: true,
			index: true,
		},
		lastActivity: {
			type: Date,
			default: Date.now,
			index: true,
		},
		expiresAt: {
			type: Date,
			required: [true, 'Expires at is required'],
			index: true,
		}
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

sessionSchema.index({ userId: 1, isActive: 1 });
sessionSchema.index({ userId: 1, createdAt: -1 });
sessionSchema.index({ token: 1, isActive: 1 });

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0});

export const Session: Model<ISession> = mongoose.model<ISession>('Session', sessionSchema);