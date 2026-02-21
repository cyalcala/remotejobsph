#!/usr/bin/env bun
import { writeFileSync, existsSync } from 'fs';
import { parse } from 'csv-parse/sync';
import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

const CSV_PATH = 'data/jobs.csv';

// Helper to convert string to kebab-case
function toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/[\s_]+/g, '-')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '');
}

const rl = readline.createInterface({ input, output });

async function prompt(question: string): Promise<string> {
    const answer = await rl.question(question);
    return answer.trim();
}

async function select(question: string, options: string[]): Promise<string> {
    console.log(question);
    options.forEach((opt, idx) => console.log(`  ${idx + 1}. ${opt}`));
    while (true) {
        const answer = await prompt(`Select [1-${options.length}]: `);
        const idx = parseInt(answer) - 1;
        if (idx >= 0 && idx < options.length) {
            return options[idx];
        }
        console.log("Invalid option, try again.");
    }
}

async function addJob() {
    console.log("\n--- Add New Remote Job ---\n");

    const name = await prompt("Site name: ");
    if (!name) { console.error("Name is required"); process.exit(1); }

    const url = await prompt("URL: ");
    if (!url) { console.error("URL is required"); process.exit(1); }

    const categoryOptions = ['freelance', 'full-time', 'part-time', 'gig', 'agency'];
    const category = await select("Category:", categoryOptions);

    const tags = await prompt("Tags (semicolon-separated) [e.g. dev;design;marketing]: ");

    const remoteOptions = ['fully-remote', 'hybrid', 'remote-friendly', 'unknown'];
    const remote_type = await select("Remote type:", remoteOptions);

    const ratingInput = await prompt("Rating (1-5, blank to skip): ");
    const rating = ratingInput ? parseFloat(ratingInput) : '';

    const description = await prompt("Description (max 150 chars): ");

    const statusOptions = ['active', 'slow', 'unknown'];
    const hiring_status = await select("Hiring status:", statusOptions);

    const id = toKebabCase(name);
    const last_verified = new Date().toISOString().split('T')[0];

    // Read existing
    const csvContent = await Bun.file(CSV_PATH).text();
    let records: any[];
    try {
      records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
    } catch (err) {
      console.error('❌ Failed to parse existing CSV:', err);
      process.exit(1);
    }

    // Since our source CSV has different headers 'Remote Work Website', 'Links', 'About', 'Category'
    // Let's adapt it to our original schema if that's what was downloaded, but since the instructions
    // talk about writing the same schema back, we should append in the format it exists.
    // The instruction schema: id, name, url, category, tags, remote_type, rating, last_verified, description, hiring_status
    // Wait, the prompt implies jobs.csv has those exact headers, but the data I copied had different ones.
    // To match the prompt's instructions perfectly, I will write the new row with those standard headers
    // But since the actual file has `Remote Work Website,Links,About,Category`, maybe I just append to it manually.
    
    // To be safe against a messed up dataset, let's just append the raw csv row in the format the build script expects.
    // Wait, the build script adapts `Remote Work Website` -> `name` etc. We'll write those columns if it exists.
    const headers = Object.keys(records[0]);
    let newRow = "";

    if (headers.includes('Remote Work Website')) {
        // Assume old downloaded CSV format
        const cleanAbout = description.replace(/"/g, '""');
        newRow = `\n"${name}","${url}","${cleanAbout}","${tags}"`;
    } else {
        // Assume ideal prompt format
        const cleanDesc = description.replace(/"/g, '""');
        newRow = `\n${id},"${name}","${url}",${category},"${tags}",${remote_type},${rating},${last_verified},"${cleanDesc}",${hiring_status}`;
    }

    const newCsvContent = csvContent.trim() + newRow + "\n";
    writeFileSync(CSV_PATH, newCsvContent);

    console.log(`\n✅ Added '${name}' (id: ${id}) — run \`git commit && git push\` to publish`);
    rl.close();
    process.exit(0);
}

addJob().catch((error) => {
    console.error(error);
    rl.close();
});
