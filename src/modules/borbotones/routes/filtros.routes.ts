import { Router } from "express";
import {
  listarCiudades,
  listarEspecialidades,
  listarDepartamentos,
  ciudadesPorDepartamento,
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
router.get("/usuarios/ciudad", usuariosPorCiudad);
router.get("/usuarios/ciudad/:ciudad", usuariosPorCiudad);

// Usuarios por especialidad
router.get("/usuarios/especialidad", usuariosPorEspecialidad);

// Usuarios por disponibilidad
router.get("/usuarios/disponible", usuariosPorDisponibilidad);

// Provincias por ciudad
router.get("/ciudad/provincias", provinciasPorCiudad);

// Departamentos (Bolivia)
router.get("/departamentos", listarDepartamentos);

// Ciudades por departamento (Bolivia)
router.get("/ciudades/por-departamento", ciudadesPorDepartamento);

// ✅ Nuevo: usuarios por nombre de servicio
router.get("/usuarios/servicio", usuariosPorServicio);

export default router;
