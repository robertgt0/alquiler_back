// Script para actualizar los servicios de Ana María Flores usando fetch en Node (UTF-8)
// Ejecutar: node scripts/fix_ana_services.js

const endpoint = 'http://localhost:5000/api/borbotones/users/68f9431ffda8e814d7eca37f';

const servicios = [
  {
    id_servicio: 1,
    nombre: "Reparación y Ajuste de Muebles",
    descripcion: "Servicio básico que incluye lijado, refuerzo de juntas, cambio de tornillos o bisagras, y retoque con barniz. Ideal para muebles que necesitan mantenimiento o ajustes menores.",
    precio: 293,
    disponible: true
  },
  {
    id_servicio: 2,
    nombre: "Fabricación de Estantes o Repisas Personalizadas",
    descripcion: "Diseño y construcción de repisas de madera a medida, con acabado barnizado o pintado. Perfecto para dormitorios, cocinas o salas modernas.",
    precio: 338,
    disponible: true
  },
  {
    id_servicio: 3,
    nombre: "Puertas y Marcos a Medida",
    descripcion: "Elaboración de puertas de madera maciza o MDF, con diseño personalizado y acabado profesional. Incluye instalación y barnizado.",
    precio: 575,
    disponible: true
  },
  {
    id_servicio: 4,
    nombre: "Muebles de Diseño (Mesas, Cómodas o Roperos)",
    descripcion: "Servicio premium que incluye diseño, construcción y acabado de muebles a medida según tus necesidades. Ideal para espacios que buscan elegancia y funcionalidad.",
    precio: 579,
    disponible: true
  }
];

async function run() {
  try {
    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ servicios })
    });

    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response body:', text);
  } catch (err) {
    console.error('Error al hacer PUT:', err);
  }
}

run();
