const dns = require('dns');

/**
 * Valida un correo electrónico.
 * @param {string} correo - Correo a validar.
 * @returns {Promise<boolean>} true si el formato y el dominio son válidos.
 */
async function validarCorreoElectronico(correo) {
  if (typeof correo !== 'string') return false;

  // Patrón básico para verificar formato local@dominio.ext
  const patronCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!patronCorreo.test(correo)) return false;

  // Verificar que la parte del dominio tenga al menos un punto válido
  const partes = correo.split('@');
  const dominio = partes[1];
  const dominioValido = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(dominio);
  if (!dominioValido) return false;

  // Verificación de registros MX del dominio (si existe correo real)
  return new Promise((resolve) => {
    dns.resolveMx(dominio, (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

// Lista de correos de prueba
const correos = [
  'usuario@gmail.com',
  'nombre.apellido@empresa.org',
  'prueba@gmail.comdvjakabdbejsjsbdjkebd', // Mal
  'prueba@gmail.com.dvjakabdb.ejsj.sbdjkebd', // Mal
  'sin-arroba.com', // Mal
  'otro@dominio', // Mal
  'user@@dominio.com' // Mal
];

// Ejecutar prueba
(async () => {
  for (const correo of correos) {
    const valido = await validarCorreoElectronico(correo);
    console.log(`${correo} → ${valido}`);
  }
})();
