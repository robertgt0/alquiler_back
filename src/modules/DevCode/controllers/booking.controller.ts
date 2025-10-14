import { Request, Response } from 'express';
import {
  createBooking,
  getBookingById,
  updateBookingStatus,
} from '../services/booking.service';

export const create = async (req: Request, res: Response) => {
  try {
    const {
      clientId,
      providerId,
      date,
      startTime,
      endTime,
      durationMinutes,
      location,
      notes,
    } = req.body || {};

    if (
      !clientId ||
      !providerId ||
      !date ||
      !startTime ||
      !endTime ||
      !durationMinutes ||
      !location
    ) {
      return res.status(400).json({
        success: false,
        message:
          'clientId, providerId, date, startTime, endTime, durationMinutes y location son requeridos',
      });
    }

    const saved = await createBooking({
      clientId: String(clientId),
      providerId: String(providerId),
      date: String(date),
      startTime: String(startTime),
      endTime: String(endTime),
      durationMinutes: Number(durationMinutes),
      location: String(location),
      notes: notes ? String(notes) : undefined,
    });

    return res.status(201).json({ success: true, data: saved });
  } catch (err: any) {
    const status = err?.status || 500;
    return res.status(status).json({
      success: false,
      message: err?.message || 'Error interno del servidor',
    });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const booking = await getBookingById(req.params.id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: 'Cita no encontrada' });
    }
    return res.json({ success: true, data: booking });
  } catch (err: any) {
    const status = err?.status || 500;
    return res.status(status).json({
      success: false,
      message: err?.message || 'Error interno del servidor',
    });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body || {};
    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: 'status es requerido' });
    }

    const updated = await updateBookingStatus(
      req.params.id,
      String(status) as any
    );
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    const status = err?.status || 500;
    return res.status(status).json({
      success: false,
      message: err?.message || 'Error interno del servidor',
    });
  }
};
