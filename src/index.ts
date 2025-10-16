import express from "express";
import cors from "cors";
import ofertasModule from "./modules/ofertas/index";

const app = express();

app.use(cors()); // permite peticiones desde tu frontend
app.use(express.json());

app.use("/api", ofertasModule); // las ofertas estarán en /api/ofertas

app.listen(4000, () => {
  console.log("Servidor corriendo en http://localhost:4000");
});

