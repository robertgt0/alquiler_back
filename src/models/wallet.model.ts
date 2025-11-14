import { Schema, model, Document, Types } from "mongoose";

export interface IWallet extends Document {
  fixer_id: Types.ObjectId;
  saldo: number;
  estado: "activa" | "bloqueada";
  fecha_actualizacion: Date;
}

const walletSchema = new Schema<IWallet>(
  {
    fixer_id: { type: Schema.Types.ObjectId, ref: "Fixer", required: true },
    saldo: { type: Number, default: 0, min: 0 },
    estado: {
      type: String,
      enum: ["activa", "bloqueada"],
      default: "activa",
    },
    fecha_actualizacion: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Wallet = model<IWallet>("Wallet", walletSchema);
