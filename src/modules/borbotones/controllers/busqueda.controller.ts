import { Request, Response } from 'express';
import { getDatabase } from '../config/conecction';
import { handleError } from '../errors/errorHandler';

export const searchAutocomplete = async (req: Request, res: Response) => {
  try {
    const { q: searchTerm, limit = 4 } = req.query;

    if (!searchTerm || typeof searchTerm !== 'string') {
      return res.json({ success: true, data: [] });
    }

    if (searchTerm.length > 80) {
      return res.status(400).json({
        success: false,
        message: 'La búsqueda no puede exceder 80 caracteres.',
      });
    }

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

    const validCharsRegex = /^[a-záéíóúñü\s´,\-]+$/i;
    if (!validCharsRegex.test(searchTerm)) {
      return res.status(400).json({
        success: false,
        message: 'Solo se permiten caracteres alfabéticos.',
      });
    }

    const onlySpecials = /^[´',\-\s]+$/;
    if (onlySpecials.test(searchTerm)) {
      return res.status(400).json({
        success: false,
        message: 'Búsqueda inexistente o caracteres no válidos.',
      });
    }

    if (trimmedSearch.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'La búsqueda debe tener al menos dos caracteres.',
      });
    }

    const db = await getDatabase();
    if (!db)
      return res.status(500).json({
        success: false,
        message: 'Error de conexión con la base de datos.',
      });

    const regex = new RegExp(trimmedSearch, 'i');


    const especialidades = db.collection('especialidades');
    const servicios = db.collection('servicios');
    const usuarios = db.collection('usuarios');
    const historial = db.collection('historial');


    const resultadosEspecialidades = await especialidades
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
              { nombre_normalizado: { $regex: regex } },
              { profesion_normalizada: { $regex: regex } },
              { 'servicios_normalizados.nombre_normalizado': { $regex: regex } },
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
        { $limit: parseInt(limit as string) },
      ])
      .toArray();


    const resultadosServicios = await servicios
      .aggregate([
        {
          $addFields: {
            nombre_normalizado: {
              $toLower: {
                $replaceAll: {
                  input: '$nombre',
                  find: 'ñ',
                  replacement: 'n',
                },
              },
            },
            descripcion_normalizada: {
              $toLower: {
                $replaceAll: {
                  input: '$descripcion',
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
              { nombre_normalizado: { $regex: regex } },
              { descripcion_normalizada: { $regex: regex } },
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
        { $limit: parseInt(limit as string) },
      ])
      .toArray();


    const resultadosUsuarios = await usuarios
      .aggregate([
        {
          $addFields: {
            nombre_normalizado: {
              $toLower: {
                $replaceAll: {
                  input: '$nombre',
                  find: 'ñ',
                  replacement: 'n',
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
              { nombre_normalizado: { $regex: regex } },
              { correo_normalizado: { $regex: regex } },
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
        { $limit: parseInt(limit as string) },
      ])
      .toArray();

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
        index === self.findIndex((t) => t.nombre === item.nombre)
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
