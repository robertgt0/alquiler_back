import mongoose, { Schema, Document, Types } from "mongoose";
import  "./servicio.model";

export interface IProveedor extends Document {
  nombre: string;
  servicios: Types.ObjectId[]; // puede ser ObjectId (sin populate) o IServicio (con populate)
}

const ProveedorSchema = new Schema<IProveedor>({
  nombre: { type: String, required: true },
  servicios: [{ type: Schema.Types.ObjectId, ref: "Servicio" }]
});

const ProveedorModel = mongoose.model<IProveedor>("Proveedor", ProveedorSchema);

export default ProveedorModel;