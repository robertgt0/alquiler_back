// src/routes/offers.ts
import { Router } from 'express';
import mongoose from 'mongoose';
import { OfferModel } from '../models/Offer';
import { seedOffers } from '../scripts/seed';

const router = Router();

/** Normaliza un documento (soporta esquema “nuevo” e “histórico” en español). */
function normalize(doc: any) {
  return {
    id: String(doc?.id ?? doc?._id),
    ownerId: doc?.ownerId ?? undefined,
    title: doc?.title ?? doc?.descripcion ?? 'Oferta sin título',
    description: doc?.description ?? doc?.descripcion ?? '',
    category: doc?.category ?? doc?.categoria ?? 'General',
    contact: doc?.contact ?? {},
    createdAt: (doc?.createdAt ? new Date(doc.createdAt) : new Date()).toISOString(),
    status:
      doc?.status === 'inactive' || doc?.status === 'deleted'
        ? doc.status
        : 'active',
    images: Array.isArray(doc?.images)
      ? doc.images.filter((x: any) => typeof x === 'string')
      : doc?.imagen
      ? [String(doc.imagen)]
      : [],
  };
}

/** HU9: listado con búsqueda/paginación + compatibilidad con documentos “viejos” */
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page ?? 1));
    const pageSize = Math.max(1, Math.min(100, Number(req.query.pageSize ?? 10)));
    const query = String(req.query.query ?? '').trim().toLowerCase();
    const includeInactive = String(req.query.includeInactive ?? 'true') !== 'false';

    // Incluir todo menos 'deleted'; si includeInactive=false, aceptar 'active' o SIN status
    const filter: any = { status: { $ne: 'deleted' } };
    if (!includeInactive) {
      filter.$or = [{ status: 'active' }, { status: { $exists: false } }];
    }

    if (query) {
      const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        ...(filter.$or ?? []),
        { title: regex },
        { description: regex },
        { category: regex },
        // Campos “históricos” en español:
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
    res.status(500).json({ error: 'Error al listar ofertas' });
  }
});

/** Seed (GET para pegar desde el navegador) */
router.get('/seed', async (_req, res) => {
  try {
    const out = await seedOffers();
    res.json(out);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'No se pudo realizar el seed' });
  }
});

/** HU10: detalle con soporte por id “propio” o _id de Mongo y docs sin status */
router.get('/:id', async (req, res) => {
  try {
    const id = String(req.params.id);

    const statusFilter = { $or: [{ status: { $ne: 'deleted' } }, { status: { $exists: false } }] };

    const byOwnId = { id, ...statusFilter };
    const tryObjectId =
      mongoose.Types.ObjectId.isValid(id) ? { _id: new mongoose.Types.ObjectId(id), ...statusFilter } : null;

    const doc = await OfferModel.findOne(tryObjectId ? { $or: [byOwnId, tryObjectId] } : byOwnId).lean();

    if (!doc) return res.status(404).json({ error: 'Oferta no encontrada' });

    res.json(normalize(doc));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al obtener la oferta' });
  }
});

export default router;
// ...importaciones y código existente arriba

/** Crear oferta (soft requirements: JSON; si mandan campos en español también funciona) */
router.post('/', async (req, res) => {
  try {
    const {
      id,
      ownerId,
      title,
      description,
      category,
      contact,
      images,

      // alias en español por compatibilidad
      descripcion,
      categoria,
      whatsapp,
    } = req.body ?? {};

    const now = new Date();

    const doc = await OfferModel.create({
      // si te mandan un id lo respetas; si no, generas uno simple
      id: id ?? String(now.getTime()),
      ownerId: ownerId ?? 'fixer-1', // TODO: reemplazar cuando haya auth real
      title: title ?? descripcion ?? 'Oferta sin título',
      description: description ?? descripcion ?? '',
      category: category ?? categoria ?? 'General',
      contact: contact ?? (whatsapp ? { whatsapp } : {}),
      images: Array.isArray(images) ? images.filter(x => typeof x === 'string') : [],
      status: 'active',
      createdAt: now,
    });

    res.status(201).json(normalize(doc.toObject()));
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'No se pudo crear la oferta' });
  }
});

/** Editar oferta por id propio o _id (solo campos permitidos) */
router.put('/:id', async (req, res) => {
  try {
    const id = String(req.params.id);

    // campos editables
    const patch: any = {};
    if (req.body.title ?? req.body.descripcion) patch.title = req.body.title ?? req.body.descripcion;
    if (req.body.description ?? req.body.descripcion) patch.description = req.body.description ?? req.body.descripcion;
    if (req.body.category ?? req.body.categoria) patch.category = req.body.category ?? req.body.categoria;
    if (req.body.contact) patch.contact = req.body.contact;
    if (Array.isArray(req.body.images)) patch.images = req.body.images.filter((x: any) => typeof x === 'string');
    if (['active', 'inactive', 'deleted'].includes(req.body.status)) patch.status = req.body.status;

    const asObjectId =
      mongoose.Types.ObjectId.isValid(id) ? { _id: new mongoose.Types.ObjectId(id) } : null;

    const doc = await OfferModel.findOneAndUpdate(
      asObjectId ? { $or: [{ id }, asObjectId] } : { id },
      { $set: patch },
      { new: true, lean: true }
    );

    if (!doc) return res.status(404).json({ error: 'Oferta no encontrada' });
    res.json(normalize(doc));
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'No se pudo editar la oferta' });
  }
});

/** Eliminar (soft delete: status = 'deleted') */
router.delete('/:id', async (req, res) => {
  try {
    const id = String(req.params.id);
    const asObjectId =
      mongoose.Types.ObjectId.isValid(id) ? { _id: new mongoose.Types.ObjectId(id) } : null;

    const result = await OfferModel.findOneAndUpdate(
      asObjectId ? { $or: [{ id }, asObjectId] } : { id },
      { $set: { status: 'deleted' } },
      { new: true, lean: true }
    );

    if (!result) return res.status(404).json({ error: 'Oferta no encontrada' });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'No se pudo eliminar la oferta' });
  }
});

// ...export default router
