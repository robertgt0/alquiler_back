// Funciones auxiliares específicas de este módulo

export const formatName = (name: string): string => {
  return name.trim().toLowerCase();
};

export const generateCode = (prefix: string = 'EJ'): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
};

// Agrega más funciones de utilidad según necesites