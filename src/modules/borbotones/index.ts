/*import { Router } from "express";
//import filtrosRouter from "./routes/filtros.routes";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    message: "📦 Módulo Los Borbotones",
    version: "1.0.0",
    description: "Endpoints para búsquedas y filtros de usuarios",
    endpoints: {
      // 🔹 Ciudades
      ciudades_listado: "/api/borbotones/filtros/ciudades",
      ciudades_busqueda:
        "/api/borbotones/filtros/ciudades?q={texto}&limit=50&page=1",

      // 🔹 Especialidades
      especialidades_listado: "/api/borbotones/filtros/especialidades",
      usuarios_por_especialidad_nombre:
        "/api/borbotones/filtros/usuarios/especialidad?especialidad={Nombre}",
      usuarios_por_especialidad_id:
        "/api/borbotones/filtros/usuarios/especialidad?especialidad_id={ID}",

      // 🔹 Usuarios por ciudad
      filtro_ciudad_query:
        "/api/borbotones/filtros/usuarios/ciudad?ciudad={NombreCiudad}",
      filtro_ciudad_param:
        "/api/borbotones/filtros/usuarios/ciudad/{NombreCiudad}",
      filtro_ciudad_id:
        "/api/borbotones/filtros/usuarios/ciudad?id_ciudad={ID}",

      // 🔹 Provincias por ciudad
      filtro_provincias_por_ciudad_nombre:
        "/api/borbotones/filtros/ciudad/provincias?ciudad={NombreCiudad}",
      filtro_provincias_por_ciudad_id:
        "/api/borbotones/filtros/ciudad/provincias?id_ciudad={ID}",

      // 🔹 Disponibilidad de servicios
      filtro_disponible_true:
        "/api/borbotones/filtros/usuarios/disponible?disponible=true",
      filtro_disponible_false:
        "/api/borbotones/filtros/usuarios/disponible?disponible=false",
      filtro_disponible_con_servicio:
        "/api/borbotones/filtros/usuarios/disponible?disponible=true&servicio_id={ID}",

      // 🔹 NUEVO: Usuarios por nombre de servicio
      usuarios_por_servicio_nombre:
        "/api/borbotones/filtros/usuarios/servicio?servicio={NombreServicio}",
      usuarios_por_servicio_nombre_disponible:
        "/api/borbotones/filtros/usuarios/servicio?servicio={NombreServicio}&disponible=true",
      usuarios_por_servicio_nombre_ciudad:
        "/api/borbotones/filtros/usuarios/servicio?servicio={NombreServicio}&ciudad={NombreCiudad}",
      usuarios_por_servicio_nombre_id_ciudad:
        "/api/borbotones/filtros/usuarios/servicio?servicio={NombreServicio}&id_ciudad={ID}",
      usuarios_por_servicio_paginado:
        "/api/borbotones/filtros/usuarios/servicio?servicio={NombreServicio}&page=1&limit=20",
    },
  });
});

// Monta las rutas del módulo de filtros
//router.use("/filtros", filtrosRouter);

export default router;*/
