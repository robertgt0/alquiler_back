// src/modules/jobs/index.ts
import { Router } from "express";
import jobsRouter from "./routes/jobs.routes";

const router = Router();
router.use("/", jobsRouter);

export default router; 
