import { Request, Response } from 'express';
import ubicacionService from '../services/ubicacion.service';
import { ApiResponse } from '../types';
import { handleError } from '../errors/errorHandler';
import { IUbicacion } from '../models/ubicacion.model';

export const getAllUbicaciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await ubicacionService.getAll();
    
    const datosTransformados = data.map((ubicacion: IUbicacion) => ({
      _id: ubicacion._id,
      id: ubicacion.id,
      nombre: ubicacion.nombre,
      posicion: {
        lat: ubicacion.posicion[0],
        lng: ubicacion.posicion[1]
      }
    }));

    const response: ApiResponse<any> = {
      success: true,
      count: datosTransformados.length,
      data: datosTransformados,
    };
    res.json(response);
  } catch (error) {
    handleError(error, res);
  } 
}; 