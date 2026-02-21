'use client';
import { useRef, useEffect } from 'react';
import { JobSiteUI } from '../lib/types';

interface JobRowProps {
  job: JobSiteUI;
  isExpanded: boolean;
  onToggle: () => void;
  isFlashed?: boolean;
  onTagClick?: (catId: string) => void;
}

export default function JobRow({ job, isExpanded, onToggle, isFlashed, onTagClick }: JobRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  // Data Sanitization
  const sanitize = (str: string) => {
    return str.replace(/^["'“”‘](.*)["'“”‘]$/, '$1').trim();
  };

  const name = sanitize(job.name).charAt(0).toUpperCase() + sanitize(job.name).slice(1);
  const description = sanitize(job.description);

  // Avatar logic (RemoteOK style rounded square)
  const getAvatarLetters = (n: string) => {
    const words = n.split(' ').filter(Boolean);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return words[0][0].toUpperCase();
  };

  const getAvatarColor = (n: string) => {
    const colors = ['#7c3aed', '#1d4ed8', '#047857', '#b45309', '#be123c', '#0e7490', '#6d28d9', '#15803d'];
    let hash = 0;
    for (let i = 0; i < n.length; i++) hash = n.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const avatarLetters = getAvatarLetters(name);
  const avatarBg = getAvatarColor(name);

  // Normalization logic
  const categoryConfig: Record<string, { label: string, emoji: string, colorVar: string }> = {
    'hiring-filipino-vas': { label: 'Pinoy VA', emoji: '🇵🇭', colorVar: '--color-pinoy' },
    'agency': { label: 'Agency', emoji: '🏢', colorVar: '--color-agency' },
    'gig': { label: 'Gig', emoji: '💼', colorVar: '--color-gig' },
    'ph-freelance-groups': { label: 'PH Freelancing', emoji: '💻', colorVar: '--color-ph-freelancing' },
    'australia': { label: 'Australia', emoji: '🦘', colorVar: '--color-australia' },
    'usa': { label: 'USA', emoji: '🇺🇸', colorVar: '--color-usa' }
  };

  const remoteConfig: Record<string, { label: string, emoji: string, colorVar: string }> = {
    'fully-remote': { label: 'Fully Remote', emoji: '🌏', colorVar: '--color-fully-remote' },
    'hybrid': { label: 'Hybrid', emoji: '🏠', colorVar: '--color-hybrid' },
    'remote-friendly': { label: 'Remote-Friendly', emoji: '✅', colorVar: '--color-remote-friendly' },
    'unknown': { label: 'Remote-Friendly', emoji: '✅', colorVar: '--color-remote-friendly' },
    'remote': { label: 'Fully Remote', emoji: '🌏', colorVar: '--color-fully-remote' }
  };

  const cat = categoryConfig[job.category] || { label: job.category, emoji: '📁', colorVar: '--text-muted' };
  const rem = remoteConfig[job.remote_type] || remoteConfig['remote-friendly'];

  useEffect(() => {
    if (isFlashed && rowRef.current) {
      rowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isFlashed]);

  return (
    <div 
      ref={rowRef}
      role="button" 
      tabIndex={0}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('.visit-btn')) return;
        onToggle();
      }}
      onKeyDown={(e) => e.key === 'Enter' && onToggle()}
      className={`card-row ${isExpanded ? 'border-accent-green shadow-[0_0_0_1px_var(--accent-green),0_8px_32px_var(--accent-green-glow)]' : ''}`}
    >
      {/* Left Accent Bar */}
      <div className="card-row-accent" style={{ backgroundColor: `var(${cat.colorVar})` }} />

      {/* Avatar */}
      <div 
        className="w-12 h-12 md:w-12 md:h-12 flex-shrink-0 flex items-center justify-center rounded-[10px] text-white font-bold text-base"
        style={{ backgroundColor: avatarBg }}
      >
        {avatarLetters}
      </div>

      {/* Main Content */}
      <div className="flex-1 min-width-0">
        <div className="flex flex-col md:flex-row md:items-baseline md:gap-2">
            <h3 className="text-base font-semibold text-primary truncate">{name}</h3>
        </div>
        <p className="text-sm text-secondary mt-0.5 truncate max-w-[400px]">
          {description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          <span 
            className="tag-pill" 
            style={{ backgroundColor: `var(${cat.colorVar}-bg)`, color: `var(${cat.colorVar})` }}
            onClick={(e) => { e.stopPropagation(); onTagClick?.(job.category); }}
          >
            {cat.emoji} {cat.label}
          </span>
          <span 
            className="tag-pill"
            style={{ backgroundColor: `var(${rem.colorVar}-bg)`, color: `var(${rem.colorVar})` }}
          >
            {rem.emoji} {rem.label}
          </span>
        </div>

        {/* Expanded Content */}
        <div 
          className="overflow-hidden transition-all duration-normal ease-decelerate"
          style={{ maxHeight: isExpanded ? '300px' : '0' }}
        >
          <div className="pt-4 md:pl-0">
             <p className="text-sm text-secondary leading-relaxed mb-4">
                {description}
             </p>
             {job.url ? (
                <a 
                    href={job.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-accent-green text-[#0d0b18] font-semibold text-sm px-4 py-2 rounded-lg hover:brightness-110"
                >
                    <span role="img" aria-label="link">🔗</span> Visit <span className="sr-only">{name} — </span> site →
                </a>
             ) : (
                <span className="text-xs text-muted"> <span role="img" aria-label="info">📋</span> No website listed</span>
             )}
          </div>
        </div>
      </div>

      {/* Right Action Block (Desktop Only) */}
      <div className="hidden md:flex flex-col items-end gap-2 flex-shrink-0">
        {job.url ? (
          <a 
            href={job.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="visit-btn text-xs font-semibold text-accent-green border border-accent-green rounded-lg px-3 py-1.5 hover:bg-accent-green hover:text-[#0d0b18] transition-all"
          >
            Visit →
          </a>
        ) : (
          <span className="text-xs text-muted">Details →</span>
        )}
        <span className="text-xs text-muted">🌏 Remote</span>
      </div>
    </div>
  );
}
