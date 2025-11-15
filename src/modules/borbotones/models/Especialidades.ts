import mongoose from "mongoose";

const EspecialistaEsquema = new mongoose.Schema({
  id_especialidad: {
    type: Number,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  fecha_creacion: {
    type: Date,
    default: Date.now
  }
}, {
  collection: "especialidades", // nombre de la colección en MongoDB
  versionKey: false             // elimina el campo __v
});

// Exportar el modelo
const Especialidades = mongoose.model("Especialidades", EspecialistaEsquema);

export default Especialidades;
