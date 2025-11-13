/**
 * Datos para el seeder de categorías.
 * Extraído de los datos estáticos del frontend.
 *
 * El modelo de Mongoose (Category.model.ts) espera:
 * - name: string (mapeado desde 'titulo')
 * - description: string (mapeado desde 'descripcion')
 * - iconUrl: string (mapeado desde 'icono', guardamos el emoji como string)
 */
export const categoriesData = [
  { name: "Plomería",             description: "Reparaciones e instalaciones",       iconUrl: "🪠" },
  { name: "Electricidad",         description: "Instalaciones eléctricas",          iconUrl: "⚡" },
  { name: "Carpintería",          description: "Muebles y estructuras",           iconUrl: "🪵" },
  { name: "Pintura",              description: "Interior y exterior",                iconUrl: "🎨" },
  { name: "Limpieza",             description: "Doméstica y comercial",            iconUrl: "🧹" },
  { name: "Jardinería",           description: "Mantenimiento de jardines",        iconUrl: "🌿" },
  { name: "Construcción",         description: "Obras y remodelación",             iconUrl: "🏗️" },
  { name: "Aire acondicionado",   description: "Instalación y mantenimiento",      iconUrl: "❄️" },
  { name: "Cerrajería",           description: "Candados y llaves",                iconUrl: "🔒" },
  { name: "Albañilería",          description: "Construcción de muros",            iconUrl: "🧱" },
  { name: "Tapicería",            description: "Reparación de muebles",            iconUrl: "🪑" },
  { name: "Soldadura",            description: "Trabajo en metal",                 iconUrl: "⚙️" },
  { name: "Vidriería",            description: "Instalación de vidrios",           iconUrl: "🪟" },
  { name: "Mecánica",             description: "Reparación de vehículos",          iconUrl: "🚗" },
  { name: "Informática",          description: "Soporte técnico",                  iconUrl: "🖥️" },
  { name: "Fotografía",           description: "Eventos y retratos",               iconUrl: "📷" },
  { name: "Banquetes",            description: "Comidas y bebidas",                iconUrl: "🍽️" },
  { name: "Mudanza",              description: "Transporte y mudanzas",            iconUrl: "🚚" },
  { name: "Costura",              description: "Confección y arreglos",            iconUrl: "🧵" },
  { name: "Peluquería",           description: "Corte y peinado",                  iconUrl: "💇" },
  { name: "Domótica",             description: "Automatización del hogar",         iconUrl: "🏠" },
  { name: "Pisos y Cerámica",     description: "Colocación y reparación",          iconUrl: "🧩" },
  { name: "Toldos y Persianas",   description: "Instalación y mantenimiento",      iconUrl: " curtains" }, // Emoji original estaba vacío
  { name: "Calefacción",          description: "Instalación y revisión",           iconUrl: "🔥" },
  { name: "Impermeabilización",   description: "Sellado y protección",             iconUrl: "💧" },
  { name: "Metalistería",         description: "Estructuras y acabados metálicos", iconUrl: "🛠️" },
  { name: "Yesería",              description: "Cielos falsos y enlucidos",        iconUrl: "🧰" },
  { name: "Interiores",           description: "Diseño y ambientación",            iconUrl: "🛋️" },
  { name: "Paisajismo",           description: "Diseño de áreas verdes",           iconUrl: "🌳" },
  { name: "Fumigación",           description: "Control de plagas",                iconUrl: "🐜" },
  { name: "Lavandería",           description: "Lavado y planchado",               iconUrl: "🧺" },
  { name: "Cuidado de Mascotas",  description: "Paseo y atención",                 iconUrl: "🐾" },
  { name: "Niñera",               description: "Cuidado infantil",                 iconUrl: "🧒" },
  { name: "Electrodomésticos",    description: "Reparación a domicilio",           iconUrl: "🔧" },
  { name: "Telefonía y Redes",    description: "Cableado y configuración",         iconUrl: "📡" },
  { name: "Impresión y Copiado",  description: "Servicios de impresión",           iconUrl: "🖨️" },
];