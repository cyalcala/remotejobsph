
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
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-black/30 z-10" /> {/* Cinematic Overlay */}
        <img 
          src="/lush-background.png" 
          alt="Lush Tropical Beach" 
          className="w-full h-full object-cover scale-105 animate-pulse-slow font-serif"
          style={{ animationDuration: '20s' }}
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 py-12 md:py-24">
        {/* Floating Hero Section */}
        <div className="flex flex-col items-center mb-16 text-center">
            <h1 className="text-5xl md:text-8xl font-black text-white drop-shadow-2xl tracking-tighter mb-4">
                REMOTEJOBS<span className="text-teal-400">PH</span>
            </h1>
            <div className="glass px-6 py-2 rounded-full border border-white/20">
                <p className="text-white md:text-lg font-medium tracking-wide">
                    Lush & Modern Remote Job Portal for Filipinos
                </p>
            </div>
            <p className="text-white/80 text-sm md:text-base font-medium mt-6 max-w-lg drop-shadow-md">
                Search, Click, and Get Hired. Experience the premium way to find your next remote career.
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
