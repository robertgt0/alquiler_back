import { Router } from "express";
import { crearOferta, obtenerOfertas } from "./services/ofertas.service";

const router = Router();

router.post("/ofertas", async (req, res) => {
  try {
    const oferta = await crearOferta(req.body);
    res.status(201).json(oferta);
  } catch (err) {
    res.status(500).json({ message: "Error al crear la oferta", error: err });
  }
});

router.get("/ofertas", async (req, res) => {
  try {
    const ofertas = await obtenerOfertas();
    res.json(ofertas);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener las ofertas", error: err });
  }
});

export default router;


