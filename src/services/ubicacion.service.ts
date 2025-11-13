import UbicacionEstaticaModel from '../models/ubicacion.model';

class UbicacionService {
  public async getAll() {
    try {
      const ubicaciones = await UbicacionEstaticaModel.find().sort({ nombre: 1 });
      return ubicaciones;
    } catch (error) {
      console.error("Error obteniendo ubicaciones:", error);
      throw error;
    }
  }
}

export default new UbicacionService();