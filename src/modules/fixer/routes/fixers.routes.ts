import { Router, Request, Response } from "express";
import { createFixer, getFixer, updateIdentity, checkCI, updateLocation, updatePayments, acceptTerms, updateCategories, listByCategory, getFixerByUser } from "../controllers/fixers.controller";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({
    ok: true,
    module: "fixer",
    endpoints: [
      "GET /check-ci?ci=123456",
      "POST /",
      "GET /by-category",
      "PUT /:id/identity",
      "PUT /:id/location",
      "PUT /:id/categories",
      "PUT /:id/payments",
      "PUT /:id/terms",
      "GET /:id",
    ],
  });
});

// Handlers (ya asegurados como funciones)
router.get("/check-ci", checkCI);
router.post("/", createFixer);
router.get("/by-category", listByCategory);
router.get("/user/:userId", getFixerByUser);
router.put("/:id/identity", updateIdentity);
router.put("/:id/location", updateLocation);
router.put("/:id/categories", updateCategories);
router.put("/:id/payments", updatePayments);
router.put("/:id/terms", acceptTerms);
router.get("/:id", getFixer);

export default router;
