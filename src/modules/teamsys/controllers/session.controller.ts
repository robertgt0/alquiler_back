import { Request, Response } from "express";
import { SessionService } from "../services/session.service";
import { JWTPayload } from "../types/auth.types";

export class SessionController {
	private sessionService: SessionService;

	constructor() {
		this.sessionService = new SessionService();
	}

	/**
	 * Obtener todas las sesiones de un usuario
	 * GET /api/sessions/user/:userId
	 * @param req 
	 * @param res 
	 */
	getSessionsByUserId = async (req: Request, res: Response): Promise<void> => {
		try {
			const { userId } = req.params;

			const sessions = await this.sessionService.getSessionsByUserId(userId);

			res.status(200).json({
				success: true,
				message: 'Sessiones obtenidas exitosamente',
				data: {
					count: sessions.length,
					sessions: sessions,
				}
			});
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

			res.status(400).json({
				success: false,
				message: 'Error al obtener sessiones',
				error: errorMessage
			});
		}
	};

	/**
	 * Eliminar una sesion especifica
	 * DELETE /api/sessions/:sessionId
	 */
	deleteSession = async (req: Request, res: Response): Promise<void> => {
		try {
			const { sessionId } = req.params;
			const { userId } = req.user as JWTPayload;

			await this.sessionService.deleteSession(sessionId, userId);

			res.status(200).json({
				success: true,
				message: 'Sesión eliminada exitosamente'
			});
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

			res.status(400).json({
				success: false,
				message: 'Error al eliminar session',
				error: errorMessage
			});
		}
	}
	/**
	  * Eliminar todas las sesiones excepto la actual
	* DELETE /api/sessions/user/:userId/all-except-current
	*/
	deleteAllSessionsExceptCurrent = async (req: Request, res: Response): Promise<void> => {
		try {
			const { email, userId } = req.user as JWTPayload;

			const authHeader = req.headers.authorization as string;
			if (!authHeader || !authHeader.startsWith('Bearer ')) {
				res.status(401).json({
					success: false,
					'message': 'Unauthorized'
				});
				return;
			}

			const token = authHeader.split(' ')[1];

			const session = await this.sessionService.getSessionsByToken(token);
			await this.sessionService.deleteAllSessionsExceptCurrent(userId, session._id.toString());

			res.status(200).json({
				success: true,
				message: 'Sesiónes eliminadas exitosamente',
			});
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

			res.status(400).json({
				success: false,
				message: 'Error al eliminar sessiones',
				error: errorMessage
			});
		}
	};

}

export const sessionController = new SessionController();