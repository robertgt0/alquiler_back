import { Router } from "express";

  
import { usuariosPorCiudad } from "../controllers/filtros.controller";
import { usuariosPorEspecialidad,usuariosPorDisponibilidad} from '../controllers/filtros.controller';

import { provinciasPorCiudad } from "../controllers/filtros.controller";
const router = Router();

// Ciudad (ya lo tienes)
router.get("/usuarios/ciudad", usuariosPorCiudad);
router.get("/usuarios/ciudad/:ciudad", usuariosPorCiudad);

// Especialidad (nuevo)
router.get("/usuarios/especialidad", usuariosPorEspecialidad);       // ?especialidad=Climatización o ?especialidad_id=7
router.get("/usuarios/especialidad/:especialidad", usuariosPorEspecialidad); // /Climatización


router.get("/usuarios/disponible", usuariosPorDisponibilidad);

router.get("/ciudad/provincias", provinciasPorCiudad);        // ?ciudad=Vigo  o ?id_ciudad=14
router.get("/ciudad/provincias/:ciudad", provinciasPorCiudad); // /ciudad/provincias/Vigo
export default router;
