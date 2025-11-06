import { Request, Response } from 'express';
import { getDatabase } from '../config/conecction';
import { handleError } from '../errors/errorHandler';

// Escapar caracteres especiales para RegExp
const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[]\]/g, '\$&');

export const searchAutocomplete = async (req: Request, res: Response) => {
try {
// Normalizar y tipar los parámetros
const rawQ = Array.isArray(req.query.q) ? req.query.q[0] : req.query.q;
const rawLimit = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
const searchTerm = typeof rawQ === 'string' ? rawQ.trim() : '';
let limit = parseInt(String(rawLimit || '4'), 10);
if (isNaN(limit) || limit < 1) limit = 4;
if (limit > 20) limit = 20;

// VALIDACIONES INICIALES
if (!searchTerm) {
  return res.status(400).json({
    success: false,
    message: 'Búsqueda inexistente o caracteres no válidos.',
  });
}

if (searchTerm.length > 80) {
  return res.status(400).json({
    success: false,
    message: 'La búsqueda no puede exceder 80 caracteres.',
  });
}

// Normalizar texto
const normalize = (str: string) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[“”‘’"']/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const trimmedSearch = normalize(searchTerm);

if (!trimmedSearch) {
  return res.status(400).json({
    success: false,
    message: 'Búsqueda inexistente o caracteres no válidos.',
  });
}

// Solo letras, tildes, ñ, espacios, comas y guiones
const validCharsRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s,\-]+$/;
if (!validCharsRegex.test(searchTerm)) {
  return res.status(400).json({
    success: false,
    message: 'Búsqueda inexistente o caracteres no válidos.',
  });
}

// Evita búsquedas de solo símbolos o espacios
const onlySpecials = /^[\s,\-]+$/;
if (onlySpecials.test(searchTerm)) {
  return res.status(400).json({
    success: false,
    message: 'Búsqueda inexistente o caracteres no válidos.',
  });
}

if (trimmedSearch.length < 1) {
  return res.status(400).json({
    success: false,
    message: 'La búsqueda debe tener al menos un carácter.',
  });
}

const db = await getDatabase();
if (!db)
  return res.status(500).json({
    success: false,
    message: 'Error de conexión con la base de datos.',
  });

// ✅ BÚSQUEDA PARCIAL FLEXIBLE
const regexStr = trimmedSearch
  .split(/\s+/)
  .map((word) => escapeRegex(word))
  .join('.*'); // Permite coincidencias intermedias
const safeRegex = new RegExp(regexStr, 'i');

const especialidades = db.collection('especialidades');
const servicios = db.collection('servicios');
const usuarios = db.collection('usuarios');
const historial = db.collection('historial');

// Consultas paralelas
const [resultadosEspecialidades, resultadosServicios, resultadosUsuarios] = await Promise.all([
  especialidades
    .aggregate([
      {
        $addFields: {
          nombre_normalizado: {
            $toLower: {
              $replaceAll: {
                input: {
                  $replaceAll: {
                    input: {
                      $replaceAll: {
                        input: {
                          $replaceAll: {
                            input: {
                              $replaceAll: {
                                input: {
                                  $replaceAll: {
                                    input: '$nombre',
                                    find: 'á',
                                    replacement: 'a',
                                  },
                                },
                                find: 'é',
                                replacement: 'e',
                              },
                            },
                            find: 'í',
                            replacement: 'i',
                          },
                        },
                        find: 'ó',
                        replacement: 'o',
                      },
                    },
                    find: 'ú',
                    replacement: 'u',
                  },
                },
                find: 'ñ',
                replacement: 'n',
              },
            },
          },
          profesion_normalizada: {
            $toLower: {
              $replaceAll: {
                input: {
                  $replaceAll: {
                    input: {
                      $replaceAll: {
                        input: {
                          $replaceAll: {
                            input: {
                              $replaceAll: {
                                input: {
                                  $replaceAll: {
                                    input: '$profesion',
                                    find: 'á',
                                    replacement: 'a',
                                  },
                                },
                                find: 'é',
                                replacement: 'e',
                              },
                            },
                            find: 'í',
                            replacement: 'i',
                          },
                        },
                        find: 'ó',
                        replacement: 'o',
                      },
                    },
                    find: 'ú',
                    replacement: 'u',
                  },
                },
                find: 'ñ',
                replacement: 'n',
              },
            },
          },
          servicios_normalizados: {
            $map: {
              input: '$servicios',
              as: 'serv',
              in: {
                nombre_normalizado: {
                  $toLower: {
                    $replaceAll: {
                      input: {
                        $replaceAll: {
                          input: {
                            $replaceAll: {
                              input: {
                                $replaceAll: {
                                  input: {
                                    $replaceAll: {
                                      input: {
                                        $replaceAll: {
                                          input: '$$serv.nombre',
                                          find: 'á',
                                          replacement: 'a',
                                        },
                                      },
                                      find: 'é',
                                      replacement: 'e',
                                    },
                                  },
                                  find: 'í',
                                  replacement: 'i',
                                },
                              },
                              find: 'ó',
                              replacement: 'o',
                            },
                          },
                          find: 'ú',
                          replacement: 'u',
                        },
                      },
                      find: 'ñ',
                      replacement: 'n',
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $match: {
          $or: [
            { nombre_normalizado: { $regex: safeRegex } },
            { profesion_normalizada: { $regex: safeRegex } },
            { 'servicios_normalizados.nombre_normalizado': { $regex: safeRegex } },
          ],
        },
      },
      {
        $project: {
          tipo: { $literal: 'especialidad' },
          id_especialidad: 1,
          nombre: 1,
          profesion: 1,
          servicios: { $slice: ['$servicios', 2] },
          _id: 0,
        },
      },
      { $limit: limit },
    ])
    .toArray(),
  servicios
    .aggregate([
      {
        $addFields: {
          nombre_normalizado: {
            $toLower: {
              $replaceAll: {
                input: {
                  $replaceAll: {
                    input: {
                      $replaceAll: {
                        input: {
                          $replaceAll: {
                            input: {
                              $replaceAll: {
                                input: '$nombre',
                                find: 'á',
                                replacement: 'a',
                              },
                            },
                            find: 'é',
                            replacement: 'e',
                          },
                        },
                        find: 'í',
                        replacement: 'i',
                      },
                    },
                    find: 'ó',
                    replacement: 'o',
                  },
                },
                find: 'ú',
                replacement: 'u',
              },
            },
          },
          descripcion_normalizada: {
            $toLower: {
              $replaceAll: {
                input: {
                  $replaceAll: {
                    input: {
                      $replaceAll: {
                        input: {
                          $replaceAll: {
                            input: {
                              $replaceAll: {
                                input: '$descripcion',
                                find: 'á',
                                replacement: 'a',
                              },
                            },
                            find: 'é',
                            replacement: 'e',
                          },
                        },
                        find: 'í',
                        replacement: 'i',
                      },
                    },
                    find: 'ó',
                    replacement: 'o',
                  },
                },
                find: 'ú',
                replacement: 'u',
              },
            },
          },
        },
      },
      {
        $match: {
          $or: [
            { nombre_normalizado: { $regex: safeRegex } },
            { descripcion_normalizada: { $regex: safeRegex } },
          ],
        },
      },
      {
        $project: {
          tipo: { $literal: 'servicio' },
          nombre: 1,
          descripcion: 1,
          _id: 0,
        },
      },
      { $limit: limit },
    ])
    .toArray(),
  usuarios
    .aggregate([
      {
        $addFields: {
          nombre_normalizado: {
            $toLower: {
              $replaceAll: {
                input: {
                  $replaceAll: {
                    input: {
                      $replaceAll: {
                        input: {
                          $replaceAll: {
                            input: {
                              $replaceAll: {
                                input: '$nombre',
                                find: 'á',
                                replacement: 'a',
                              },
                            },
                            find: 'é',
                            replacement: 'e',
                          },
                        },
                        find: 'í',
                        replacement: 'i',
                      },
                    },
                    find: 'ó',
                    replacement: 'o',
                  },
                },
                find: 'ú',
                replacement: 'u',
              },
            },
          },
          correo_normalizado: {
            $toLower: {
              $replaceAll: {
                input: '$correo',
                find: 'ñ',
                replacement: 'n',
              },
            },
          },
        },
      },
      {
        $match: {
          $or: [
            { nombre_normalizado: { $regex: safeRegex } },
            { correo_normalizado: { $regex: safeRegex } },
          ],
        },
      },
      {
        $project: {
          tipo: { $literal: 'usuario' },
          nombre: 1,
          correo: 1,
          _id: 0,
        },
      },
      { $limit: limit },
    ])
    .toArray(),
]);

const combinados = [
  ...resultadosEspecialidades,
  ...resultadosServicios,
  ...resultadosUsuarios,
];

if (combinados.length === 0) {
  return res.json({
    success: true,
    data: [],
    message: `No se han encontrado resultados para "${searchTerm}"`,
  });
}

const resultadosUnicos = combinados.filter(
  (item, index, self) =>
    index === self.findIndex((t) => t.nombre === item.nombre && t.tipo === item.tipo)
);

await historial.updateOne(
  { termino: trimmedSearch },
  {
    $set: {
      termino: trimmedSearch,
      terminoOriginal: searchTerm,
      fecha: new Date(),
    },
  },
  { upsert: true }
);

return res.json({
  success: true,
  data: resultadosUnicos,
  searchTerm,
  count: resultadosUnicos.length,
});


} catch (error) {
handleError(error, res);
}
};