export type LocationDTO = { lat: number; lng: number; address?: string };

export type UpsertFixerDTO = {
  userId: string;
  location: LocationDTO;
};
