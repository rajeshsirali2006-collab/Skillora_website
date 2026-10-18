import React from 'react';

interface HeaderProps {
  isSkeleton: boolean;
  onToggleSkeleton: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isSkeleton, onToggleSkeleton }) => {
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

        {/* Skeleton loading demo toggle */}
        <div className="nav-actions">
          <button
            onClick={onToggleSkeleton}
            className="clay-pill-btn secondary-pill"
            title="Toggle skeleton preview mode"
            aria-label="Toggle skeleton preview mode"
          >
            <span className="btn-icon">{isSkeleton ? '🌿' : '✨'}</span>
            <span className="btn-text">{isSkeleton ? 'Live View' : 'Skeleton View'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
