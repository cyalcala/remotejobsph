'use client';
import { useState, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import { JobSiteUI } from '../lib/types';
import JobRow from './job-row';
// No lucide-react icons used in this theme version (emojis used instead)

export default function SearchBox({ jobs, phJobs }: { jobs: JobSiteUI[], phJobs: JobSiteUI[] }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRemoteTypes, setSelectedRemoteTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('Alphabetical');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showSearchHint, setShowSearchHint] = useState(true);

  // Configuration
  const categoryFilters = [
    { id: 'hiring-filipino-vas', label: 'Pinoy VA', emoji: '🇵🇭', colorVar: '--color-pinoy' },
    { id: 'agency', label: 'Agency', emoji: '🏢', colorVar: '--color-agency' },
    { id: 'gig', label: 'Gig', emoji: '💼', colorVar: '--color-gig' },
    { id: 'ph-freelance-groups', label: 'PH Freelancing', emoji: '💻', colorVar: '--color-ph-freelancing' },
    { id: 'australia', label: 'Australia', emoji: '🦘', colorVar: '--color-australia' },
    { id: 'usa', label: 'USA', emoji: '🇺🇸', colorVar: '--color-usa' }
  ];

  const remoteFilters = [
    { id: 'fully-remote', label: 'Fully Remote', emoji: '🌏', colorVar: '--color-fully-remote' },
    { id: 'hybrid', label: 'Hybrid', emoji: '🏠', colorVar: '--color-hybrid' },
    { id: 'remote-friendly', label: 'Remote-Friendly', emoji: '✅', colorVar: '--color-remote-friendly' }
  ];

  const alphabet = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // 1. Data Sanitization & Merging
  const sanitizedJobs = useMemo(() => {
    const raw = [...jobs, ...phJobs];
    const map = new Map<string, JobSiteUI>();

    raw.forEach(job => {
      const cleanName = job.name.replace(/^["'“”‘](.*)["'“”‘]$/, '$1').trim();
      const key = cleanName.toLowerCase();
      
      if (map.has(key)) {
          // map.get(key)!;
          // In real updateui2 style we'd add description lines, 
          // but let's stick to standard deduplication for now
      } else {
          map.set(key, { ...job, name: cleanName });
      }
    });

    return Array.from(map.values());
  }, [jobs, phJobs]);

  // 2. Search & Filtering
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 120);
    return () => clearTimeout(handler);
  }, [query]);

  const fuse = useMemo(() => new Fuse(sanitizedJobs, {
    keys: ['name', 'description'],
    threshold: 0.3,
  }), [sanitizedJobs]);

  const filteredItems = useMemo(() => {
    let result = sanitizedJobs;

    if (debouncedQuery.trim()) {
      result = fuse.search(debouncedQuery).map(r => r.item);
    }

    if (selectedCategories.length > 0) {
      result = result.filter(j => selectedCategories.includes(j.category));
    }

    if (selectedRemoteTypes.length > 0) {
      result = result.filter(j => selectedRemoteTypes.includes(j.remote_type));
    }

    const sorted = [...result];
    switch (sortBy) {
      case '🔤 Alphabetical':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case '🇵🇭 Pinoy VA First':
        sorted.sort((a, b) => (a.category === 'hiring-filipino-vas' ? -1 : 1) - (b.category === 'hiring-filipino-vas' ? -1 : 1) || a.name.localeCompare(b.name));
        break;
      case '🏢 Agency First':
        sorted.sort((a, b) => (a.category === 'agency' ? -1 : 1) - (b.category === 'agency' ? -1 : 1) || a.name.localeCompare(b.name));
        break;
      case '💼 Gig First':
        sorted.sort((a, b) => (a.category === 'gig' ? -1 : 1) - (b.category === 'gig' ? -1 : 1) || a.name.localeCompare(b.name));
        break;
      case '🦘 Australia First':
        sorted.sort((a, b) => (a.category === 'australia' ? -1 : 1) - (b.category === 'australia' ? -1 : 1) || a.name.localeCompare(b.name));
        break;
        case '🇺🇸 USA First':
          sorted.sort((a, b) => (a.category === 'usa' ? -1 : 1) - (b.category === 'usa' ? -1 : 1) || a.name.localeCompare(b.name));
          break;
    }

    return sorted;
  }, [sanitizedJobs, debouncedQuery, selectedCategories, selectedRemoteTypes, sortBy, fuse]);

  // 3. Alphabet/Metadata Logic
  const activeLetters = useMemo(() => {
    const set = new Set<string>();
    filteredItems.forEach(j => {
      const firstChar = j.name.charAt(0).toUpperCase();
      set.add(/[A-Z]/.test(firstChar) ? firstChar : '#');
    });
    return set;
  }, [filteredItems]);

  // URL Sync
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (selectedCategories.length) params.set('category', selectedCategories.join(','));
    if (selectedRemoteTypes.length) params.set('remote', selectedRemoteTypes.join(','));
    if (sortBy !== 'Alphabetical') params.set('sort', sortBy);
    
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);

    // Dynamic Title
    let title = 'RemoteJobsPH — 🇵🇭 Remote Jobs for Filipinos';
    if (query) title = `🔍 "${query}" · RemoteJobsPH`;
    else if (selectedCategories.length) title = '🇵🇭 Pinoy VA · RemoteJobsPH';
    document.title = title;
  }, [query, selectedCategories, selectedRemoteTypes, sortBy]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        const searchInput = document.getElementById('hero-search') as HTMLInputElement;
        searchInput?.focus();
        searchInput?.select();
        setShowSearchHint(false);
      }
      if (e.key === 'Escape') setExpandedId(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedRemoteTypes([]);
    setSortBy('🔤 Alphabetical');
    setQuery('');
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const toggleRemote = (id: string) => {
    setSelectedRemoteTypes(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const activeCount = selectedCategories.length + selectedRemoteTypes.length;

  return (
    <div className="flex flex-col bg-base">
      
      {/* 7. HERO SECTION */}
      <section className="bg-base px-6 py-12 text-center max-w-[1200px] mx-auto w-full">
        <h2 className="text-[2.5rem] font-bold text-primary tracking-tight leading-tight">
            🌏 Find Remote Work as a Filipino
        </h2>
        <p className="text-secondary mt-2">
            Browse {sanitizedJobs.length} remote-friendly companies — updated regularly
        </p>

        <div className="relative max-w-[600px] mx-auto mt-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">🔍</span>
            <input 
                id="hero-search"
                type="text"
                placeholder={`Search ${sanitizedJobs.length} companies...`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-[52px] pl-12 pr-12 bg-bg-input border-[1.5px] border-border-row rounded-xl text-primary focus:border-accent-green focus:ring-[3px] focus:ring-accent-green-glow transition-all outline-none"
            />
            {showSearchHint && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                    <span className="text-xs text-muted font-mono border border-border-subtle px-1.5 py-0.5 rounded">/</span>
                </div>
            )}
        </div>
      </section>

      {/* 8. FILTER TAG BAR */}
      <div className="w-full px-6 pb-4 overflow-x-auto no-scrollbar flex items-center gap-2 max-w-[1200px] mx-auto">
        <button 
            onClick={clearAll}
            className={`tag-pill ${selectedCategories.length === 0 && selectedRemoteTypes.length === 0 ? 'border-accent-green text-accent-green bg-accent-green-dim' : 'border-border-subtle bg-bg-tag text-secondary'}`}
        >
            🌐 All Jobs
        </button>
        {categoryFilters.map(f => {
            const active = selectedCategories.includes(f.id);
            return (
                <button 
                    key={f.id}
                    onClick={() => toggleCategory(f.id)}
                    className="tag-pill"
                    style={active ? { borderColor: `var(${f.colorVar})`, color: `var(${f.colorVar})`, backgroundColor: `var(${f.colorVar}-bg)` } : { borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-tag)', color: 'var(--text-secondary)' }}
                >
                    {f.emoji} {f.label} {active && `(${sanitizedJobs.filter(j => j.category === f.id).length})`} {active && '✕'}
                </button>
            )
        })}
        {remoteFilters.map(f => {
            const active = selectedRemoteTypes.includes(f.id);
            return (
                <button 
                    key={f.id}
                    onClick={() => toggleRemote(f.id)}
                    className="tag-pill"
                    style={active ? { borderColor: `var(${f.colorVar})`, color: `var(${f.colorVar})`, backgroundColor: `var(${f.colorVar}-bg)` } : { borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-tag)', color: 'var(--text-secondary)' }}
                >
                    {f.emoji} {f.label} {active && '✕'}
                </button>
            )
        })}
        {activeCount > 0 && (
            <button onClick={clearAll} className="tag-pill border-[#ff6b6b] text-[#ff6b6b] bg-[rgba(255,107,107,0.08)]">
                Clear all ✕
            </button>
        )}
      </div>

      {/* 9. RESULTS BAR */}
      <div className="flex items-center justify-between px-6 py-2 max-w-[1200px] mx-auto w-full">
        <span className="text-xs text-muted">📋 Showing {filteredItems.length} of {sanitizedJobs.length} companies</span>
        <div className="flex items-center gap-2">
            <span className="text-xs text-muted">Sort by</span>
            <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-bg-tag text-secondary border border-border-subtle rounded-md text-xs px-2 py-1 outline-none cursor-pointer"
            >
                <option>🔤 Alphabetical</option>
                <option>🇵🇭 Pinoy VA First</option>
                <option>🏢 Agency First</option>
                <option>💼 Gig First</option>
                <option>🦘 Australia First</option>
                <option>🇺🇸 USA First</option>
            </select>
        </div>
      </div>

      {/* 10. PAGE LAYOUT (Main + Sidebar) */}
      <div className="grid md:grid-cols-[220px_1fr] gap-6 px-6 max-w-[1200px] mx-auto w-full pb-24">
        
        {/* 11. LEFT SIDEBAR */}
        <aside className="hidden md:flex flex-col sticky top-28 h-[calc(100vh-100px)] overflow-y-auto no-scrollbar">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-4">⚙️ Filters {activeCount > 0 && <span className="text-accent-green ml-1">· {activeCount} active</span>}</h3>
            
            <section className="flex flex-col gap-1 mb-8">
                {categoryFilters.map(f => {
                    const active = selectedCategories.includes(f.id);
                    const count = sanitizedJobs.filter(j => j.category === f.id).length;
                    return (
                        <button 
                            key={f.id}
                            onClick={() => toggleCategory(f.id)}
                            className="flex items-center justify-between p-2 rounded-lg text-sm transition-all border-[1.5px]"
                            style={active ? { borderColor: `var(${f.colorVar})`, color: `var(${f.colorVar})`, backgroundColor: `var(${f.colorVar}-bg)` } : { borderColor: 'transparent', backgroundColor: 'var(--bg-tag)', color: 'var(--text-secondary)' }}
                        >
                            <span>{f.emoji} {f.label}</span>
                            <span className="text-[10px] text-muted opacity-60">({count})</span>
                        </button>
                    )
                })}
            </section>

            <section className="flex flex-col gap-1">
                {remoteFilters.map(f => {
                    const active = selectedRemoteTypes.includes(f.id);
                    return (
                        <button 
                            key={f.id}
                            onClick={() => toggleRemote(f.id)}
                            className="flex items-center justify-between p-2 rounded-lg text-sm transition-all border-[1.5px]"
                            style={active ? { borderColor: `var(${f.colorVar})`, color: `var(${f.colorVar})`, backgroundColor: `var(${f.colorVar}-bg)` } : { borderColor: 'transparent', backgroundColor: 'var(--bg-tag)', color: 'var(--text-secondary)' }}
                        >
                            <span>{f.emoji} {f.label}</span>
                        </button>
                    )
                })}
            </section>

            {activeCount > 0 && (
                <button onClick={clearAll} className="w-full mt-6 p-2 rounded-lg border-[1.5px] border-[rgba(255,107,107,0.3)] text-[#ff6b6b] bg-[rgba(255,107,107,0.06)] text-sm hover:bg-[rgba(255,107,107,0.12)]">
                    🗑️ Clear all filters
                </button>
            )}
        </aside>

        {/* Main Listing Area */}
        <div className="flex-grow min-w-0">
            
            {/* 12. ALPHABET INDEX */}
            <div className="flex flex-wrap gap-1 mb-6">
                {alphabet.map(letter => {
                    const active = activeLetters.has(letter);
                    return (
                        <button 
                            key={letter}
                            disabled={!active}
                            onClick={() => {
                                const el = document.getElementById(`letter-${letter}`);
                                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                            className={`w-6 h-6 flex items-center justify-center text-[10px] font-mono rounded-md transition-colors ${active ? 'text-secondary hover:bg-bg-tag hover:text-primary' : 'text-muted opacity-30 cursor-default'}`}
                        >
                            {letter}
                        </button>
                    )
                })}
            </div>

            {/* List */}
            <div className="flex flex-col">
                {filteredItems.length === 0 ? (
                    <div className="py-20 text-center">
                        <span className="text-5xl mb-4">🔍</span>
                        <h3 className="text-xl font-bold mt-4">No companies found</h3>
                        <p className="text-secondary text-sm mt-2">Try a different search or clear your filters</p>
                        <button onClick={clearAll} className="mt-8 bg-accent-green text-[#0d0b18] font-bold text-sm px-6 py-3 rounded-lg">
                            🗑️ Clear everything
                        </button>
                    </div>
                ) : (
                    filteredItems.map((job, idx) => {
                        const firstChar = job.name.charAt(0).toUpperCase();
                        const letter = /[A-Z]/.test(firstChar) ? firstChar : '#';
                        const prevLetter = filteredItems[idx-1] ? (/[A-Z]/.test(filteredItems[idx-1].name.charAt(0).toUpperCase()) ? filteredItems[idx-1].name.charAt(0).toUpperCase() : '#') : null;
                        const isNewGroup = letter !== prevLetter;

                        return (
                            <div key={job.id}>
                                {isNewGroup && (
                                    <div id={`letter-${letter}`} className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted py-4 px-1">
                                        {letter}
                                    </div>
                                )}
                                <JobRow 
                                    job={job}
                                    isExpanded={expandedId === job.id}
                                    onToggle={() => setExpandedId(expandedId === job.id ? null : job.id)}
                                    onTagClick={(catId) => setSelectedCategories([catId])}
                                />
                            </div>
                        )
                    })
                )}
            </div>
        </div>
      </div>

      {/* 25. MOBILE FILTER BUTTON */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[200]">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="bg-accent-green text-[#0d0b18] font-bold text-sm px-5 py-2.5 rounded-full shadow-[0_4px_20px_rgba(0,230,118,0.3)]"
          >
              ⚙️ Filters {activeCount > 0 && `· ${activeCount}`}
          </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
          <>
            <div className="fixed inset-0 bg-black/60 z-[250]" onClick={() => setIsSidebarOpen(false)} />
            <div className="fixed inset-x-0 bottom-0 bg-bg-surface z-[300] rounded-t-[20px] p-6 max-h-[85vh] overflow-y-auto border-t-[1.5px] border-border-subtle slide-up">
                <div className="w-9 h-1 bg-border-row rounded-full mx-auto mb-6" />
                <div className="flex items-center justify-between mb-8">
                    <span className="text-xl font-bold">⚙️ Filters</span>
                    {activeCount > 0 && <button onClick={clearAll} className="text-xs text-[#ff6b6b] underline">Clear all</button>}
                </div>
                
                {/* Mobile Filter Options */}
                <div className="flex flex-col gap-6">
                    <section>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted mb-3">Categories</h4>
                        <div className="grid grid-cols-2 gap-2">
                             {categoryFilters.map(f => (
                                <button 
                                    key={f.id}
                                    onClick={() => toggleCategory(f.id)}
                                    className="p-2 rounded-lg text-xs transition-all border-[1.5px] text-left"
                                    style={selectedCategories.includes(f.id) ? { borderColor: `var(${f.colorVar})`, color: `var(${f.colorVar})`, backgroundColor: `var(${f.colorVar}-bg)` } : { borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-tag)', color: 'var(--text-secondary)' }}
                                >
                                    {f.emoji} {f.label}
                                </button>
                             ))}
                        </div>
                    </section>
                    <section>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted mb-3">Remote Configuration</h4>
                        <div className="flex flex-col gap-2">
                            {remoteFilters.map(f => (
                                <button 
                                    key={f.id}
                                    onClick={() => toggleRemote(f.id)}
                                    className="p-3 rounded-lg text-sm transition-all border-[1.5px] text-left"
                                    style={selectedRemoteTypes.includes(f.id) ? { borderColor: `var(${f.colorVar})`, color: `var(${f.colorVar})`, backgroundColor: `var(${f.colorVar}-bg)` } : { borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-tag)', color: 'var(--text-secondary)' }}
                                >
                                    {f.emoji} {f.label}
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="w-full mt-10 bg-accent-green text-[#0d0b18] font-bold py-4 rounded-xl"
                >
                    Done ✓
                </button>
            </div>
          </>
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
            onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); document.getElementById('hero-search')?.focus(); }}
            className={`
                fixed bottom-6 right-6 md:right-10 w-11 h-11 bg-bg-surface text-primary rounded-full flex items-center justify-center shadow-2xl border-[1.5px] border-border-row transition-opacity duration-normal z-[150]
                ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}
        >
            ↑
        </button>
    );
}
