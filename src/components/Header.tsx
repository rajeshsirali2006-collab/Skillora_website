import React from 'react';
import { DbStatus } from '../types';

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
        <a href="#top" onClick={scrollTo('top')} className="nav-brand clay-pill-nav" aria-label="Rajesh S I Home">
          <span className="brand-avatar-mini">
            <img src="/assets/rajesh-profile.png" alt="Rajesh S I" className="mini-avatar-img" />
          </span>
          <span className="brand-name">Rajesh S I</span>
          <span className="brand-badge clay-badge-olive">Freelance</span>
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

