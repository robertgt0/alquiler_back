import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectMongo } from "./config/mongoose";
import offersRouter from "./routes/offers";
import fixerModule from "./modules/fixer";
import categoriesModule from "./modules/categories";

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const corsOrigins = [
  ...(process.env.ALLOWED_ORIGINS ?? "").split(","),
  ...(process.env.CORS_ORIGIN ?? "").split(","),
]
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins.length ? corsOrigins : true,
    credentials: true,
  })
);

app.get("/", (_req, res) => {
  res.json({
    message: "API Backend",
    status: "OK",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    modules: ["/api/offers", "/api/fixers", "/api/categories"],
  });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/health", (_req, res) => {
  const dbEnabled = (process.env.DB_ENABLED ?? "true").toLowerCase() !== "false";
  const hasUri = Boolean(process.env.MONGODB_URI ?? process.env.MONGO_URI);

  res.json({
    status: "healthy",
    database: dbEnabled ? (hasUri ? "enabled" : "missing-uri") : "disabled",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/offers", offersRouter);
app.use("/api/fixers", fixerModule);
app.use("/api/categories", categoriesModule);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Ruta no encontrada", path: req.path });
});

const PORT = Number(process.env.PORT ?? 4000);
const dbEnabled = (process.env.DB_ENABLED ?? "true").toLowerCase() !== "false";
const mongoUri = process.env.MONGODB_URI ?? process.env.MONGO_URI;

async function bootstrap() {
  if (dbEnabled && mongoUri) {
    try {
      await connectMongo();
    } catch (error) {
      console.error("Error al conectar con MongoDB", error);
      process.exit(1);
    }
  } else if (dbEnabled) {
    console.warn("DB_ENABLED=true pero falta MONGODB_URI. No se conectara a Mongo.");
  } else {
    console.log("Base de datos desactivada (modo sin DB)");
  }

  app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
    console.log("Endpoints disponibles: /api/offers, /api/fixers, /api/categories");
  });
}

bootstrap();
