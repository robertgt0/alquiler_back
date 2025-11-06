import { Cita, ICita } from '../../../models/cita.model';
import { Proveedor } from '../../../models/proveedor.model';
import { Cliente } from '../../../models/cliente.model';
import { Types } from 'mongoose';

export class CitaService {
  static async crearCita(data: Partial<ICita>) {
    const proveedor = await Proveedor.findById(data.proveedorId);
    if (!proveedor) throw new Error('Proveedor no encontrado');

    const existe = await Cita.findOne({
      proveedorId: data.proveedorId,
      fecha: data.fecha,
      'horario.inicio': data.horario?.inicio,
    });

    if (existe) throw new Error('Horario ya ocupado');

    const nuevaCita = new Cita(data);
    await nuevaCita.save();
    return nuevaCita.populate(['proveedorId', 'clienteId', 'servicioId']);
  }

  static async listarPorProveedor(proveedorId: string) {
    return Cita.find({ proveedorId: new Types.ObjectId(proveedorId) })
      .populate('proveedorId')
      .populate('clienteId')
      .populate('servicioId');
  }

  static async listarPorCliente(clienteId: string) {
    return Cita.find({ clienteId: new Types.ObjectId(clienteId) })
      .populate('proveedorId')
      .populate('clienteId')
      .populate('servicioId');
  }

  static async actualizarCita(id: string, data: any) {
    return await Cita.findByIdAndUpdate(id, data, { new: true })
      .populate('proveedorId')
      .populate('clienteId')
      .populate('servicioId');
  }

  // ✅ Eliminar solo si pertenece al proveedor
  static async eliminarCitaPorProveedor(citaId: string, proveedorId: string) {
    const cita = await Cita.findById(citaId);
    if (!cita) throw new Error('Cita no encontrada');
    if (cita.proveedorId.toString() !== proveedorId)
      throw new Error('No puedes eliminar citas de otro proveedor');

    return await Cita.findByIdAndDelete(citaId);
  }
}
