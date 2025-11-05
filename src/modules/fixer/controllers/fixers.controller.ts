import { Request, Response } from "express";
import service, { PaymentAccount, PaymentMethod } from "../services/fixers.service";

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

function normalizePaymentMethods(raw: any): PaymentMethod[] {
  const list = Array.isArray(raw) ? raw : [];
  const methods = list
    .map((value) => String(value || "").toLowerCase())
    .filter((value): value is PaymentMethod => (ALLOWED_PAYMENTS as readonly string[]).includes(value));
  return Array.from(new Set(methods));
}

function normalizeAccounts(raw: any, methods: PaymentMethod[]): Partial<Record<PaymentMethod, PaymentAccount>> {
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

export const checkCI = (req: Request, res: Response) => {
  try {
    const ci = normalizeCI(req.query.ci);
    const excludeId = req.query.excludeId ? String(req.query.excludeId) : undefined;
    const unique = service.isCIUnique(ci, excludeId);
    if (!unique) {
      return res.json({ success: true, unique: false, message: "Este C.I. ya esta registrado" });
    }
    res.json({ success: true, unique: true, message: "Disponible" });
  } catch (err: any) {
    res.status(400).json({ success: false, message: String(err.message || "Error") });
  }
};

export const createFixer = (req: Request, res: Response) => {
  try {
    const { userId } = req.body || {};
    if (!userId) {
      return res.status(400).json({ success: false, message: "userId requerido" });
    }

    const ci = normalizeCI(req.body?.ci);
    if (!service.isCIUnique(ci)) {
      return res.status(400).json({ success: false, message: "Este C.I. ya esta registrado" });
    }

    const location = normalizeLocation(req.body?.location);
    const categories = normalizeCategories(req.body?.categories);
    const methods = normalizePaymentMethods(req.body?.paymentMethods);
    const accounts = normalizeAccounts(req.body?.paymentAccounts, methods);

    const created = service.create({
      userId: String(userId),
      ci,
      location,
      categories,
      paymentMethods: methods,
      paymentAccounts: accounts,
      termsAccepted: Boolean(req.body?.termsAccepted),
    });

    res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    res.status(400).json({ success: false, message: String(err.message || "Error") });
  }
};

export const updateIdentity = (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const ci = normalizeCI(req.body?.ci);
    if (!service.isCIUnique(ci, id)) {
      return res.status(400).json({ success: false, message: "Este C.I. ya esta registrado" });
    }

    const updated = service.update(id, { ci });
    if (!updated) return res.status(404).json({ success: false, message: "Fixer no encontrado" });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, message: String(err.message || "Error") });
  }
};

export const getFixer = (req: Request, res: Response) => {
  try {
    const fixer = service.getById(req.params.id);
    if (!fixer) return res.status(404).json({ success: false, message: "Fixer no encontrado" });
    res.json({ success: true, data: fixer });
  } catch (err: any) {
    res.status(400).json({ success: false, message: String(err.message || "Error") });
  }
};

export const updateLocation = (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const location = normalizeLocation(req.body);
    if (!location) return res.status(400).json({ success: false, message: "Ubicacion invalida" });

    const updated = service.updateLocation(id, location);
    if (!updated) return res.status(404).json({ success: false, message: "Fixer no encontrado" });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, message: String(err.message || "Error") });
  }
};

export const updateCategories = (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const categories = normalizeCategories(req.body?.categories);
    if (!categories) return res.status(400).json({ success: false, message: "Categorias invalidas" });

    const updated = service.updateCategories(id, categories);
    if (!updated) return res.status(404).json({ success: false, message: "Fixer no encontrado" });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, message: String(err.message || "Error") });
  }
};

export const updatePayments = (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const methods = normalizePaymentMethods(req.body?.methods);
    if (!methods.length) {
      return res.status(400).json({ success: false, message: "Debes elegir al menos un metodo de pago" });
    }
    const accounts = normalizeAccounts(req.body?.accounts, methods);
    const updated = service.updatePaymentInfo(id, methods, accounts);
    if (!updated) return res.status(404).json({ success: false, message: "Fixer no encontrado" });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, message: String(err.message || "Error") });
  }
};

export const acceptTerms = (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const accepted = Boolean(req.body?.accepted);
    if (!accepted) return res.status(400).json({ success: false, message: "Debe aceptar los terminos" });

    const updated = service.setTermsAccepted(id, true);
    if (!updated) return res.status(404).json({ success: false, message: "Fixer no encontrado" });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, message: String(err.message || "Error") });
  }
};

// ⬇️⬇️⬇️ NUEVOS CONTROLADORES PARA FIXERJOBS ⬇️⬇️⬇️

import { FixerJob } from "../services/fixers.service";

function normalizeFixerJob(raw: any): FixerJob {
  if (!raw) throw new Error("Datos del trabajo invalidos");
  
  const jobId = String(raw.jobId || "").trim();
  const jobName = String(raw.jobName || "").trim();
  const generalDescription = String(raw.generalDescription || "").trim();
  
  if (!jobId) throw new Error("jobId es requerido");
  if (!jobName) throw new Error("jobName es requerido");
  if (!generalDescription) throw new Error("generalDescription es requerida");
  
  const job: FixerJob = {
    jobId,
    jobName,
    generalDescription,
  };
  
  // customDescription es opcional
  if (raw.customDescription) {
    const customDesc = String(raw.customDescription).trim();
    if (customDesc.length > 500) {
      throw new Error("customDescription no puede exceder 500 caracteres");
    }
    job.customDescription = customDesc;
  }
  
  return job;
}

function normalizeFixerJobs(raw: any): FixerJob[] {
  if (!Array.isArray(raw)) throw new Error("fixerJobs debe ser un arreglo");
  return raw.map(normalizeFixerJob);
}

// PUT /:id/jobs - Actualizar todos los trabajos del fixer
export const updateFixerJobs = (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const fixerJobs = normalizeFixerJobs(req.body?.fixerJobs);
    
    if (!fixerJobs.length) {
      return res.status(400).json({ 
        success: false, 
        message: "Debes proporcionar al menos un trabajo" 
      });
    }
    
    const updated = service.updateFixerJobs(id, fixerJobs);
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

// POST /:id/jobs - Agregar/actualizar un solo trabajo
export const addFixerJob = (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const job = normalizeFixerJob(req.body);
    
    const updated = service.addFixerJob(id, job);
    if (!updated) {
      return res.status(404).json({ 
        success: false, 
        message: "Fixer no encontrado" 
      });
    }
    
    res.json({ 
      success: true, 
      data: updated,
      message: "Trabajo agregado/actualizado exitosamente"
    });
  } catch (err: any) {
    res.status(400).json({ 
      success: false, 
      message: String(err.message || "Error") 
    });
  }
};

// GET /:id/jobs/:jobId - Obtener descripción de un trabajo específico
export const getFixerJobDescription = (req: Request, res: Response) => {
  try {
    const { id, jobId } = req.params;
    
    const description = service.getFixerJobDescription(id, jobId);
    if (description === null) {
      return res.status(404).json({ 
        success: false, 
        message: "Trabajo no encontrado para este fixer" 
      });
    }
    
    res.json({ 
      success: true, 
      data: { jobId, description } 
    });
  } catch (err: any) {
    res.status(400).json({ 
      success: false, 
      message: String(err.message || "Error") 
    });
  }
};