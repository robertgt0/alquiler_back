import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// 🔹 MÓDULOS
import nombreGrupoEjemploRouter from "./modules/nombre_grupo_ejemplo";
import fixerModule from "./modules/fixer";          // carpeta 'fixer'
import categoriesModule from "./modules/categories"; // módulo categories

// ✅ Cargar .env (si en el futuro lo usas)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz (útil para ver qué módulos están montados)
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "API Backend",
    status: "OK",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    modules: [
      "/api/nombre_grupo_ejemplo",
      "/api/fixer",        // 👈 consistente con app.use
      "/api/categories",   // 👈 agrégalo aquí también
    ],
  });
});

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "healthy",
    database: "disabled", // sin DB por ahora
    uptime: process.uptime(),
  });
});

// ============================================
// MONTAR MÓDULOS/GRUPOS AQUÍ
// ============================================
app.use("/api/nombre_grupo_ejemplo", nombreGrupoEjemploRouter);
app.use("/api/fixer", fixerModule);          // 👈 base path correcto
app.use("/api/categories", categoriesModule); // 👈 categories montado

// ============================================
// Manejo de errores 404 (siempre al final)
// ============================================
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
    path: req.path,
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n Servidor corriendo en puerto ${PORT}`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(` Módulos: /api/nombre_grupo_ejemplo, /api/fixer, /api/categories`); // 👈 actualiza el log
  console.log(` 🔌 Base de datos: DESACTIVADA (modo sin DB)`);
});
