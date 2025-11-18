import { Schema, model, Document, Types } from "mongoose";

export interface IUserAuth extends Document {
  userId: Types.ObjectId; // referencia a User
  authProvider: string; // ej. "local", "google"
  mapaModificacion: number; // número de cambios permitidos o nivel de acceso
  createdAt: Date;
  updatedAt: Date;
}

const userAuthSchema = new Schema<IUserAuth>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    mapaModificacion: {
      type: Number,
      default: 3,
    },
  },
  { timestamps: true } // crea automáticamente createdAt y updatedAt
);

export const UserAuth = model<IUserAuth>("UserAuth", userAuthSchema);
