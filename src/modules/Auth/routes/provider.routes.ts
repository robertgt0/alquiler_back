import { Router, Request, Response } from 'express';
import User from '../../../models/user.model';
import Provider from '../../../models/provider.model';
import bcrypt from 'bcryptjs';

const router = Router();

// POST /api/auth/register-provider
router.post('/register-provider', async (req: Request, res: Response) => {
  try {
    const {
      name,
      lastName,
      ci,
      email,
      phone,
      password,
      servicios,
      ubicacion,
      horarios,
    } = req.body;

    // Validaciones básicas
    if (!name || !lastName || !ci || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Todos los campos de usuario son requeridos' });
    }

    if (!servicios || !ubicacion || !ubicacion.lat || !ubicacion.lng) {
      return res.status(400).json({ success: false, message: 'Datos de proveedor incompletos' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'El usuario ya existe' });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const newUser = new User({
      name,
      lastName,
      ci,
      email,
      phone,
      password: hashedPassword,
      role: 'proveedor',
    });
    await newUser.save();

    // Crear proveedor asociado
    const newProvider = new Provider({
      user: newUser._id,
      servicios,
      ubicacion,
      horarios: horarios || [],
      calendario: {},
      rating: 0,
      trabajosCompletados: 0,
    });
    await newProvider.save();

    // Devolver datos sin la contraseña
    const providerResponse = {
      ...newProvider.toJSON(),
      user: {
        _id: newUser._id,
        name: newUser.name,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    };

    res.status(201).json({ success: true, provider: providerResponse });
  } catch (error) {
    console.error('Error registrando proveedor:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

export default router;
