import mongoose, { Schema, Document } from 'mongoose';

// Interface para TypeScript
export interface IOferta extends Document {
  fixerId: mongoose.Types.ObjectId; // Referencia al Fixer que creó la oferta
  descripcion: string; // Máximo 100 caracteres según HU06
  categorias: string[]; // Categorías/servicios de la oferta
  imagenes: string[]; // URLs de las imágenes (máximo 5)
  activa: boolean;
  fechaPublicacion: Date;
  fechaEdicion?: Date;
}

// Schema de Mongoose
const OfertaSchema: Schema = new Schema(
  {
    fixerId: {
      type: Schema.Types.ObjectId,
      ref: 'Fixer',
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
      maxlength: 100, // Según HU06
      trim: true,
    },
    categorias: [
      {
        type: String,
        required: true,
      },
    ],
    imagenes: [
      {
        type: String,
        validate: {
          validator: function (v: string[]) {
            return v.length <= 5; // Máximo 5 imágenes según HU06
          },
          message: 'No se permiten más de 5 imágenes por oferta',
        },
      },
    ],
    activa: {
      type: Boolean,
      default: true,
    },
    fechaPublicacion: {
      type: Date,
      default: Date.now,
    },
    fechaEdicion: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Índices para mejorar búsquedas
OfertaSchema.index({ fixerId: 1 });
OfertaSchema.index({ activa: 1 });
OfertaSchema.index({ fechaPublicacion: -1 }); // Para ordenar por más recientes

export default mongoose.model<IOferta>('Oferta', OfertaSchema);