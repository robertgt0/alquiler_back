import { Router, type Request } from "express";
import mongoose from "mongoose";
import { OfferModel } from "../models/Offer";
import { seedAll } from "../scripts/seed";
import { FixerModel } from "../modules/fixer/models/Fixer";

const router = Router();

function resolveOwnerId(req: Request): string | null {
  const header = req.get("x-owner-id");
  const bodyValue =
    typeof req.body?.ownerId === "string" || typeof req.body?.ownerId === "number"
      ? String(req.body.ownerId)
      : undefined;
  const queryValue =
    typeof req.query?.ownerId === "string" || typeof req.query?.ownerId === "number"
      ? String(req.query.ownerId)
      : undefined;
  const raw = header ?? bodyValue ?? queryValue ?? "";
  const trimmed = raw.trim();
  return trimmed || null;
}

function buildIdFilter(id: string, extra?: Record<string, unknown>) {
  const append = (criteria: Record<string, unknown>) => (extra ? { ...criteria, ...extra } : criteria);
  const filters = [append({ id })];
  if (mongoose.Types.ObjectId.isValid(id)) {
    filters.push(append({ _id: new mongoose.Types.ObjectId(id) }));
  }
  return filters.length > 1 ? { $or: filters } : filters[0];
}

function normalize(doc: any) {
  return {
    id: String(doc?.id ?? doc?._id),
    ownerId: doc?.ownerId ?? undefined,
    title: doc?.title ?? doc?.descripcion ?? "Oferta sin titulo",
    description: doc?.description ?? doc?.descripcion ?? "",
    category: doc?.category ?? doc?.categoria ?? "General",
    contact: doc?.contact ?? {},
    createdAt: (doc?.createdAt ? new Date(doc.createdAt) : new Date()).toISOString(),
    status:
      doc?.status === "inactive" || doc?.status === "deleted"
        ? doc.status
        : "active",
    images: Array.isArray(doc?.images)
      ? doc.images.filter((x: any) => typeof x === "string")
      : doc?.imagen
      ? [String(doc.imagen)]
      : [],
  };
}

router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page ?? 1));
    const pageSize = Math.max(1, Math.min(100, Number(req.query.pageSize ?? 10)));
    const query = String(req.query.query ?? "").trim().toLowerCase();
    const includeInactive = String(req.query.includeInactive ?? "true") !== "false";
    const ownerIdFilter = typeof req.query.ownerId === "string" ? req.query.ownerId.trim() : "";

    const filter: any = { status: { $ne: "deleted" } };
    if (!includeInactive) {
      filter.$or = [{ status: "active" }, { status: { $exists: false } }];
    }

    if (ownerIdFilter) {
      filter.ownerId = ownerIdFilter;
    }

    if (query) {
      const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [
        ...(filter.$or ?? []),
        { title: regex },
        { description: regex },
        { category: regex },
        { descripcion: regex },
        { categoria: regex },
      ];
    }

    const [docs, total] = await Promise.all([
      OfferModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      OfferModel.countDocuments(filter),
    ]);

    const items = docs.map(normalize);
    res.json({ total, items });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al listar ofertas" });
  }
});

router.get("/seed", async (_req, res) => {
  try {
    const out = await seedAll();
    res.json(out);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "No se pudo realizar el seed" });
  }
});

