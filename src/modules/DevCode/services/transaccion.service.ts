import { Types } from 'mongoose';
import TransaccionModel from '../models/transaccion';
import { ITransaccion } from '../types';

/**
 * Obtiene todas las transacciones de un fixer por su ID,
 * ordenadas por fecha descendente.
 */
export const getTransaccionesByFixerId = async (fixerId: Types.ObjectId): Promise<ITransaccion[]> => {
  try {
    // Busca todas las transacciones que coincidan con el fixer_id
    // y las ordena por 'fecha' de más nueva a más antigua.
    const transacciones = await TransaccionModel.find({ fixer_id: fixerId })
                                                .sort({ fecha: -1 }); 
    return transacciones;
  } catch (error: any) {
    console.error('Error en servicio - getTransaccionesByFixerId:', error.message);
    throw new Error('Error al buscar transacciones por ID de fixer');
  }
};