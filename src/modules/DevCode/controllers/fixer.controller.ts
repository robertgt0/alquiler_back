import { Request, Response } from 'express';
import * as fixerService from '../services/fixer.service';

/**
 
Maneja la petición de obtener todos los fixers.*/
export const handleGetAllFixers = async (req: Request, res: Response) => {
  try {
    const todosLosFixers = await fixerService.getAllFixers();
    res.status(200).json(todosLosFixers);
  } catch (error: any) {
    console.error('Error al obtener fixers:', error.message);
    res.status(500).json({ success: false, message: 'Error interno del servidor al buscar fixers' });
  }
};