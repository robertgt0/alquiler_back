import { Notificacion, INotificacion } from "@models/notificacion.model";

export const createNotificacion = async (data: Partial<INotificacion>): Promise<INotificacion> => {
  const notificacion = new Notificacion(data);
  return await notificacion.save();
};

export const getNotificaciones = async (): Promise<INotificacion[]> => {
  return await Notificacion.find().populate("usuario");
};

export const getNotificacionById = async (id: string): Promise<INotificacion | null> => {
  return await Notificacion.findById(id).populate("usuario");
};

export const updateNotificacion = async (id: string, data: Partial<INotificacion>): Promise<INotificacion | null> => {
  return await Notificacion.findByIdAndUpdate(id, data, { new: true });
};

export const deleteNotificacion = async (id: string): Promise<INotificacion | null> => {
  return await Notificacion.findByIdAndDelete(id);
};
