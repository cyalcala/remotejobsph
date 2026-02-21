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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 h-14 bg-surface border-b border-structural z-[100] w-full">
        <div className="max-w-[1100px] mx-auto h-full px-6 flex items-center justify-between">
            <div className="flex items-center">
                <span className="text-sm font-semibold text-primary">RemoteJobsPH</span>
                <span className="mx-2 text-[#ddd] text-xs">·</span>
                <span className="text-xs text-secondary hidden md:inline">Remote work for Filipinos</span>
            </div>
            <div className="hidden md:block">
                <a href="#" className="text-sm text-secondary hover:text-accent hover:underline transition-colors flex items-center gap-1">
                    Submit a company <span className="text-accent">→</span>
                </a>
            </div>
        </div>
      </nav>

      {/* Hero Bar */}
      <header className="h-[72px] md:h-[72px] bg-bg-page border-b border-structural flex items-center">
          <div className="max-w-[1100px] w-full mx-auto px-6">
              <h1 className="text-xl font-semibold text-primary">
                  Browse {mainJobUIs.length + phJobUIs.length} remote-friendly companies hiring Filipinos
              </h1>
          </div>
      </header>

      <main className="flex-grow pb-24">
        <SearchBox jobs={mainJobUIs} phJobs={phJobUIs} />
      </main>

      {/* Footer */}
      <footer className="bg-bg-page border-top border-structural py-8 mt-12 mb-0">
          <div className="max-w-[1100px] mx-auto px-6">
              <div className="flex flex-wrap items-center gap-x-2 text-xs text-secondary">
                  <span>RemoteJobsPH</span>
                  <span className="text-[#ddd]">·</span>
                  <span>Data updated manually</span>
                  <span className="text-[#ddd]">·</span>
                  <a href="#" className="hover:underline">
                      Submit a company <span className="text-accent">→</span>
                  </a>
              </div>
              <p className="text-xs text-[#bbb] mt-2">
                  Built for Filipino remote workers. Not affiliated with any company listed.
              </p>
          </div>
      </footer>
    </div>
  );
}
