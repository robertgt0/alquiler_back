import { OfferModel } from "../models/Offer";
import { FixerModel } from "../modules/fixer/models/Fixer";

const FIXER_SEED = [
  {
    fixerId: "fixer-1",
    userId: "user-juan",
    ci: "1000001",
    name: "Juan Pérez",
    city: "Cochabamba",
    photoUrl: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=300&q=80",
    whatsapp: "+59170123456",
    bio: "Soy una persona responsable y eficiente que trabaja tanto en obras grandes y pequeñas.",
    categories: ["Carpintería", "Albañil", "Plomero"],
    paymentMethods: ["cash", "qr", "card"],
    paymentAccounts: {
      cash: { holder: "Juan Pérez", accountNumber: "Efectivo" },
      qr: { holder: "Juan Pérez", accountNumber: "QR-13579" },
      card: { holder: "Juan Pérez", accountNumber: "4111 1111 1111 1111" },
    },
    jobsCount: 45,
    ratingAvg: 4.6,
    ratingCount: 38,
    memberSince: new Date("2019-08-28T00:00:00Z"),
    termsAccepted: true,
    location: { lat: -17.3895, lng: -66.1568, address: "Av. Heroínas 123" },
  },
  {
    fixerId: "fixer-2",
    userId: "user-maria",
    ci: "1000002",
    name: "María Gonzales",
    city: "La Paz",
    photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80",
    whatsapp: "+59170234567",
    bio: "Especialista en instalación eléctrica residencial con experiencia certificada.",
    categories: ["Electricista", "Instalaciones"],
    paymentMethods: ["cash", "card"],
    paymentAccounts: {
      card: { holder: "María Gonzales", accountNumber: "5105 1051 0510 5100" },
    },
    jobsCount: 58,
    ratingAvg: 4.8,
    ratingCount: 41,
    memberSince: new Date("2018-03-12T00:00:00Z"),
    termsAccepted: true,
    location: { lat: -16.5000, lng: -68.1500, address: "C. Murillo 456" },
  },
  {
    fixerId: "fixer-3",
    userId: "user-carlos",
    ci: "1000003",
    name: "Carlos Mamani",
    city: "Santa Cruz",
    photoUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80",
    whatsapp: "+59170345678",
    bio: "Trabajo en carpintería fina y restauración de muebles a medida.",
    categories: ["Carpintería", "Restauración"],
    paymentMethods: ["cash", "qr"],
    paymentAccounts: {
      qr: { holder: "Carlos Mamani", accountNumber: "QR-86420" },
    },
    jobsCount: 32,
    ratingAvg: 4.3,
    ratingCount: 21,
    memberSince: new Date("2020-11-05T00:00:00Z"),
    termsAccepted: true,
    location: { lat: -17.7833, lng: -63.1821, address: "Av. Beni 890" },
  },
  {
    fixerId: "fixer-4",
    userId: "user-ana",
    ci: "1000004",
    name: "Ana Quispe",
    city: "Sucre",
    photoUrl: "https://images.unsplash.com/photo-1544723795-432537dcfb9a?auto=format&fit=crop&w=300&q=80",
    whatsapp: "+59170456789",
    bio: "Especialista en plomería y soluciones de cocina.",
    categories: ["Plomería"],
    paymentMethods: ["cash", "qr"],
    paymentAccounts: {
      qr: { holder: "Ana Quispe", accountNumber: "QR-75319" },
    },
    jobsCount: 27,
    ratingAvg: 4.5,
    ratingCount: 19,
    memberSince: new Date("2021-01-18T00:00:00Z"),
    termsAccepted: true,
    location: { lat: -19.0429, lng: -65.2559, address: "C. España 234" },
  },
];

export async function seedFixers() {
  const count = await FixerModel.countDocuments();
  if (count > 0) {
    return { inserted: 0, already: count };
  }

  const inserted = await FixerModel.insertMany(FIXER_SEED);
  return { inserted: inserted.length, already: 0 };
}

export async function seedOffers() {
  const count = await OfferModel.countDocuments();
  if (count > 0) return { inserted: 0, already: count };

  const docs = [
    {
      id: "1",
      ownerId: "fixer-1",
      title: "Arreglar grifo con goteo",
      description: "Revisión de grifería en cocina, fuga leve y goteo constante. Material básico disponible.",
      category: "Plomería",
      contact: { whatsapp: "555-123-4567" },
      createdAt: new Date("2025-10-15T13:45:00.000Z"),
      status: "active",
      images: [
        "https://images.unsplash.com/photo-1505693416388-a5cce066f8e5",
        "https://images.unsplash.com/photo-1501183638710-841dd1984471",
      ],
    },
    {
      id: "2",
      ownerId: "fixer-2",
      title: "Instalar luces en la sala de estar",
      description: "Instalación de 4 focos LED empotrables y verificación de apagadores existentes.",
      category: "Electricidad",
      contact: { whatsapp: "555-987-6543" },
      createdAt: new Date("2025-10-14T17:10:00.000Z"),
      status: "active",
      images: [
        "https://images.unsplash.com/photo-1493666438817-866a91353ca9",
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
      ],
    },
    {
      id: "3",
      ownerId: "fixer-3",
      title: "Arreglar marco de puerta roto",
      description: "Marco astillado por golpe, requiere encolado y ajuste de bisagras.",
      category: "Carpintería",
      contact: { whatsapp: "555-246-8013" },
      createdAt: new Date("2025-10-12T08:30:00.000Z"),
      status: "active",
      images: [
        "https://images.unsplash.com/photo-1520880867055-1e30d1cb001c",
        "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
      ],
    },
    {
      id: "4",
      ownerId: "fixer-4",
      title: "Destapar lavaplatos de la cocina",
      description: "Lavaplatos obstruido, requiere destape y limpieza de sifón en U.",
      category: "Plomería",
      contact: { whatsapp: "555-789-0123" },
      createdAt: new Date("2025-10-09T09:20:00.000Z"),
      status: "inactive",
      images: [],
    },
  ];

  const result = await OfferModel.insertMany(docs);
  return { inserted: result.length, already: 0 };
}

export async function seedAll() {
  const fixers = await seedFixers();
  const offers = await seedOffers();
  return { fixers, offers };
}
