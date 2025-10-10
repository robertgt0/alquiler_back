"use strict";

export function validarPassword(password) {
  if (typeof password !== "string") return false;

  if (/\s/.test(password)) return false;

  if (!(password.length >= 8 && password.length <= 16)) return false;

  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;

  return true;
}

export function validarCoincidenciaPassword(password, confirmarPassword) {
  if(!validarPassword(password) || !validarPassword(confirmarPassword))return false;
  return password === confirmarPassword;
}

export function validarImagen(imagen) {
  try {
    const buffer = Buffer.from(imagen, "base64");
    const maxBytes = 1024 * 1024;
    if (buffer.length > maxBytes) return false;
    const bytes = new Uint8Array(buffer);

    const esPNG =
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4E &&
      bytes[3] === 0x47;

    const esJPG =
      bytes[0] === 0xFF &&
      bytes[1] === 0xD8 &&
      bytes[bytes.length - 2] === 0xFF &&
      bytes[bytes.length - 1] === 0xD9;

    if (!esPNG && !esJPG) return false;
    return true;
  } catch (error) {
    console.log(error)
    return false;
  }
}
