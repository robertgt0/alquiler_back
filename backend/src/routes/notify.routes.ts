import { Router } from 'express';
import { sendNotification } from '../controllers/notify.controller';

const router = Router();

router.post('/notify', sendNotification);

export default router;
