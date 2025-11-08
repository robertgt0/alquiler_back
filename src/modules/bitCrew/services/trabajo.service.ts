import { Types } from 'mongoose';
import TrabajoModel from '../models/trabajo';
import { ITrabajo } from '../types/index';

/**
 * Obtiene todos los trabajos asociados a un fixer_id específico.
 */
export const getTrabajosByFixerId = async (fixerId: Types.ObjectId): Promise<ITrabajo[]> => {
  // 2. Si se encuentra, usar su '_id' para buscar en 'trabajo'
  return TrabajoModel.find({ fixer_id: fixerId });
};