import express from 'express';
import { getNearbyFixers, getNearbyUbicaciones } from '../controllers/geolocationController';

const router = express.Router();

// GET /api/geolocation/nearby-fixers?lat=...&lng=...&radius=...
router.get('/nearby-fixers', getNearbyFixers);

// GET /api/geolocation/nearby-ubicaciones?lat=...&lng=...&radius=...
router.get('/nearby-ubicaciones', getNearbyUbicaciones);

export default router;