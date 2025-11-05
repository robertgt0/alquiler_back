import { Router, Request, Response } from "express";
import { 
  createFixer, 
  getFixer, 
  updateIdentity, 
  checkCI, 
  updateLocation, 
  updatePayments, 
  acceptTerms, 
  updateCategories,
  updateFixerJobs,    // ⬇️ NUEVO
  addFixerJob,        // ⬇️ NUEVO
  getFixerJobDescription  // ⬇️ NUEVO
} from "../controllers/fixers.controller";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({
    ok: true,
    module: "fixer",
    endpoints: [
      "GET /check-ci?ci=123456",
      "POST /",
      "PUT /:id/identity",
      "PUT /:id/location",
      "PUT /:id/categories",
      "PUT /:id/payments",
      "PUT /:id/terms",
      "GET /:id",
      "PUT /:id/jobs",           // ⬇️ NUEVO
      "POST /:id/jobs",          // ⬇️ NUEVO
      "GET /:id/jobs/:jobId",    // ⬇️ NUEVO
    ],
  });
});

// Rutas existentes
router.get("/check-ci", checkCI);
router.post("/", createFixer);
router.put("/:id/identity", updateIdentity);
router.put("/:id/location", updateLocation);
router.put("/:id/categories", updateCategories);
router.put("/:id/payments", updatePayments);
router.put("/:id/terms", acceptTerms);
router.get("/:id", getFixer);

// ⬇️⬇️⬇️ NUEVAS RUTAS PARA FIXERJOBS ⬇️⬇️⬇️
router.put("/:id/jobs", updateFixerJobs);           // Actualizar todos los trabajos
router.post("/:id/jobs", addFixerJob);              // Agregar/actualizar un trabajo
router.get("/:id/jobs/:jobId", getFixerJobDescription);  // Obtener descripción

export default router;