// ✅ NUEVO ENDPOINT PARA EL MAPA - Obtiene ofertas con datos de fixers
router.get("/map-data", async (req, res) => {
  try {
    const includeInactive = String(req.query.includeInactive ?? "false") !== "false";
    
    // Filtro para ofertas activas
    const filter: any = { status: { $ne: "deleted" } };
    if (!includeInactive) {
      filter.$or = [{ status: "active" }, { status: { $exists: false } }];
    }

    // Obtener todas las ofertas activas
    const ofertas = await OfferModel.find(filter).lean();

    // Obtener todos los ownerIds únicos
    const ownerIds = [...new Set(ofertas.map(o => o.ownerId).filter(Boolean))];

    // Obtener todos los fixers en una sola query
    const fixers = await FixerModel.find({
      fixerId: { $in: ownerIds }
    }).lean();

    // Crear un mapa de fixers por ID para búsqueda rápida
    const fixerMap = new Map(fixers.map(f => [f.fixerId, f]));

    // Combinar ofertas con datos de fixers
    const result = ofertas
      .map(oferta => {
        const fixer = fixerMap.get(oferta.ownerId);
        
        // Si no hay fixer o no tiene ubicación, saltar esta oferta
        if (!fixer || !fixer.location) return null;

        return {
          id: String(oferta.id ?? oferta._id),
          title: oferta.title ?? oferta.descripcion ?? "Oferta sin título",
          description: oferta.description ?? oferta.descripcion ?? "",
          category: oferta.category ?? oferta.categoria ?? "General",
          price: 150, // Valor por defecto, cambiar según tu lógica
          rating: fixer.ratingAvg ?? 0,
          fixerName: fixer.name ?? "Fixer sin nombre",
          fixerId: fixer.fixerId,
          whatsapp: fixer.whatsapp ?? oferta.contact?.whatsapp ?? "+591 000-0000",
          location: {
            lat: fixer.location.lat,
            lng: fixer.location.lng,
            address: fixer.location.address
          },
          images: Array.isArray(oferta.images) 
            ? oferta.images.filter((x: any) => typeof x === "string")
            : [],
          isActive: oferta.status !== "inactive",
          createdAt: oferta.createdAt
        };
      })
      .filter(Boolean); // Eliminar nulls

    res.json({
      total: result.length,
      offers: result
    });
  } catch (e) {
    console.error("Error en /map-data:", e);
    res.status(500).json({ error: "Error al obtener datos para el mapa" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = String(req.params.id);
    const statusFilter = { $or: [{ status: { $ne: "deleted" } }, { status: { $exists: false } }] };

    const byOwnId = { id, ...statusFilter };
    const tryObjectId =
      mongoose.Types.ObjectId.isValid(id)
        ? { _id: new mongoose.Types.ObjectId(id), ...statusFilter }
        : null;

    const doc = await OfferModel.findOne(tryObjectId ? { $or: [byOwnId, tryObjectId] } : byOwnId).lean();

    if (!doc) return res.status(404).json({ error: "Oferta no encontrada" });
    res.json(normalize(doc));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al obtener la oferta" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      id,
      title,
      description,
      category,
      contact,
      images,
      descripcion,
      categoria,
      whatsapp,
    } = req.body ?? {};

    const ownerId = resolveOwnerId(req);
    if (!ownerId) {
      return res.status(400).json({ error: "Debes indicar el fixer propietario (ownerId)." });
    }

    const now = new Date();
    const desc = (description ?? descripcion ?? "").toString();
    if (desc.length > 100) {
      return res.status(400).json({ error: "La descripcion debe ser de 100 caracteres o menos" });
    }

    const doc = await OfferModel.create({
      id: id ?? String(now.getTime()),
      ownerId,
      title: title ?? descripcion ?? "Oferta sin titulo",
      description: desc,
      category: category ?? categoria ?? "General",
      contact: contact ?? (whatsapp ? { whatsapp } : {}),
      images: Array.isArray(images) ? images.filter((x) => typeof x === "string") : [],
      status: "active",
      createdAt: now,
    });

    res.status(201).json(normalize(doc.toObject()));
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: "No se pudo crear la oferta" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = String(req.params.id);
    const ownerId = resolveOwnerId(req);
    if (!ownerId) {
      return res.status(400).json({ error: "Debes identificarte como el fixer propietario para editar." });
    }

    const patch: any = {};
    if (req.body.title ?? req.body.descripcion) patch.title = req.body.title ?? req.body.descripcion;
    if (req.body.description ?? req.body.descripcion) patch.description = req.body.description ?? req.body.descripcion;
    if (req.body.category ?? req.body.categoria) patch.category = req.body.category ?? req.body.categoria;
    if (req.body.contact) patch.contact = req.body.contact;
    if (Array.isArray(req.body.images)) patch.images = req.body.images.filter((x: any) => typeof x === "string");
    if (["active", "inactive", "deleted"].includes(req.body.status)) patch.status = req.body.status;

    const filter = buildIdFilter(id, { ownerId });
    const doc = await OfferModel.findOneAndUpdate(filter, { $set: patch }, { new: true, lean: true });

    if (!doc) {
      const exists = await OfferModel.exists(buildIdFilter(id));
      if (exists) {
        return res.status(403).json({ error: "No puedes editar una oferta que no te pertenece." });
      }
      return res.status(404).json({ error: "Oferta no encontrada" });
    }
    res.json(normalize(doc));
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: "No se pudo editar la oferta" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = String(req.params.id);
    const ownerId = resolveOwnerId(req);
    if (!ownerId) {
      return res.status(400).json({ error: "Debes identificarte como el fixer propietario para eliminar." });
    }

    const filter = buildIdFilter(id, { ownerId });
    const result = await OfferModel.findOneAndUpdate(filter, { $set: { status: "deleted" } }, { new: true, lean: true });

    if (!result) {
      const exists = await OfferModel.exists(buildIdFilter(id));
      if (exists) {
        return res.status(403).json({ error: "No puedes eliminar una oferta que no te pertenece." });
      }
      return res.status(404).json({ error: "Oferta no encontrada" });
    }
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: "No se pudo eliminar la oferta" });
  }
});

export default router;