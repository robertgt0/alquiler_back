import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: "Provider", required: true },
    fecha: { type: Date, required: true },
    horaInicio: { type: Date, required: true },
    horaFin: { type: Date, required: true },
    duracionMinutos: { type: Number, required: true },
    ubicacion: { type: String, required: true },
    notas: { type: String, default: "" },
    estado: { type: String, enum: ["pendiente", "completada", "cancelada"], default: "pendiente" },
  },
  { timestamps: true }
);

export default mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);
