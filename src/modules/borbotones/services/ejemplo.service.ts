import Ejemplo from '../models/usuarios.model';
import { EjemploEntity } from '../types';

export class EjemploService {
  async getAll() {
    return await Ejemplo.find();
  }

  async getById(id: string) {
    return await Ejemplo.findById(id);
  }

  async create(data: EjemploEntity) {
    const ejemplo = new Ejemplo(data);
    return await ejemplo.save();
  }

  async update(id: string, data: Partial<EjemploEntity>) {
    return await Ejemplo.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string) {
    return await Ejemplo.findByIdAndDelete(id);
  }

  // Agrega más métodos según tu lógica de negocio
}

export default new EjemploService();