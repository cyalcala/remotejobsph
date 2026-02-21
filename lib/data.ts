import 'server-only';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { JobSite } from './types';

export async function getAllJobs(): Promise<JobSite[]> {
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'sites.json');
    const raw = readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as JobSite[];
  } catch (error) {
    console.error('Error loading jobs:', error);
    return [];
  }
}


