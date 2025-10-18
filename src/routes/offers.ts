import { Router } from 'express';
import { OfferModel } from '../models/Offer';
import { seedOffers } from '../scripts/seed';

const router = Router();

/** HU9: listado con filtro/busca/paginación */
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page ?? 1));
    const pageSize = Math.max(1, Math.min(100, Number(req.query.pageSize ?? 10)));
    const query = String(req.query.query ?? '').trim().toLowerCase();
    const includeInactive = String(req.query.includeInactive ?? 'true') !== 'false';

    const filter: any = { status: { $ne: 'deleted' } };

    if (!includeInactive) filter.status = 'active';

    if (query) {
      const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ title: regex }, { description: regex }, { category: regex }];
    }

    const [items, total] = await Promise.all([
      OfferModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      OfferModel.countDocuments(filter),
    ]);

    res.json({ total, items });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al listar ofertas' });
  }
});

/** Seed (para poblar la BD) — GET para que puedas pegar la URL en el navegador */
router.get('/seed', async (_req, res) => {
  try {
    const out = await seedOffers();
    res.json(out);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'No se pudo realizar el seed' });
  }
});

/** HU10: detalle */
router.get('/:id', async (req, res) => {
  try {
    const doc = await OfferModel.findOne({ id: req.params.id, status: { $ne: 'deleted' } }).lean();
    if (!doc) return res.status(404).json({ error: 'Oferta no encontrada' });
    res.json(doc);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al obtener la oferta' });
  }
});

export default router;

