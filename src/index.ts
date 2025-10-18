import express from "express";
import cors from "cors";
import ofertasModule from "./modules/ofertas/routes/ofertas.routes";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para parsear urlencoded, aunque multer maneje FormData

// Rutas
app.use("/api/ofertas", ofertasModule);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
