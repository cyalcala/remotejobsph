'use client';
import { useRef, useEffect } from 'react';
import { JobSiteUI } from '../lib/types';

interface JobRowProps {
  job: JobSiteUI;
  isExpanded: boolean;
  onToggle: () => void;
  isFlashed?: boolean;
}

export default function JobRow({ job, isExpanded, onToggle, isFlashed }: JobRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  // Data Sanitization
  const sanitize = (str: string) => {
    return str.replace(/^["'“”‘](.*)["'“”‘]$/, '$1').trim();
  };

  const name = sanitize(job.name).charAt(0).toUpperCase() + sanitize(job.name).slice(1);
  const description = sanitize(job.description);

  // Avatar logic
  const getAvatarLetters = (n: string) => {
    const words = n.split(' ').filter(Boolean);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return words[0][0].toUpperCase();
  };

  const getAvatarColor = (n: string) => {
    const colors = [
      { bg: '#e8f0fe', text: '#1a73e8' },
      { bg: '#f3f0ff', text: '#7048e8' },
      { bg: '#fff4e6', text: '#e67700' },
      { bg: '#ebfbee', text: '#212529' },
      { bg: '#fff0f6', text: '#c2255c' },
      { bg: '#e0f7fa', text: '#006064' },
      { bg: '#fce4ec', text: '#880e4f' },
      { bg: '#f3e5f5', text: '#4a148c' }
    ];
    let hash = 0;
    for (let i = 0; i < n.length; i++) hash = n.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const avatarLetters = getAvatarLetters(name);
  const avatarTheme = getAvatarColor(name);

  // Tag normalization
  const normalizeTag = (tag: string, type: 'category' | 'remote') => {
    const t = tag.toLowerCase().trim();
    if (type === 'category') {
      if (t === 'agency') return 'Agency';
      if (t.includes('pinoy') || t.includes('va')) return 'Pinoy VA';
      if (t === 'gig') return 'Gig';
      if (t.includes('freelancing')) return 'PH Freelancing';
      if (t === 'australia') return 'Australia';
      if (t === 'usa') return 'USA';
      return tag;
    } else {
      if (t.includes('fully')) return 'Fully Remote';
      if (t === 'hybrid') return 'Hybrid';
      return 'Remote-Friendly';
    }
  };

  const getTagStyles = (cat: string) => {
    const t = cat.toLowerCase();
    const isDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const opacity = isDark ? '26' : 'FF'; // 15% opacity roughly 26 in hex
    
    if (t.includes('pinoy') || t.includes('va')) return { background: `#e8f0fe${opacity}`, color: '#3b5bdb' };
    if (t === 'agency') return { background: `#f3f0ff${opacity}`, color: '#6741d9' };
    if (t === 'gig') return { background: `#fff4e6${opacity}`, color: '#e67700' };
    if (t.includes('freelancing')) return { background: `#fff9db${opacity}`, color: '#e67700' };
    if (t === 'australia') return { background: `#ebfbee${opacity}`, color: '#2f9e44' };
    if (t === 'usa') return { background: `#fff0f6${opacity}`, color: '#c2255c' };
    return { background: `#f1f3f5${opacity}`, color: '#555555' };
  };

  const categoryLabel = normalizeTag(job.category, 'category');
  const remoteLabel = normalizeTag(job.remote_type, 'remote');
  const tagStyles = getTagStyles(categoryLabel);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onToggle();
  };

  // Duplicate logic placeholder (handled in parent render normally, but we ensure cleanliness here)
  // const isDuplicate = Array.isArray(job.description) && job.description.length > 1;

  useEffect(() => {
    if (isExpanded && rowRef.current) {
        rowRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isExpanded]);

  return (
    <div 
      ref={rowRef}
      role="button" 
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      className={`
        flex flex-col w-full border-bottom border-row cursor-pointer select-none
        ${isExpanded ? 'bg-surface border-l-[3px] border-l-accent' : 'bg-transparent border-b border-row hover:bg-hover'}
        ${isFlashed ? 'flash-row' : ''}
        transition-all duration-normal ease-decelerate overflow-hidden
      `}
      style={{ maxHeight: isExpanded ? '400px' : '48px' }}
    >
      <div className="flex items-center min-h-[48px] px-3 gap-3">
        {/* Avatar */}
        <div 
          className="flex-shrink-0 w-8 h-8 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs font-semibold"
          style={{ backgroundColor: avatarTheme.bg, color: avatarTheme.text }}
        >
          {avatarLetters}
        </div>

        {/* Company Name */}
        <div className="flex-shrink-0 w-[140px] md:w-[220px] overflow-hidden">
          <span className="text-sm font-medium text-primary block truncate">
            {name}
          </span>
        </div>

        {/* Description (Truncated) */}
        <div className="flex-grow hidden md:block px-6 overflow-hidden">
          <span className="text-sm text-secondary block truncate max-w-[400px]">
            {description}
          </span>
        </div>

        {/* Tags & Arrow */}
        <div className="flex-shrink-0 flex items-center gap-2 ml-auto">
          <span 
            className="tag-pill hidden sm:inline-block"
            style={tagStyles}
          >
            {categoryLabel}
          </span>
          <span className="tag-pill bg-[#f1f3f5] text-[#555555]">
            {remoteLabel}
          </span>
          <span className={`text-sm text-[#ccc] transition-colors ml-3 ${isExpanded ? 'text-primary rotate-90' : 'group-hover:text-primary'}`}>
            →
          </span>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-3 pb-4 pt-2">
          <p className="text-sm text-[#555] mb-2 leading-relaxed">
            {description}
          </p>
          
          {/* Duplicate Sub-descriptions if any */}
          {/* Note: This logic assumes parent passes merged records */}
          
          <div className="flex items-center gap-2 mt-4">
             <span className="tag-pill sm:hidden" style={tagStyles}>
                {categoryLabel}
             </span>
             {job.url && (
                <a 
                    href={job.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm text-accent underline font-medium"
                >
                    <span className="sr-only">{name} — </span>Visit site →
                </a>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
