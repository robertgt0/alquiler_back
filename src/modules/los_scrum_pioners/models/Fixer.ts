import mongoose, { Schema, Document } from 'mongoose';

// Interface para TypeScript
export interface IFixer extends Document {
  userId: mongoose.Types.ObjectId; // Referencia al usuario que se convirtió en Fixer
  ci: string; // Carnet de Identidad (único)
  ubicacionTrabajo: {
    lat: number;
    lng: number;
    direccion?: string;
  };
  servicios: string[]; // IDs o nombres de servicios que ofrece
  metodoPago: {
    efectivo: boolean;
    qr: boolean;
    tarjeta: boolean;
  };
  cuentaBancaria?: {
    numeroCuenta: string;
    nombreTitular: string;
  };
  terminosAceptados: boolean;
  fechaRegistro: Date;
  activo: boolean;
}

// Schema de Mongoose
const FixerSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // Un usuario solo puede ser Fixer una vez
    },
    ci: {
      type: String,
      required: true,
      unique: true, // CI único según HU01
      trim: true,
      match: /^[0-9]{6,10}$/, // Solo números, 6-10 dígitos
    },
    ubicacionTrabajo: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
      direccion: {
        type: String,
        trim: true,
      },
    },
    servicios: [
      {
        type: String,
        required: true,
      },
    ],
    metodoPago: {
      efectivo: {
        type: Boolean,
        default: false,
      },
      qr: {
        type: Boolean,
        default: false,
      },
      tarjeta: {
        type: Boolean,
        default: false,
      },
    },
    cuentaBancaria: {
      numeroCuenta: {
        type: String,
        trim: true,
      },
      nombreTitular: {
        type: String,
        trim: true,
      },
    },
    terminosAceptados: {
      type: Boolean,
      required: true,
      default: false,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Crea automáticamente createdAt y updatedAt
  }
);

// Índices para mejorar búsquedas
FixerSchema.index({ ci: 1 });
FixerSchema.index({ userId: 1 });
FixerSchema.index({ 'ubicacionTrabajo.lat': 1, 'ubicacionTrabajo.lng': 1 });

export default mongoose.model<IFixer>('Fixer', FixerSchema);