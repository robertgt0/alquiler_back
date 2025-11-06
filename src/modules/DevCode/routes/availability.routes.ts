import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.status(501).json({ success: false, message: "Ruta no implementada" });
});

export default router;

