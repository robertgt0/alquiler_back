import RecargaModel from '../models/recarga';
import { IRecarga } from '../types/index';

export const crearRecarga = async (data: IRecarga) => {
  const nuevaRecarga = new RecargaModel(data);
  return await nuevaRecarga.save();
};

export const obtenerRecargas = async () => {
  return await RecargaModel.find().sort({ fecha: -1 });
};
