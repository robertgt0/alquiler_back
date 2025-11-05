function validarCorreoElectronico(correo) {
    if (typeof correo !== "string") return false;
    const correoLimpio = correo.trim();
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexCorreo.test(correoLimpio);
  }
  
  const correos = [
    "usuario@gmail.com",
    " ejemplo@correo.org ",
    "usuario@@gmail.com",
    "sin@punto",
    "invalido.com",
    "",
    "correo@empresa.edu.bo"
  ];
  
  for (const correo of correos) {
    const resultado = validarCorreoElectronico(correo);
    console.log(`"${correo}" → ${resultado ? "VÁLIDO ✅" : "INVÁLIDO ❌"}`);
  }
  