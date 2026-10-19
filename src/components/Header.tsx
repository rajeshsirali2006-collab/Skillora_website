import React from 'react';
import { DbStatus } from '../types';
import { SkilloraLogo } from './SkilloraLogo';

interface HeaderProps {
  isSkeleton: boolean;
  onToggleSkeleton: () => void;
  onOpenInquiries?: () => void;
  dbStatus?: DbStatus | null;
}

export const Header: React.FC<HeaderProps> = ({
  isSkeleton,
  onToggleSkeleton,
  onOpenInquiries,
  dbStatus,
}) => {
  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="site-header" id="top">
      <div className="container nav-container">
        <a href="#top" onClick={scrollTo('top')} className="nav-brand clay-pill-nav" aria-label="Skillora — Turn Skills into Opportunities">
          <SkilloraLogo variant="full" height={40} className="skillora-nav-logo" idPrefix="nav-logo" />
        </a>

        <nav className="nav-links clay-nav-island" aria-label="Main Navigation">
          <a href="#services" onClick={scrollTo('services')} className="nav-link">Services</a>
          <a href="#projects" onClick={scrollTo('projects')} className="nav-link">Projects</a>
          <a href="#about" onClick={scrollTo('about')} className="nav-link">About Me</a>
          <a href="#certifications" onClick={scrollTo('certifications')} className="nav-link">Credentials</a>
          <a href="#contact" onClick={scrollTo('contact')} className="nav-link nav-cta-pill">Sign &amp; Contact</a>
        </nav>

        {/* Header Actions */}
        <div className="nav-actions">
          {/* Preview skeleton toggle */}
          <button
            id="toggleSkeletonBtn"
            onClick={onToggleSkeleton}
            className={`clay-pill-btn skeleton-toggle-compact ${isSkeleton ? 'primary-terracotta' : 'secondary-pill'}`}
            title={isSkeleton ? 'Switch back to live view' : 'Toggle preview skeleton view'}
            aria-label={isSkeleton ? 'Switch back to live view' : 'Toggle preview skeleton view'}
            aria-pressed={isSkeleton}
          >
            <span className="btn-icon">{isSkeleton ? '🌿' : '✨'}</span>
            <span className="skeleton-btn-label">{isSkeleton ? 'Live' : 'Skeleton'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

