// src/types/user.ts

export interface IUser {
  name: string;
  lastName: string;
  ci: string;           // Cédula de identidad o documento
  email: string;
  phone: string;
  password: string;
  role?: 'cliente' | 'proveedor' | 'admin'; // opcional porque mongoose tiene default
}
