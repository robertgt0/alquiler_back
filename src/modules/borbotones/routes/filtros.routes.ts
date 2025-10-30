import { Router } from "express";
import {
  listarCiudades,
  listarEspecialidades,
  usuariosPorCiudad,
  usuariosPorEspecialidad,
  usuariosPorDisponibilidad,
  provinciasPorCiudad,
  usuariosPorServicio, // 👈 nuevo
  listarDepartamentos,
  ciudadesPorDepartamento,
} from "../controllers/filtros.controller";

const router = Router();

// Rutas base
router.get("/", (req, res) => {
  res.json({
    message: "Módulo de filtros",
    endpoints: {
      departamentos: "/departamentos",
      especialidades: "/especialidades",
      ciudades: "/ciudades",
      "usuarios-por-ciudad": "/usuarios/ciudad",
      "usuarios-por-especialidad": "/usuarios/especialidad"
    }
  });
});

// Ciudades
router.get("/ciudades", listarCiudades);

// Departamentos (Bolivia)
router.get("/departamentos", (req, res) => {
  console.log("🔍 Procesando petición GET /departamentos");
  return listarDepartamentos(req, res);
});

// Especialidades
router.get("/especialidades", (req, res) => {
  console.log("🔍 Procesando petición GET /especialidades");
  return listarEspecialidades(req, res);
});

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

// Ciudades por departamento (Bolivia)
router.get("/ciudades/por-departamento", ciudadesPorDepartamento);

// ✅ Nuevo: usuarios por nombre de servicio
// http://localhost:5000/api/borbotones/filtros/usuarios/servicio?servicio=Cambio de cerraduras
router.get("/usuarios/servicio", usuariosPorServicio);

export default router;
