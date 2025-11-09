import { Router } from "express";
import * as calendarioController from "../controllers/calendarioController.controller";

const router = Router();

router.post("/", calendarioController.createCalendario);
router.get("/", calendarioController.getCalendarios);
router.get("/:id", calendarioController.getCalendarioById);
router.put("/:id", calendarioController.updateCalendario);
router.delete("/:id", calendarioController.deleteCalendario);

export default router;
