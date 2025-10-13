// Servicio EN MEMORIA para Fixers (sin Mongo)
import { UpsertFixerDTO } from "../types";
import { randomUUID } from "crypto";

type FixerMem = {
  id: string;
  userId: string;
  location: { lat: number; lng: number; address?: string };
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
      createdAt: now,
      updatedAt: now,
    };
    store.set(id, fixer);
    return fixer;
  }

  async update(id: string, data: Partial<UpsertFixerDTO>) {
    const current = store.get(id);
    if (!current) return null;

    const updated: FixerMem = {
      ...current,
      ...(data.userId ? { userId: data.userId } : {}),
      ...(data.location ? { location: data.location } : {}),
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
