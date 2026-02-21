'use client';
import { JobSiteUI } from '../lib/types';
import { ExternalLink, Zap } from 'lucide-react';

export default function JobCard({ job }: { job: JobSiteUI }) {
  if (!job) return null;

  return (
    <div className="glass-card group flex flex-col h-full p-6 rounded-[1.5rem] relative overflow-hidden">
      {/* Accent Glow */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-white/5 blur-3xl rounded-full group-hover:bg-teal-400/10 transition-colors" />

      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-black text-white group-hover:text-teal-400 transition-colors duration-300 tracking-tight leading-tight">
          {job.name}
        </h3>
        <a 
          href={job.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-3 bg-white/5 hover:bg-teal-500 hover:text-white rounded-xl transition-all shadow-lg"
          aria-label={`Visit ${job.name} website`}
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <p className="text-white/70 text-[0.95rem] leading-relaxed mb-8 flex-grow font-medium">
        {job.description}
      </p>

      <div className="flex flex-wrap gap-2.5 mt-auto pt-6 border-t border-white/5">
        <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[0.7rem] font-black uppercase tracking-widest ${
          job.category === 'gig' ? 'bg-pink-500/20 text-pink-300' :
          job.category === 'ph-freelance-groups' ? 'bg-indigo-500/20 text-indigo-300' :
          job.category === 'usa' ? 'bg-blue-500/20 text-blue-300' :
          job.category === 'australia' ? 'bg-sky-500/20 text-sky-300' :
          job.category === 'hiring-filipino-vas' ? 'bg-teal-500/20 text-teal-300' :
          'bg-white/10 text-white/70'
        }`}>
          <Zap className="h-3 w-3 mr-1.5 fill-current" />
          {job.category === 'ph-freelance-groups' ? 'PH Freelance' : 
           job.category === 'hiring-filipino-vas' ? 'Pinoy VA' :
           job.category.replace('-', ' ')}
        </span>
        <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-[0.7rem] font-black uppercase tracking-widest bg-white/5 text-white/50 border border-white/5">
          {job.remote_type.replace('-', ' ')}
        </span>
      </div>
    </div>
  );
}
