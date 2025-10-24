import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import nombreGrupoEjemploRouter from './modules/nombre_grupo_ejemplo';
import availabilityRoutes from "./modules/DevCode/routes/availability.routes";
// Cargar variables de entorno
dotenv.config();

import connectDB from "./config/database";

import nombreGrupoEjemploRouter from "./modules/nombre_grupo_ejemplo";
import fixerModule from "./modules/fixer";
import categoriesModule from "./modules/categories";

const app = express();

// CORS: desde variable ALLOWED_ORIGINS (coma separada)
app.use(
  cors({
    origin: (process.env.ALLOWED_ORIGINS || "*").split(","),
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔌 Conecta Mongo SOLO si DB_ENABLED=true y existe MONGODB_URI
if (process.env.DB_ENABLED === "true") {
  if (!process.env.MONGODB_URI) {
    console.warn("⚠️ DB_ENABLED=true pero falta MONGODB_URI. No se conectará a Mongo.");
  } else {
    connectDB().catch((err) => {
      console.error("❌ Error conectando a Mongo:", err);
      process.exit(1); // opcional: tumbar si falla la DB en producción
    });
  }
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
    database: process.env.DB_ENABLED === "true" ? "enabled" : "disabled",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// MONTAR MÓDULOS/GRUPOS AQUÍ
// ============================================
// Montar tus módulos aquí:
app.use('/api/nombre_grupo_ejemplo', nombreGrupoEjemploRouter);
app.use('/api/devcode', availabilityRoutes)
// ============================================
// Manejo de errores 404
// ============================================
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Ruta no encontrada", path: req.path });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\nServidor corriendo en puerto ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`Módulos: /api/nombre_grupo_ejemplo, /api/fixer, /api/categories`);
});
