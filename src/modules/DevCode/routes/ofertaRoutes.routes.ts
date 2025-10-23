import { Router } from "express";
import * as ofertaController from "../controllers/ofertaController.controller";

const router = Router();

router.post("/", ofertaController.createOferta);
router.get("/", ofertaController.getOfertas);
router.get("/:id", ofertaController.getOfertaById);
router.put("/:id", ofertaController.updateOferta);
router.delete("/:id", ofertaController.deleteOferta);

export default router;
