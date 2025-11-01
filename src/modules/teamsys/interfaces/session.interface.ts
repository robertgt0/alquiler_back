import mongoose from "mongoose";

export interface IDeviceInfo {
	userAgent: string;
	ip: string;
	browser?: string;
	os?: string;
	device?: string;
}

export interface ILocation {
	country?: string;
	city?: string;
}

export interface ISession {
	_id: mongoose.Types.ObjectId;
	userId: mongoose.Types.ObjectId;
	token: string;
	refreshToken?: string;
	deviceInfo: IDeviceInfo;
	location?: ILocation;
	isActive: boolean;
	lastActivity: Date;
	expiresAt: Date;
	createdAt: Date;
	updatedAt: Date;
}