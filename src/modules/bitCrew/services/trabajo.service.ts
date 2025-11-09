/*import { Types } from 'mongoose';
import TrabajoModel from '../models/trabajo';
import { ITrabajo } from '../types/index';


 //Obtiene todos los trabajos asociados a un fixer_id específico.

export const getTrabajosByFixerId = async (fixerId: Types.ObjectId): Promise<ITrabajo[]> => {
  // 2. Si se encuentra, usar su '_id' para buscar en 'trabajo'
  return TrabajoModel.find({ fixer_id: fixerId });
};*/
/*
import { Types } from 'mongoose';
import TrabajoModel from '../models/trabajo';
import { ITrabajo } from '../types';
// ⬇️ --- IMPORTACIONES ADICIONALES --- ⬇️
import mongoose from 'mongoose';
import BilleteraModel from '../models/wallet';
import TransaccionModel from '../models/transsacion';


//Obtiene todos los trabajos asociados a un fixer_id específico.
export const getTrabajosByFixerId = async (fixerId: Types.ObjectId): Promise<ITrabajo[]> => {
  // (Esta función es la que ya tenías)
  return TrabajoModel.find({ fixer_id: fixerId });
};

// ================================================================
// 🚀 NUEVA FUNCIÓN: Pagar un trabajo en efectivo (CON TRANSACCIÓN DB)
// ================================================================
/**
 * Marca un trabajo como pagado, descuenta de la billetera del fixer
 * y crea un registro de transacción.
 * Utiliza una transacción de Mongoose para asegurar atomicidad.
 /
export const pagarTrabajoEfectivo = async (trabajoId: string): Promise<ITrabajo> => {
  
  // 1. Iniciar sesión de transacción
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 2. Buscar el trabajo (dentro de la sesión)
    const trabajo = await TrabajoModel.findById(trabajoId).session(session);
    if (!trabajo) {
      throw new Error('Trabajo no encontrado.');
    }
    if (trabajo.estado === 'pagado') {
      throw new Error('Este trabajo ya ha sido pagado.');
    }
    if (trabajo.estado !== 'completado') {
      throw new Error('El trabajo debe estar "completado" para poder pagarse.');
    }

    // 3. Buscar la billetera del fixer (dentro de la sesión)
    const billetera = await BilleteraModel.findOne({ fixer_id: trabajo.fixer_id }).session(session);
    if (!billetera) {
      throw new Error('Billetera del fixer no encontrada.');
    }

    const monto = trabajo.monto_a_pagar;

    // 4. Verificar fondos (¡COMENTADO! Asumimos que el pago en efectivo no descuenta saldo)
    // NOTA: Si "pagado en efectivo" significa que el FIXER te paga a TI, 
    // descomenta esta sección y cambia la lógica.
    /*
    if (billetera.saldo < monto) {
      throw new Error('Saldo insuficiente en la billetera del fixer.');
    }
    billetera.saldo -= monto; // Descontar saldo
    /

    // 5. Crear la transacción de débito
    const nuevaTransaccion = new TransaccionModel({
      fixer_id: trabajo.fixer_id,
      billetera_id: billetera._id,
      tipo: 'debito', // O 'credito' dependiendo de la lógica de negocio
      monto: monto,
      descripcion: `Pago (Efectivo) por trabajo: ${trabajo.descripcion.substring(0, 30)}...`,
      fecha: new Date(),
      // ⬇️ NOTA: Si el saldo no se descuenta, el 'saldo_resultante' es el mismo
      saldo_resultante: billetera.saldo 
    });

    // 6. Actualizar el trabajo
    trabajo.estado = 'pagado';
    trabajo.fecha_pago = new Date();

    // 7. Guardar todos los cambios (dentro de la sesión)
    // await billetera.save({ session }); // Descomentar si el saldo cambia
    await trabajo.save({ session });
    await nuevaTransaccion.save({ session });

    // 8. Confirmar la transacción
    await session.commitTransaction();
    
    console.log(`[Servicio] Trabajo ${trabajoId} pagado en efectivo exitosamente.`);
    return trabajo;

  } catch (error: any) {
    // 9. Si algo falla, revertir todo
    console.error(`Error en transacción de pago: ${error.message}`);
    await session.abortTransaction();
    throw error; // Lanzar el error para que el controlador lo atrape
  } finally {
    // 10. Cerrar la sesión
    session.endSession();
  }
};
*/

