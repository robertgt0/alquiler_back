import { Router } from "express";
import {
  listarCiudades,
  listarEspecialidades,
  usuariosPorCiudad,
  usuariosPorEspecialidad,
  usuariosPorDisponibilidad,
  provinciasPorCiudad,
  usuariosPorServicio, // 👈 nuevo
} from "../controllers/filtros.controller";

const router = Router();

// Ciudades
router.get("/ciudades", listarCiudades);

// Especialidades
router.get("/especialidades", listarEspecialidades);

// Usuarios por ciudad
// http://localhost:5000/api/borbotones/filtros/usuarios/ciudad?ciudad=cochabamba
router.get("/usuarios/ciudad", usuariosPorCiudad);
router.get("/usuarios/ciudad/:ciudad", usuariosPorCiudad);

// Usuarios por especialidad
router.get("/usuarios/especialidad", usuariosPorEspecialidad);

// Usuarios por disponibilidad
router.get("/usuarios/disponible", usuariosPorDisponibilidad);

// Provincias por ciudad
router.get("/ciudad/provincias", provinciasPorCiudad);

// ✅ Nuevo: usuarios por nombre de servicio
// http://localhost:5000/api/borbotones/filtros/usuarios/servicio?servicio=Cambio de cerraduras
router.get("/usuarios/servicio", usuariosPorServicio);

export default router;
