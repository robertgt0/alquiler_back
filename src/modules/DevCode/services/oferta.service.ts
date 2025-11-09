// src/modules/DevCode/services/oferta.service.ts
import { Servicio } from '../../../models/servicio.model';
import { OfertaVista } from '../../../models/ofertaVista.model';
import { Types } from 'mongoose';

export class OfertaService {
  /**
   * Detecta servicios nuevos para un cliente específico
   * @param clienteId ID del cliente (requester)
   * @param minutosAtras Ventana de tiempo para buscar (default 15 min)
   */
  static async detectarNuevasOfertas(clienteId: string, minutosAtras: number = 15) {
    const fechaLimite = new Date();
    fechaLimite.setMinutes(fechaLimite.getMinutes() - minutosAtras);

    // 1. Buscar servicios creados en los últimos X minutos
    const serviciosNuevos = await Servicio.find({
      createdAt: { $gte: fechaLimite },
    }).populate('proveedorId');

    // src/modules/DevCode/services/oferta.service.ts
// ... dentro de detectarNuevasOfertas ...

    if (serviciosNuevos.length === 0) {
      return { nuevas: 0, servicios: [] };
    }

    // 2. Filtrar los que el cliente YA vio
    const serviciosVistosIds = await OfertaVista.find({
      clienteId: new Types.ObjectId(clienteId),
      servicioId: { $in: serviciosNuevos.map(s => s._id) },
    }).distinct('servicioId');

    // 3. Obtener solo los NO vistos
    const serviciosNoVistos = serviciosNuevos.filter(
      (s) => !serviciosVistosIds.some((id) => id.equals(s._id))
    );

    return {
      nuevas: serviciosNoVistos.length,
      servicios: serviciosNoVistos,
    };
  }

  /**
   * Marca servicios como vistos por el cliente
   */
  static async marcarOfertasComoVistas(clienteId: string, serviciosIds: string[]) {
    const registros = serviciosIds.map((servicioId) => ({
      clienteId: new Types.ObjectId(clienteId),
      servicioId: new Types.ObjectId(servicioId),
      vistoPor: 'manual',
      fechaVista: new Date(),
    }));

    // Usar bulkWrite para insertar sin duplicar
    await OfertaVista.bulkWrite(
      registros.map((r) => ({
        updateOne: {
          filter: { clienteId: r.clienteId, servicioId: r.servicioId },
          update: { $set: r },
          upsert: true, // Crea si no existe
        },
      }))
    );

    return { marcadas: serviciosIds.length };
  }
}