
import { readFileSync, writeFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

const CSV_PATH = './data/jobs.csv';

const raw = readFileSync(CSV_PATH, 'utf-8');
const records = parse(raw, {
  columns: true,
  skip_empty_lines: true,
});

const MANUAL_OVERRIDE: Record<string, { category: string, about: string }> = {
  'Athena': {
    category: 'full-time',
    about: 'Premier agency offering world-class training and high-paying full-time executive assistant roles for top-tier global clients.'
  },
  'OnlineJobs': {
    category: 'freelance',
    about: 'The largest and most established marketplace for finding direct-hire remote jobs in the Philippines with thousands of listings.'
  },
  'VirtualStaff': {
    category: 'freelance',
    about: 'A popular marketplace where Filipinos can create profiles and find direct remote work from employers in the US, UK, and Australia.'
  },
  'Hello Rache': {
    category: 'full-time',
    about: 'Specialized staffing agency for healthcare professionals, providing stable remote roles for registered nurses as medical scribes.'
  },
  'Support Shepherd': {
    category: 'full-time',
    about: 'Executive headhunting firm focused on long-term, high-quality remote career placements for Filipino professionals.'
  },
  'MultiplyMii': {
    category: 'full-time',
    about: 'End-to-end recruitment firm connecting talented Filipinos with high-growth e-commerce businesses globally.'
  },
  'TaskBullet': {
    category: 'gig',
    about: 'Platform offering a "bucket system" for virtual assistant services, suitable for flexible project-based and hourly task work.'
  },
  'Magic Virtual': {
    category: 'gig',
    about: 'On-demand personal assistant app connecting users with VAs for quick tasks and 24/7 on-demand support.'
  },
  'FreeUp': {
    category: 'freelance',
    about: 'High-end freelance marketplace that pre-vets talent, connecting top 1% of Filipino freelancers with global business owners.'
  },
  'Upwork': {
    category: 'freelance',
    about: 'The worlds largest freelance platform offering a vast range of remote opportunities for Filipino specialists and agencies.'
  },
  'EVirtualAssistants': {
    category: 'freelance',
    about: 'Marketplace platform focused on providing direct communication between clients and Filipino virtual assistants.'
  },
  'GoHireNow': {
    category: 'freelance',
    about: 'Modern hiring platform connecting Filipino remote talent directly with international business owners.'
  },
  'BruntWork': {
    category: 'full-time',
    about: 'Remote staffing company providing stable, high-paying full-time roles with health benefits and equipment for Filipinos.'
  },
  'Cloudstaff': {
    category: 'full-time',
    about: 'Leading remote staffing firm offering premium work habitats and long-term careers for Philippine professionals.'
  }
};

const normalize = (records: any[]) => {
  return records.map((r: any) => {
    let name = r['Remote Work Website'].trim();
    const url = r['Links'].trim();
    const aboutRaw = r['About'];
    
    // Check for manual overrides first (fuzzy match)
    const matchKey = Object.keys(MANUAL_OVERRIDE).find(key => name.toLowerCase().includes(key.toLowerCase()));
    
    if (matchKey) {
        return {
            'Remote Work Website': name,
            'Links': url,
            'About': MANUAL_OVERRIDE[matchKey].about,
            'Category': MANUAL_OVERRIDE[matchKey].category
        };
    }

    let category = 'agency'; // Default
    const lowerAbout = aboutRaw.toLowerCase();

    // Heuristics
    if (lowerAbout.includes('marketplace') || lowerAbout.includes('direct hiring') || lowerAbout.includes('direct hire') || lowerAbout.includes('link') || lowerAbout.includes('market') || lowerAbout.includes('platform for finding')) {
      category = 'freelance';
    } else if (lowerAbout.includes('full-time') || lowerAbout.includes('career') || lowerAbout.includes('stable') || lowerAbout.includes('long-term')) {
      category = 'full-time';
    } else if (lowerAbout.includes('part-time') || lowerAbout.includes('flexible') || lowerAbout.includes('boutique')) {
      category = 'part-time';
    } else if (lowerAbout.includes('task') || lowerAbout.includes('project-based') || lowerAbout.includes('gig') || lowerAbout.includes('hourly')) {
      category = 'gig';
    } else if (lowerAbout.includes('agency') || lowerAbout.includes('staffing') || lowerAbout.includes('outsourcing') || lowerAbout.includes('bpo')) {
      category = 'agency';
    }

    // Clean description
    let desc = aboutRaw
      .replace(/\[\d+\]/g, '')
      .replace(/CTTO:.*$/i, '')
      .replace(/Every successful VA[\s\S]*$/i, '')
      .replace(/^A .* platform that/, 'Platform that')
      .replace(/^A .* company that/, 'Agency')
      .replace(/^An? .* agency/, 'Agency')
      .replace(/^UK-based/, 'UK')
      .replace(/^Australian-based/, 'Australian')
      .trim();

    // Smart capitalization
    if (desc.length > 0) {
        desc = desc.charAt(0).toUpperCase() + desc.slice(1);
    }

    if (desc.length > 145) {
      desc = desc.substring(0, 142) + '...';
    }

    return {
      'Remote Work Website': name,
      'Links': url,
      'About': desc,
      'Category': category
    };
  });
};

const updated = normalize(records);

const csvContent = [
  'Remote Work Website,Links,About,Category',
  ...updated.map(r => `"${r['Remote Work Website']}","${r['Links']}","${r['About'].replace(/"/g, '""')}","${r['Category']}"`)
].join('\n');

writeFileSync(CSV_PATH, csvContent);
console.log('✅ Successfully re-categorized with intelligent descriptions.');
