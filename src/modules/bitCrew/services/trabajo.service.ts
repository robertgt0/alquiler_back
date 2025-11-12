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