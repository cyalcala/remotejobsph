
import SearchBox from '@/components/search-box';
import { getAllJobs, getPHFreelanceJobs } from '@/lib/data';
import JobRow from '@/components/job-row';

export default async function HomePage() {
  const [jobs, phJobs] = await Promise.all([
    getAllJobs(),
    getPHFreelanceJobs()
  ]);

  const mapToUI = (data: any[]) => data.map(job => ({
      ...job,
      tags: typeof job.tags === 'string' ? job.tags.split(';') : (job.tags || [])
  }));

  const mainJobUIs = mapToUI(jobs);
  const phJobUIs = mapToUI(phJobs);

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <SearchBox jobs={mainJobUIs} phJobs={phJobUIs} />
    </main>
  );
}
