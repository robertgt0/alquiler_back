import { Router } from "express";
import { registrarDeudaController } from "../controllers/cardController";

const router = Router();

router.post("/registrar-deuda", registrarDeudaController);

export default router;