#!/usr/bin/env bun
// @ts-nocheck
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

const PRIMARY_CSV = './data/jobs.csv';
const JOBS8_CSV = './jobs8.csv';

function mergeData() {
    let primaryRecords: any[] = [];
    if (existsSync(PRIMARY_CSV)) {
        const raw = readFileSync(PRIMARY_CSV, 'utf-8');
        primaryRecords = parse(raw, { 
            columns: true, 
            skip_empty_lines: true, 
            relax_quotes: true, 
            relax_column_count: true, 
            skip_records_with_error: true 
        }) as any[];
    }

    const jobs8Raw = readFileSync(JOBS8_CSV, 'utf-8');
    const jobs8Records = parse(jobs8Raw, { 
        columns: true, 
        skip_empty_lines: true, 
        relax_quotes: true, 
        relax_column_count: true, 
        skip_records_with_error: true 
    }) as any[];

    const merged = new Map<string, any>();

    const addRecord = (name: string, url: string, about: string, category: string) => {
        if (!url || !name) return;
        const cleanUrl = url.trim().toLowerCase().replace(/\/$/, '');
        
        // Prioritize existing records if already merged (deduplication)
        if (merged.has(cleanUrl)) return;

        merged.set(cleanUrl, {
            'Remote Work Website': (name || '').trim(),
            'Links': (url || '').trim(),
            'About': (about || '').trim(),
            'Category': category.toLowerCase().trim()
        });
    };

    // 1. Add Primary (Higher priority/Manual edits)
    primaryRecords.forEach((r: any) => {
        addRecord(r['Remote Work Website'], r['Links'], r['About'], r['Category']);
    });

    // 2. Add Jobs8 (Merged pool)
    jobs8Records.forEach((r: any) => {
        addRecord(r['Remote Work Website'], r['Links'], r['About'], r['Category'] || 'agency');
    });

    const finalRecords = Array.from(merged.values());
    const csvContent = stringify(finalRecords, { header: true });
    writeFileSync(PRIMARY_CSV, csvContent);
    console.log(`✅ Merged primary and jobs8 into data/jobs.csv. Total records: ${finalRecords.length}`);
}

mergeData();
