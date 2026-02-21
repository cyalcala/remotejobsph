import { readFileSync } from 'fs';
import { join } from 'path';
import type { JobSite } from './types';

export async function getAllJobs(): Promise<JobSite[]> {
  const filePath = join(process.cwd(), 'public', 'data', 'sites.json');
  const raw = readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as JobSite[];
}

