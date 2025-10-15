import { UsuarioDocument } from ".";

export interface TokenResponse {
  accessToken: string,
  refreshToken: string,
  user: UsuarioDocument,
  expiresAt: Date,
}