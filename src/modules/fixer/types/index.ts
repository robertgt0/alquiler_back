// src/modules/fixer/types/index.ts

export type LocationDTO = {
  lat: number;
  lng: number;
  address?: string;
};

// DTO general que usan todas las HU del flujo "Convertirse en Fixer"
export type UpsertFixerDTO = {
  userId: string;
  ci?: string;           // 👈 agregado para HU01 (registro C.I.)
  location?: LocationDTO; // 👈 ahora opcional, porque HU01 no la necesita todavía
};
