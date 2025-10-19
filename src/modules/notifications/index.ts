import { Router } from 'express';
import notificationRouter from './routes/notification.routes';

const router = Router();
router.use('/', notificationRouter);

export default router;

