import { Request, Response } from 'express';
import teamsysService from '../services/teamsys.service';
import { ApiResponse} from '../types/index';
import Usuario, { UserDocument } from '../models/teamsys';
import { SessionService } from '../services/session.service';
import { handleError } from '../errors/errorHandler';
import { AuthService } from '../services/auth.service';
import { TwoFactorService } from '../services/twofactor.service';

const sessionService = new SessionService();
const authService = new AuthService();
const twoFactorService = new TwoFactorService();

/*obtener todos los registros de usuario */
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await teamsysService.getAll();
    const response: ApiResponse<UserDocument[]> = {
      success: true,
      count: data.length,
      data,
    };
    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
};

export const existsByEmail = async (req: Request, res: Response) => {
  try {
    const email = (req.query.email ?? '').toString().trim();

    if (!email) {
      return res.status(400).json({ error: 'El parámetro "email" es requerido' });
    }

    const exists = await teamsysService.verificarCorreo(email);

    return res.json({ exists });
  } catch (err) {
    console.error('Error en existsByEmail:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/*obtener usr por id */
export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await teamsysService.getById(req.params.id);
    if (!data) {
      res.status(404).json({
        success: false,
        message: 'Registro no encontrado',
      });
      return;
    }
    const response: ApiResponse<UserDocument> = {
      success: true,
      data,
    };
    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
};

/*crear nuevo usr 
  que verifique si un usr con el mismo 
*/
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await teamsysService.create(req.body);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ip = (req.ip || req.socket.remoteAddress || 'Unknown').replace('::ffff:', '');
    const { accessToken, refreshToken } = authService.generateTokens(user);
    const result = await sessionService.create(user.id, userAgent, ip, accessToken, refreshToken);

    const response: ApiResponse<{accessToken: string, refreshToken: string, user: UserDocument}> = {
      success: true,
      message: 'Registro creado exitosamente',
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: user,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    handleError(error, res);
  }
};

/*actualizar un usr existente */
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await teamsysService.update(req.params.id, req.body);
    if (!data) {
      res.status(404).json({
        success: false,
        message: 'Registro no encontrado',
      });
      return;
    }
    const response: ApiResponse<UserDocument> = {
      success: true,
      data,
      message: 'Registro actualizado exitosamente'
    };
    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
};

/*eliminaar un usr por id */
export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await teamsysService.delete(req.params.id);
    if (!data) {
      res.status(404).json({
        success: false,
        message: 'Registro no encontrado',
      });
      return;
    }
    res.json({
      success: true,
      message: 'Registro eliminado correctamente',
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * tarea: endpoint de autenticacion
 * Registrar un nuevo usuario (versión autenticación)
 * Este endpoint se usa para crear usuarios con validación previa
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;

    const nuevoUsuario = await teamsysService.create(data);
    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      data: nuevoUsuario,
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * Iniciar sesión de un usuario existente
 * Verifica correo y contraseña
 * Si 2FA esta habilitado: requiere el token
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { correoElectronico, password, twoFactorToken } = req.body;

    if (!correoElectronico || !password) {
      res.status(400).json({
        success: false,
        message: 'El correo electrónico y la contraseña son requeridos',
      });
      return;
    }

    const usuario = await teamsysService.autenticarUsuario(correoElectronico, password);

    if (!usuario) {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
      return;
    }

    if (usuario.twoFactorEnabled) {
      if (! twoFactorToken) {
        res.json({
          success: true,
          message: 'Two-factor authentication required',
          data: {
            requiresTwoFactor: true,
          }
        });

        return;
      }

      if (! usuario.twoFactorSecret) {
        throw new Error("Two-factor secret not found");
      }

      twoFactorService.verifyToken(usuario.twoFactorSecret, twoFactorToken);
    }

    // registarr en sessions
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ip = (req.ip || req.socket.remoteAddress || 'Unknown').replace('::ffff:', '');
    const { accessToken, refreshToken } = authService.generateTokens(usuario);
    await sessionService.create(usuario.id, userAgent, ip, accessToken, refreshToken);

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        accessToken,
        refreshToken,
        user: usuario,
      }
    });
  } catch (error) {
    handleError(error, res);
  }
};