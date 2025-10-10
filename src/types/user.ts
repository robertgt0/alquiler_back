import { Types } from 'mongoose';

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  lastName: string;
  ci: string;
  email: string;
  phone: string;
  password: string;
  role: 'cliente' | 'proveedor' | 'admin';
}
