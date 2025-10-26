require('dotenv').config();
const mongoose = require('mongoose');

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/alquiler';

async function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Conectado.');

    const coll = mongoose.connection.collection('usuarios');
    const cursor = coll.find({});

    let updated = 0;
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      const serviciosActuales = Array.isArray(doc.servicios) ? doc.servicios : [];

      // Comprobar si ya tiene 4 servicios con precio
      const tienePrecios = serviciosActuales.length >= 4 && serviciosActuales.every(s => s && (s.precio !== undefined || s.precio_personalizado !== undefined));
      if (tienePrecios) continue;

      // Plantillas de servicios y rangos de precio por especialidad (Bs)
      const templates = {
        'Plomería': {
          servicios: ['Instalación de tuberías', 'Reparación de fuga', 'Desatranco', 'Instalación de artefactos sanitarios'],
          range: [80, 700],
          keywords: ['plomer', 'plomero', 'plomería']
        },
        'Electricista': {
          servicios: ['Instalación eléctrica', 'Reparación de cortocircuito', 'Cambio de tablero', 'Instalación de luminarias'],
          range: [100, 900],
          keywords: ['electr', 'electric', 'electricista']
        },
        'Carpintería': {
          servicios: ['Muebles a medida', 'Reparación de puertas', 'Instalación de closets', 'Barnizado y acabado'],
          range: [120, 1200],
          keywords: ['carpin', 'madera', 'carpinter']
        },
        'Pintura': {
          servicios: ['Pintura interior', 'Pintura exterior', 'Ajuste y enmasillado', 'Pintura decorativa'],
          range: [80, 700],
          keywords: ['pint', 'pintor', 'pintura']
        },
        'Albañilería': {
          servicios: ['Construcción de muros', 'Revoque', 'Colocación de pisos', 'Pequeñas obras'],
          range: [150, 1500],
          keywords: ['alba', 'albañil', 'albañiler']
        },
        'Decoración': {
          servicios: ['Diseño de interiores', 'Montaje de espacios', 'Decoración de eventos', 'Asesoría de color'],
          range: [200, 1200],
          keywords: ['decor', 'decoración', 'decorador']
        },
        'Jardinería': {
          servicios: ['Corte de césped', 'Diseño de jardines', 'Poda de árboles', 'Mantenimiento anual'],
          range: [60, 600],
          keywords: ['jardin', 'jardiner', 'paisaj']
        },
        'Limpieza': {
          servicios: ['Limpieza general', 'Limpieza profunda', 'Lavado de alfombras', 'Limpieza de obra'],
          range: [50, 500],
          keywords: ['limp', 'limpieza', 'aseo']
        },
        'Reparación de electrodomésticos': {
          servicios: ['Reparación de lavadora', 'Reparación de nevera', 'Reparación de cocina', 'Servicio técnico general'],
          range: [100, 900],
          keywords: ['electro', 'electrodomést', 'electrodomesticos', 'electrodomésticos']
        },
        'Mecánica': {
          servicios: ['Cambio de aceite', 'Alineación', 'Reparación de frenos', 'Diagnóstico motor'],
          range: [120, 1000],
          keywords: ['mec', 'mecánica', 'mecan']
        },
        'Peluquería': {
          servicios: ['Corte de cabello', 'Peinados', 'Coloración', 'Tratamientos capilares'],
          range: [50, 400],
          keywords: ['peluqu', 'peluquer', 'peluquería', 'estética']
        },
        'Fotografía': {
          servicios: ['Sesión fotográfica', 'Cobertura de eventos', 'Retoque fotográfico', 'Fotografía de producto'],
          range: [150, 1500],
          keywords: ['foto', 'fotógrafo', 'fotografia']
        },
        'Mudanzas': {
          servicios: ['Mudanza local', 'Embalaje y desembalaje', 'Transporte de muebles', 'Mudanza nacional'],
          range: [200, 2000],
          keywords: ['mudanz', 'mudanza', 'transporte']
        },
        'Aire acondicionado': {
          servicios: ['Instalación de split', 'Mantenimiento y limpieza', 'Carga de gas', 'Reparación de compresor'],
          range: [150, 1200],
          keywords: ['aire', 'ac', 'aire acondicionado']
        },
        'Cerrajería': {
          servicios: ['Cambio de cerradura', 'Apertura de puertas', 'Copia de llaves', 'Instalación de cierres de seguridad'],
          range: [80, 600],
          keywords: ['cerraj', 'cerrajería', 'cerradura']
        },
        'Soldadura': {
          servicios: ['Soldadura estructural', 'Reparación de rejas', 'Fabricación metálica', 'Soldadura de aluminio'],
          range: [120, 900],
          keywords: ['soldad', 'soldadura', 'soldador']
        }
      };

      // Obtener especialidad principal si existe
      const especialidades = Array.isArray(doc.especialidades) && doc.especialidades.length > 0
        ? doc.especialidades.map(e => (typeof e === 'string' ? e : e.nombre)).filter(Boolean)
        : [];

      const primarySpec = especialidades.length > 0 ? especialidades[0] : null;

      let chosenTemplate = null;
      if (primarySpec) {
        const primaryLower = primarySpec.toLowerCase();
        // Buscar coincidencia por keywords en las plantillas
        for (const key of Object.keys(templates)) {
          const tpl = templates[key];
          if (tpl.keywords && tpl.keywords.some(kw => primaryLower.includes(kw))) {
            chosenTemplate = tpl;
            break;
          }
        }
      }

      // Si aún no hay plantilla, intentar buscar por cualquier palabra clave dentro de todas las especialidades
      if (!chosenTemplate && especialidades.length > 0) {
        const joined = especialidades.join(' ').toLowerCase();
        for (const key of Object.keys(templates)) {
          const tpl = templates[key];
          if (tpl.keywords && tpl.keywords.some(kw => joined.includes(kw))) {
            chosenTemplate = tpl;
            break;
          }
        }
      }

      // Si no hay plantilla, usar genérica
      if (!chosenTemplate) {
        chosenTemplate = {
          servicios: ['Servicio general 1', 'Servicio general 2', 'Servicio general 3', 'Servicio general 4'],
          range: [50, 800]
        };
      }

      const nuevosServicios = [];
      for (let i = 0; i < 4; i++) {
        const nombreBase = chosenTemplate.servicios[i] || `${doc.nombre || 'Servicio'} - ${i+1}`;
        const precio = await randomInt(chosenTemplate.range[0], chosenTemplate.range[1]);
        nuevosServicios.push({ id_servicio: Date.now() + i + Math.floor(Math.random()*1000), nombre: nombreBase, precio });
      }

      await coll.updateOne({ _id: doc._id }, { $set: { servicios: nuevosServicios } });
      updated++;
    }

    console.log(`Actualización completada. Documentos modificados: ${updated}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error en script:', err);
    process.exit(1);
  }
}

main();
