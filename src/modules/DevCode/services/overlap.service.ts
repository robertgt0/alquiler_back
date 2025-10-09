import { getAvailabilityService } from './availabilily.service';

export const isSlotAvailable = async (providerId: string, date: string, time: string) => {
    const data = await getAvailabilityService(providerId);
    const day = data.availability.find(d => d.date === date);
    const available = !!day && day.slots.includes(time);
    return { providerId, date, time, available };
};