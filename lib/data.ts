import data from '../public/data/sites.json';
import type { JobSite } from './types';

// The data is generated at build-time by `bun run build-data.ts`
export async function getAllJobs(): Promise<JobSite[]> {
  // In a real app we might read this exactly or if it's imported like a static file it works
  return data as JobSite[];
}
