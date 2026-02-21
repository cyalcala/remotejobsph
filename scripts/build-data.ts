#!/usr/bin/env bun
// @ts-nocheck
import { parse } from 'csv-parse/sync';
import { z } from 'zod';
import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// Schema from lib/types.ts
const JobSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  url: z.string().url(),
  category: z.string(),
  tags: z.string(),
  remote_type: z.string(),
  rating: z.any(),
  last_verified: z.string(),
  description: z.string(),
  hiring_status: z.string(),
});

function toKebabCase(str: string): string {
  const result = str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
  
  return result || 'site-' + Math.random().toString(36).substr(2, 5);
}

function processCSV(filePath: string) {
  if (!existsSync(filePath)) return [];
  const csvContent = readFileSync(filePath, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
  });

  return records.map(r => {
    const name = r['Remote Work Website'] || r['Group Name'] || '';
    const url = r['Links'] || r['Facebook Link'] || '';
    const category = r['Category'] || 'agency';
    const about = r['About'] || '';

    return {
      id: toKebabCase(name),
      name,
      url: url.startsWith('http') ? url : `https://${url}`,
      category,
      tags: category,
      remote_type: 'fully-remote', // Default for these lists
      rating: '',
      last_verified: new Date().toISOString().split('T')[0],
      description: about,
      hiring_status: 'active'
    };
  });
}

async function buildData() {
  const mainJobs = processCSV('./data/jobs.csv');
  const phFreelance = processCSV('./jobs9.csv');

  const dataDir = join(process.cwd(), 'public', 'data');
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

  writeFileSync(join(dataDir, 'sites.json'), JSON.stringify(mainJobs, null, 2));
  writeFileSync(join(dataDir, 'ph-freelance.json'), JSON.stringify(phFreelance, null, 2));
  
  // Also build search index for main
  writeFileSync(join(dataDir, 'search-index.json'), JSON.stringify(mainJobs));

  console.log(`✅ Build complete. Main: ${mainJobs.length} records. PH Freelance: ${phFreelance.length} records.`);
}

buildData().catch(console.error);
