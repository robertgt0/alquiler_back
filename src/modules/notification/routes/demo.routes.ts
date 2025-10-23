import express from 'express';
import { demoNotification } from '../controllers/demo.controller'; // Ajusta la ruta para que apunte a 'controllers/demo.controller.ts'

const router = express.Router();

router.post('/send-demo-notification', demoNotification);

export default router;
