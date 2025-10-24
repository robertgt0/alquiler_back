import { Category } from "../types";
import { randomUUID } from "crypto";

const seedNames = [
  "Plomería","Electricista","Carpintería","Pintura","Arreglo de electrodomésticos",
  "Climatización","Jardinería","Limpieza","Trabajo de techos","Trabajo de pisos",
  "Embalosado","Paneles de yeso","Aislamiento","Arreglo de ventanas","Arreglo de puertas",
  "Reparación de cercas","Mantenimiento de piscinas","Control de plagas","Limpieza de canaletas","Levantador de basura"
];

const store = new Map<string, Category>();

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const FORBIDDEN = ["xxx","spam","invalido","prueba","test"];
const MIN = 3;
const MAX = 40;

class CategoriesService {
  constructor() {
    if (store.size === 0) {
      seedNames.forEach(n => {
        const cat: Category = {
          id: randomUUID(),
          name: n,
          slug: slugify(n),
          createdAt: new Date().toISOString()
        };
        store.set(cat.id, cat);
      });
    }
  }

  list() {
    return Array.from(store.values()).sort((a,b)=> a.name.localeCompare(b.name));
  }

  validateName(name: string) {
    const trimmed = (name ?? "").trim();
    if (!trimmed) throw new Error("El campo no puede estar vacío");
    if (trimmed.length < MIN) throw new Error(`Mínimo ${MIN} caracteres`);
    if (trimmed.length > MAX) throw new Error(`Máximo ${MAX} caracteres`);
    if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s.-]+$/.test(trimmed))
      throw new Error("Solo letras, números, espacios, punto y guión");
    const bad = FORBIDDEN.find(w => trimmed.toLowerCase().includes(w));
    if (bad) throw new Error("Contiene palabras inválidas");
    const exists = this.list().find(c => c.slug === slugify(trimmed));
    if (exists) throw new Error("El tipo de trabajo ya existe");
    return trimmed;
  }

  create(name: string) {
    const valid = this.validateName(name);
    const cat: Category = {
      id: randomUUID(),
      name: valid,
      slug: slugify(valid),
      createdAt: new Date().toISOString()
    };
    store.set(cat.id, cat);
    return cat;
  }

  getByIds(ids: string[]) {
    return ids.map(id => store.get(id)).filter(Boolean) as Category[];
  }
}

export default new CategoriesService();
