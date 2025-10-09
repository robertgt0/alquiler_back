import { Router } from "express";
import { postProvider } from "../controllers/provider.controller";

const router = Router();

router.post("/", postProvider);

export default router;