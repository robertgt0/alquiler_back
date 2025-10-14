import mongoose from "mongoose";

const ProviderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // relación con el modelo User
      required: true,
    },
    servicios: {
      type: [String], // array de servicios
      default: [],
      validate: {
        validator: (arr : string[]) => arr.length > 0,
        message: "Debe especificar al menos un servicio",
      },
    },
    ubicacion: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      direccion: { type: String, required: true, trim: true },
    },
    horarios: {
      type: [String], // ejemplo: ["08:00-12:00", "14:00-18:00"]
      default: [],
    },
    calendario: {
      type: Object, // estructura flexible (agenda, reservas, etc.)
      default: {},
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    trabajosCompletados: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true, // agrega createdAt y updatedAt automáticamente
  }
);

export default mongoose.models.Provider || mongoose.model("Provider", ProviderSchema);
