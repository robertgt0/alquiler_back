import { Calendario, ICalendario } from "@models/calendario.model";

export const createCalendario = async (data: Partial<ICalendario>): Promise<ICalendario> => {
  const calendario = new Calendario(data);
  return await calendario.save();
};

export const getCalendarios = async (): Promise<ICalendario[]> => {
  return await Calendario.find().populate("proveedor");
};

export const getCalendarioById = async (id: string): Promise<ICalendario | null> => {
  return await Calendario.findById(id).populate("proveedor");
};

export const updateCalendario = async (id: string, data: Partial<ICalendario>): Promise<ICalendario | null> => {
  return await Calendario.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCalendario = async (id: string): Promise<ICalendario | null> => {
  return await Calendario.findByIdAndDelete(id);
};
