import { Router } from "express";
import * as OfertasController from "../controllers/ofertas.controller";

const router = Router();

router.post("/", OfertasController.crearOferta);
router.get("/", OfertasController.listarOfertas);

export default router;
