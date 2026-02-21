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
    <div className="w-full max-w-5xl mx-auto -mt-6 relative z-10 px-4">
      {/* Search Input */}
      <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-4 md:p-6 border border-white/40">
        
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            placeholder="Search roles, skills, or companies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search jobs"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-2">
            
          <div className="flex flex-wrap gap-2 items-center" role="group" aria-label="Category Filters">
            {['all', 'freelance', 'full-time', 'part-time', 'gig', 'agency', 'ph-freelance-groups', 'usa', 'australia'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filterCategory === cat 
                  ? (
                    cat === 'freelance' ? 'bg-purple-500 text-white shadow-md' :
                    cat === 'full-time' ? 'bg-emerald-500 text-white shadow-md' :
                    cat === 'part-time' ? 'bg-orange-500 text-white shadow-md' :
                    cat === 'gig' ? 'bg-pink-500 text-white shadow-md' :
                    cat === 'agency' ? 'bg-blue-600 text-white shadow-md' :
                    cat === 'ph-freelance-groups' ? 'bg-indigo-600 text-white shadow-md' :
                    cat === 'usa' ? 'bg-blue-700 text-white shadow-md' :
                    cat === 'australia' ? 'bg-sky-600 text-white shadow-md' :
                    'bg-sky-500 text-white shadow-md'
                  )
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-pressed={filterCategory === cat}
              >
                {cat === 'ph-freelance-groups' ? 'Freelance Groups' : cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
              <select 
                value={filterRemote} 
                onChange={e => setFilterRemote(e.target.value)}
                className="bg-gray-100 text-gray-700 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block p-2 border-none"
                aria-label="Filter by remote type"
              >
                  <option value="all">Any Remote Type</option>
                  <option value="fully-remote">Fully Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="remote-friendly">Remote-Friendly</option>
              </select>

              {(filterCategory !== 'all' || filterRemote !== 'all' || query !== '') && (
                  <button 
                      onClick={() => { setFilterCategory('all'); setFilterRemote('all'); setQuery(''); }}
                      className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
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
      <div className="mt-8 mb-4 flex justify-between items-end px-2">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
             {results.length > 0 ? "Latest Opportunities" : "No results found"}
          </h2>
          <p className="text-sm font-medium text-gray-500">{results.length} result{results.length !== 1 && 's'}</p>
      </div>

      {/* Grid */}
      <JobGrid jobs={results} />

      {results.length === 0 && (
          <div className="py-20 text-center text-gray-500 flex flex-col items-center">
              <Search className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-lg">Try adjusting your filters or search terms.</p>
          </div>
      )}

    </div>
  );
}
