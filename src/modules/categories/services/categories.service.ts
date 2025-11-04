import { randomUUID } from "crypto";
import { Category } from "../types";
import { CategoryModel, CategoryDoc } from "../models/Category";

const seedNames = [
  "Plomeria",
  "Electricista",
  "Carpinteria",
  "Pintura",
  "Arreglo de electrodomesticos",
  "Climatizacion",
  "Jardineria",
  "Limpieza",
  "Trabajo de techos",
  "Trabajo de pisos",
  "Instalacion de paneles",
  "Aislamiento",
  "Arreglo de ventanas",
  "Arreglo de puertas",
  "Reparacion de cercas",
  "Mantenimiento de piscinas",
  "Control de plagas",
  "Limpieza de canaletas",
  "Levantador de basura",
];

const FORBIDDEN = ["xxx", "spam", "invalido", "prueba", "test"];
const MIN = 3;
const MAX = 40;

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function toDTO(doc: CategoryDoc): Category {
  return {
    id: doc.id,
    name: doc.name,
    slug: doc.slug,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
  };
}

async function cleanupDuplicates() {
  const docs = await CategoryModel.find().lean<CategoryDoc[]>();
  const seen = new Map<string, string>();
  const remove: string[] = [];

  docs.forEach((doc) => {
    const slug = doc.slug;
    if (!slug) return;
    const prev = seen.get(slug);
    if (prev) {
      remove.push(doc._id.toString());
    } else {
      seen.set(slug, doc._id.toString());
    }
  });

  if (remove.length) {
    await CategoryModel.deleteMany({ _id: { $in: remove } });
  }
}

async function seedDefaults() {
  await cleanupDuplicates();

  for (const name of seedNames) {
    const slug = slugify(name);
    await CategoryModel.updateOne(
      { slug },
      {
        $setOnInsert: {
          id: randomUUID(),
          name,
          slug,
        },
      },
      { upsert: true }
    ).catch(() => undefined);
  }
}

class CategoriesService {
  private ready: Promise<void>;

  constructor() {
    this.ready = seedDefaults();
  }

  private async ensureReady() {
    await this.ready;
  }

  private validateName(name: string) {
    const trimmed = (name ?? "").trim();
    if (!trimmed) throw new Error("El campo no puede estar vacio");
    if (trimmed.length < MIN) throw new Error(`Minimo ${MIN} caracteres`);
    if (trimmed.length > MAX) throw new Error(`Maximo ${MAX} caracteres`);
    if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s.\-]+$/.test(trimmed)) {
      throw new Error("Solo letras, numeros, espacios, punto y guion");
    }
    const bad = FORBIDDEN.find((word) => trimmed.toLowerCase().includes(word));
    if (bad) throw new Error("Contiene palabras invalidas");
    return trimmed;
  }

  async list(): Promise<Category[]> {
    await this.ensureReady();
    const docs = await CategoryModel.find().sort({ name: 1 }).lean<CategoryDoc[]>();
    return docs.map(toDTO);
  }

  async create(name: string): Promise<Category> {
    await this.ensureReady();
    const valid = this.validateName(name);
    const slug = slugify(valid);

    const exists = await CategoryModel.findOne({ slug }).lean();
    if (exists) throw new Error("El tipo de trabajo ya existe");

    const doc = await CategoryModel.create({
      id: randomUUID(),
      name: valid,
      slug,
    });

    return toDTO(doc);
  }

  async getByIds(ids: string[]): Promise<Category[]> {
    await this.ensureReady();
    if (!ids?.length) return [];
    const docs = await CategoryModel.find({ id: { $in: ids } }).lean<CategoryDoc[]>();
    return docs.map(toDTO);
  }
}

export default new CategoriesService();
