// @ts-nocheck
import { readFileSync, writeFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

const CSV_PATH = './data/jobs.csv';

const raw = readFileSync(CSV_PATH, 'utf-8');
const records = parse(raw, {
  columns: true,
  skip_empty_lines: true,
  relax_quotes: true,
}) as any[];

const MANUAL_OVERRIDE: Record<string, { category: string, about: string }> = {
  'Athena': {
    category: 'hiring-filipino-vas',
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
    category: 'hiring-filipino-vas',
    about: 'Specialized staffing agency for healthcare professionals, providing stable remote roles for registered nurses as medical scribes.'
  },
  'Support Shepherd': {
    category: 'hiring-filipino-vas',
    about: 'Executive headhunting firm focused on long-term, high-quality remote career placements for Filipino professionals.'
  },
  'MultiplyMii': {
    category: 'hiring-filipino-vas',
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
    category: 'hiring-filipino-vas',
    about: 'Remote staffing company providing stable, high-paying full-time roles with health benefits and equipment for Filipinos.'
  },
  'Cloudstaff': {
    category: 'hiring-filipino-vas',
    about: 'Leading remote staffing firm offering premium work habitats and long-term careers for Philippine professionals.'
  }
};

const normalize = (records: any[]) => {
  return records.map((r: any) => {
    const name = r['Remote Work Website'].trim();
    const url = r['Links'].trim();
    const aboutRaw = r['About'] || '';
    
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

    let category = r['Category'] || 'agency'; 
    const lowerAbout = aboutRaw.toLowerCase();
    const lowerName = name.toLowerCase();

    // Mapping priorities
    const specialCategories = ['usa', 'australia', 'ph-freelance-groups', 'hiring-filipino-vas'];
    
    // 1. Detect "Hiring Filipino VAs" first as it's the user's focus
    if (lowerAbout.includes('filipino va') || lowerAbout.includes('virtual assistant from the philippines') || lowerAbout.includes('filipino virtual assistant') || lowerAbout.includes('hire filipino')) {
        category = 'hiring-filipino-vas';
    } 
    // 2. Location based
    else if (url.includes('.com.au') || lowerAbout.includes('australian company') || lowerAbout.includes('aussie') || lowerAbout.includes('australia')) {
        category = 'australia';
    } else if (lowerAbout.includes('usa based') || lowerAbout.includes('united states') || lowerAbout.includes('u.s. company') || lowerAbout.includes('u.s. based')) {
        category = 'usa';
    }
    // 3. Fallback to standard categories if not already a special category
    else if (!specialCategories.includes(category)) {
        if (lowerAbout.includes('marketplace') || lowerAbout.includes('direct hiring') || lowerAbout.includes('direct hire') || lowerAbout.includes('link') || lowerAbout.includes('market') || lowerAbout.includes('platform for finding')) {
          category = 'freelance';
        } else if (lowerAbout.includes('full-time') || lowerAbout.includes('career') || lowerAbout.includes('stable') || lowerAbout.includes('long-term')) {
          category = 'full-time';
        } else if (lowerAbout.includes('part-time') || lowerAbout.includes('flexible') || lowerAbout.includes('boutique')) {
          category = 'part-time';
        } else if (lowerAbout.includes('task') || lowerAbout.includes('project-based') || lowerAbout.includes('gig') || lowerAbout.includes('hourly')) {
          category = 'gig';
        } else {
          category = 'agency';
        }
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

    // Final validation
    const validEnums = ['freelance', 'full-time', 'part-time', 'gig', 'agency', 'usa', 'australia', 'ph-freelance-groups', 'hiring-filipino-vas'];
    if (!validEnums.includes(category)) {
        category = 'agency';
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

const csvContent = stringify(updated, {
  header: true,
  columns: ['Remote Work Website', 'Links', 'About', 'Category']
});

writeFileSync(CSV_PATH, csvContent);
console.log('✅ Successfully re-categorized with intelligent descriptions.');
