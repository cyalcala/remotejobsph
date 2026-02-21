import dynamic from 'next/dynamic';
import SearchBox from '@/components/search-box';
import { getAllJobs } from '@/lib/data';

const BeachScene = dynamic(() => import('@/components/beach-scene'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gradient-to-b from-sky-300 to-blue-100 flex items-center justify-center">
    <div className="animate-pulse space-y-4 text-center">
        <div className="h-10 bg-white/20 rounded-lg w-64 mx-auto"></div>
        <div className="h-4 bg-white/20 rounded-lg w-48 mx-auto"></div>
    </div>
  </div>,
});

export default async function HomePage() {
  const jobs = await getAllJobs();

  // Convert raw JobSite to JobSiteUI
  const jobUIs = jobs.map(job => ({
      ...job,
      tags: typeof job.tags === 'string' ? job.tags.split(';') : job.tags
  }));

  return (
    <main className="min-h-screen bg-gray-50/50">
      <BeachScene />
      <SearchBox jobs={jobUIs} />
    </main>
  );
}
