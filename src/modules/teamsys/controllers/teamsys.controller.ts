import { Request, Response } from 'express';
import teamsysService from '../services/teamsys.service';
import { ApiResponse, UsuarioDocument } from '../types/index';
import { handleError } from '../errors/errorHandler';

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

/*crear nuevo usr 
  que verifique si un usr con el mismo 
*/
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