import { Router } from "express";
import {  /*crearClienteController,*/ obtenerClientesController,  obtenerClientePorIdController} from "../controllers/cliente.controller";

const router = Router();

//router.post("/", crearClienteController);
router.get("/", obtenerClientesController);
router.get("/:id", obtenerClientePorIdController);

export default router;
