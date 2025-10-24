import { Request, Response } from 'express';
import teamsysService from '../services/teamsys.service';
import { ApiResponse} from '../types/index';
import Usuario, { UserDocument } from '../models/teamsys';
import { handleError } from '../errors/errorHandler';

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
    const data = await teamsysService.create(req.body);
    const response: ApiResponse<UserDocument | null> = {
      success: true,
      data,
      message: 'Registro creado exitosamente'
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

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: usuario,
    });
  } catch (error) {
    handleError(error, res);
  }
};