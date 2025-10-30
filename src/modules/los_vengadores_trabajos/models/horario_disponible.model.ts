import mongoose, { Schema, Document } from "mongoose";

export interface IHorario extends Document {
  proveedorId: mongoose.Schema.Types.ObjectId;
  fecha: string;
  horaInicio: string;
  horaFin: string;
}

const Horario_disponibleSchema = new Schema<IHorario>({
  proveedorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Proveedor", // 👈 Nombre del modelo al que se relaciona
        required: true
      },  
  fecha: { type: String, required: true },
  horaInicio: { type: String, required: true },
  horaFin: { type: String, required: true }
});

const HorarioModel = mongoose.model<IHorario>("Horario_disponible", Horario_disponibleSchema);

export default HorarioModel;