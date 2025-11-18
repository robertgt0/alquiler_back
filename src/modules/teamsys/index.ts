import { Router } from "express";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { Types } from "mongoose";
import { UserModel } from "../../models/User";

const router = Router();

function normalizeEmail(email?: string) {
  return (email ?? "").trim().toLowerCase();
}

function resolvePassword(body: any): string | undefined {
  return (
    body?.password ??
    body?.contraseña ??
    body?.contrase\u00f1a ??
    body?.["password"] ??
    body?.["contraseña"] ??
    body?.["contrase\u00f1a"]
  );
}

router.get("/exists", async (req, res) => {
  try {
    const email = normalizeEmail(String(req.query.email ?? ""));
    if (!email) return res.json({ exists: false });

    const existing = await UserModel.findOne({ correo: new RegExp(`^${email}$`, "i") }).lean();
    res.json({ exists: Boolean(existing) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || "Error al verificar correo" });
  }
});

router.post("/usuario", async (req, res) => {
  try {
    const payload = req.body ?? {};

    const nombre = String(payload.nombre ?? "").trim();
    const correo = normalizeEmail(payload.correo);
    const fotoPerfil = String(payload.fotoPerfil ?? "").trim();
    const terminos = Boolean(payload.terminosYCondiciones);
    const rol = payload.rol ? String(payload.rol) : "requester";
    const authProvider = payload.authProvider ? String(payload.authProvider) : "local";
    const password = resolvePassword(payload);
    const rawCi = String(
      payload.ci ??
        payload.CI ??
        payload.documento ??
        payload.numeroDocumento ??
        payload.documentId ??
        ""
    ).trim();
    const ci = rawCi || `auto-${new Types.ObjectId().toString()}`;

    if (!nombre || !correo || !fotoPerfil) {
      return res.status(400).json({
        success: false,
        message: "Nombre, correo y fotoPerfil son obligatorios",
      });
    }

    const duplicate = await UserModel.findOne({ correo: new RegExp(`^${correo}$`, "i") }).lean();
    if (duplicate) {
      return res.status(409).json({ success: false, message: "El correo ya se encuentra registrado" });
    }

    const coordinates = Array.isArray(payload?.ubicacion?.coordinates)
      ? payload.ubicacion.coordinates.map((v: any) => Number(v))
      : undefined;

    const user = await UserModel.create({
      nombre,
      apellido: payload.apellido ?? undefined,
      telefono: payload.telefono ?? undefined,
      correo,
      ci,
      fotoPerfil,
      ubicacion: coordinates && coordinates.length === 2
        ? { lat: coordinates[1], lng: coordinates[0] }
        : undefined,
      terminosYCondiciones: terminos,
      rol,
      authProvider,
      password,
      geo: payload.ubicacion ?? undefined,
    });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || "Error al registrar usuario" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const email =
      normalizeEmail(req.body?.correoElectronico) ||
      normalizeEmail(req.body?.correo) ||
      normalizeEmail(req.body?.email);
    const password = resolvePassword(req.body);

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Correo y contraseña son obligatorios" });
    }

    const user = await UserModel.findOne({ correo: new RegExp(`^${email}$`, "i") })
      .select("+password +contraseña +contrase\u00f1a")
      .lean<any>();

    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    const storedPassword: string | undefined =
      user.password ?? user.contraseña ?? user["contrase\u00f1a"];

    if (storedPassword && storedPassword !== password) {
      return res.status(401).json({ success: false, message: "Contraseña incorrecta" });
    }

    const secret: Secret = process.env.JWT_SECRET || "servineoapptest123";
    const signOptions: SignOptions = {
      expiresIn: process.env.JWT_EXPIRES_IN as "1h" | "2h" | "24h" | number || "1h"
    };

    const token = jwt.sign(
      {
        sub: String(user._id),
        rol: user.rol ?? "requester",
      },
      secret,
      signOptions
    );

    const { password: _pwd, contraseña: _c1, ["contrase\u00f1a"]: _c2, ...rest } = user;

    res.json({
      success: true,
      token,
      user: {
        id: rest._id,
        nombre: rest.nombre,
        apellido: rest.apellido,
        correo: rest.correo,
        telefono: rest.telefono,
        fotoPerfil: rest.fotoPerfil,
        rol: rest.rol,
        ubicacion: rest.ubicacion,
        terminosYCondiciones: rest.terminosYCondiciones,
        authProvider: rest.authProvider,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || "Error al iniciar sesión" });
  }
});

// ✅ NUEVA RUTA: GOOGLE CALLBACK - AGREGADA
router.post("/google/callback", async (req, res) => {
  try {
    const { code, authType, redirect_uri } = req.body;

    console.log('🔐 Google callback recibido:', { 
      code: code ? 'present' : 'missing', 
      authType,
      redirect_uri 
    });

    if (!code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Código de autorización requerido' 
      });
    }

    // ✅ SIMULACIÓN TEMPORAL - REEMPLAZAR CON LÓGICA REAL DE GOOGLE
    // Por ahora, simulamos un usuario de prueba
    
    const mockUser = {
      _id: 'mock-user-id-' + Date.now(),
      nombre: 'Usuario Google',
      correo: 'usuario.google@gmail.com',
      fotoPerfil: 'https://via.placeholder.com/150',
      rol: 'requester',
      authProvider: 'google'
    };

    // Simular diferentes escenarios basados en authType
    if (authType === 'login') {
      // Simular usuario no encontrado para testing
      // return res.status(400).json({ success: false, message: 'usuario no encontrado' });
    }

    if (authType === 'register') {
      // Simular usuario ya registrado para testing  
      // return res.status(400).json({ success: false, message: 'usuario ya registrado' });
    }

    // Generar token JWT
    const secret: Secret = process.env.JWT_SECRET || "servineoapptest123";
    const signOptions: SignOptions = {
      expiresIn: process.env.JWT_EXPIRES_IN as "1h" | "2h" | "24h" | number || "1h"
    };

    const token = jwt.sign(
      { 
        sub: mockUser._id, 
        rol: mockUser.rol 
      }, 
      secret,
      signOptions
    );

    res.json({
      success: true,
      data: {
        user: {
          id: mockUser._id,
          nombre: mockUser.nombre,
          correo: mockUser.correo,
          fotoPerfil: mockUser.fotoPerfil,
          rol: mockUser.rol
        },
        accessToken: token,
        refreshToken: null // Opcional
      }
    });

  } catch (error: any) {
    console.error('❌ Error en Google callback:', error);
    res.status(500).json({ 
      success: false, 
      message: error?.message || 'Error interno del servidor' 
    });
  }
});

export default router;