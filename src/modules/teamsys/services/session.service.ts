import mongoose from "mongoose";
import { ISession } from "../interfaces/session.interface";
import { Session } from "../models/session.model";
import { DeviceParser } from "../utils/deviceParser.util";
import User from "../models/teamsys";

export class SessionService {
	
	/**
	 * Obtener la session por token 
	 */
	async getSessionsByToken(token: string): Promise<ISession> {
		const session = await Session.findOne({
			token: token,
			isActive: true,
		});

		if (! session) {
			throw new Error('Session no encontrada');
		}

		return session;
	}

	/**
	 * Obtener todas las sesiones por usuario 
	 */
	async getSessionsByUserId(userId: string): Promise<ISession[]> {
		if ((!mongoose.Types.ObjectId.isValid(userId))) {
			throw new Error('ID de usuario invalido');
		}

		const sessions = await Session.find({
			userId: new mongoose.Types.ObjectId(userId),
			isActive: true,
		}).sort({ lastActivity: -1 }).lean();

		return sessions;
	}

	/**
	 * Crear una sesion
	 */
	async create(userId: string, userAgent: string, ip: string, accessToken: string, refreshToken: string): Promise<{ session: ISession; accessToken: string; refreshToken: string }> {
		if ((!mongoose.Types.ObjectId.isValid(userId))) {
			throw new Error('ID de usuario invalido');
		}

		const user = await User.findById(userId);

		if (!user) {
			throw new Error('Usuario no encontrado');
		}

		const deviceInfo = DeviceParser.createDeviceInfo(userAgent, ip);

		const refreshExpiresAt = 1;
		const expiresAt = new Date(Date.now() + refreshExpiresAt);

		const session = Session.create({
			userId: new mongoose.Types.ObjectId(userId),
			token: accessToken,
			refreshToken: refreshToken,
			deviceInfo,
			isActive: true,
			lastActivity: new Date(),
			expiresAt,
		});

		return {
			session: (await session).toObject(),
			accessToken,
			refreshToken,
		}
	}

	/**
	 * Eliminar una sesión 
	 */
	async deleteSession(sessionId: string, userId: string): Promise<void> {
		if ((!mongoose.Types.ObjectId.isValid(sessionId))) {
			throw new Error('ID de sesion invalido');
		}

		if ((!mongoose.Types.ObjectId.isValid(userId))) {
			throw new Error('ID de usuario invalido');
		}

		const session = await Session.findOne({
			_id: new mongoose.Types.ObjectId(sessionId),
			userId: new mongoose.Types.ObjectId(userId),
		});

		if (!session) {
			throw new Error('Sesion no encontrada');
		}

		session.isActive = false;
		await session.save();
	}

	/**
 	* Eliminar todas las sesiones de un usuario 
 	*/
	async deleteAllSessionsExceptCurrent(userId: string, currentSessionId: string): Promise<number> {
		if ((!mongoose.Types.ObjectId.isValid(userId))) {
			throw new Error('ID de usuario invalido');
		}

		if ((!mongoose.Types.ObjectId.isValid(currentSessionId))) {
			throw new Error('ID de sesion invalido');
		}

		await Session.find({
			userId: new mongoose.Types.ObjectId(userId),
			_id: { $ne: new mongoose.Types.ObjectId(currentSessionId) },
			isActive: true,
		},)

		const result = await Session.updateMany({
			userId: new mongoose.Types.ObjectId(userId),
			_id: { $ne: new mongoose.Types.ObjectId(currentSessionId) },
			isActive: true,
		},
		{
			$set: { isActive: false }
		});

		return result.modifiedCount
	}
}