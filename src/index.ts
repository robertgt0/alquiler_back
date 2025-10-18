import express from 'express';
import offerRoutes from './offers';

const router = express.Router();

// Ruta para las ofertas
router.use('/offers', offerRoutes);

export default router;
