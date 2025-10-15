import { Router } from "express";
import { createAppointment } from "../controllers/appointments.controller";

const router = Router();

router.post("/", createAppointment);

export default router;