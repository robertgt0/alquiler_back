export interface AvailabilityResponse {
  providerId: string;
  date: string;
  slots: string[];
}

export const getAvailabilityService = async (
  providerId: string,
  date?: string
): Promise<AvailabilityResponse> => {
  // Reemplazar este mock por la lógica real que
  // consulte la disponibilidad de horarios del proveedor y excluya las citas reservadas.
  const normalizedDate = date || new Date().toISOString().slice(0, 10);

  return {
    providerId,
    date: normalizedDate,
    slots: ['09:00', '09:30', '10:00', '10:30'],
  };
};
