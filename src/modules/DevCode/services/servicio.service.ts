import { Servicio, IServicio } from '../../../models/servicio.model';

export class ServicioService {
  static async crear(data: Partial<IServicio>) {
    const nuevo = new Servicio(data);
    await nuevo.save();
    return nuevo;
  }

  static async listar() {
    return Servicio.find().populate('proveedorId');
  }

  static async listarPorProveedor(proveedorId: string) {
    return Servicio.find({ proveedorId });
  }

  static async obtener(id: string) {
    return Servicio.findById(id).populate('proveedorId');
  }

  static async actualizar(id: string, data: Partial<IServicio>) {
    return Servicio.findByIdAndUpdate(id, data, { new: true });
  }

  static async eliminar(id: string) {
    return Servicio.findByIdAndDelete(id);
  }

}
