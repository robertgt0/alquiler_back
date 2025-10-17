import { Schema, model, InferSchemaType, HydratedDocument } from 'mongoose';

const ejemploSchema = new Schema({
    titulo: { type: String, required: true },
  // ...
}, { timestamps: true });

export type Ejemplo = InferSchemaType<typeof ejemploSchema>;
export type EjemploDocument = HydratedDocument<Ejemplo>;

export default model<Ejemplo>('Ejemplo', ejemploSchema);
