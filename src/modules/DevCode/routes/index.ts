import { Router } from 'express';
import proveedorRoutes from './proveedor.routes';
import citaRoutes from './cita.routes';
import servicioRoutes from './servicio.routes';
import clienteRoutes from './cliente.routes';
import ofertaRoutes from './oferta.routes'; // ← NUEVO

const router = Router();

// Monta las rutas específicas del módulo
router.use('/proveedores', proveedorRoutes);
router.use('/citas', citaRoutes);
router.use('/servicios', servicioRoutes);
router.use('/clientes', clienteRoutes);
router.use('/ofertas', ofertaRoutes); // ← NUEVO

// Ruta base de prueba del módulo
router.get('/', (req, res) => {
  res.json({
    message: 'Módulo DevCode funcionando correctamente 🚀',
    endpoints: [
      '/api/devcode/proveedores',
      '/api/devcode/citas',
      '/api/devcode/servicios',
      '/api/devcode/ofertas', // ← NUEVO
    ]
  });
});

export default router;
