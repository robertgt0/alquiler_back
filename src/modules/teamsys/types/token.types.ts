import { UsuarioDocument } from ".";

export interface TokenResponse {
  accessToken: string,
  refreshToken: string,
  user: Partial<UsuarioDocument>,
  expiresAt: Date,
}