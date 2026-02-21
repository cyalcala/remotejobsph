
import SearchBox from '@/components/search-box';
import { getAllJobs } from '@/lib/data';

export default async function HomePage() {
  const jobs = await getAllJobs();

  // Convert raw JobSite to JobSiteUI
  const jobUIs = jobs.map(job => ({
      ...job,
      tags: typeof job.tags === 'string' ? job.tags.split(';') : job.tags
  }));

  return (
    <main className="relative min-h-screen">
      {/* Cinematic Background */}
      <div className="fixed inset-0 -z-10 bg-[#001a2a]">
        <div className="absolute inset-0 bg-black/20 z-10" /> {/* Subtle Cinematic Overlay */}
        <img 
          src="/philippines-beach.png" 
          alt="Relaxing Philippines Beach" 
          className="w-full h-full object-cover scale-100 animate-fade-in"
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 py-16 md:py-32">
        {/* Floating Hero Section */}
        <div className="flex flex-col items-center mb-16 text-center">
            <h1 className="text-6xl md:text-9xl font-black text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] tracking-tighter mb-4 uppercase">
                REMOTEJOBS<span className="text-teal-400">PH</span>
            </h1>
            <p className="text-white/90 text-sm md:text-lg font-bold mt-4 max-w-lg drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] uppercase tracking-[0.2em]">
                Your Gateway to Global Careers
            </p>
        </div>

        <SearchBox jobs={jobUIs} />
      </div>

      {/* Background aesthetic glow */}
      <div className="fixed top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />
    </main>
  );
}
