import { Cita, ICita } from '../../../models/cita.model';
import { Proveedor } from '../../../models/proveedor.model';
import { Cliente } from '../../../models/cliente.model'; // 👈 importa el modelo si lo creaste

export class CitaService {
  static async crearCita(data: Partial<ICita>) {
    const proveedor = await Proveedor.findById(data.proveedorId);
    if (!proveedor) throw new Error('Proveedor no encontrado');

    // Verificar si el horario ya está ocupado
    const existe = await Cita.findOne({
      proveedorId: data.proveedorId,
      fecha: data.fecha,
      'horario.inicio': data.horario?.inicio,
    });

    if (existe) throw new Error('Horario ya ocupado');

    const nuevaCita = new Cita(data);
    await nuevaCita.save();
    return nuevaCita.populate(['proveedorId', 'clienteId', 'servicioId']); // ✅ incluir el servicio
  }

  static async listarPorProveedor(proveedorId: string) {
    return Cita.find({ proveedorId })
      .populate('proveedorId')
      .populate('clienteId')
      .populate('servicioId'); // ✅ incluir el servicio
  }

  static async listarPorCliente(clienteId: string) {
    return Cita.find({ clienteId })
      .populate('proveedorId')
      .populate('clienteId')
      .populate('servicioId'); // ✅ incluir el servicio
  }
  static async actualizarCita(id: string, data: any) {
    return await Cita.findByIdAndUpdate(id, data, { new: true });
  }

  static async eliminarCita(id: string) {
    return await Cita.findByIdAndDelete(id);
  }
}
