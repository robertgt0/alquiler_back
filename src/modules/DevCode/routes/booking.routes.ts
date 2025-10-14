import { Router } from 'express';
import { create, getById, updateStatus } from '../controllers/booking.controller';

const router = Router();

// POST /api/bookings
router.post('/', create);

// GET /api/bookings/:id
router.get('/:id', getById);

// PUT /api/bookings/:id/status
router.put('/:id/status', updateStatus);

export default router;
