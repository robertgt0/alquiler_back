import { Router, Request, Response } from "express";
import { createFixer, getFixer, updateIdentity, checkCI } from "../controllers/fixers.controller";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({
    ok: true,
    module: "fixer",
    endpoints: [
      "GET /check-ci?ci=123456",
      "POST /",
      "PUT /:id/identity",
      "GET /:id",
    ],
  });
});

// Handlers (ya asegurados como funciones)
router.get("/check-ci", checkCI);
router.post("/", createFixer);
router.put("/:id/identity", updateIdentity);
router.get("/:id", getFixer);

export default router;
