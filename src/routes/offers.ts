import express from 'express';
import OfferModel from '../models/Offer';
import { verifyFixer } from '../middlewares/auth';

const router = express.Router();

// Crear una nueva oferta de servicio
router.post('/', verifyFixer, async (req, res) => {
  const { title, description, category, contact, images } = req.body;

  // Validación simple (puedes agregar más validaciones)
  if (description.length > 100) {
    return res.status(400).json({ message: 'La descripción no puede exceder los 100 caracteres' });
  }

  try {
    const newOffer = new OfferModel({
      ownerId: req.user.id,  // Supón que tienes un middleware de autenticación
      title,
      description,
      category,
      contact,
      images,
    });

    await newOffer.save();

    return res.status(201).json({ message: 'Oferta de trabajo creada', offer: newOffer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al crear la oferta' });
  }
});

export default router;
