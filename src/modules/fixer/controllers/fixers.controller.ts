import { Request, Response } from "express";
import service from "../services/fixers.service";
import type { FixerSkillInput } from "../services/fixers.service";
import type { PaymentAccount, PaymentMethod } from "../models/Fixer";

const ALLOWED_PAYMENTS: PaymentMethod[] = ["card", "qr", "cash"];

function onlyDigits(value: string) {
  return /^\d+$/.test(value);
}

function isLengthOK(value: string) {
  return value.length >= 6 && value.length <= 10;
}

function normalizeCI(raw: unknown) {
  const ci = String(raw ?? "").trim();
  if (!ci) throw new Error("El campo C.I. es obligatorio");
  if (!onlyDigits(ci)) throw new Error("C.I. invalido - solo numeros");
  if (!isLengthOK(ci)) throw new Error("El C.I. no cumple la longitud 6-10");
  return ci;
}

// ✅ Bug 3.1.4 CORREGIDO: Nueva función para validar city obligatorio
function normalizeCity(raw: unknown): string {
  const city = String(raw ?? "").trim();
  if (!city) throw new Error("El campo Ciudad es obligatorio");
  if (city.length < 2) throw new Error("La ciudad debe tener al menos 2 caracteres");
  if (city.length > 120) throw new Error("La ciudad no puede tener más de 120 caracteres");
  return city;
}

function normalizeLocation(raw: any) {
  if (!raw) return undefined;
  const lat = Number(raw.lat);
  const lng = Number(raw.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error("Ubicacion invalida");
  }
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw new Error("Ubicacion invalida");
  }
  const location = { lat, lng } as { lat: number; lng: number; address?: string };
  if (raw.address) location.address = String(raw.address).trim();
  return location;
}

function normalizeCategories(raw: any): string[] | undefined {
  if (raw === undefined) return undefined;
  if (!Array.isArray(raw)) throw new Error("Las categorias deben ser un arreglo");
  const categories = raw
    .map((item) => String(item || "").trim())
    .filter(Boolean);
  if (!categories.length) throw new Error("Debes indicar al menos una categoria");
  return categories;
}

function normalizeSkills(raw: any): FixerSkillInput[] | undefined {
  if (raw === undefined) return undefined;
  if (!Array.isArray(raw)) throw new Error("Las habilidades deben ser un arreglo");
  return raw
    .map((item) => {
      if (!item) return null;
      const categoryId = String(item.categoryId ?? item.id ?? "").trim();
      if (!categoryId) return null;
      const custom =
        item.customDescription === undefined || item.customDescription === null
          ? undefined
          : String(item.customDescription).trim();
      return custom ? { categoryId, customDescription: custom } : { categoryId };
    })
    .filter((value): value is FixerSkillInput => value !== null);
}

function mergeCategoryIds(
  categories: string[] | undefined,
  skills: FixerSkillInput[] | undefined
): string[] {
  const set = new Set<string>();
  (categories ?? []).forEach((value) => {
    const trimmed = typeof value === "string" ? value.trim() : "";
    if (trimmed) set.add(trimmed);
  });
  (skills ?? []).forEach((skill) => {
    const trimmed = typeof skill.categoryId === "string" ? skill.categoryId.trim() : "";
    if (trimmed) set.add(trimmed);
  });
  return Array.from(set);
}

function normalizePaymentMethods(raw: any): PaymentMethod[] {
  const list = Array.isArray(raw) ? raw : [];
  const methods = list
    .map((value) => String(value || "").toLowerCase())
    .filter((value): value is PaymentMethod => (ALLOWED_PAYMENTS as readonly string[]).includes(value));
  return Array.from(new Set(methods));
}

function normalizeAccounts(
  raw: any,
  methods: PaymentMethod[]
): Partial<Record<PaymentMethod, PaymentAccount>> {
  if (!raw) return {};
  const out: Partial<Record<PaymentMethod, PaymentAccount>> = {};

  methods.forEach((method) => {
    const data = raw[method];
    if (!data) return;
    const holder = String(data.holder ?? "").trim();
    const accountNumber = String(data.accountNumber ?? "").trim();
    if (!holder || !accountNumber) return;
    out[method] = { holder, accountNumber };
  });

  return out;
}

export const checkCI = async (req: Request, res: Response) => {
  try {
    const ci = normalizeCI(req.query.ci);
    const excludeId = req.query.excludeId ? String(req.query.excludeId) : undefined;
    const unique = await service.isCIUnique(ci, excludeId);
    if (!unique) {
      return res.json({ success: true, unique: false, message: "Este C.I. ya esta registrado" });
    }
    res.json({ success: true, unique: true, message: "Disponible" });
  } catch (err: any) {
    res.status(400).json({ success: false, message: String(err.message || "Error") });
  }
};

