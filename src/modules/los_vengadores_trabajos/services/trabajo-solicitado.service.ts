// src/modules/los_vengadores_trabajos/services/trabajo-solicitado.service.ts

import TrabajoSolicitado, { ITrabajoSolicitado } from "../models/trabajo-solicitado.model";

// Haz explícito el DTO. (También podrías usar Pick + Partial, pero así queda claro)
export type NuevaSolicitudDTO = {
  proveedor?: string | null;
  cliente?: string | null;
  fecha: string;        // "YYYY-MM-DD" o "DD/MM/YYYY" según estés usando
  hora_inicio: string;  // "HH:mm"
  hora_fin: string;     // "HH:mm"
  estado?: string;      // opcional
};

export async function crearSolicitudService(data: NuevaSolicitudDTO) {
  // 1) Validación de formato HH:mm
  const hhmm = /^\d{2}:\d{2}$/;
  if (!hhmm.test(data.hora_inicio) || !hhmm.test(data.hora_fin)) {
    throw new Error("Horas inválidas, use formato HH:mm");
  }

  // 2) Validación simple de rango (inicio < fin)
  if (data.hora_inicio >= data.hora_fin) {
    throw new Error("La hora_fin debe ser mayor que la hora_inicio");
  }

  // 3) (Opcional) Evitar duplicado exacto en la misma fecha/proveedor
  //    OJO: esto solo evita duplicado exacto, no solapamiento de rangos.
  const yaExiste = await TrabajoSolicitado.findOne({
    proveedor: data.proveedor ?? null, // 👈 corregido (antes "preoveedor")
    fecha: data.fecha,
    hora_inicio: data.hora_inicio,
    hora_fin: data.hora_fin,
  });

  if (yaExiste) {
    throw new Error("Ya existe una solicitud con ese rango horario");
  }

  // 4) Crear documento
  const doc = await TrabajoSolicitado.create({
    proveedor: data.proveedor ?? null,
    cliente: data.cliente ?? null,
    fecha: data.fecha,
    hora_inicio: data.hora_inicio,
    hora_fin: data.hora_fin,
    estado: data.estado ?? "pendiente",
  });

  return doc;
}
