import mongoose from "mongoose";
import { ISession } from "../interfaces/session.interface";
import { Session } from "../models/session.model";
import { DeviceParser } from "../utils/deviceParser.util";
import User from "../models/teamsys";

export class SessionService {

	/**
	 * Obtener la session por token 
	 */
	async getSessionByToken(token: string): Promise<ISession | null> {
		const session = await Session.findOne({
			token: token,
			isActive: true,
			expiresAt: { $gt: new Date() }
		});

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
	 * Obtener la session por ip 
	 */
	async getSessionByIp(ip: string, userId: string): Promise<ISession | null> {
		const session = await Session.findOne({
			"deviceInfo.ip": ip,
			userId: new mongoose.Types.ObjectId(userId),
			isActive: true,
			expiresAt: { $gt: new Date() }
		});

		return session;
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

		const refreshExpiresAt = 60 * 60 * 1000; // 1 hour
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
	* @param userId - ID del usuario
	* @param currentSessionId - ID de la sesión a excluir (opcional). Si no se proporciona, se eliminan TODAS las sesiones
	* */
 	
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

		// const result = await Session.updateMany({
		// 	userId: new mongoose.Types.ObjectId(userId),
		// 	_id: { $ne: new mongoose.Types.ObjectId(currentSessionId) },
		// 	isActive: true,
		// },
		// {
		// 	$set: { isActive: false }
		// });

		await Session.deleteMany({
			userId: new mongoose.Types.ObjectId(userId),
			_id: { $ne: new mongoose.Types.ObjectId(currentSessionId) },
		});

		return 1;
	}
	/**
    * Eliminar sesiones de usuario Miguel H3 "cambiar contraseña"
    * @param userId - ID del usuario
    * @param currentSessionId - ID de la sesión a excluir (opcional). Si no se proporciona, se eliminan TODAS las sesiones
    */
	async deleteAllSessionsExceptCurrentM(userId: string, currentSessionId?: string): Promise<number> {
		if ((!mongoose.Types.ObjectId.isValid(userId))) {
			throw new Error('ID de usuario invalido');
		}

		// Construir filtro dinámicamente
		const filter: any = {
			userId: new mongoose.Types.ObjectId(userId),
			isActive: true,
		};

		// Solo excluir sesión actual si se proporciona y es válida
		if (currentSessionId && mongoose.Types.ObjectId.isValid(currentSessionId)) {
			filter._id = { $ne: new mongoose.Types.ObjectId(currentSessionId) };
		}
		// Si currentSessionId es null, undefined, o string vacío, se eliminan TODAS

		const result = await Session.updateMany(
			filter,
			{
				$set: { isActive: false }
			}
		);

		return result.modifiedCount;
	}
}