import { Router } from "express";
import * as clienteController from "../controllers/cliente.controller";

const router = Router();

// CRUD Clientes
router.post("/", clienteController.createCliente);
router.get("/", clienteController.getClientes);
router.get("/:id", clienteController.getClienteById);
router.put("/:id", clienteController.updateCliente);
router.delete("/:id", clienteController.deleteCliente);

export default router;
