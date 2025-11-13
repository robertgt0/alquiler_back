import { Types } from 'mongoose';
import TrabajoModel from '../models/trabajo';
import { ITrabajo } from '../types';
import mongoose from 'mongoose';
import BilleteraModel from '../models/wallet';
import TransaccionModel from '../models/transacion';

// Comisión fija de la plataforma (5%)
const TASA_COMISION = 0.05; 

/**
 * Obtiene todos los trabajos asociados a un fixer_id específico.
 */
export const getTrabajosByFixerId = async (fixerId: Types.ObjectId): Promise<ITrabajo[]> => {
  // Esta función no cambia
  return TrabajoModel.find({ fixer_id: fixerId });
};

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

    // --- 3. LÓGICA DE COMISIÓN ---
    const montoTotalDelTrabajo = trabajo.monto_a_pagar;
    const montoComision = montoTotalDelTrabajo * TASA_COMISION;

    // 4. --- ¡ MENSAJE ! --- 
    if (billetera.saldo <= 0) { 
      // Si el saldo es 0 o negativo, lanza tu error personalizado.
      throw new Error("No se puede continuar el pago por falta de saldo. Su saldo debe ser mayor a 0 Bs");
    }

    // 5. Descontar la comisión de la billetera
    const saldoAnterior = billetera.saldo;
    billetera.saldo -= montoComision; 
    billetera.fecha_actualizacion = new Date();

    // 6. Crear la transacción de DÉBITO por la comisión
    const nuevaTransaccion = new TransaccionModel({
      fixer_id: trabajo.fixer_id,
      billetera_id: billetera._id,
      tipo: 'debito', 
      monto: montoComision, 
      descripcion: `Comisión (${TASA_COMISION * 100}%) por trabajo: ${trabajo.descripcion.substring(0, 30)}...`,
      fecha: new Date(),
      saldo_resultante: billetera.saldo 
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
