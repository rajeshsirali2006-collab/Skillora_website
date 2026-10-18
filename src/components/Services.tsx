import React from 'react';

export const Services: React.FC = () => {
  return (
    <section className="section services-section" id="services">
      <div className="container">
        
        <div className="section-header text-center">
          <span className="section-kicker clay-pill-olive">What I Build For Clients</span>
          <h2 className="section-title">End-to-end data pipelines without the corporate bloat.</h2>
          <p className="section-subtitle">
            Whether you need a rock-solid financial dashboard or an automated bot that ingests raw CSVs into clean database tables, here's how I help.
          </p>
        </div>

        <div className="services-grid">
          
          {/* Service Card 1: Excel & Dashboards */}
          <div className="clay-card service-card">
            <div className="service-icon-box terracotta-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="3" ry="3"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="3" y1="15" x2="21" y2="15"></line>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <line x1="15" y1="3" x2="15" y2="21"></line>
              </svg>
            </div>
            <div className="service-header">
              <h3 className="service-name">Advanced Excel &amp; KPI Dashboards</h3>
              <span className="clay-tag-pill">Microsoft Certified</span>
            </div>
            <p className="service-desc">
              Custom spreadsheet architectures built with Pivot Tables, Power Query, dynamic VLOOKUP/XLOOKUP formulas, and self-updating executive KPI summaries.
            </p>
            <ul className="service-features">
              <li><span className="bullet-dot terracotta-bg"></span> Automated formula error minimization (&gt;20%)</li>
              <li><span className="bullet-dot terracotta-bg"></span> Dynamic slicers, charts, and one-click refresh</li>
              <li><span className="bullet-dot terracotta-bg"></span> Raw spreadsheet cleanup &amp; sanitization</li>
            </ul>
            <div className="service-footer">
              <span className="service-badge-tech">Excel • Power Query • VBA/Macros</span>
            </div>
          </div>

          {/* Service Card 2: AI Workflows & Automation */}
          <div className="clay-card service-card featured-service">
            <div className="featured-badge clay-pill-terracotta">Most Requested</div>
            <div className="service-icon-box olive-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </div>
            <div className="service-header">
              <h3 className="service-name">AI &amp; Python Automation Pipelines</h3>
              <span className="clay-tag-pill">AI Focus</span>
            </div>
            <p className="service-desc">
              Custom Python ingestion routines integrated with modern AI tooling to parse messy text, extract structured data, and trigger autonomous daily reports.
            </p>
            <ul className="service-features">
              <li><span className="bullet-dot olive-bg"></span> AI-driven document &amp; record parsing</li>
              <li><span className="bullet-dot olive-bg"></span> Scheduled data transformation scripts</li>
              <li><span className="bullet-dot olive-bg"></span> Zero manual intervention required</li>
            </ul>
            <div className="service-footer">
              <span className="service-badge-tech">Python • AI Integrations • Pandas</span>
            </div>
          </div>

          {/* Service Card 3: Database & SQL Schema */}
          <div className="clay-card service-card">
            <div className="service-icon-box sand-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
              </svg>
            </div>
            <div className="service-header">
              <h3 className="service-name">Relational Databases &amp; SQL Queries</h3>
              <span className="clay-tag-pill">Data Integrity</span>
            </div>
            <p className="service-desc">
              Normalized schema architecture, indexing, and high-performance SQL query construction across PostgreSQL, Supabase, and MySQL relational systems.
            </p>
            <ul className="service-features">
              <li><span className="bullet-dot sand-dot-bg"></span> Structured normalization &amp; record integrity</li>
              <li><span className="bullet-dot sand-dot-bg"></span> Fast analytical queries and aggregations</li>
              <li><span className="bullet-dot sand-dot-bg"></span> Seamless integration into backend APIs</li>
            </ul>
            <div className="service-footer">
              <span className="service-badge-tech">PostgreSQL • Supabase • MySQL</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
