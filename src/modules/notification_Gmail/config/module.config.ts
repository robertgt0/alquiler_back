// src/modules/notification_Gmail/config/module.config.ts

/**
 * Configuración del módulo Notification_Gmail
 * Define metadatos, rutas base y límites generales
 */
export const moduleConfig = {
  moduleName: "notification_Gmail",
  version: "1.0.0",
  prefix: "/api/notifications/gmail",
  features: {
    emailSending: true,       // habilita envío de notificaciones por correo
    validation: true,         // mantiene validaciones internas
    logging: true,            // mantiene registro de logs locales
  },
  limits: {
    maxItemsPerPage: 50,
  },
};

export default moduleConfig;
