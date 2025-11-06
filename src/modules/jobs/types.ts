export type FixerDTO = {
  id: string;
  name: string;
  city?: string;
  rating?: number;
  reviewsCount?: number;
  avatar?: string | null;
  skills?: string[];
  summary?: string;
};

export type JobWithFixersDTO = {
  jobId: string;
  jobName: string;
  fixers: FixerDTO[];
};
