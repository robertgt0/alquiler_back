import { Router } from "express";
import { userController } from "../controllers/user.controller";

const router = Router();

// CRUD básico
router.get("/", userController.getAll.bind(userController));
router.get("/:id", userController.getById.bind(userController));
router.post("/", userController.create.bind(userController));
router.put("/:id", userController.update.bind(userController));
router.delete("/:id", userController.delete.bind(userController));
router.get("/correo/:correo", userController.findByCorreo.bind(userController));

export default router;
