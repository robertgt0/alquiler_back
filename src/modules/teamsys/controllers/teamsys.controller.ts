import { Request, Response } from 'express';
import teamsysService from '../services/teamsys.service';
import { ApiResponse} from '../types/index';
import Usuario, { UserDocument } from '../models/teamsys';
import { SessionService } from '../services/session.service';
import { handleError } from '../errors/errorHandler';
import { AuthService } from '../services/auth.service';
import { JWTPayload } from '../types/auth.types';
import { validarPassword } from '../utils/validaciones';
import mongoose from 'mongoose';

const sessionService = new SessionService();
const authService = new AuthService();

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
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { correoElectronico, password } = req.body;

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
        usuaer: usuario,
      }
    });
  } catch (error) {
    handleError(error, res);
  }
};

// En controllers/teamsys.controller.ts - Agregar este export
export const cambiarContraseña = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId,email } = req.user as JWTPayload;
    console.log('🔍 UserId correcto:', userId);
    console.log('🔍 email:', email);
    console.log('🔍 Es ObjectId válido?:', mongoose.Types.ObjectId.isValid(userId));
    const { contraseñaActual, nuevaContraseña, confirmacionContraseña } = req.body;


    // Validaciones básicas
    if (!contraseñaActual || !nuevaContraseña || !confirmacionContraseña) {
      res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos',
      });
      return;
    }

    // Verificar coincidencia de contraseñas
    if (nuevaContraseña !== confirmacionContraseña) {
      res.status(400).json({
        success: false,
        message: 'La nueva contraseña y la confirmación no coinciden',
      });
      return;
    }

    // Validar requisitos de nueva contraseña (usando la función existente)
    if (!validarPassword(nuevaContraseña)) {
      res.status(400).json({
        success: false,
        message: 'La nueva contraseña no cumple con los requisitos mínimos: mínimo 8 caracteres, máximo 16, al menos una mayúscula, una minúscula y un número',
      });
      return;
    }

    // Cambiar contraseña
    const usuarioActualizado = await teamsysService.cambiarContraseña(
      userId, 
      contraseñaActual, 
      nuevaContraseña
    );

    // Cerrar todas las sesiones del usuario (usando el servicio existente)
    const sessionService = new SessionService();
    await sessionService.deleteAllSessionsExceptCurrentM(userId);

    res.json({
      success: true,
      message: 'Contraseña cambiada exitosamente. Todas las sesiones han sido cerradas por seguridad.',
      data: {
        usuario: {
          id: usuarioActualizado._id,
          correo: usuarioActualizado.correo,
          nombre: usuarioActualizado.nombre
        }
      }
    });
  } catch (error) {
    handleError(error, res);
  }
};