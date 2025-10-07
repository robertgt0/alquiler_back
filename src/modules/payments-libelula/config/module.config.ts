// Configuración específica de este módulo

export const moduleConfig = {
  moduleName: 'nombre_grupo_ejemplo',
  version: '1.0.0',
  prefix: '/api/nombre_grupo_ejemplo',
  features: {
    ejemplo: true,
    // Agrega más features aquí
  },
  limits: {
    maxItemsPerPage: 50,
  },
};

export default moduleConfig;