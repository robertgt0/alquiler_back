import { Request, Response } from 'express';
import teamsysService from '../services/teamsys.service';
import { ApiResponse } from '../types';
import { handleError } from '../errors/errorHandler';

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await teamsysService.getAll();
    const response: ApiResponse<any> = {
      success: true,
      count: data.length,
      data: data,
    };
    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
};

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
    const response: ApiResponse<any> = {
      success: true,
      data: data,
    };
    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await teamsysService.create(req.body);
    const response: ApiResponse<any> = {
      success: true,
      data: data,
      message: 'Registro creado exitosamente'
    };
    res.status(201).json(response);
  } catch (error) {
    handleError(error, res);
  }
};

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
    const response: ApiResponse<any> = {
      success: true,
      data: data,
      message: 'Registro actualizado exitosamente'
    };
    res.json(response);
  } catch (error) {
    handleError(error, res);
  }
};

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