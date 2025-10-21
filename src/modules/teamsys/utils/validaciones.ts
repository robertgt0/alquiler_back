
import dns from 'dns';

export function validarPassword(password: string): boolean {
  if (typeof password !== "string") return false;
  if (/\s/.test(password)) return false;
  if (!(password.length >= 8 && password.length <= 16)) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
}

export function validarCoincidenciaPassword(password: string, confirmarPassword: string): boolean {
  if (!validarPassword(password) || !validarPassword(confirmarPassword)) return false;
  return password === confirmarPassword;
}

/**
 * @param correo Correo electrónico a validar.
 * @returns Promise<boolean> → true si el formato y el dominio son válidos.
 */
export async function validarCorreoElectronico(correo: string): Promise<boolean> {
  if (typeof correo !== 'string') return false;
  const patronCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!patronCorreo.test(correo)) return false;
  const partes = correo.split('@');
  const dominio = partes[1];
  const dominioValido = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(dominio);
  if (!dominioValido) return false;
  return new Promise((resolve) => {
    dns.resolveMx(dominio, (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

/**
 * @param fileBuffer Contenido binario de la imagen
 * @param maxSizeBytes Tamaño máximo permitido (por defecto 1 MB)
 * @returns true si la imagen cumple los requisitos
 */
export function validarImagen(fileBuffer: Buffer, maxSizeBytes = 1024 * 1024): boolean {
  if (!Buffer.isBuffer(fileBuffer)) return false;
  if (fileBuffer.length > maxSizeBytes) return false;
  const esPNG =
    fileBuffer[0] === 0x89 &&
    fileBuffer[1] === 0x50 &&
    fileBuffer[2] === 0x4E &&
    fileBuffer[3] === 0x47;
  const esJPG =
    fileBuffer[0] === 0xFF &&
    fileBuffer[1] === 0xD8 &&
    fileBuffer[fileBuffer.length - 2] === 0xFF &&
    fileBuffer[fileBuffer.length - 1] === 0xD9;
  return esPNG || esJPG;
}

/*export function validarImagen(imagen: string): boolean {
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

    return esPNG || esJPG;
  } catch (error) {
    console.log(error);
    return false;
  }
}*/

export function limpiarInput(valor: unknown): unknown {
  if (typeof valor === 'string') return valor;
  if (valor === null || valor === undefined) return valor;

  if (typeof valor === 'object') {
    for (const key in valor as Record<string, unknown>) {
      if (key.startsWith('$') || key.includes('.')) {
        delete (valor as Record<string, unknown>)[key];
      } else {
        (valor as Record<string, unknown>)[key] = limpiarInput((valor as Record<string, unknown>)[key]);
      }
    }
  }

  return valor;
}

/*"use strict";

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

export function limpiarInput(valor) {
  // Si es string → simplemente lo devuelve (no hay peligro)
  if (typeof valor === 'string') {
    return valor;
  }

  // Si es null o undefined → lo devuelve tal cual
  if (valor === null || valor === undefined) {
    return valor;
  }

  // Si es un objeto → lo limpia recursivamente
  if (typeof valor === 'object') {
    for (const key in valor) {
      if (key.startsWith('$') || key.includes('.')) {
        delete valor[key];
      } else {
        valor[key] = limpiarInput(valor[key]);
      }
    }
  }

  return valor;
}
  */
