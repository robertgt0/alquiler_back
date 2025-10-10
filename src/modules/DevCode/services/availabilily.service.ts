export const getAvailabilityService = async (providerId: string) => {
  return {
    providerId,
    availability: [
      { date: "2025-10-08", slots: ["09:00", "11:00", "14:00"] },
      { date: "2025-10-09", slots: ["10:00", "13:00", "15:00"] },
    ],
  };
};
