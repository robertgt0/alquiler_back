import { Router } from 'express';
import trabajoRoutes from "./routes/trabajo.routes";
import horarioRoutes from "./routes/horario_disponible.routes";
import clienteRoutes from "./routes/cliente.routes";
import proveedorRoutes from "./routes/proveedor.routes";
const router = Router();

router.get('/', (req, res) => {
  res.json({
    message: '📦 Módulo de Trabajos - Los Vengadores',
    version: '1.0.0',
    description: 'Endpoints para listar trabajos agendados y horarios.',
    endpoints: {
      trabajos: "/trabajos",
      horarios: "/horarios",
      clientes: "/clientes",
      proveedores: "/proveedores"
    }
  });
});

// Montar rutas
router.use("/trabajos", trabajoRoutes);         // crear y eliminar trabajos
router.use("/horarios", horarioRoutes);         // crear o modificar horarios disponibles
router.use("/clientes", clienteRoutes);         // recuperar información de clientes
router.use("/proveedores", proveedorRoutes);   // recuperar información de proveedores

export default router;