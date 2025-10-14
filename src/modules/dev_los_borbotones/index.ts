import { Router } from "express";
import filtrosRouter from "./routes/filstros.routes";

const router = Router();

// Ruta base del módulo
router.get("/", (_req, res) => {
  res.json({
    message: "📦 Módulo Los Borbotones",
    version: "1.0.0",
    description: "Endpoints para búsquedas y filtros de usuarios",
    endpoints: {
      // 🔹 Filtros por CIUDAD
      filtro_ciudad_query:
        "/api/borbotones/filstros/usuarios/ciudad?ciudad={NombreCiudad}",
      filtro_ciudad_param:
        "/api/borbotones/filstros/usuarios/ciudad/{NombreCiudad}",
      filtro_ciudad_id:
        "/api/borbotones/filstros/usuarios/ciudad?id_ciudad={ID}",

      // 🔹 Filtros por PROVINCIAS (nuevo)
      filtro_provincias_por_ciudad_nombre:
        "/api/borbotones/filstros/ciudad/provincias?ciudad={NombreCiudad}",
      filtro_provincias_por_ciudad_id:
        "/api/borbotones/filstros/ciudad/provincias?id_ciudad={ID}",

      // 🔹 Filtros por ESPECIALIDAD
      filtro_especialidad_query:
        "/api/borbotones/filstros/usuarios/especialidad?especialidad={NombreEspecialidad}",
      filtro_especialidad_id:
        "/api/borbotones/filstros/usuarios/especialidad?especialidad_id={ID}",
      filtro_especialidad_param:
        "/api/borbotones/filstros/usuarios/especialidad/{NombreEspecialidad}",

      // 🔹 Filtro por DISPONIBILIDAD de servicios
      filtro_disponible_true:
        "/api/borbotones/filstros/usuarios/disponible?disponible=true",
      filtro_disponible_false:
        "/api/borbotones/filstros/usuarios/disponible?disponible=false",
      filtro_disponible_con_servicio:
        "/api/borbotones/filstros/usuarios/disponible?disponible=true&servicio_id={ID}",
    },
  });
});

// 🔧 Montar subrutas del módulo
router.use("/filstros", filtrosRouter);

export default router;