import { Types } from 'mongoose';
import TrabajoModel from '../models/trabajo';
import { ITrabajo } from '../types';
import mongoose from 'mongoose';
import BilleteraModel from '../models/wallet';
import TransaccionModel from '../models/transsacion';

// Comisión fija de la plataforma (5%)
const TASA_COMISION = 0.05; 

/**
 * Obtiene todos los trabajos asociados a un fixer_id específico.
 */
export const getTrabajosByFixerId = async (fixerId: Types.ObjectId): Promise<ITrabajo[]> => {
  // Esta función no cambia
  return TrabajoModel.find({ fixer_id: fixerId });
};

// ================================================================
// 🚀 LÓGICA DE PAGO ACTUALIZADA (CON COMISIÓN)
// ================================================================
/**
 * Procesa el pago de un trabajo.
 * 1. Calcula la comisión (ej. 5%)
 * 2. Descuenta la comisión de la billetera del fixer.
 * 3. Crea una transacción de débito por la comisión.
 * 4. Marca el trabajo como 'pagado'.
 */
export const pagarTrabajoEfectivo = async (trabajoId: string): Promise<ITrabajo> => {
  
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Buscar el trabajo
    const trabajo = await TrabajoModel.findById(trabajoId).session(session);
    if (!trabajo) {
      throw new Error('Trabajo no encontrado.');
    }
    if (trabajo.estado === 'pagado') {
      throw new Error('Este trabajo ya ha sido pagado.');
    }
    if (trabajo.estado !== 'completado') {
      throw new Error('El trabajo debe estar "completado" para poder pagarse.');
    }

    // 2. Buscar la billetera del fixer
    const billetera = await BilleteraModel.findOne({ fixer_id: trabajo.fixer_id }).session(session);
    if (!billetera) {
      throw new Error('Billetera del fixer no encontrada.');
    }

    // --- 3. NUEVA LÓGICA DE COMISIÓN ---
    const montoTotalDelTrabajo = trabajo.monto_a_pagar;
    const montoComision = montoTotalDelTrabajo * TASA_COMISION; // ej. 100 * 0.05 = 5

    // 4. Verificar si el fixer tiene saldo para pagar la comisión
    if (billetera.saldo < montoComision) {
      throw new Error(`Saldo insuficiente (Bs. ${billetera.saldo.toFixed(2)}) para pagar la comisión (Bs. ${montoComision.toFixed(2)}).`);
    }

    // 5. Descontar la comisión de la billetera
    const saldoAnterior = billetera.saldo;
    billetera.saldo -= montoComision; // ej. saldo = 50 - 5 = 45
    billetera.fecha_actualizacion = new Date();

    // 6. Crear la transacción de DÉBITO por la comisión
    const nuevaTransaccion = new TransaccionModel({
      fixer_id: trabajo.fixer_id,
      billetera_id: billetera._id,
      tipo: 'debito', // Es un débito (salida de dinero) de la billetera del fixer
      monto: montoComision, // El monto de la transacción es la comisión (ej. 5)
      descripcion: `Comisión (${TASA_COMISION * 100}%) por trabajo: ${trabajo.descripcion.substring(0, 30)}...`,
      fecha: new Date(),
      saldo_resultante: billetera.saldo // El saldo después del descuento
    });

    // 7. Actualizar el estado del trabajo
    trabajo.estado = 'pagado';
    trabajo.fecha_pago = new Date();

    // 8. Guardar todo en la sesión
    await billetera.save({ session });
    await trabajo.save({ session });
    await nuevaTransaccion.save({ session });
    
    // 9. Confirmar la transacción
    await session.commitTransaction();
    
    console.log(`[Servicio] Comisión de Bs. ${montoComision} cobrada. Trabajo ${trabajoId} marcado como pagado.`);
    return trabajo;

  } catch (error: any) {
    // 10. Si algo falla, revertir todo
    console.error(`Error en transacción de pago: ${error.message}`);
    await session.abortTransaction();
    throw error; 
  } finally {
    // 11. Cerrar la sesión
    session.endSession();
  }
};