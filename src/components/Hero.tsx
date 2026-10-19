import React from 'react';
import { SkilloraLogo } from './SkilloraLogo';

interface HeroProps {
  isSkeleton?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ isSkeleton }) => {
  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (isSkeleton) {
    return (
      <section className="hero-section" id="hero">
        <div className="container hero-container" style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '56px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="shimmer" style={{ width: '160px', height: '26px', borderRadius: '9999px' }} />
            <div className="shimmer" style={{ width: '380px', height: '36px', borderRadius: '9999px' }} />
            <div className="shimmer" style={{ width: '100%', height: '110px', borderRadius: '18px' }} />
            <div className="shimmer" style={{ width: '85%', height: '70px', borderRadius: '14px' }} />
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div className="shimmer" style={{ width: '260px', height: '54px', borderRadius: '9999px' }} />
              <div className="shimmer" style={{ width: '140px', height: '24px', borderRadius: '8px' }} />
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
              <div className="shimmer" style={{ width: '140px', height: '60px', borderRadius: '9999px' }} />
              <div className="shimmer" style={{ width: '150px', height: '60px', borderRadius: '9999px' }} />
              <div className="shimmer" style={{ width: '150px', height: '60px', borderRadius: '9999px' }} />
            </div>
          </div>
          <div className="clay-hero-frame">
            <div className="shimmer" style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: '28px' }} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero-section" id="hero">
      <div className="container hero-container">

        <div className="hero-content live-content">
          {/* Handwritten welcoming note */}
          <div className="hero-handwritten-note">
            <span className="handwritten-script">Hey there, welcome to Skillora!</span>
            <svg className="handwritten-arrow" width="36" height="30" viewBox="0 0 40 30" fill="none" aria-hidden="true">
              <path d="M4 6C15 7 30 11 34 22M34 22L25 21M34 22L32 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className="hero-status-pill clay-pill">
            <SkilloraLogo variant="mark" height={20} idPrefix="hero-mark" />
            <span>Turn Skills into Opportunities &bull; Open for contracts</span>
          </div>

          {/* Bold, singular headline */}
          <h1 className="hero-headline">
            Turning messy, unstructured data into clean, automated momentum.
          </h1>

          {/* Warm first-person microcopy */}
          <p className="hero-subline">
            I'm <strong>Rajesh</strong>, a freelance data analyst &amp; automation builder based in Bangalore. 
            I build bespoke Excel dashboards, Python data pipelines, and AI-powered workflows that save 
            teams hours of manual repetition and cut reporting errors by over 20%.
          </p>

          {/* Single, prominent pill-shaped CTA */}
          <div className="hero-cta-wrapper">
            <a href="#contact" onClick={scrollToContact} className="clay-pill-btn primary-terracotta hero-main-cta" id="heroCtaBtn">
              <span className="cta-label">Let's Talk About Your Project</span>
              <span className="clay-pill-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </span>
            </a>
            <span className="hero-cta-annotation handwritten-script">zero friction, reply within 24h!</span>
          </div>

          {/* Quick Trust Metrics / Floating Clay Pills */}
          <div className="hero-trust-bar">
            <div className="trust-item clay-pill-sand">
              <span className="trust-number">20%+</span>
              <span className="trust-label">Error Rate Reduction</span>
            </div>
            <div className="trust-item clay-pill-sand">
              <span className="trust-number">10+ hrs</span>
              <span className="trust-label">Saved Per Weekly Cycle</span>
            </div>
            <div className="trust-item clay-pill-sand">
              <span className="trust-number">100%</span>
              <span className="trust-label">Reliable Schema Quality</span>
            </div>
          </div>
        </div>

        {/* 3D Clay Hero Visual Card */}
        <div className="hero-visual live-content">
          <div className="clay-hero-frame">
            <img 
              src="/assets/clay-analytics.jpg" 
              alt="3D claymorphic analytics charts, donut graphs and pastel spheres" 
              className="clay-hero-img" 
            />
            
            {/* Floating Clay Badges on Hero Image */}
            <div className="floating-badge badge-top-left clay-card-floating">
              <span className="clay-mini-icon olive-icon">⚡</span>
              <div>
                <span className="badge-title">AI Workflows</span>
                <span className="badge-sub">Auto data cleansing</span>
              </div>
            </div>

            <div className="floating-badge badge-bottom-right clay-card-floating">
              <span className="clay-mini-icon terracotta-icon">📊</span>
              <div>
                <span className="badge-title">Dynamic KPI</span>
                <span className="badge-sub">Interactive Excel &amp; SQL</span>
              </div>
            </div>

            <div className="clay-floating-stamp handwritten-script">
              Crafted with care 🌿
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
