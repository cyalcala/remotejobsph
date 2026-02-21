import { JobSiteUI } from '../lib/types';
import { ExternalLink, Star } from 'lucide-react';

export default function JobCard({ job }: { job: JobSiteUI }) {
  // Simple 3D tilt effect on hover via CSS classes
  return (
    <a
      href={job.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-100/50 hover:bg-sky-50 focus:outline-none focus:ring-4 focus:ring-sky-500/20"
      aria-label={`Open ${job.name} in new tab`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-sky-600 transition-colors">
          {job.name}
        </h3>
        
        <div className="flex items-center space-x-2">
            {job.rating !== "" && (
              <span className="flex items-center text-xs font-medium text-amber-500 bg-amber-50 px-2 py-1 rounded-full">
                <Star className="w-3 h-3 mr-1 fill-amber-500" />
                {job.rating}
              </span>
            )}
            <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-sky-400 opacity-0 group-hover:opacity-100 transition-all -translate-y-1 translate-x-1 group-hover:translate-x-0 group-hover:translate-y-0" />
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed h-10">
        {job.description || "No description provided."}
      </p>

      <div className="flex flex-wrap gap-2 mt-auto">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${
          job.category === 'gig' ? 'bg-pink-100 text-pink-800' :
          job.category === 'ph-freelance-groups' ? 'bg-indigo-100 text-indigo-800' :
          job.category === 'usa' ? 'bg-blue-100 text-blue-800' :
          job.category === 'australia' ? 'bg-sky-100 text-sky-800' :
          job.category === 'hiring-filipino-vas' ? 'bg-teal-100 text-teal-800' :
          'bg-blue-50 text-blue-700'
        }`}>
          {job.category === 'ph-freelance-groups' ? 'freelance groups' : 
           job.category === 'hiring-filipino-vas' ? 'Pinoy VA jobs' :
           job.category.replace('-', ' ')}
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-sky-100 text-sky-800">
          {job.remote_type.replace('-', ' ')}
        </span>
        
        {job.tags && job.tags.map((tag, idx) => (
          tag.trim() && (
             <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border border-gray-200 text-gray-500">
                {tag.trim()}
             </span>
          )
        )).slice(0, 2)} {/* Show max 2 tags */}
      </div>
    </a>
  );
}
