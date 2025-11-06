import { Router } from "express";
import { getJobsWithFixers } from "../controllers/jobsWithFixers.controller";

const router = Router();

// HU02
router.get("/jobs-with-fixers", getJobsWithFixers);

export default router;
