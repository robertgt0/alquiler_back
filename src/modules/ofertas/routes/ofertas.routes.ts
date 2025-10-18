import { Router } from "express";
import * as OfertasController from "../controllers/ofertas.controller";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

// POST con imagen
router.post("/", upload.single("imagen"), OfertasController.crearOfertaConImagen);

// GET todas las ofertas
router.get("/", OfertasController.listarOfertas);

export default router;
