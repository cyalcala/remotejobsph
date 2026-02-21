import { z } from 'zod';

export const JobSiteSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, 'Must be kebab-case'),
  name: z.string().min(1),
  url: z.string().url(),
  category: z.enum(['gig', 'agency', 'usa', 'australia', 'ph-freelance-groups', 'hiring-filipino-vas', 'ph-freelancing']),
  tags: z.string(), // raw semicolon-separated string from CSV
  remote_type: z.enum(['fully-remote', 'hybrid', 'remote-friendly', 'unknown', 'remote']),
  rating: z.any(),
  last_verified: z.string(),
  description: z.string(),
  hiring_status: z.string(),
});

export type JobSite = z.infer<typeof JobSiteSchema>;

// Derived type for UI (tags parsed to array)
export interface JobSiteUI extends Omit<JobSite, 'tags'> {
  tags: string[];
}
