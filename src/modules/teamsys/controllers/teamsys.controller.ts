import { Request, Response } from 'express';
import teamsysService from '../services/teamsys.service';
import { ApiResponse, UsuarioDocument } from '../types/index';
import { handleError } from '../errors/errorHandler';
import { signAccessToken } from '../utils/jwt'; //  añadido para crear tokens JWT

/*obtener todos los registros de usuario */
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await teamsysService.getAll();
    const response: ApiResponse<UsuarioDocument[]> = {
      success: true,
      count: data.length,
      data,
    };
    res.json(response);
  } catch (error) {
    handleError(error, res);
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
    const response: ApiResponse<UsuarioDocument> = {
      success: true,
      data,
    };
    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
};

/*crear nuevo usr */
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await teamsysService.create(req.body);
    const response: ApiResponse<UsuarioDocument> = {
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
    const response: ApiResponse<UsuarioDocument> = {
      success: true,
      data,
      message: 'Registro actualizado exitosamente'
    };
    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
};

/*eliminar un usr por id */
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
 * Inicio de sesión con correo electrónico y contraseña
 * Verifica credenciales y redirige al Home si la cuenta está validada.
 */
export const loginWithEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { correoElectronico, password } = req.body;

    // Buscar usuario por correo
    const user = await teamsysService.getByEmail(correoElectronico);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
      return;
    }

    // Verificar contraseña (aquí se puede usar bcrypt en el futuro)
    if (user.password !== password) {
      res.status(401).json({
        success: false,
        message: "Contraseña incorrecta",
      });
      return;
    }

    // Verificar si la cuenta está validada (puedes agregar un campo booleano en el modelo)
    // if (!user.validado) {
    //   res.status(403).json({
    //     success: false,
    //     message: "Cuenta no validada. Revisa tu correo electrónico.",
    //   });
    //   return;
    // }

    // Generar token JWT
    const token = signAccessToken({
      userId: user._id,
      email: user.correoElectronico,
    });

    // Responder con token y redirección al Home
    res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      token,
      redirectTo: "/home", 
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error al iniciar sesión",
    });
  }
};