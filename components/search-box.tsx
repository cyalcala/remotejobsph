'use client';
import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { JobSiteUI } from '../lib/types';
import JobGrid from './job-grid';
import { Search, FilterX } from 'lucide-react';

export default function SearchBox({ jobs }: { jobs: JobSiteUI[] }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterRemote, setFilterRemote] = useState<string>('all');

  // Simple debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Fuse configuration
  const fuse = useMemo(() => new Fuse(jobs, {
    keys: ['name', 'description', 'tags'],
    threshold: 0.3,
    distance: 100,
  }), [jobs]);

  const results = useMemo(() => {
    let baseData = jobs;
    
    // 1. Text Search
    if (debouncedQuery.trim() !== '') {
      baseData = fuse.search(debouncedQuery).map(res => res.item);
    }
    
    // 2. Filters
    if (filterCategory !== 'all') {
      baseData = baseData.filter(job => job.category === filterCategory);
    }
    
    if (filterRemote !== 'all') {
      baseData = baseData.filter(job => job.remote_type === filterRemote);
    }

    return baseData;
  }, [jobs, fuse, debouncedQuery, filterCategory, filterRemote]);

  // Handle ARIA announce
  const ariaMessage = `${results.length} result${results.length === 1 ? '' : 's'} found.`;

  return (
    <div className="w-full max-w-5xl mx-auto relative z-10">
      {/* Search Input Container */}
      <div className="glass rounded-[2rem] p-6 md:p-8 mb-12 shadow-2xl">
        
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-white/50" />
          </div>
          <input
            type="text"
            className="block w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 placeholder-white/40 text-white rounded-2xl focus:ring-2 focus:ring-teal-400 focus:bg-white/10 focus:border-transparent transition-all outline-none"
            placeholder="Search roles, skills, or companies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search jobs"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            
          <div className="flex flex-wrap gap-2.5 items-center" role="group" aria-label="Category Filters">
            {['all', 'hiring-filipino-vas', 'gig', 'agency', 'ph-freelance-groups', 'usa', 'australia'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  filterCategory === cat 
                  ? (
                    cat === 'hiring-filipino-vas' ? 'bg-teal-500 text-white shadow-[0_0_20px_rgba(20,184,166,0.4)] scale-105' :
                    cat === 'gig' ? 'bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)] scale-105' :
                    cat === 'agency' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-105' :
                    cat === 'ph-freelance-groups' ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] scale-105' :
                    cat === 'usa' ? 'bg-blue-700 text-white shadow-[0_0_20px_rgba(29,78,216,0.4)] scale-105' :
                    cat === 'australia' ? 'bg-sky-600 text-white shadow-[0_0_20px_rgba(2,132,199,0.4)] scale-105' :
                    'bg-white text-gray-900 shadow-xl scale-105 border-transparent'
                  )
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
                aria-pressed={filterCategory === cat}
              >
                {cat === 'all' ? 'All Jobs' :
                 cat === 'hiring-filipino-vas' ? 'Pinoy VA Jobs' :
                 cat === 'ph-freelance-groups' ? 'PH Freelancing' :
                 cat === 'gig' ? 'Gigs' :
                 cat === 'usa' ? 'USA' :
                 cat === 'australia' ? 'Australia' :
                 cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
              <select 
                value={filterRemote} 
                onChange={e => setFilterRemote(e.target.value)}
                className="bg-white/5 text-white/80 text-sm font-medium rounded-xl focus:ring-2 focus:ring-teal-400 block p-3 border border-white/10 outline-none cursor-pointer hover:bg-white/10 transition-all"
                aria-label="Filter by remote type"
              >
                  <option value="all" className="bg-gray-900">Any Remote Type</option>
                  <option value="fully-remote" className="bg-gray-900">Fully Remote</option>
                  <option value="hybrid" className="bg-gray-900">Hybrid</option>
                  <option value="remote-friendly" className="bg-gray-900">Remote-Friendly</option>
              </select>

              {(filterCategory !== 'all' || filterRemote !== 'all' || query !== '') && (
                  <button 
                      onClick={() => { setFilterCategory('all'); setFilterRemote('all'); setQuery(''); }}
                      className="p-3 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
                      aria-label="Clear filters"
                  >
                      <FilterX className="h-5 w-5" />
                  </button>
              )}
          </div>
        </div>

        <div className="sr-only" aria-live="polite" role="status">
            {ariaMessage}
        </div>
      </div>
          
      {/* Results Header */}
      <div className="mb-8 flex justify-between items-end px-4">
          <h2 className="text-2xl font-black tracking-tight text-white drop-shadow-lg uppercase">
             {results.length > 0 ? "Latest Opportunities" : "No results found"}
          </h2>
          <div className="glass px-4 py-1.5 rounded-full">
            <p className="text-sm font-bold text-white/90">{results.length} results</p>
          </div>
      </div>

      {/* Grid */}
      <JobGrid jobs={results} />

      {results.length === 0 && (
          <div className="py-24 glass rounded-[2rem] text-center text-white/40 flex flex-col items-center">
              <Search className="h-16 w-16 mb-6 opacity-20" />
              <p className="text-xl font-medium">No matches found for your current search.</p>
              <button 
                onClick={() => { setFilterCategory('all'); setFilterRemote('all'); setQuery(''); }}
                className="mt-6 text-teal-400 hover:text-teal-300 font-bold underline underline-offset-4"
              >
                Clear all filters
              </button>
          </div>
      )}

    </div>
  );
}
