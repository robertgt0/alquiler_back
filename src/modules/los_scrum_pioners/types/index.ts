// DTOs para requests del frontend

export interface CreateFixerDTO {
  userId: string;
  ci: string;
  ubicacionTrabajo: {
    lat: number;
    lng: number;
    direccion?: string;
  };
  servicios: string[];
  metodoPago: {
    efectivo: boolean;
    qr: boolean;
    tarjeta: boolean;
  };
  cuentaBancaria?: {
    numeroCuenta: string;
    nombreTitular: string;
  };
  terminosAceptados: boolean;
}

export interface CreateOfertaDTO {
  fixerId: string;
  descripcion: string;
  categorias: string[];
  imagenes?: string[];
}

export interface UpdateOfertaDTO {
  descripcion?: string;
  categorias?: string[];
  imagenes?: string[];
  activa?: boolean;
}

// Respuestas estandarizadas
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}