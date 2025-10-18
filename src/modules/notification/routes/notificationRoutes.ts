import { Router } from 'express';
import { createNotification, listNotifications } from '../controllers/notificationController';

const router = Router();

router.post('/', createNotification);
router.get('/', listNotifications);

export default router;
