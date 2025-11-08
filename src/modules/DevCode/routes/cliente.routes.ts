import { Router } from "express";
import { ClienteController } from "../controllers/cliente.controller";

const router = Router();

router.post("/", ClienteController.crear);
router.get("/", ClienteController.listar);
router.get("/:id", ClienteController.obtener);
router.put("/:id", ClienteController.actualizar);
router.delete("/:id", ClienteController.eliminar);

export default router;
