import { FilterQuery, Types } from "mongoose";
import {
  FixerDoc,
  FixerModel,
  PaymentAccount,
  PaymentMethod,
  Location,
} from "../models/Fixer";
import { UserModel } from "../../../models/User";
import type { UserDoc } from "../../../models/User";
import categoriesService from "../../categories/services/categories.service";
import type { Category } from "../../categories/types";

export type FixerRecord = {
  id: string;
  userId: string;
  ci?: string;
  location?: Location;
  categories?: string[];
  paymentMethods?: PaymentMethod[];
  paymentAccounts?: Partial<Record<PaymentMethod, PaymentAccount>>;
  termsAccepted?: boolean;
  createdAt: string;
  updatedAt: string;
  name?: string;
  city?: string;
  photoUrl?: string;
  whatsapp?: string;
  bio?: string;
  jobsCount?: number;
  ratingAvg?: number;
  ratingCount?: number;
  memberSince?: string;
};

export type FixerWithCategories = FixerRecord & { categoriesInfo: Category[] };

export type FixersByCategoryResult = {
  category: Category;
  total: number;
  fixers: FixerWithCategories[];
};

export type CreateFixerDTO = {
  userId: string;
  ci: string;
  location?: Location;
  categories?: string[];
  paymentMethods?: PaymentMethod[];
  paymentAccounts?: Partial<Record<PaymentMethod, PaymentAccount>>;
  termsAccepted?: boolean;
  name?: string;
  city?: string;
  photoUrl?: string;
  whatsapp?: string;
  bio?: string;
  jobsCount?: number;
  ratingAvg?: number;
  ratingCount?: number;
  memberSince?: Date | string;
  fixerId?: string;
};

export type UpdateFixerDTO = Partial<CreateFixerDTO>;

function toRecord(doc: FixerDoc | null): FixerRecord | null {
  if (!doc) return null;
  const plain = doc.toObject({ flattenMaps: true }) as FixerDoc & {
    paymentAccounts?: Record<PaymentMethod, PaymentAccount>;
  };

  return {
    id: plain.fixerId,
    userId: plain.userId,
    ci: plain.ci,
    location: plain.location,
    categories: plain.categories,
    paymentMethods: plain.paymentMethods,
    paymentAccounts: plain.paymentAccounts ?? {},
    termsAccepted: plain.termsAccepted,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    name: plain.name,
    city: plain.city,
    photoUrl: plain.photoUrl,
    whatsapp: plain.whatsapp,
    bio: plain.bio,
    jobsCount: plain.jobsCount,
    ratingAvg: plain.ratingAvg,
    ratingCount: plain.ratingCount,
    memberSince: plain.memberSince ? new Date(plain.memberSince).toISOString() : undefined,
  };
}

function buildIdQuery(id: string): FilterQuery<FixerDoc> {
  const or: FilterQuery<FixerDoc>[] = [{ fixerId: id }];
  if (Types.ObjectId.isValid(id)) {
    or.push({ _id: new Types.ObjectId(id) });
  }
  return or.length === 1 ? or[0] : { $or: or };
}

function buildFullName(user: Partial<UserDoc> & { nombre?: string; apellido?: string }) {
  const parts = [user.nombre, user.apellido]
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean);
  return parts.length ? parts.join(" ") : undefined;
}

function extractCity(user: Partial<UserDoc>) {
  const location = (user.ubicacion ?? user.location ?? {}) as any;
  return (
    location?.ciudad ??
    location?.city ??
    location?.municipio ??
    location?.departamento ??
    location?.provincia ??
    undefined
  )?.toString();
}

function extractPhone(user: Partial<UserDoc>) {
  return (
    user.telefono ??
    (user as any).celular ??
    (user as any).whatsapp ??
    undefined
  )?.toString();
}

function extractBio(user: Partial<UserDoc>) {
  return (
    (user as any).bio ??
    (user as any).sobreMi ??
    (user as any).descripcion ??
    (user as any).about ??
    undefined
  )?.toString();
}

function extractPhoto(user: Partial<UserDoc>) {
  return (
    user.fotoPerfil ??
    (user as any).avatar ??
    (user as any).imagen ??
    (user as any).photoUrl ??
    undefined
  )?.toString();
}

async function attachUserData(record: FixerRecord | null): Promise<FixerRecord | null> {
  if (!record) return null;
  if (!record.userId || !Types.ObjectId.isValid(record.userId)) {
    return record;
  }

  const user = await UserModel.findById(record.userId).lean<UserDoc>().catch(() => null);
  if (!user) return record;

  const merged: FixerRecord = {
    ...record,
    name: record.name ?? buildFullName(user) ?? user.nombre ?? undefined,
    city: record.city ?? extractCity(user),
    photoUrl: record.photoUrl ?? extractPhoto(user),
    whatsapp: record.whatsapp ?? extractPhone(user),
    bio: record.bio ?? extractBio(user) ?? undefined,
    memberSince:
      record.memberSince ??
      (user.createdAt ? new Date(user.createdAt).toISOString() : undefined),
  };

  if (merged.jobsCount === undefined) {
    const stats = (user as any).estadisticas ?? (user as any).stats ?? {};
    const jobs = stats?.trabajos ?? stats?.trabajosRegistrados ?? stats?.totalTrabajos;
    if (typeof jobs === "number") merged.jobsCount = jobs;
  }

  if (merged.ratingAvg === undefined) {
    const stats = (user as any).estadisticas ?? (user as any).stats ?? {};
    const rating = stats?.promedioCalificacion ?? stats?.rating ?? stats?.ratingPromedio;
    if (typeof rating === "number") merged.ratingAvg = rating;
  }

  if (merged.ratingCount === undefined) {
    const stats = (user as any).estadisticas ?? (user as any).stats ?? {};
    const ratingCount = stats?.numeroCalificaciones ?? stats?.ratingCount;
    if (typeof ratingCount === "number") merged.ratingCount = ratingCount;
  }

  return merged;
}

