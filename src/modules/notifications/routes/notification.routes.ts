import { Router } from 'express';
import { createNotification } from '../controllers/notification.controller';

const router = Router();
router.post('/', createNotification);

export default router;

