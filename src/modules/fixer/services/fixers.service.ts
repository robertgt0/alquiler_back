import { randomUUID } from "crypto";

export type PaymentMethod = "card" | "qr" | "cash";

export type PaymentAccount = {
  holder: string;
  accountNumber: string;
};

// ⬇️ NUEVO: Tipo para trabajos del fixer
export type FixerJob = {
  jobId: string;
  jobName: string;
  customDescription?: string;
  generalDescription: string;
};

export type FixerMem = {
  id: string;
  userId: string;
  ci?: string;
  location?: { lat: number; lng: number; address?: string };
  categories?: string[];
  fixerJobs?: FixerJob[]; // ⬇️ NUEVO
  paymentMethods?: PaymentMethod[];
  paymentAccounts?: Partial<Record<PaymentMethod, PaymentAccount>>;
  termsAccepted?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateFixerDTO = {
  userId: string;
  ci?: string;
  location?: { lat: number; lng: number; address?: string };
  categories?: string[];
  fixerJobs?: FixerJob[]; // ⬇️ NUEVO
  paymentMethods?: PaymentMethod[];
  paymentAccounts?: Partial<Record<PaymentMethod, PaymentAccount>>;
  termsAccepted?: boolean;
};

export type UpdateFixerDTO = Partial<CreateFixerDTO>;

const store = new Map<string, FixerMem>();

class FixersService {
  create(data: CreateFixerDTO) {
    const now = new Date().toISOString();
    const id = randomUUID();
    const fixer: FixerMem = {
      id,
      userId: data.userId,
      ci: data.ci,
      location: data.location,
      categories: data.categories ?? [],
      fixerJobs: data.fixerJobs ?? [], // ⬇️ NUEVO
      paymentMethods: data.paymentMethods ?? [],
      paymentAccounts: data.paymentAccounts ?? {},
      termsAccepted: Boolean(data.termsAccepted),
      createdAt: now,
      updatedAt: now,
    };
    store.set(id, fixer);
    return fixer;
  }

  update(id: string, data: UpdateFixerDTO) {
    const current = store.get(id);
    if (!current) return null;

    const updated: FixerMem = {
      ...current,
      ...(data.userId !== undefined ? { userId: data.userId } : {}),
      ...(data.ci !== undefined ? { ci: data.ci } : {}),
      ...(data.location !== undefined ? { location: data.location } : {}),
      ...(data.categories !== undefined ? { categories: data.categories } : {}),
      ...(data.fixerJobs !== undefined ? { fixerJobs: data.fixerJobs } : {}), // ⬇️ NUEVO
      ...(data.paymentMethods !== undefined ? { paymentMethods: data.paymentMethods } : {}),
      ...(data.paymentAccounts !== undefined ? { paymentAccounts: data.paymentAccounts } : {}),
      ...(data.termsAccepted !== undefined ? { termsAccepted: Boolean(data.termsAccepted) } : {}),
      updatedAt: new Date().toISOString(),
    };

    store.set(id, updated);
    return updated;
  }

  getById(id: string) {
    return store.get(id) || null;
  }

  findByCI(ci: string) {
    for (const fixer of store.values()) {
      if (fixer.ci === ci) return fixer;
    }
    return null;
  }

  isCIUnique(ci: string, excludeId?: string) {
    const found = this.findByCI(ci);
    if (!found) return true;
    if (excludeId && found.id === excludeId) return true;
    return false;
  }

  updateLocation(id: string, location: { lat: number; lng: number; address?: string }) {
    return this.update(id, { location });
  }

  updateCategories(id: string, categories: string[]) {
    return this.update(id, { categories });
  }

  updatePaymentInfo(id: string, methods: PaymentMethod[], accounts?: Partial<Record<PaymentMethod, PaymentAccount>>) {
    return this.update(id, { paymentMethods: methods, paymentAccounts: accounts ?? {} });
  }

  setTermsAccepted(id: string, accepted: boolean) {
    return this.update(id, { termsAccepted: accepted });
  }

  // ⬇️⬇️⬇️ NUEVOS MÉTODOS PARA FIXERJOBS ⬇️⬇️⬇️
  
  updateFixerJobs(id: string, fixerJobs: FixerJob[]) {
    return this.update(id, { fixerJobs });
  }

  addFixerJob(id: string, job: FixerJob) {
    const current = this.getById(id);
    if (!current) return null;
    
    const existingJobs = current.fixerJobs || [];
    const jobIndex = existingJobs.findIndex(j => j.jobId === job.jobId);
    
    let updatedJobs: FixerJob[];
    if (jobIndex >= 0) {
      updatedJobs = [...existingJobs];
      updatedJobs[jobIndex] = job;
    } else {
      updatedJobs = [...existingJobs, job];
    }
    
    return this.update(id, { fixerJobs: updatedJobs });
  }

  getFixerJobDescription(fixerId: string, jobId: string): string | null {
    const fixer = this.getById(fixerId);
    if (!fixer || !fixer.fixerJobs) return null;
    
    const job = fixer.fixerJobs.find(j => j.jobId === jobId);
    return job?.customDescription || job?.generalDescription || null;
  }
}

export default new FixersService();