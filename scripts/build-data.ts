#!/usr/bin/env bun
// @ts-nocheck
import { parse } from 'csv-parse/sync';
import { z } from 'zod';
import { mkdirSync, writeFileSync, existsSync } from 'fs';

import { JobSiteSchema } from '../lib/types';

const CSV_PATH = 'data/jobs.csv';

// Helper to convert string to kebab-case
function toKebabCase(str: string): string {
  const result = str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
  
  return result || 'site'; // Fallback if name is non-latin
}

async function buildData() {
  if (!existsSync(CSV_PATH)) {
    console.error(`❌ Source file not found: ${CSV_PATH}`);
    process.exit(1);
  }

  const csvContent = await Bun.file(CSV_PATH).text();

  let records: any[];
  try {
    // The CSV has headers: Remote Work Website,Links,About,Category
    records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_quotes: true,
    });
  } catch (err) {
    console.error('❌ Failed to parse CSV:', err);
    process.exit(1);
  }

  let errorCount = 0;
  const validJobs = [];
  const ids = new Set();
  const urls = new Set();

  for (let i = 0; i < records.length; i++) {
    const rawRecord = records[i];
    const lineNumber = i + 2; // +1 for header, +1 for 0-index
    
    // Map from the actual CSV headers to our schema
    const categoryFromCsv = (rawRecord['Category'] || 'freelance').toLowerCase();
    
    const record: any = {
      id: toKebabCase(rawRecord['Remote Work Website'] || `site-${i}`),
      name: rawRecord['Remote Work Website'] || '',
      url: rawRecord['Links'] || '',
      category: categoryFromCsv,
      tags: rawRecord['Tags'] || rawRecord['Category'] || 'General',
      remote_type: 'fully-remote', // Default
      rating: '', // Default
      last_verified: new Date().toISOString().split('T')[0], // Default to today
      description: rawRecord['About'] || '',
      hiring_status: 'active' // Default
    };

    // Ensure URL has https://
    if (record.url && !record.url.startsWith('http')) {
        record.url = 'https://' + record.url;
    } else if (record.url && record.url.startsWith('http://')) {
        record.url = record.url.replace('http://', 'https://');
    }

    if (record.description.length > 150) {
      // Silently truncate
      record.description = record.description.substring(0, 147) + '...';
    }

    const result = JobSiteSchema.safeParse(record);

    if (!result.success) {
      console.error(`\n❌ Validation Error on line ${lineNumber} (ID: ${record.id}):`);
      result.error.issues.forEach(issue => {
        console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
      });
      console.error(` Raw Record: `, JSON.stringify(record));
      errorCount++;
      continue;
    }

    const job = result.data;

    // Check custom rules
    if (ids.has(job.id)) {
      let uniqueId = job.id;
      let counter = 1;
      while(ids.has(uniqueId)) {
        uniqueId = `${job.id}-${counter}`;
        counter++;
      }
      job.id = uniqueId;
    }
    ids.add(job.id);

    if (urls.has(job.url)) {
      console.warn(`⚠️ Warning on line ${lineNumber}: Duplicate URL -> ${job.url}. Skipping.`);
      continue;
    }
    urls.add(job.url);

    validJobs.push(job);
  }

  if (errorCount > 0) {
    console.error(`\n🔥 Build failed with ${errorCount} errors. Fix CSV data.`);
    process.exit(1);
  }

  validJobs.sort((a, b) => a.name.localeCompare(b.name));

  const outputDir = 'public/data';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  writeFileSync(`${outputDir}/sites.json`, JSON.stringify(validJobs, null, 2));

  // Build search index
  const searchIndex = validJobs.map(job => ({
    id: job.id,
    name: job.name,
    description: job.description,
    tags: job.tags,
    category: job.category
  }));

  writeFileSync(`${outputDir}/search-index.json`, JSON.stringify(searchIndex, null, 2));

  console.log(`✅ ${validJobs.length} jobs processed, 0 errors`);
}

buildData().catch(console.error);
