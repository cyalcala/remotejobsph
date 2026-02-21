'use client';
import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { JobSiteUI } from '../lib/types';
import JobRow from './job-row';
import { Search, Filter, X, ChevronDown } from 'lucide-react';

export default function SearchBox({ jobs, phJobs }: { jobs: JobSiteUI[], phJobs: JobSiteUI[] }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRemoteTypes, setSelectedRemoteTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('Alphabetical');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(handler);
  }, [query]);

  const categories = [
    { id: 'hiring-filipino-vas', label: 'Pinoy VA' },
    { id: 'agency', label: 'Agency' },
    { id: 'gig', label: 'Gig' },
    { id: 'australia', label: 'Australia' },
    { id: 'usa', label: 'USA' }
  ];

  const remoteTypes = [
    { id: 'fully-remote', label: 'Fully Remote' },
    { id: 'hybrid', label: 'Hybrid' },
    { id: 'remote-friendly', label: 'Remote-Friendly' }
  ];

  const fuse = useMemo(() => new Fuse(jobs, {
    keys: ['name', 'description'],
    threshold: 0.3,
  }), [jobs]);

  const phFuse = useMemo(() => new Fuse(phJobs, {
    keys: ['name', 'description'],
    threshold: 0.3,
  }), [phJobs]);

  const activeFilterCount = selectedCategories.length + selectedRemoteTypes.length;

  const processList = (list: JobSiteUI[], f: Fuse<JobSiteUI>, sorting: string, q: string) => {
    let result = list;
    if (q.trim()) {
      result = f.search(q).map(r => r.item);
    }
    
    // Filters only apply to main list or should they apply to both?
    // User said sidebar categories: All, Pinoy VA, Agency, Gig, Australia, USA.
    // PH Freelancing is NOT in the list. So it's a separate pool.
    
    const sorted = [...result];
    switch (sorting) {
      case 'Alphabetical': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'Category': sorted.sort((a, b) => a.category.localeCompare(b.category)); break;
      case 'Pinoy VA First':
        sorted.sort((a, b) => {
          if (a.category === 'hiring-filipino-vas' && b.category !== 'hiring-filipino-vas') return -1;
          if (a.category !== 'hiring-filipino-vas' && b.category === 'hiring-filipino-vas') return 1;
          return a.name.localeCompare(b.name);
        });
        break;
      case 'Australia First':
        sorted.sort((a, b) => {
          if (a.category === 'australia' && b.category !== 'australia') return -1;
          if (a.category !== 'australia' && b.category === 'australia') return 1;
          return a.name.localeCompare(b.name);
        });
        break;
    }
    return sorted;
  };

  const filteredItems = useMemo(() => {
    let result = jobs;
    if (debouncedQuery.trim()) {
      result = fuse.search(debouncedQuery).map(r => r.item);
    }
    if (selectedCategories.length > 0) {
      result = result.filter(j => selectedCategories.includes(j.category));
    }
    if (selectedRemoteTypes.length > 0) {
      result = result.filter(j => selectedRemoteTypes.includes(j.remote_type));
    }
    return processList(result, fuse, sortBy, ''); // Sort only, already searched
  }, [jobs, debouncedQuery, selectedCategories, selectedRemoteTypes, sortBy, fuse]);

  const filteredPHItems = useMemo(() => {
    // PH Freelance section is ONLY shown if no category filters are active, 
    // OR if we are just searching. 
    if (selectedCategories.length > 0 || selectedRemoteTypes.length > 0) return [];
    
    let result = phJobs;
    if (debouncedQuery.trim()) {
      result = phFuse.search(debouncedQuery).map(r => r.item);
    }
    return processList(result, phFuse, sortBy, ''); // Sort only
  }, [phJobs, debouncedQuery, sortBy, phFuse, selectedCategories, selectedRemoteTypes]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedRemoteTypes([]);
    setQuery('');
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleRemoteType = (id: string) => {
    setSelectedRemoteTypes(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const FilterContent = () => (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-bold text-[#111] uppercase tracking-wider">
          Filters {activeFilterCount > 0 && <span className="ml-1 text-[#999] font-medium">· {activeFilterCount}</span>}
        </h2>
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="text-[12px] text-[#999] hover:text-[#111] underline">
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-[11px] font-bold text-[#999] uppercase tracking-widest mb-3">Category</h3>
          <div className="space-y-2">
            {categories.map(cat => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={selectedCategories.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                  className="w-4 h-4 border-[#e0e0e0] rounded-[2px] checked:bg-[#111] transition-colors"
                />
                <span className={`text-[13px] ${selectedCategories.includes(cat.id) ? 'text-[#111] font-medium' : 'text-[#555]'} group-hover:text-[#111]`}>
                  {cat.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-bold text-[#999] uppercase tracking-widest mb-3">Remote Type</h3>
          <div className="space-y-2">
            {remoteTypes.map(type => (
              <label key={type.id} className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={selectedRemoteTypes.includes(type.id)}
                  onChange={() => toggleRemoteType(type.id)}
                  className="w-4 h-4 border-[#e0e0e0] rounded-[2px] checked:bg-[#111] transition-colors"
                />
                <span className={`text-[13px] ${selectedRemoteTypes.includes(type.id) ? 'text-[#111] font-medium' : 'text-[#555]'} group-hover:text-[#111]`}>
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fafafa]">
      
      <div className="hidden md:block w-[240px] fixed h-screen border-r border-[#eeeeee] bg-white p-6 overflow-y-auto">
        <FilterContent />
      </div>

      <div className="flex-grow md:ml-[240px] flex flex-col">
        
        <div className="sticky top-0 z-30 bg-[#fafafa] pt-4 px-4 pb-2 border-b border-[#eeeeee]/50">
            <div className="relative group max-w-5xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999] group-focus-within:text-[#111] transition-colors" />
                <input 
                    type="text"
                    placeholder="Search companies or roles..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full h-[40px] pl-10 pr-4 bg-[#fafafa] border border-[#e0e0e0] rounded-sm text-[14px] text-[#111] focus:outline-none focus:border-[#111] focus:bg-white transition-all outline-none"
                />
            </div>
        </div>

        <div className="max-w-5xl w-full px-4 pt-6">
            
            <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[12px] font-medium text-[#999] uppercase tracking-wider">
                    {filteredItems.length + filteredPHItems.length} Opportunities
                </span>
                
                <div className="flex items-center gap-2 relative">
                    <span className="text-[12px] text-[#999]">Sort by</span>
                    <div className="relative">
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none bg-transparent pr-7 pl-1 py-1 text-[13px] font-bold text-[#111] outline-none cursor-pointer border-b border-transparent hover:border-[#111] transition-all"
                        >
                            <option>Alphabetical</option>
                            <option>Category</option>
                            <option>Pinoy VA First</option>
                            <option>Australia First</option>
                        </select>
                        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#111] pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-[#eeeeee] rounded-sm shadow-sm overflow-hidden mb-8">
                {/* Main Section */}
                {filteredItems.map(job => (
                    <JobRow key={job.id} job={job} />
                ))}

                {/* Isolated Section Heading */}
                {filteredPHItems.length > 0 && (
                    <div className="bg-[#f8f9fa] h-[36px] flex items-center px-4 border-b border-[#eeeeee]">
                        <span className="text-[11px] font-bold text-[#999] uppercase tracking-widest">
                            Philippine Freelancing Community
                        </span>
                    </div>
                )}

                {/* Isolated PH Freelance Section */}
                {filteredPHItems.map(job => (
                    <JobRow key={job.id} job={job} />
                ))}

                {filteredItems.length === 0 && filteredPHItems.length === 0 && (
                    <div className="h-[200px] flex flex-col items-center justify-center text-[#999]">
                        <p className="text-[14px]">No matches found</p>
                        <button onClick={clearFilters} className="text-[12px] underline mt-2 hover:text-[#111]">Reset all filters</button>
                    </div>
                )}
            </div>
        </div>
      </div>

      <div className="md:hidden">
        <button 
           onClick={() => setIsSidebarOpen(true)}
           className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#111] text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl z-50 text-[14px] font-bold"
        >
          <Filter className="h-4 w-4" />
          Filters {activeFilterCount > 0 && <span>· {activeFilterCount}</span>}
        </button>

        {isSidebarOpen && (
            <>
                <div className="fixed inset-0 bg-black/60 z-[60]" onClick={() => setIsSidebarOpen(false)} />
                <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-[20px] p-8 z-[70] animate-in slide-in-from-bottom duration-300">
                    <div className="flex justify-between items-center mb-8">
                         <div className="flex items-center gap-2">
                            <span className="text-[18px] font-bold text-[#111]">Filters</span>
                            {activeFilterCount > 0 && <span className="bg-[#f1f3f5] text-[#555] px-2 py-0.5 rounded text-[12px]">{activeFilterCount}</span>}
                         </div>
                         <button onClick={() => setIsSidebarOpen(false)} className="p-2 -mr-2">
                             <X className="h-6 w-6 text-[#111]" />
                         </button>
                    </div>
                    <FilterContent />
                    <button 
                        onClick={() => setIsSidebarOpen(false)}
                        className="w-full bg-[#111] text-white py-4 rounded-xl mt-12 font-bold"
                    >
                        Show {filteredItems.length + filteredPHItems.length} results
                    </button>
                </div>
            </>
        )}
      </div>

    </div>
  );
}
