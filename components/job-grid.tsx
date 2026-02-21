import { JobSiteUI } from '../lib/types';
import JobCard from './job-card';

export default function JobGrid({ jobs }: { jobs: JobSiteUI[] }) {
  if (jobs.length === 0) {
    return null; // Handled by search-box empty state
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
      {jobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
