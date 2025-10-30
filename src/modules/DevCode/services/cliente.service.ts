import { Cliente } from "@models/cliente.model";

export class ClienteService {
  // Crear cliente
  static async crearCliente(data: any) {
    const nuevo = new Cliente(data);
    await nuevo.save();
    return nuevo;
  }

  // Listar todos los clientes
  static async listarClientes() {
    return Cliente.find();
  }

  // Obtener un cliente por ID
  static async obtenerCliente(id: string) {
    return Cliente.findById(id);
  }

  // Actualizar un cliente
  static async actualizarCliente(id: string, data: any) {
    return Cliente.findByIdAndUpdate(id, data, { new: true });
  }

  // Eliminar un cliente
  static async eliminarCliente(id: string) {
    return Cliente.findByIdAndDelete(id);
  }
}
