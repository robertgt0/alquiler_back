import { IUser } from '@/types/user';
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'El apellido es requerido'],
      trim: true,
    },
    ci: {
      type: String,
      required: [true, 'El CI es requerido'],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email inválido'],
    },
    phone: {
      type: String,
      required: [true, 'El número de celular es requerido'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'La contraseña es requerida'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    },
    role: {
      type: String,
      enum: ['cliente', 'proveedor', 'admin'],
      default: 'cliente',
    },
  },
  {
    timestamps: true, 
    toJSON: {
      transform(_, ret: any) {
        if (ret.password) delete ret.password; 
        return ret;
      },
    },

  }
);

// 🔐 Método de instancia para comparar contraseñas
userSchema.methods.comparePassword = async function (password: string) {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, this.password);
};

// Exporta el modelo tipado
const User: Model<IUserDocument> = mongoose.model<IUserDocument>('User', userSchema);
export default User;
