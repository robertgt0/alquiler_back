import { Router } from "express";
import routes from "./routes/fixers.routes"; // en plural, como tu archivo


const router = Router();
router.use("/", routes);
export default router;
