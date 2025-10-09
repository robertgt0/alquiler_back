import Teamsys from '../models/teamsys';
import { TeamsysEntity } from '../types';

export class TeamsysService {
  async getAll() {
    return await Teamsys.find();
  }

  async getById(id: string) {
    return await Teamsys.findById(id);
  }

  async create(data: TeamsysEntity) {
    const item = new Teamsys(data);
    return await item.save();
  }

  async update(id: string, data: Partial<TeamsysEntity>) {
    return await Teamsys.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string) {
    return await Teamsys.findByIdAndDelete(id);
  }

  // Agrega más métodos según tu lógica de negocio
}

export default new TeamsysService();