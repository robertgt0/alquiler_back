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
