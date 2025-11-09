import { Types } from 'mongoose';
import BilleteraModel from '../models/wallet';
import { IBilletera } from '../types/index';

export const getBilleteraByFixerId = async (fixerId: Types.ObjectId): Promise<IBilletera | null> => {
  return BilleteraModel.findOne({ fixer_id: fixerId });
};

export const checkAndUpdateBilleteraStatus = async (billeteraId: Types.ObjectId): Promise<IBilletera | null> => {
  try {
    const billetera = await BilleteraModel.findById(billeteraId);

    if (!billetera) {
      throw new Error('No se encontró la billetera para actualizar.');
    }

    let nuevoEstado: string;
    let nuevaAlerta: string | null = null;

    // --- Lógica de negocio extendida ---
    if (billetera.saldo <= 0) {
      nuevoEstado = 'restringido';
      nuevaAlerta = 'restringido';
      console.log(`[ALERTA] Billetera de fixer '${billetera.fixer_id}' restringida (saldo: ${billetera.saldo}).`);
    } else if (billetera.saldo > 0 && billetera.saldo < 50) {
      nuevoEstado = 'activo';
      nuevaAlerta = 'saldo_bajo';
      console.log(`[ALERTA] Fixer '${billetera.fixer_id}' tiene saldo bajo: ${billetera.saldo}.`);
    } else {
      nuevoEstado = 'activo';
      nuevaAlerta = null;
    }

    // --- Actualizar solo si hay cambios ---
    if (billetera.estado !== nuevoEstado || billetera.alerta !== nuevaAlerta) {
      billetera.estado = nuevoEstado;
      billetera.alerta = nuevaAlerta;
      billetera.fecha_actualizacion = new Date();
      await billetera.save();
      console.log(`[Servicio] Estado de billetera ${billeteraId} actualizado a: ${nuevoEstado}`);
    } else {
      console.log(`[Servicio] Estado de billetera ${billeteraId} sin cambios (${nuevoEstado}).`);
    }

    return billetera;
  } catch (error: any) {
    console.error('Error en checkAndUpdateBilleteraStatus:', error.message);
    throw new Error('Error al actualizar el estado de la billetera');
  }
};
