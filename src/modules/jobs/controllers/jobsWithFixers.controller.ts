import { Request, Response } from "express";
import { listJobsWithFixersService } from "../services/jobs.service";

export async function getJobsWithFixers(req: Request, res: Response) {
  try {
    const q = typeof req.query.q === "string" ? req.query.q : undefined;
    const data = await listJobsWithFixersService(q);
    res.json(data);
  } catch (e) {
    console.error("getJobsWithFixers error", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
