import express from 'express';
import Fixer from '../models/Fixer';

const router = express.Router();

// GET /api/fixers -> devuelve todos los fixers
router.get('/', async (req, res) => {
  try {
    const fixers = await Fixer.find({});
    res.json(fixers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener fixers' });
  }
});

export default router;
