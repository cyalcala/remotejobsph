import { z } from 'zod';

export const JobSiteSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, 'Must be kebab-case'),
  name: z.string().min(1),
  url: z.string().url().startsWith('https://'),
  category: z.enum(['freelance', 'full-time', 'part-time', 'gig', 'agency', 'usa', 'australia', 'ph-freelance-groups']),
  tags: z.string(), // raw semicolon-separated string from CSV
  remote_type: z.enum(['fully-remote', 'hybrid', 'remote-friendly', 'unknown']),
  rating: z.union([z.number().min(1).max(5), z.literal('')]),
  last_verified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().max(150),
  hiring_status: z.enum(['active', 'slow', 'unknown']),
});

export type JobSite = z.infer<typeof JobSiteSchema>;

// Derived type for UI (tags parsed to array)
export interface JobSiteUI extends Omit<JobSite, 'tags'> {
  tags: string[];
}
