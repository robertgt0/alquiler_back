// Servicio EN MEMORIA para Fixers (sin Mongo)
import { randomUUID } from "crypto";

// 👇 Tipos locales (no importamos nada de ../types)
export type UpsertFixerDTO = {
  userId: string;
  location: { lat: number; lng: number; address?: string };
  categories?: string[];            // ✅ HU03: categorías opcionales
};

export type FixerMem = {
  id: string;
  userId: string;
  location: { lat: number; lng: number; address?: string };
  categories?: string[];            // ✅ HU03 guardadas aquí
  createdAt: string;
  updatedAt: string;
};

const store = new Map<string, FixerMem>();

class FixersService {
  async create(data: UpsertFixerDTO) {
    const now = new Date().toISOString();
    const id = randomUUID();

    const fixer: FixerMem = {
      id,
      userId: data.userId,
      location: data.location,
      categories: Array.isArray(data.categories) ? data.categories : [],
      createdAt: now,
      updatedAt: now,
    };

    store.set(id, fixer);
    return fixer;
  }

  async update(id: string, data: Partial<UpsertFixerDTO>) {
    const current = store.get(id);
    if (!current) return null;

    if (data.categories && !Array.isArray(data.categories)) {
      throw new Error("categories debe ser un array de strings");
    }

    const updated: FixerMem = {
      ...current,
      ...(data.userId ? { userId: data.userId } : {}),
      ...(data.location ? { location: data.location } : {}),
      ...(data.categories ? { categories: data.categories } : {}),
      updatedAt: new Date().toISOString(),
    };

    store.set(id, updated);
    return updated;
  }

  async getById(id: string) {
    return store.get(id) || null;
  }
}

export default new FixersService();
