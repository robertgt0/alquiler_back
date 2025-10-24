import { Cita, ICita } from '@models/cita.model';
import { Proveedor } from '@models/proveedor.model';

export class CitaService {
  // Crear una cita
  static async crearCita(data: Partial<ICita>) {
    const proveedor = await Proveedor.findById(data.proveedorId);
    if (!proveedor) throw new Error('Proveedor no encontrado');

    // Verificar si el horario ya está ocupado
    const existe = await Cita.findOne({
      proveedorId: data.proveedorId,
      fecha: data.fecha,
      'horario.inicio': data.horario?.inicio
    });

    if (existe) throw new Error('Horario ya ocupado');

    const nuevaCita = new Cita(data);
    await nuevaCita.save();
    return nuevaCita;
  }

  // Listar citas de un proveedor
  static async listarPorProveedor(proveedorId: string) {
    return Cita.find({ proveedorId }).populate('proveedorId');
  }

  // Listar citas de un cliente
  static async listarPorCliente(clienteId: string) {
    return Cita.find({ clienteId }).populate('proveedorId');
  }
}
