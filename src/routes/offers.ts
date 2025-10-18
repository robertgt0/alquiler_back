import { Router } from 'express';
import mongoose from 'mongoose';
import { OfferModel } from '../models/Offer';
import { seedOffers } from '../scripts/seed';

const router = Router();

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

router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page ?? 1));
    const pageSize = Math.max(1, Math.min(100, Number(req.query.pageSize ?? 10)));
    const query = String(req.query.query ?? '').trim().toLowerCase();
    const includeInactive = String(req.query.includeInactive ?? 'true') !== 'false';

    const filter: any = { status: { $ne: 'deleted' } };
    if (!includeInactive) {
      filter.$or = [{ status: 'active' }, { status: { $exists: false } }];
    }

    if (query) {
      const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\]/g, '\\$&'), 'i');
      filter.$or = [
        ...(filter.$or ?? []),
        { title: regex },
        { description: regex },
        { category: regex },
        { descripcion: regex },
        { categoria: regex }
      ];
    }

    const [docs, total] = await Promise.all([
      OfferModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      OfferModel.countDocuments(filter)
    ]);

    const items = docs.map(normalize);
    res.json({ total, items });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al listar ofertas' });
  }
});

router.get('/seed', async (_req, res) => {
  try {
    const out = await seedOffers();
    res.json(out);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'No se pudo realizar el seed' });
  }
});

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
      descripcion,
      categoria,
      whatsapp
    } = req.body ?? {};

    const now = new Date();

    const doc = await OfferModel.create({
      id: id ?? String(now.getTime()),
      ownerId: ownerId ?? 'fixer-1',
      title: title ?? descripcion ?? 'Oferta sin título',
      description: description ?? descripcion ?? '',
      category: category ?? categoria ?? 'General',
      contact: contact ?? (whatsapp ? { whatsapp } : {}),
      images: Array.isArray(images) ? images.filter(x => typeof x === 'string') : [],
      status: 'active',
      createdAt: now
    });

    res.status(201).json(normalize(doc.toObject()));
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'No se pudo crear la oferta' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = String(req.params.id);
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

export default router;