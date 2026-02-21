
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

const PRIMARY_CSV = './data/jobs.csv';
const JOBS8_CSV = './jobs8.csv';
const JOBS9_CSV = './jobs9.csv';

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
        });
    }

    const jobs8Raw = readFileSync(JOBS8_CSV, 'utf-8');
    const jobs8Records = parse(jobs8Raw, { 
        columns: true, 
        skip_empty_lines: true, 
        relax_quotes: true, 
        relax_column_count: true, 
        skip_records_with_error: true 
    });

    const jobs9Raw = readFileSync(JOBS9_CSV, 'utf-8');
    const jobs9Records = parse(jobs9Raw, { 
        columns: true, 
        skip_empty_lines: true, 
        relax_quotes: true, 
        relax_column_count: true, 
        skip_records_with_error: true 
    });

    const merged = new Map<string, any>();

    // Helper to add record with deduplication
    const addRecord = (name: string, url: string, about: string, category: string) => {
        if (!url || !name) return;
        const cleanUrl = url.trim().toLowerCase().replace(/\/$/, '');
        if (merged.has(cleanUrl)) return;
        
        merged.set(cleanUrl, {
            'Remote Work Website': (name || '').trim(),
            'Links': (url || '').trim(),
            'About': (about || '').trim(),
            'Category': (category || 'agency').trim()
        });
    };

    // 1. Add Primary (highest priority)
    primaryRecords.forEach(r => {
        addRecord(r['Remote Work Website'], r['Links'], r['About'], r['Category']);
    });

    // 2. Add Jobs8 (USA/Australia logic)
    jobs8Records.forEach(r => {
        let cat = r['Category'] || 'agency';
        const about = r['About'] || '';
        const url = r['Links'] || '';
        const name = r['Remote Work Website'] || '';

        // Intelligent Location categorization
        const lowerAbout = about.toLowerCase();
        const lowerName = name.toLowerCase();
        const lowerUrl = url.toLowerCase();

        if (lowerUrl.includes('.com.au') || lowerUrl.includes('.org.au') || lowerAbout.includes('australia') || lowerAbout.includes('aussie') || lowerName.includes('(australia)')) {
            cat = 'australia';
        } else if (lowerAbout.includes('u.s.') || lowerAbout.includes('usa') || lowerAbout.includes('united states') || lowerUrl.includes('.us/')) {
            cat = 'usa';
        }

        addRecord(name, url, about, cat);
    });

    // 3. Add Jobs9 (PH Freelance Groups)
    jobs9Records.forEach(r => {
        const name = r['Group Name'] || r['Remote Work Website'];
        const url = r['Facebook Link'] || r['Links'];
        addRecord(name, url, 'Filipino freelance community group for networking, support, and job leads.', 'ph-freelance-groups');
    });

    const finalRecords = Array.from(merged.values());
    
    const csvContent = stringify(finalRecords, { header: true });
    writeFileSync(PRIMARY_CSV, csvContent);
    
    console.log(`✅ Merged data. Total records: ${finalRecords.length}`);
}

mergeData();
