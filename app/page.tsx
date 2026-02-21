import SearchBox from '@/components/search-box';
import { getAllJobs, getPHFreelanceJobs } from '@/lib/data';
import type { JobSite } from '@/lib/types';

export default async function HomePage() {
  const [jobs, phJobs] = await Promise.all([
    getAllJobs(),
    getPHFreelanceJobs()
  ]);

  const mapToUI = (data: JobSite[]) => data.map(job => ({
      ...job,
      tags: typeof job.tags === 'string' ? job.tags.split(';') : (job.tags || [])
  }));

  const mainJobUIs = mapToUI(jobs);
  const phJobUIs = mapToUI(phJobs);
  const totalCount = mainJobUIs.length + phJobUIs.length;
  
  // Calculate stats for top bar
  const pinoyVACount = mainJobUIs.filter(j => j.category === 'hiring-filipino-vas').length;
  const gigCount = mainJobUIs.filter(j => j.category === 'gig').length;
  const australiaCount = mainJobUIs.filter(j => j.category === 'australia').length;

  return (
    <div className="flex flex-col min-h-screen bg-bg-base">
      
      {/* 5. STATS BAR */}
      <div className="hidden md:flex h-9 bg-[#0d0b18] border-b border-border-subtle items-center justify-center text-[10px] text-text-muted gap-4 z-[110] sticky top-0">
          <span>🌏 <span className="text-accent-green font-medium">{totalCount.toLocaleString()}</span> companies listed</span>
          <span>·</span>
          <span>🇵🇭 <span className="text-accent-green font-medium">{pinoyVACount}</span> Pinoy VA companies</span>
          <span>·</span>
          <span>💼 <span className="text-accent-green font-medium">{gigCount}</span> Gig opportunities</span>
          <span>·</span>
          <span>🦘 <span className="text-accent-green font-medium">{australiaCount}</span> Australia-based</span>
      </div>

      {/* 6. NAVIGATION */}
      <nav className="sticky top-0 md:top-9 h-[56px] bg-bg-surface border-b border-border-subtle z-[100] w-full">
        <div className="max-w-[1200px] mx-auto h-full px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className="text-lg" role="img" aria-label="PH Flag">🇵🇭</span>
                <span className="text-base font-semibold text-primary">RemoteJobsPH</span>
            </div>
            
            <div className="hidden md:block text-[10px] text-text-muted font-medium">
                ✨ <span className="text-text-primary">{totalCount}</span> companies hiring now
            </div>

            <button className="bg-accent-green text-[#0d0b18] font-bold text-xs px-4 py-2 rounded-lg hover:brightness-110 md:inline-flex hidden">
                + Submit Company
            </button>
            <button className="bg-accent-green text-[#0d0b18] font-bold text-lg w-9 h-9 flex items-center justify-center rounded-full hover:brightness-110 md:hidden">
                +
            </button>
        </div>
      </nav>

      <main className="flex-grow">
        <SearchBox jobs={mainJobUIs} phJobs={phJobUIs} />
      </main>

      {/* 27. FOOTER */}
      <footer className="bg-bg-base border-t border-border-subtle py-10 mt-12 px-6">
          <div className="max-w-[1200px] mx-auto">
              <div className="flex flex-wrap items-center gap-x-2 text-xs text-text-muted font-medium">
                  <span className="text-text-primary font-semibold">🇵🇭 RemoteJobsPH</span>
                  <span className="opacity-40">·</span>
                  <span>Remote work for Filipinos</span>
                  <span className="opacity-40">·</span>
                  <span>{totalCount.toLocaleString()} companies listed</span>
              </div>
              
              <p className="text-[10px] text-text-muted mt-2 leading-relaxed max-w-[500px]">
                  Built with ❤️ for Filipino remote workers · Not affiliated with any company listed · Data updated manually
              </p>

              <div className="flex gap-4 mt-6">
                  <a href="#" className="text-xs text-accent-green hover:underline">
                      📬 Submit a company →
                  </a>
                  <a href="#" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
                      🐛 Report an issue →
                  </a>
              </div>
          </div>
      </footer>
    </div>
  );
}
