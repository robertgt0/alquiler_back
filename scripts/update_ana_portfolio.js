// Script para actualizar el portafolio de Ana María Flores
const endpoint = 'http://localhost:5000/api/borbotones/users/68f9431ffda8e814d7eca37f';

const portfolio = [
  {
    id: 1,
    titulo: "Restauración de Silla Clásica",
    descripcion: "Trabajo detallado de restauración completa, incluyendo lijado, refuerzo de estructura y acabado barnizado.",
    imagen: "/images/portfolio/carpinteria/restauracion-silla.jpg"
  },
  {
    id: 2,
    titulo: "Mueble Modular en Proceso",
    descripcion: "Construcción de mueble modular personalizado mostrando la calidad del trabajo interno y estructural.",
    imagen: "/images/portfolio/carpinteria/mueble-modular.jpg"
  },
  {
    id: 3,
    titulo: "Mesa de Comedor de Madera Maciza",
    descripcion: "Fabricación de mesa robusta en madera noble con acabado premium y barniz protector.",
    imagen: "/images/portfolio/carpinteria/mesa-comedor.jpg"
  },
  {
    id: 4,
    titulo: "Set de Sillas de Madera",
    descripcion: "Conjunto de sillas a medida con diseño elegante y acabado en barniz brillante.",
    imagen: "/images/portfolio/carpinteria/set-sillas.jpg"
  }
];

async function run() {
  try {
    // Realizamos el PUT enviando solo el portfolio
    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ portfolio })
    });

    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error al actualizar el portfolio:', err);
  }
}

run();