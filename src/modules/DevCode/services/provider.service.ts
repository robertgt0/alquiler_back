import connectDB from "@/config/database";
import provider from "../models/provider";

const providers = [
  {
    usuarioId: "641f3a58e2a6a11f9c2b4f9b",
    servicios: ["doctor"],
    descripcion: "Médico general con 15 años de experiencia.",
    ubicacion: { lat: -16.51, lng: -68.16 },
    horario: [
      { dia: "lunes", inicio: "09:00", fin: "17:00", ocupado: [] },
      { dia: "martes", inicio: "09:00", fin: "17:00", ocupado: [] },
    ],
    rating: 4.9,
    trabajosCompletados: 10,
  },
];

export const seed = async () => {
  await connectDB();
  await provider.deleteMany(); // opcional: limpia la colección
  await provider.insertMany(providers);
  
  process.exit();
  
};
