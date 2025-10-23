import { Router } from 'express';
import { create, getById, updateStatus } from '../controllers/booking.controller';

const router = Router();

router.post('/', create);

router.get('/:id', getById);

router.put('/:id/status', updateStatus);

export default router;
