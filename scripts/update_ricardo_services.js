// Script para actualizar los servicios de Ricardo Mendoza
const endpoint = 'http://localhost:5000/api/borbotones/users/68f9431ffda8e814d7eca3d9';

const servicios = [
  {
    id_servicio: 1,
    nombre: "Decoración básica de evento pequeño",
    descripcion: "Incluye mantel, centro de mesa y algunos globos.",
    precio: 74,
    disponible: true
  },
  {
    id_servicio: 2,
    nombre: "Decoración temática (cumpleaños, baby shower, etc.)",
    descripcion: "Incluye fondo decorativo, guirnaldas y carteles personalizados.",
    precio: 178,
    disponible: true
  },
  {
    id_servicio: 3,
    nombre: "Decoración con flores y luces LED",
    descripcion: "Ideal para bodas, quinceañeros o aniversarios.",
    precio: 691,
    disponible: true
  },
  {
    id_servicio: 4,
    nombre: "Decoración completa premium",
    descripcion: "Incluye todo: fondo temático, iluminación, mesa decorada, flores y cartel personalizado.",
    precio: 707,
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

    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error al hacer PUT:', err);
  }
}

run();