class FixersService {
  async create(data: CreateFixerDTO) {
    if (!Types.ObjectId.isValid(data.userId)) {
      throw new Error("userId invalido: se espera ObjectId de Mongo");
    }

    const user = await UserModel.findById(data.userId).lean<UserDoc>();
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const userObjectId = new Types.ObjectId(data.userId);
    const userIdStr = userObjectId.toString();

    const existingByUser = await FixerModel.findOne({ userId: userIdStr });
    if (existingByUser) {
      existingByUser.ci = data.ci;
      if (data.location !== undefined) existingByUser.location = data.location;
      if (data.categories !== undefined) existingByUser.categories = data.categories;
      if (data.paymentMethods !== undefined) existingByUser.paymentMethods = data.paymentMethods;
      if (data.paymentAccounts !== undefined) existingByUser.paymentAccounts = data.paymentAccounts ?? {};
      if (data.termsAccepted !== undefined) existingByUser.termsAccepted = Boolean(data.termsAccepted);
      if (!existingByUser.memberSince) existingByUser.memberSince = user.createdAt ?? new Date();
      if (!existingByUser.name) existingByUser.name = buildFullName(user) ?? user.nombre ?? undefined;
      if (!existingByUser.city) existingByUser.city = extractCity(user) ?? existingByUser.city;
      if (!existingByUser.photoUrl) existingByUser.photoUrl = extractPhoto(user) ?? existingByUser.photoUrl;
      if (!existingByUser.whatsapp) existingByUser.whatsapp = extractPhone(user) ?? existingByUser.whatsapp;
      if (!existingByUser.bio) existingByUser.bio = extractBio(user) ?? existingByUser.bio;
      await existingByUser.save();
      return attachUserData(toRecord(existingByUser));
    }

    const now = new Date();
    const fixerId = data.fixerId ?? userIdStr;

    const doc = await FixerModel.create({
      fixerId,
      userId: userIdStr,
      ci: data.ci,
      location: data.location,
      categories: data.categories ?? [],
      paymentMethods: data.paymentMethods ?? [],
      paymentAccounts: data.paymentAccounts ?? {},
      termsAccepted: Boolean(data.termsAccepted ?? false),
      name: data.name ?? buildFullName(user) ?? user.nombre ?? undefined,
      city: data.city ?? extractCity(user),
      photoUrl: data.photoUrl ?? extractPhoto(user),
      whatsapp: data.whatsapp ?? extractPhone(user),
      bio: data.bio ?? extractBio(user),
      jobsCount: data.jobsCount ?? 0,
      ratingAvg: data.ratingAvg ?? 0,
      ratingCount: data.ratingCount ?? 0,
      memberSince: data.memberSince ? new Date(data.memberSince) : user.createdAt ?? now,
    });

    await UserModel.updateOne(
      { _id: userObjectId },
      { $set: { rol: "fixer" } }
    ).catch(() => undefined);

    return attachUserData(toRecord(doc));
  }

  async update(id: string, data: UpdateFixerDTO) {
    const update: Record<string, unknown> = {};

    if (data.userId !== undefined) update.userId = data.userId;
    if (data.ci !== undefined) update.ci = data.ci;
    if (data.location !== undefined) update.location = data.location;
    if (data.categories !== undefined) update.categories = data.categories;
    if (data.paymentMethods !== undefined) update.paymentMethods = data.paymentMethods;
    if (data.paymentAccounts !== undefined) update.paymentAccounts = data.paymentAccounts;
    if (data.termsAccepted !== undefined) update.termsAccepted = Boolean(data.termsAccepted);
    if (data.name !== undefined) update.name = data.name;
    if (data.city !== undefined) update.city = data.city;
    if (data.photoUrl !== undefined) update.photoUrl = data.photoUrl;
    if (data.whatsapp !== undefined) update.whatsapp = data.whatsapp;
    if (data.bio !== undefined) update.bio = data.bio;
    if (data.jobsCount !== undefined) update.jobsCount = data.jobsCount;
    if (data.ratingAvg !== undefined) update.ratingAvg = data.ratingAvg;
    if (data.ratingCount !== undefined) update.ratingCount = data.ratingCount;
    if (data.memberSince !== undefined) update.memberSince = data.memberSince ? new Date(data.memberSince) : null;

    if (Object.keys(update).length === 0) {
      const existing = await FixerModel.findOne(buildIdQuery(id));
      return toRecord(existing);
    }

    const doc = await FixerModel.findOneAndUpdate(
      buildIdQuery(id),
      { $set: update },
      {
        new: true,
        runValidators: true,
        timestamps: true,
      }
    );

    return attachUserData(toRecord(doc));
  }

