// src/types/index.ts
export interface IUser {
  name: string;
  email: string;
  password?: string;
  ci?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}