'use client';
import { JobSiteUI } from '../lib/types';
import { ArrowRight } from 'lucide-react';

export default function JobRow({ job }: { job: JobSiteUI }) {
  if (!job) return null;

  const getCategoryStyles = (cat: string) => {
    switch (cat) {
      case 'hiring-filipino-vas':
        return 'bg-[#e8f0fe] text-[#3b5bdb]';
      case 'agency':
        return 'bg-[#f3f0ff] text-[#6741d9]';
      case 'gig':
        return 'bg-[#fff4e6] text-[#e67700]';
      case 'australia':
        return 'bg-[#ebfbee] text-[#2f9e44]';
      case 'usa':
        return 'bg-[#fff0f6] text-[#c2255c]';
      default:
        return 'bg-[#f1f3f5] text-[#555]';
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'hiring-filipino-vas': return 'Pinoy VA';
      case 'ph-freelance-groups': return 'PH Freelance';
      case 'ph-freelancing': return 'PH Freelance';
      default: return cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ');
    }
  };

  return (
    <a 
      href={job.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center h-[48px] px-4 border-b border-[#eeeeee] bg-white hover:bg-[#f9f9f9] row-transition group"
    >
      {/* Left: Company Name */}
      <div className="w-1/4 min-w-[150px] flex-shrink-0">
        <span className="text-[14px] font-medium text-[#111] truncate block">
          {job.name}
        </span>
      </div>

      {/* Center: Description (Truncated) */}
      <div className="flex-grow text-center px-4 overflow-hidden hidden md:block">
        <span className="text-[13px] text-[#999] truncate block max-w-[400px] mx-auto">
          {job.description}
        </span>
      </div>

      {/* Right: Tags & Arrow */}
      <div className="flex items-center gap-3 ml-auto flex-shrink-0">
        <div className="flex items-center gap-2">
            <span className={`tag-pill ${getCategoryStyles(job.category)}`}>
            {getCategoryLabel(job.category)}
            </span>
            <span className="tag-pill bg-[#f1f3f5] text-[#555]">
            {job.remote_type.replace('-', ' ')}
            </span>
        </div>
        <ArrowRight className="h-4 w-4 text-[#ccc] group-hover:text-[#111] arrow-transition ml-1" />
      </div>
    </a>
  );
}
