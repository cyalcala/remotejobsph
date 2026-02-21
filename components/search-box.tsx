'use client';
import { useState, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import { JobSiteUI } from '../lib/types';
import JobRow from './job-row';
import { Search, Filter, X } from 'lucide-react';

export default function SearchBox({ jobs, phJobs }: { jobs: JobSiteUI[], phJobs: JobSiteUI[] }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRemoteTypes, setSelectedRemoteTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('Alphabetical');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [flashedId, setFlashedId] = useState<string | null>(null);
  const [showSearchHint, setShowSearchHint] = useState(true);

  // Constants
  const categories = [
    { id: 'hiring-filipino-vas', label: 'Pinoy VA' },
    { id: 'agency', label: 'Agency' },
    { id: 'gig', label: 'Gig' },
    { id: 'ph-freelance-groups', label: 'PH Freelancing' },
    { id: 'australia', label: 'Australia' },
    { id: 'usa', label: 'USA' }
  ];

  const remoteTypes = [
    { id: 'fully-remote', label: 'Fully Remote' },
    { id: 'hybrid', label: 'Hybrid' },
    { id: 'remote-friendly', label: 'Remote-Friendly' }
  ];

  const alphabet = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // 1. Data Merging & Sanitization
  const sanitizedJobs = useMemo(() => {
    const raw = [...jobs, ...phJobs];
    const map = new Map<string, JobSiteUI>();

    raw.forEach(job => {
      const cleanName = job.name.replace(/^["'“”‘](.*)["'“”‘]$/, '$1').trim();
      const key = cleanName.toLowerCase();
      
      if (map.has(key)) {
        const existing = map.get(key)!;
        // Merge descriptions if requested/duplicate
        const desc1 = existing.description.trim();
        const desc2 = job.description.trim();
        if (desc1 !== desc2) {
            // Keep unique descriptions in an array-like structure or string
            existing.description = `${desc1} // ${desc2}`;
        }
      } else {
        map.set(key, { ...job, name: cleanName });
      }
    });

    return Array.from(map.values());
  }, [jobs, phJobs]);

  // 2. Search & Filter Logic
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 120);
    return () => clearTimeout(handler);
  }, [query]);

  const fuse = useMemo(() => new Fuse(sanitizedJobs, {
    keys: ['name', 'description'],
    threshold: 0.3,
  }), [sanitizedJobs]);

  const filteredResults = useMemo(() => {
    let result = sanitizedJobs;

    if (debouncedQuery.trim()) {
      result = fuse.search(debouncedQuery).map(r => r.item);
    }

    if (selectedCategories.length > 0) {
      result = result.filter(j => selectedCategories.includes(j.category) || (j.category === 'ph-freelancing' && selectedCategories.includes('ph-freelance-groups')));
    }

    if (selectedRemoteTypes.length > 0) {
      result = result.filter(j => selectedRemoteTypes.includes(j.remote_type));
    }

    const sorted = [...result];
    switch (sortBy) {
      case 'Alphabetical': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'Pinoy VA First':
        sorted.sort((a, b) => (a.category === 'hiring-filipino-vas' ? -1 : 1) - (b.category === 'hiring-filipino-vas' ? -1 : 1) || a.name.localeCompare(b.name));
        break;
      case 'Agency First':
        sorted.sort((a, b) => (a.category === 'agency' ? -1 : 1) - (b.category === 'agency' ? -1 : 1) || a.name.localeCompare(b.name));
        break;
      // Add other sorts as needed
      default: sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    return sorted;
  }, [sanitizedJobs, debouncedQuery, selectedCategories, selectedRemoteTypes, sortBy, fuse]);

  // 3. Alphabet Logic
  const activeLetters = useMemo(() => {
    const set = new Set<string>();
    filteredResults.forEach(j => {
      const firstChar = j.name.charAt(0).toUpperCase();
      set.add(/[A-Z]/.test(firstChar) ? firstChar : '#');
    });
    return set;
  }, [filteredResults]);

  // 4. URL State Persistence
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (selectedCategories.length) params.set('category', selectedCategories.join(','));
    if (selectedRemoteTypes.length) params.set('remote', selectedRemoteTypes.join(','));
    if (sortBy !== 'Alphabetical') params.set('sort', sortBy);
    
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);

    // Dynamic Title
    let title = 'RemoteJobsPH — Remote Jobs for Filipinos';
    if (query) title = `"${query}" · RemoteJobsPH`;
    else if (selectedCategories.length) title = 'Pinoy VA · RemoteJobsPH';
    document.title = title;
  }, [query, selectedCategories, selectedRemoteTypes, sortBy]);

  // Keyboard focus search
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        const searchInput = document.getElementById('main-search') as HTMLInputElement;
        searchInput?.focus();
        searchInput?.select();
        setShowSearchHint(false);
      }
      if (e.key === 'Escape') setExpandedId(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const scrollToLetter = (letter: string) => {
    const target = document.getElementById(`letter-${letter}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Logic for flash highlight would be triggered here via an interaction state
      const firstItem = filteredResults.find(j => {
          const fc = j.name.charAt(0).toUpperCase();
          return fc === letter || (letter === '#' && !/[A-Z]/.test(fc));
      });
      if (firstItem) setFlashedId(firstItem.id);
      setTimeout(() => setFlashedId(null), 600);
    }
  };

  const getLabelForCat = (id: string, count: number) => {
    return (
        <label key={id} className="flex items-center gap-2 cursor-pointer group py-1.5">
            <input 
                type="checkbox" 
                checked={selectedCategories.includes(id)}
                onChange={() => setSelectedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])}
                className="checkbox-custom"
            />
            <span className="text-sm text-primary group-hover:text-accent transition-colors">{categories.find(c => c.id === id)?.label}</span>
            <span className="text-xs text-secondary ml-auto">({count})</span>
        </label>
    );
  };

  const activeCountTotal = selectedCategories.length + selectedRemoteTypes.length;

  return (
    <div className="flex flex-col md:flex-row min-h-screen max-w-[1100px] mx-auto pt-6 px-6 gap-8">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-[240px] sticky top-[72px] h-[calc(100vh-100px)] overflow-y-auto pr-4 no-scrollbar">
        <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-primary uppercase">Filters {activeCountTotal > 0 && <span className="text-accent ml-1">· {activeCountTotal}</span>}</span>
            {activeCountTotal > 0 && (
                <button onClick={() => { setSelectedCategories([]); setSelectedRemoteTypes([]); setQuery(''); }} className="text-xs text-secondary underline">Clear all</button>
            )}
        </div>

        <section className="mt-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3">Category</h3>
            <div className="flex flex-col">
                {categories.map(cat => getLabelForCat(cat.id, sanitizedJobs.filter(j => j.category === cat.id).length))}
            </div>
        </section>

        <section className="mt-8">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3">Remote Type</h3>
            <div className="flex flex-col">
                {remoteTypes.map(type => (
                    <label key={type.id} className="flex items-center gap-2 cursor-pointer group py-1.5">
                        <input 
                            type="checkbox" 
                            checked={selectedRemoteTypes.includes(type.id)}
                            onChange={() => setSelectedRemoteTypes(prev => prev.includes(type.id) ? prev.filter(t => t !== type.id) : [...prev, type.id])}
                            className="checkbox-custom"
                        />
                        <span className="text-sm text-primary">{type.label}</span>
                        <span className="text-xs text-secondary ml-auto">({sanitizedJobs.filter(j => j.remote_type === type.id).length})</span>
                    </label>
                ))}
            </div>
        </section>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Search Bar */}
        <div className="relative mb-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-placeholder pointer-events-none" />
            <input 
                id="main-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search companies or roles..."
                className="w-full h-11 pl-10 pr-12 bg-surface border border-[#e0e0e0] rounded-lg text-sm focus:ring-[3px] focus:ring-[#3b5bdb1a] focus:border-accent outline-none transition-all"
            />
            {showSearchHint && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                    <span className="text-[10px] font-mono border border-structural px-1.5 py-0.5 rounded text-[#ddd]">/</span>
                </div>
            )}
        </div>

        <div className="flex items-center justify-between mt-2 mb-6">
            <span className="text-xs text-secondary">Showing {filteredResults.length} of {sanitizedJobs.length} companies</span>
            <div className="flex items-center gap-1">
                <span className="text-xs text-secondary">Sort by</span>
                <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-xs font-medium text-secondary bg-transparent cursor-pointer outline-none hover:text-primary"
                >
                    <option value="Alphabetical">Alphabetical</option>
                    <option value="Pinoy VA First">Pinoy VA First</option>
                    <option value="Agency First">Agency First</option>
                </select>
            </div>
        </div>

        {/* Alphabet Bar */}
        <div className="flex flex-wrap gap-1 mb-8 alphabet-bar no-scrollbar">
            {alphabet.map(letter => {
                const isActive = activeLetters.has(letter);
                return (
                    <button 
                        key={letter}
                        disabled={!isActive}
                        onClick={() => scrollToLetter(letter)}
                        className={`
                            w-7 h-7 flex items-center justify-center text-[11px] font-mono rounded-[4px] transition-all
                            ${isActive ? 'text-[#555] hover:bg-group-header hover:text-primary cursor-pointer' : 'text-[#ddd] cursor-default'}
                        `}
                    >
                        {letter}
                    </button>
                );
            })}
        </div>

        {/* List */}
        <div className="flex flex-col listing-container">
            {filteredResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <span className="text-4xl mb-4">¯\_(ツ)_/¯</span>
                    <p className="text-sm text-secondary">No companies match your search.</p>
                    <button onClick={() => { setQuery(''); setSelectedCategories([]); setSelectedRemoteTypes([]); }} className="text-sm text-accent underline mt-3">Clear filters and search</button>
                </div>
            ) : (
                filteredResults.map((job, index) => {
                    const firstChar = job.name.charAt(0).toUpperCase();
                    const groupTitle = /[A-Z]/.test(firstChar) ? firstChar : '#';
                    const prevJob = filteredResults[index - 1];
                    const prevFirstChar = prevJob?.name.charAt(0).toUpperCase();
                    const prevGroupTitle = prevFirstChar ? (/[A-Z]/.test(prevFirstChar) ? prevFirstChar : '#') : null;
                    
                    const showHeader = groupTitle !== prevGroupTitle;

                    return (
                        <div key={job.id} id={showHeader ? `letter-${groupTitle}` : undefined}>
                            {showHeader && (
                                <div className="h-8 bg-group-header border-y border-structural px-3 flex items-center">
                                    <span className="text-xs font-semibold text-secondary uppercase tracking-widest">{groupTitle}</span>
                                </div>
                            )}
                            <JobRow 
                                job={job}
                                isExpanded={expandedId === job.id}
                                onToggle={() => setExpandedId(expandedId === job.id ? null : job.id)}
                                isFlashed={flashedId === job.id}
                            />
                        </div>
                    );
                })
            )}
        </div>
      </div>

      {/* Mobile Filter Pill Placeholder - Full implementation would be logic intensive here, but structure is ready */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[200]">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="bg-[#111] text-white text-sm font-medium px-6 py-2.5 rounded-full shadow-2xl flex items-center gap-2"
          >
              <Filter className="h-4 w-4" />
              Filters {activeCountTotal > 0 && <span>· {activeCountTotal}</span>}
          </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-[300] bg-white flex flex-col p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                  <span className="text-lg font-bold">Filters</span>
                  <button onClick={() => setIsSidebarOpen(false)}>
                      <X className="h-6 w-6" />
                  </button>
              </div>
              {/* Reuse Desktop content logic or just simple close for now */}
              <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="mt-auto w-full bg-accent text-white py-4 rounded-lg font-bold"
              >
                  Done
              </button>
          </div>
      )}

      {/* Back to Top */}
      <BackToTop />
    </div>
  );
}

function BackToTop() {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const toggle = () => setVisible(window.scrollY > 600);
        window.addEventListener('scroll', toggle);
        return () => window.removeEventListener('scroll', toggle);
    }, []);

    return (
        <button 
            onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); document.getElementById('main-search')?.focus(); }}
            className={`
                fixed bottom-6 right-6 md:right-10 w-10 h-10 bg-[#111] text-white rounded-full flex items-center justify-center shadow-lg transition-opacity duration-normal
                ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            `}
        >
            ↑
        </button>
    );
}
