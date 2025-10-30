import { Router } from "express";
import {  /*crearProveedorController, */ obtenerProveedoresController,  obtenerProveedorPorIdController} from "../controllers/proveedor.controller";

const router = Router();

//router.post("/", crearProveedorController);
router.get("/", obtenerProveedoresController);
router.get("/:id", obtenerProveedorPorIdController);

export default router;
