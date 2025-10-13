import jwt from "jsonwebtoken";

//  Obtiene la clave secreta desde .env
const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("JWT_SECRET no definido en .env");

/**
 * Genera un token JWT con expiración configurable.
 * Por defecto expira en 15 minutos para forzar reautenticación tras inactividad.
 */
export function signAccessToken(payload: object, expiresIn = "15m") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verifica si el token es válido y no ha expirado.
 */
export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (error) {
    throw new Error("Token inválido o expirado");
  }
}