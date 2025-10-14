import { getAvailabilityService } from './availabilily.service';

export const isSlotAvailable = async (providerId: string, date: string, time: string) => {
    const { slots } = await getAvailabilityService(providerId, date);
    const available = slots.includes(time);
    return { providerId, date, time, available };
};