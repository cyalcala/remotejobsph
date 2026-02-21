import 'server-only';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { JobSite } from './types';

export async function getAllJobs(): Promise<JobSite[]> {
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'sites.json');
    if (!existsSync(filePath)) return [];
    const raw = readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as JobSite[];
  } catch (error) {
    console.error('Error loading jobs:', error);
    return [];
  }
}

export async function getPHFreelanceJobs(): Promise<JobSite[]> {
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'ph-freelance.json');
    if (!existsSync(filePath)) return [];
    const raw = readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as JobSite[];
  } catch (error) {
    console.error('Error loading PH freelance jobs:', error);
    return [];
  }
}
