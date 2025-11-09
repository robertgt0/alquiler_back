import { Types } from 'mongoose';
import BilleteraModel from '../models/wallet';
import { IBilletera } from '../types/wallet.types';

/**
 * Obtiene la billetera de un fixer por el ID del fixer.
 */
export const getBilleteraByFixerId = async (fixerId: Types.ObjectId): Promise<IBilletera | null> => {
  return BilleteraModel.findOne({ fixer_id: fixerId });
};


// ================================================================
// NUEVA FUNCIÓN: Chequear saldo y actualizar ESTADO DE BILLETERA
// ================================================================
/**
 * Verifica el saldo de una billetera y actualiza su estado.
 * Si el saldo es <= 0, el estado cambia a 'restringido'.
 * Si el saldo es > 0, el estado cambia a 'activo'.
 * Devuelve la billetera actualizada.
 */
export const checkAndUpdateBilleteraStatus = async (billeteraId: Types.ObjectId): Promise<IBilletera | null> => {
  try {
    const billetera = await BilleteraModel.findById(billeteraId);

    if (!billetera) {
      throw new Error('No se encontró la billetera para actualizar.');
    }

    let nuevoEstado: string;
    let nuevaAlerta: string | null = null;

    // 1. Aplicar la lógica de negocio
    if (billetera.saldo <= 0) {
      nuevoEstado = 'restringido';
      nuevaAlerta = 'restringido';
      console.log(`[ALERTA] La billetera del fixer '${billetera.fixer_id}' fue restringida (saldo: ${billetera.saldo}).`);
    } else if (billetera.saldo > 0 && billetera.saldo < 50) {
      nuevoEstado = 'activo';
      nuevaAlerta = 'saldo_bajo';
      console.log(`[ALERTA] El fixer '${billetera.fixer_id}' tiene saldo bajo: ${billetera.saldo}.`);
    } else {
      nuevoEstado = 'activo';
      nuevaAlerta = null;
    }

    // 2. Actualizar solo si el estado es diferente
    if (billetera.estado !== nuevoEstado || billetera.alerta !== nuevaAlerta) {
      billetera.estado = nuevoEstado;
      billetera.alerta = nuevaAlerta;
      billetera.fecha_actualizacion = new Date();
      await billetera.save(); // Guarda los cambios
      
      console.log(`[Servicio] Estado de Billetera ${billeteraId} actualizado a: ${nuevoEstado}`);
    } else {
      console.log(`[Servicio] Estado de Billetera ${billeteraId} ya era: ${nuevoEstado}. No se requiere actualización.`);
    }

    // 3. Devolver la billetera (actualizada o no)
    return billetera;

  } catch (error: any) {
    console.error('Error en checkAndUpdateBilleteraStatus:', error.message);
    throw new Error('Error al actualizar el estado de la billetera');
  }
};
