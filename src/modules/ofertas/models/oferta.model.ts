import { ObjectId } from "mongodb";

export interface Oferta {
  _id?: ObjectId;
  descripcion: string;
  categoria: string;
  imagenes: string[]; // URLs de las imágenes subidas
  createdAt: Date;
  updatedAt: Date;
}