export const createFixer = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body || {};
    if (!userId) {
      return res.status(400).json({ success: false, message: "userId requerido" });
    }

    const userIdStr = String(userId);
    const ci = normalizeCI(req.body?.ci);
    
    // ✅ Bug 3.1.4 CORREGIDO: Validar city obligatorio
    const city = normalizeCity(req.body?.city);
    
    const existingFixer = await service.getByUserId(userIdStr);
    const ciUnique = await service.isCIUnique(ci, existingFixer?.id);
    if (!ciUnique) {
      return res.status(400).json({ success: false, message: "Este C.I. ya esta registrado" });
    }

    const location = normalizeLocation(req.body?.location);
    const categories = normalizeCategories(req.body?.categories);
    const skills = normalizeSkills(req.body?.skills);
    const methods = normalizePaymentMethods(req.body?.paymentMethods);
    const accounts = normalizeAccounts(req.body?.paymentAccounts, methods);

    const termsAcceptedValue =
      req.body?.termsAccepted === undefined ? undefined : Boolean(req.body?.termsAccepted);

    const created = await service.create({
      userId: userIdStr,
      ci,
      location,
      categories,
      skills,
      paymentMethods: methods,
      paymentAccounts: accounts,
      termsAccepted: termsAcceptedValue,
      name: typeof req.body?.name === "string" ? req.body.name.trim() || undefined : undefined,
      city, // ✅ Ahora es obligatorio y validado
      photoUrl:
        typeof req.body?.photoUrl === "string" ? req.body.photoUrl.trim() || undefined : undefined,
      whatsapp:
        typeof req.body?.whatsapp === "string" ? req.body.whatsapp.trim() || undefined : undefined,
      bio: typeof req.body?.bio === "string" ? req.body.bio.trim() || undefined : undefined,
      fixerId: existingFixer?.id,
    });

    res.status(existingFixer ? 200 : 201).json({ success: true, data: created });
  } catch (err: any) {
    res.status(400).json({ success: false, message: String(err.message || "Error") });
  }
};

export const updateIdentity = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const ci = normalizeCI(req.body?.ci);
    if (!(await service.isCIUnique(ci, id))) {
      return res.status(400).json({ success: false, message: "Este C.I. ya esta registrado" });
    }

    const updated = await service.update(id, { ci });
    if (!updated) return res.status(404).json({ success: false, message: "Fixer no encontrado" });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, message: String(err.message || "Error") });
  }
};

export const getFixer = async (req: Request, res: Response) => {
  try {
    const fixer = await service.getById(req.params.id);
    if (!fixer) return res.status(404).json({ success: false, message: "Fixer no encontrado" });
    res.json({ success: true, data: fixer });
  } catch (err: any) {
    res.status(400).json({ success: false, message: String(err.message || "Error") });
  }
};

export const getFixerByUser = async (req: Request, res: Response) => {
  try {
    const fixer = await service.getByUserId(req.params.userId);
    if (!fixer) return res.status(404).json({ success: false, message: "Fixer no encontrado" });
    res.json({ success: true, data: fixer });
  } catch (err: any) {
    res.status(400).json({ success: false, message: String(err.message || "Error") });
  }
};

export const listByCategory = async (req: Request, res: Response) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const data = await service.listByCategories(search);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: String(err?.message || "Error") });
  }
};

export const updateLocation = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const location = normalizeLocation(req.body);
    if (!location) return res.status(400).json({ success: false, message: "Ubicacion invalida" });

    const updated = await service.updateLocation(id, location);
    if (!updated) return res.status(404).json({ success: false, message: "Fixer no encontrado" });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, message: String(err.message || "Error") });
  }
};

export const updateCategories = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const categories = normalizeCategories(req.body?.categories);
    const skills = normalizeSkills(req.body?.skills);
    const merged = mergeCategoryIds(categories, skills);
    
    if (!merged.length) {
      return res.status(400).json({ 
        success: false, 
        message: "Debes indicar al menos una categoria" 
      });
    }

    // ✅ BUG 1.1.1 FIX: Extraer bio de la misma forma que createFixer
    const bio = typeof req.body?.bio === "string" 
      ? req.body.bio.trim() || undefined 
      : undefined;

    // Validar bio si fue proporcionada
    if (bio !== undefined && bio.length > 0) {
      if (bio.length < 20) {
        return res.status(400).json({
          success: false,
          message: "El 'Sobre mí' debe tener al menos 20 caracteres"
        });
      }
      if (bio.length > 500) {
        return res.status(400).json({
          success: false,
          message: "El 'Sobre mí' no puede exceder 500 caracteres"
        });
      }
    }

    // ✅ Usar service.update() directamente (igual que createFixer)
    const updateData: any = { categories: merged };
    if (skills !== undefined) updateData.skills = skills;
    if (bio !== undefined) updateData.bio = bio;

    const updated = await service.update(id, updateData);

    if (!updated) {
      return res.status(404).json({ 
        success: false, 
        message: "Fixer no encontrado" 
      });
    }

    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ 
      success: false, 
      message: String(err.message || "Error") 
    });
  }
};

export const updatePayments = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const methods = normalizePaymentMethods(req.body?.methods);
    if (!methods.length) {
      return res.status(400).json({ success: false, message: "Debes elegir al menos un metodo de pago" });
    }
    const accounts = normalizeAccounts(req.body?.accounts, methods);
    const updated = await service.updatePaymentInfo(id, methods, accounts);
    if (!updated) return res.status(404).json({ success: false, message: "Fixer no encontrado" });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, message: String(err.message || "Error") });
  }
};

export const acceptTerms = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const accepted = Boolean(req.body?.accepted);
    if (!accepted) return res.status(400).json({ success: false, message: "Debe aceptar los terminos" });

    const updated = await service.setTermsAccepted(id, true);
    if (!updated) return res.status(404).json({ success: false, message: "Fixer no encontrado" });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, message: String(err.message || "Error") });
  }
};