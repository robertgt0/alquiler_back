import { randomUUID } from "crypto";
import { Types } from "mongoose";
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
const DESC_MIN = 20;
const DESC_MAX = 800;

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
    description: typeof doc.description === "string" ? doc.description : "",
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
  };
}

type DuplicateCheckDoc = {
  slug?: string | null;
  _id: Types.ObjectId | string;
};

async function cleanupDuplicates() {
  const docs = (await CategoryModel.find().select("slug").lean().exec()) as DuplicateCheckDoc[];
  const seen = new Map<string, string>();
  const remove: string[] = [];

  docs.forEach(({ slug, _id }) => {
    if (!slug) return;
    const docId = typeof _id === "string" ? _id : _id.toString();
    const prev = seen.get(slug);
    if (prev) {
      remove.push(docId);
    } else {
      seen.set(slug, docId);
    }
  });

  if (remove.length) {
    await CategoryModel.deleteMany({ _id: { $in: remove } });
  }
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
          description: "",
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

  private validateDescription(description: string) {
    const trimmed = (description ?? "").trim();
    if (!trimmed) throw new Error("Debes ingresar una descripcion general");
    if (trimmed.length < DESC_MIN) throw new Error(`Minimo ${DESC_MIN} caracteres`);
    if (trimmed.length > DESC_MAX) throw new Error(`Maximo ${DESC_MAX} caracteres`);
    return trimmed;
  }

  async list(): Promise<Category[]> {
    await this.ensureReady();
    const docs = await CategoryModel.find().sort({ name: 1 }).lean<CategoryDoc[]>();
    return docs.map(toDTO);
  }

  async create(name: string, description: string): Promise<Category> {
    await this.ensureReady();
    const valid = this.validateName(name);
    const slug = slugify(valid);
    const general = this.validateDescription(description);

    const exists = await CategoryModel.findOne({ slug }).lean();
    if (exists) throw new Error("El tipo de trabajo ya existe");

    const doc = await CategoryModel.create({
      id: randomUUID(),
      name: valid,
      slug,
      description: general,
    });

    return toDTO(doc);
  }

  async getByIds(ids: string[]): Promise<Category[]> {
    await this.ensureReady();
    if (!ids?.length) return [];

    const unique = Array.from(new Set(ids.filter(Boolean)));
    if (!unique.length) return [];

    const objectIds = unique
      .filter((value) => Types.ObjectId.isValid(value))
      .map((value) => new Types.ObjectId(value));

    const lower = Array.from(
      new Set(
        unique
          .map((value) => value.toLowerCase?.())
          .filter((value): value is string => typeof value === "string" && value.length > 0)
      )
    );

    const nameMatchers = unique.map((value) => new RegExp(`^${escapeRegex(value)}$`, "i"));

    const orFilters: Record<string, unknown>[] = [
      { id: { $in: unique } },
      { slug: { $in: lower } },
      { name: { $in: nameMatchers } },
    ];

    if (objectIds.length) {
      orFilters.push({ _id: { $in: objectIds } });
    }

    const docs = await CategoryModel.find({ $or: orFilters }).lean<CategoryDoc[]>();
    if (!docs.length) return [];

    const seen = new Map<string, Category>();
    docs.forEach((doc) => {
      const dto = toDTO(doc);
      if (!seen.has(dto.id)) {
        seen.set(dto.id, dto);
      }
    });

    return Array.from(seen.values());
  }
}

export default new CategoriesService();
