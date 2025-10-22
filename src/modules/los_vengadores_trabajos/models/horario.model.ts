import mongoose, { Schema, Document } from "mongoose";

export interface IHorario extends Document {
  fecha: string;
  horaInicio: string;
  horaFin: string;
  costo: number;
}

const HorarioSchema = new Schema<IHorario>({
  fecha: { type: String, required: true },
  horaInicio: { type: String, required: true },
  horaFin: { type: String, required: true },
  costo: { type: Number, required: true },
});

const HorarioModel = mongoose.model<IHorario>("Horario", HorarioSchema);

export default HorarioModel;