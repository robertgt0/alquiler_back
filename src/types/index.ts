// src/modules/fixer/types/index.ts

export type UpsertFixerDTO = {
  userId: string;
  ci?: string;
  location?: { lat: number; lng: number; address?: string };
  categories?: string[];
};

export type FixerDTO = {
  id: string;
  userId: string;
  ci?: string;
  location?: { lat: number; lng: number; address?: string };
  categories?: string[];
  createdAt: string;
  updatedAt: string;
};
