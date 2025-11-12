import { isValidObjectId } from "mongoose";
import TrabajoModel from "../models/trabajo.model";

export async function listTrabajosCancelados(opts?: { onlyCancelled?: boolean }) {
  const query = opts?.onlyCancelled ? { estado: "cancelado" } : {};
  // .lean() devuelve objetos planos (mejor performance para API)
  return await TrabajoModel.find(query).lean().exec();
}

export async function getTrabajoById(id: string) {
  if (!isValidObjectId(id)) {
    const err: any = new Error("ID inválido");
    err.status = 400;
    throw err;
  }

  const doc = await TrabajoModel.findById(id).lean().exec();
  if (!doc) {
    const err: any = new Error("Trabajo no encontrado");
    err.status = 404;
    throw err;
  }
  return doc;
}
