/*
import { Document, Types } from 'mongoose'; // ⬅️ CAMBIO HECHO AQUÍ

// Interfaz para 'Fixer'
export interface IFixer extends Document {
  _id: Types.ObjectId; // ⬅️ AÑADE ESTA LÍNEA
  nombre: string;
  usuario: string;
  email: string;
  hash_password: string;
  activo: boolean;
  fecha_registro: Date;
  telefono?: string;
}

// Interfaz para 'Trabajo'
// (La movemos aquí para mantener todo el módulo 'bitCrew' junto)
export interface ITrabajo extends Document {
  fixer_id: Types.ObjectId; // ⬅️ CAMBIO HECHO AQUÍ (ya no usa 'mongoose.')
  descripcion: string;
  estado: string;
  monto_a_pagar: number;
  fecha_creacion: Date;
  fecha_pago?: Date;
}

// Interfaz para 'Billetera'
export interface IBilletera extends Document {
  fixer_id: Types.ObjectId; // ⬅️ CAMBIO HECHO AQUÍ (ya no usa 'mongoose.')
  saldo: number;
  fecha_actualizacion: Date;
}
*/
import { Document, Types } from 'mongoose'; // ⬅️ CAMBIO HECHO AQUÍ

// Interfaz para 'Fixer'
export interface IFixer extends Document {
  _id: Types.ObjectId; // ⬅️ AÑADE ESTA LÍNEA
  nombre: string;
  usuario: string;
  email: string;
  hash_password: string;
  activo: boolean;
  fecha_registro: Date;
  telefono?: string;
}

// Interfaz para 'Trabajo'
// (La movemos aquí para mantener todo el módulo 'bitCrew' junto)
export interface ITrabajo extends Document {
  fixer_id: Types.ObjectId; // ⬅️ CAMBIO HECHO AQUÍ (ya no usa 'mongoose.')
  descripcion: string;
  estado: string;
  monto_a_pagar: number;
  fecha_creacion: Date;
  fecha_pago?: Date;
}

// Interfaz para 'Billetera'
export interface IBilletera extends Document {
  _id: Types.ObjectId;
  fixer_id: Types.ObjectId;
  saldo: number;
  estado: string; // <-- 🚀 CAMPO AÑADIDO
  fecha_actualizacion: Date;
}