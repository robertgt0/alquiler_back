import { Transaccion, ITransaccion } from "@/models/transaccion.model";
import { FilterQuery } from "mongoose";

export const createTransaccion = async (data: Partial<ITransaccion>): Promise<ITransaccion> => {
  const transaccion = new Transaccion(data);
  return await transaccion.save();
}

export const getTransacciones = async (): Promise<ITransaccion[]> => {
  return await Transaccion.find().populate("cuentaOrigen cuentaDestino");
}

export const getTransaccionById = async (id: string): Promise<ITransaccion | null> => {
  return await Transaccion.findById(id).populate("cuentaOrigen cuentaDestino");
}

export const updateTransaccion = async (id: string, data: Partial<ITransaccion>): Promise<ITransaccion | null> => {
  return await Transaccion.findByIdAndUpdate(id, data, { new: true });
}

export const deleteTransaccion = async (id: string): Promise<ITransaccion | null> => {
  return await Transaccion.findByIdAndDelete(id);
}

export const findPaginated = async (
  query: FilterQuery<ITransaccion>,
  skip: number,
  limit: number
): Promise<ITransaccion[]> => {
  return Transaccion.find(query)
    .sort({ fecha: -1 }) // Más nuevas primero
    .skip(skip)
    .limit(limit)
    .exec(); // .exec() es una buena práctica
}

export const count = async (query: FilterQuery<ITransaccion>): Promise<number> => {
  return Transaccion.countDocuments(query).exec();
}

