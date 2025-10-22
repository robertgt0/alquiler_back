import { Router } from "express";
import * as OfertasController from "../controllers/ofertas.controller";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

// POST: Crear oferta con imagen
router.post("/", upload.single("imagen"), OfertasController.crearOfertaConImagen);

// GET: Listar todas las ofertas
router.get("/", OfertasController.listarOfertas);

// DELETE: Borrar oferta por ID
router.delete("/:id", OfertasController.borrarOferta);

// PUT: Editar oferta por ID (con o sin nueva imagen)
router.put("/:id", upload.single("imagen"), OfertasController.editarOferta);

export default router;