  async getById(id: string) {
    const doc = await FixerModel.findOne(buildIdQuery(id));
    return attachUserData(toRecord(doc));
  }

  async getByUserId(userId: string) {
    const doc = await FixerModel.findOne({ userId });
    return attachUserData(toRecord(doc));
  }

  async findByCI(ci: string) {
    const doc = await FixerModel.findOne({ ci });
    return attachUserData(toRecord(doc));
  }

  async isCIUnique(ci: string, excludeId?: string) {
    const doc = await FixerModel.findOne({ ci }).select(["fixerId"]);
    if (!doc) return true;
    if (!excludeId) return false;

    if (doc.fixerId === excludeId) return true;
    if (Types.ObjectId.isValid(excludeId) && doc._id.equals(new Types.ObjectId(excludeId))) {
      return true;
    }
    return false;
  }

  async listByCategories(search?: string) {
    const trimmed = search?.trim();
    const filter: FilterQuery<FixerDoc> = {};

    if (trimmed) {
      const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");
      filter.$or = [{ name: regex }, { city: regex }, { bio: regex }];
    }

    const docs = await FixerModel.find(filter);
    if (!docs.length) return [];

    const records = await Promise.all(docs.map(async (doc) => attachUserData(toRecord(doc))));
    const valid = records.filter((rec): rec is FixerRecord => Boolean(rec && rec.categories && rec.categories.length));
    if (!valid.length) return [];

    const categoryIds = new Set<string>();
    valid.forEach((rec) => {
      (rec.categories ?? []).forEach((id) => {
        if (id) categoryIds.add(id);
      });
    });

    if (!categoryIds.size) return [];

    const categories = await categoriesService.getByIds(Array.from(categoryIds));
    if (!categories.length) return [];

    const categoryById = new Map<string, Category>();
    const categoryMap = new Map<string, Category>();
    categories.forEach((cat) => {
      categoryById.set(cat.id, cat);
      [cat.id, cat.slug, cat.name, cat.name.toLowerCase()].forEach((key) => {
        if (typeof key === "string" && key.trim()) {
          categoryMap.set(key, cat);
        }
      });
    });
    if (!categoryMap.size || !categoryById.size) return [];

    const grouped = new Map<string, FixerWithCategories[]>();

    valid.forEach((rec) => {
      const categoriesInfo = (rec.categories ?? [])
        .map((raw) => {
          const candidate = typeof raw === "string" ? raw.trim() : "";
          if (!candidate) return undefined;
          return categoryMap.get(candidate) ?? categoryMap.get(candidate.toLowerCase());
        })
        .filter((cat): cat is Category => Boolean(cat));

      if (!categoriesInfo.length) return;

      const fixerWithCategories: FixerWithCategories = {
        ...rec,
        categoriesInfo,
      };

      (rec.categories ?? []).forEach((raw) => {
        const candidate = typeof raw === "string" ? raw.trim() : "";
        const key = candidate ? candidate : "";
        const effectiveKey = key ? key : "";
        const category =
          key && (categoryMap.get(key) ?? categoryMap.get(key.toLowerCase()));
        if (!category) return;
        const mapKey = category.id;
        if (!grouped.has(mapKey)) grouped.set(mapKey, []);
        grouped.get(mapKey)!.push(fixerWithCategories);
      });
    });

    const result = Array.from(grouped.entries())
      .map(([catId, fixers]) => {
        const category = categoryById.get(catId);
        if (!category) return null;

        const uniqueFixers = Array.from(new Map(fixers.map((fixer) => [fixer.id, fixer])).values());
        uniqueFixers.sort((a, b) => {
          const ratingDiff = (b.ratingAvg ?? 0) - (a.ratingAvg ?? 0);
          if (ratingDiff !== 0) return ratingDiff;
          return (a.name ?? "").localeCompare(b.name ?? "");
        });

        return {
          category,
          total: uniqueFixers.length,
          fixers: uniqueFixers,
        } as FixersByCategoryResult;
      })
      .filter((item): item is FixersByCategoryResult => item !== null)
      .sort((a, b) => a.category.name.localeCompare(b.category.name));

    return result;
  }

  async updateLocation(id: string, location: Location) {
    return this.update(id, { location });
  }

  async updateCategories(id: string, categories: string[]) {
    return this.update(id, { categories });
  }

  async updatePaymentInfo(
    id: string,
    methods: PaymentMethod[],
    accounts?: Partial<Record<PaymentMethod, PaymentAccount>>
  ) {
    return this.update(id, {
      paymentMethods: methods,
      paymentAccounts: accounts ?? {},
    });
  }

  async setTermsAccepted(id: string, accepted: boolean) {
    return this.update(id, { termsAccepted: accepted });
  }
}

export default new FixersService();

