import mongoose, { Schema, Document } from "mongoose";

export interface ICliente extends Document {
  nombre: string;
}

const ClienteSchema = new Schema<ICliente>({
  nombre: { type: String, required: true }
});

const ClienteModel = mongoose.model<ICliente>("Cliente", ClienteSchema);

export default ClienteModel;
