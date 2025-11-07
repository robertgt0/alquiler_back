import { Servicio, IServicio } from "../../../models/servicio.model";

export const createServicio = async (data: Partial<IServicio>): Promise<IServicio> => {
  const servicio = new Servicio(data);
  return await servicio.save();
};

export const getServicios = async (): Promise<IServicio[]> => {
  return await Servicio.find();
};

export const getServicioById = async (id: string): Promise<IServicio | null> => {
  return await Servicio.findById(id);
};

export const updateServicio = async (id: string, data: Partial<IServicio>): Promise<IServicio | null> => {
  return await Servicio.findByIdAndUpdate(id, data, { new: true });
};

export const deleteServicio = async (id: string): Promise<IServicio | null> => {
  return await Servicio.findByIdAndDelete(id);
};
