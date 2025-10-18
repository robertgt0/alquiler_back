import { OfferModel } from '../models/Offer';

export async function seedOffers() {
  // si ya hay datos, no duplicar
  const count = await OfferModel.countDocuments();
  if (count > 0) return { inserted: 0, already: count };

  const docs = [
    {
      id: '1',
      ownerId: 'fixer-1',
      title: 'Arreglar grifo con goteo',
      description: 'Revisión de grifería en cocina, fuga leve y goteo constante. Material básico disponible.',
      category: 'Plomería',
      contact: { whatsapp: '555-123-4567' },
      createdAt: new Date('2025-10-15T13:45:00.000Z'),
      status: 'active',
      images: [
        'https://images.unsplash.com/photo-1505693416388-a5cce066f8e5',
        'https://images.unsplash.com/photo-1501183638710-841dd1984471',
      ],
    },
    {
      id: '2',
      ownerId: 'fixer-2',
      title: 'Instalar luces en la sala de estar',
      description: 'Instalación de 4 focos LED empotrables y verificación de apagadores existentes.',
      category: 'Electricidad',
      contact: { whatsapp: '555-987-6543' },
      createdAt: new Date('2025-10-14T17:10:00.000Z'),
      status: 'active',
      images: [
        'https://images.unsplash.com/photo-1493666438817-866a91353ca9',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
      ],
    },
    {
      id: '3',
      ownerId: 'fixer-3',
      title: 'Arreglar marco de puerta roto',
      description: 'Marco astillado por golpe, requiere encolado y ajuste de bisagras.',
      category: 'Carpintería',
      contact: { whatsapp: '555-246-8013' },
      createdAt: new Date('2025-10-12T08:30:00.000Z'),
      status: 'active',
      images: [
        'https://images.unsplash.com/photo-1520880867055-1e30d1cb001c',
        'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
      ],
    },
    {
      id: '4',
      ownerId: 'fixer-4',
      title: 'Destapar lavaplatos de la cocina',
      description: 'Lavaplatos obstruido, requiere destape y limpieza de sifón en U.',
      category: 'Plomería',
      contact: { whatsapp: '555-789-0123' },
      createdAt: new Date('2025-10-09T09:20:00.000Z'),
      status: 'inactive',
      images: [],
    },
  ];

  const result = await OfferModel.insertMany(docs);
  return { inserted: result.length };
}
