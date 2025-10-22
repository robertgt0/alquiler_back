// Servicio EN MEMORIA para Fixers (sin Mongo por ahora)
import { randomUUID } from "crypto";

export type FixerMem = {
  id: string;
  userId: string;
  ci?: string; // <- CI puede existir o no aún (lo ponemos opcional)
  createdAt: string;
  updatedAt: string;
};

export type CreateFixerDTO = {
  userId: string;
  ci?: string;
};

export type UpdateFixerDTO = Partial<CreateFixerDTO>;

const store = new Map<string, FixerMem>();

class FixersService {
  // Crear un fixer (puede venir ya con CI)
  create(data: CreateFixerDTO) {
    const now = new Date().toISOString();
    const id = randomUUID();
    const fixer: FixerMem = {
      id,
      userId: data.userId,
      ci: data.ci, // puede ser undefined si todavía no se registró
      createdAt: now,
      updatedAt: now,
    };
    store.set(id, fixer);
    return fixer;
  }

  // Actualizar (por ejemplo, para guardar/editar CI)
  update(id: string, data: UpdateFixerDTO) {
    const current = store.get(id);
    if (!current) return null;

    const updated: FixerMem = {
      ...current,
      ...(data.userId !== undefined ? { userId: data.userId } : {}),
      ...(data.ci !== undefined ? { ci: data.ci } : {}),
      updatedAt: new Date().toISOString(),
    };

    store.set(id, updated);
    return updated;
  }

  getById(id: string) {
    return store.get(id) || null;
  }

  // -------- HU01: utilidades para CI --------

  // Buscar si existe un fixer con ese CI
  findByCI(ci: string) {
    for (const f of store.values()) {
      if (f.ci === ci) return f;
    }
    return null;
  }

  /**
   * Verifica si un CI es único.
   * - Si no existe ningún fixer con ese CI => true.
   * - Si existe, pero es el mismo fixer (excludeId) => true.
   * - Si existe con otro fixer => false.
   */
  isCIUnique(ci: string, excludeId?: string) {
    const found = this.findByCI(ci);
    if (!found) return true;
    if (excludeId && found.id === excludeId) return true;
    return false;
  }
}

export default new FixersService();
