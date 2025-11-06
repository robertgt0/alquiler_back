import Job from "../../../models/job.model";
import User from "../../../models/user.model";

type FixerDTO = {
  id: string;
  name: string;
  city?: string;
  rating?: number;
  reviewsCount?: number;
  summary?: string;
  avatar?: string | null;
  skills: string[]; // ← NOMBRES
};

type JobWithFixersDTO = {
  jobId: string;
  jobName: string;
  fixers: FixerDTO[];
};

export async function listJobsWithFixersService(q?: string): Promise<JobWithFixersDTO[]> {
  const jobs = await Job.find().select("name").lean();

  const out: JobWithFixersDTO[] = [];
  for (const job of jobs) {
    const nameFilter = q ? { name: { $regex: q, $options: "i" } } : {};

    const fixers = await User.find({
      role: "fixer",
      skills: job._id,
      ...nameFilter,
    })
      .select("name city rating reviewsCount summary avatar skills")
      .populate({ path: "skills", select: "name", model: "Job" }) // ← trae nombres
      .lean();

    out.push({
      jobId: String(job._id),
      jobName: job.name,
      fixers: fixers.map((f: any) => ({
        id: String(f._id),
        name: f.name,
        city: f.city,
        rating: f.rating,
        reviewsCount: f.reviewsCount,
        summary: f.summary,
        avatar: f.avatar ?? null,
        skills: Array.isArray(f.skills) ? f.skills.map((s: any) => s?.name).filter(Boolean) : [],
      })),
    });
  }

  // opcional: orden alfabético por nombre de trabajo
  out.sort((a, b) => a.jobName.localeCompare(b.jobName));
  return out;
}
