import { OfertaTrabajo, IOfertaTrabajo } from "../../../models/ofertaTrabajo.model";

export const createOferta = async (data: Partial<IOfertaTrabajo>): Promise<IOfertaTrabajo> => {
  const oferta = new OfertaTrabajo(data);
  return await oferta.save();
};

export const getOfertas = async (): Promise<IOfertaTrabajo[]> => {
  return await OfertaTrabajo.find().populate("proveedor servicio");
};

export const getOfertaById = async (id: string): Promise<IOfertaTrabajo | null> => {
  return await OfertaTrabajo.findById(id).populate("proveedor servicio");
};

export const updateOferta = async (id: string, data: Partial<IOfertaTrabajo>): Promise<IOfertaTrabajo | null> => {
  return await OfertaTrabajo.findByIdAndUpdate(id, data, { new: true });
};

export const deleteOferta = async (id: string): Promise<IOfertaTrabajo | null> => {
  return await OfertaTrabajo.findByIdAndDelete(id);
};
