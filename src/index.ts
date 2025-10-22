import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import connectDB from "./config/database";

import nombreGrupoEjemploRouter from "./modules/nombre_grupo_ejemplo";
import fixerModule from "./modules/fixer";
import categoriesModule from "./modules/categories";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 👇 conecta Mongo SOLO si DB_ENABLED=true
if (process.env.DB_ENABLED === "true") {
  connectDB();
} else {
  console.log("🔌 Base de datos: DESACTIVADA (modo sin DB)");
}

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "API Backend",
    status: "OK",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    modules: ["/api/nombre_grupo_ejemplo", "/api/fixer", "/api/categories"],
  });
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "healthy",
    database:
      process.env.DB_ENABLED === "true" ? "connected?" : "disabled",
    uptime: process.uptime(),
  });
});

app.use("/api/nombre_grupo_ejemplo", nombreGrupoEjemploRouter);
app.use("/api/fixer", fixerModule);
app.use("/api/categories", categoriesModule);

app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Ruta no encontrada", path: req.path });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n Servidor corriendo en puerto ${PORT}`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(` Módulos: /api/nombre_grupo_ejemplo, /api/fixer, /api/categories`);
});

