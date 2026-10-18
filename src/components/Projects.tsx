import React, { useState } from 'react';
import { ProjectCategory } from '../types';

interface ProjectsProps {
  onShowToast: (message: string, icon?: string) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ onShowToast }) => {
  const [filter, setFilter] = useState<ProjectCategory>('all');
  const [simIndex, setSimIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const states = [
    { rows: '1,420', acc: '99.8%', time: '14.5 hrs', log: 'Ready: Ingested 1,420 raw records. Zero schema mismatches detected.' },
    { rows: '2,840', acc: '99.9%', time: '28.0 hrs', log: 'Pipeline Pass 2: Ingested 2,840 records. Cleaned phone strings & normalized dates. 0 null values.' },
    { rows: '5,120', acc: '100%', time: '42.5 hrs', log: 'Pipeline Pass 3: Ingested 5,120 records. Auto-generated Power Query output with 0 manual errors.' },
  ];

  const currentSimState = states[simIndex % states.length];

  const handleRunSim = () => {
    if (isSimulating) return;
    setIsSimulating(true);

    setTimeout(() => {
      setSimIndex((prev) => prev + 1);
      setIsSimulating(false);
      onShowToast('⚡ Live KPI Dashboard updated & recalculated!', '📊');
    }, 550);
  };

  const handleScrollToSim = (e: React.MouseEvent) => {
    e.preventDefault();
    const simEl = document.getElementById('excel-sim');
    if (simEl) {
      simEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Determine visibility based on category filter
  const showProject1 = filter === 'all' || filter === 'excel' || filter === 'automation';
  const showProject2 = filter === 'all' || filter === 'automation' || filter === 'database';

  return (
    <section className="section projects-section" id="projects">
      <div className="container">
        
        <div className="section-header text-center">
          <span className="section-kicker clay-pill-terracotta">Selected Case Studies</span>
          <h2 className="section-title">Measurable results delivered with care.</h2>
          <p className="section-subtitle">
            Every project starts with raw, chaotic inputs and ends with reliable, beautifully organized intelligence.
          </p>
        </div>

        {/* Project Filter Buttons */}
        <div className="project-filters clay-pill-island" role="tablist" aria-label="Filter projects">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')} 
            role="tab" 
            aria-selected={filter === 'all'}
          >
            All Work
          </button>
          <button 
            className={`filter-btn ${filter === 'excel' ? 'active' : ''}`}
            onClick={() => setFilter('excel')} 
            role="tab" 
            aria-selected={filter === 'excel'}
          >
            Excel &amp; Dashboards
          </button>
          <button 
            className={`filter-btn ${filter === 'automation' ? 'active' : ''}`}
            onClick={() => setFilter('automation')} 
            role="tab" 
            aria-selected={filter === 'automation'}
          >
            Python &amp; AI Pipelines
          </button>
          <button 
            className={`filter-btn ${filter === 'database' ? 'active' : ''}`}
            onClick={() => setFilter('database')} 
            role="tab" 
            aria-selected={filter === 'database'}
          >
            Databases &amp; SQL
          </button>
        </div>

        <div className="projects-list">
          
          {/* Project 1: Automated Data Processing & Analytics Dashboard */}
          {showProject1 && (
            <article className="clay-card project-card" data-category="excel automation">
              <div className="project-grid">
                
                <div className="project-info">
                  <div className="project-meta">
                    <span className="clay-pill-olive mini-pill">Academic &amp; Live Project</span>
                    <span className="project-dates">Aug – Nov 2026</span>
                  </div>
                  <h3 className="project-title">Automated Data Processing &amp; Analytics Dashboard</h3>
                  <p className="project-org">MS Engineering College, Bangalore</p>
                  
                  <p className="project-narrative">
                    Transformed raw, unstructured institutional datasets into clean, reliable formats. Designed an intelligent automated formula engine that replaced repetitive manual checks with dynamic KPI summaries and automated export routines.
                  </p>

                  <div className="project-highlights">
                    <div className="highlight-chip clay-pill-sand">
                      <span className="highlight-num">20%+</span>
                      <span className="highlight-text">Manual Error Reduction</span>
                    </div>
                    <div className="highlight-chip clay-pill-sand">
                      <span className="highlight-num">Real-time</span>
                      <span className="highlight-text">KPI Metric Summaries</span>
                    </div>
                    <div className="highlight-chip clay-pill-sand">
                      <span className="highlight-num">Automated</span>
                      <span className="highlight-text">Report Generation</span>
                    </div>
                  </div>

                  <div className="project-tech-stack">
                    <span className="tech-tag clay-badge">Advanced Excel</span>
                    <span className="tech-tag clay-badge">Power Query</span>
                    <span className="tech-tag clay-badge">Pivot Tables</span>
                    <span className="tech-tag clay-badge">Python</span>
                    <span className="tech-tag clay-badge">AI Tools</span>
                  </div>

                  <div className="project-actions">
                    <button 
                      onClick={handleScrollToSim} 
                      className="clay-pill-btn secondary-terracotta open-demo-btn" 
                      aria-expanded="true"
                    >
                      <span>⚡ Try Interactive Simulator</span>
                    </button>
                  </div>
                </div>

                {/* Project Visual / Interactive Clay Simulator */}
                <div className="project-visual">
                  <div className="clay-project-frame">
                    <div className="frame-bar">
                      <span className="frame-dot"></span>
                      <span className="frame-dot"></span>
                      <span className="frame-dot"></span>
                      <span className="frame-title">live-dashboard-preview.xlsx</span>
                    </div>
                    
                    <div className="clay-sim-box" id="excel-sim">
                      <div className="sim-header">
                        <span className="sim-status clay-badge-olive">● Engine Ready</span>
                        <span className="handwritten-script sim-note">click below to test-drive!</span>
                      </div>

                      {/* Live Mini KPI Tiles */}
                      <div className="sim-kpi-grid">
                        <div className="sim-kpi-tile clay-pill-sand">
                          <span className="kpi-sub">Processed Rows</span>
                          <span className="kpi-val" id="simRowCount">{currentSimState.rows}</span>
                        </div>
                        <div className="sim-kpi-tile clay-pill-sand">
                          <span className="kpi-sub">Validation Accuracy</span>
                          <span className="kpi-val highlight-green" id="simAccuracy">{currentSimState.acc}</span>
                        </div>
                        <div className="sim-kpi-tile clay-pill-sand">
                          <span className="kpi-sub">Time Saved</span>
                          <span className="kpi-val" id="simTimeSaved">{currentSimState.time}</span>
                        </div>
                      </div>

                      {/* Simulator Controls */}
                      <div className="sim-controls">
                        <button 
                          onClick={handleRunSim}
                          disabled={isSimulating}
                          id="simCleanBtn" 
                          className="clay-pill-btn primary-terracotta sim-action-btn"
                        >
                          {isSimulating ? (
                            <span>⏳ Optimizing &amp; Running ETL...</span>
                          ) : (
                            <span>Run AI Data Cleaning &amp; Recalculate</span>
                          )}
                        </button>
                      </div>

                      <div className="sim-log" id="simLogText">
                        {currentSimState.log}
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </article>
          )}

          {/* Project 2: Information Management & Workflow Optimization System */}
          {showProject2 && (
            <article className="clay-card project-card" data-category="automation database">
              <div className="project-grid">
                
                <div className="project-info">
                  <div className="project-meta">
                    <span className="clay-pill-terracotta mini-pill">Mini Project | Academic</span>
                    <span className="project-dates">Dec 2025 – May 2026</span>
                  </div>
                  <h3 className="project-title">Information Management &amp; Workflow Optimization System</h3>
                  <p className="project-org">MS Engineering College, Bangalore</p>
                  
                  <p className="project-narrative">
                    Designed a structured information management system to streamline institutional records, query retrieval, and automated administrative workflows. Created normalized relational data schemas and executed multi-table SQL queries ensuring strict record accuracy.
                  </p>

                  <div className="project-highlights">
                    <div className="highlight-chip clay-pill-sand">
                      <span className="highlight-num">3NF</span>
                      <span className="highlight-text">Normalized Schema</span>
                    </div>
                    <div className="highlight-chip clay-pill-sand">
                      <span className="highlight-num">Sub-second</span>
                      <span className="highlight-text">Query Retrieval</span>
                    </div>
                    <div className="highlight-chip clay-pill-sand">
                      <span className="highlight-num">Automated</span>
                      <span className="highlight-text">Admin Workflows</span>
                    </div>
                  </div>

                  <div className="project-tech-stack">
                    <span className="tech-tag clay-badge">Python</span>
                    <span className="tech-tag clay-badge">SQL (Relational Queries)</span>
                    <span className="tech-tag clay-badge">AI Integrations</span>
                    <span className="tech-tag clay-badge">Schema Design</span>
                  </div>

                  <div className="project-actions">
                    <a href="#contact" onClick={scrollToContact} className="clay-pill-btn secondary-olive">
                      <span>Discuss Similar Architecture →</span>
                    </a>
                  </div>
                </div>

                {/* Project Visual: 3D Clay Workflow Art */}
                <div className="project-visual">
                  <div className="clay-project-frame">
                    <img 
                      src="/assets/clay-workflow.jpg" 
                      alt="3D clay workflow automation engine with cute gears, database cubes, and lightning bolt" 
                      className="clay-workflow-img" 
                    />
                    <div className="image-caption-pill clay-pill-sand">
                      <span>Tactile representation of automated pipeline pipelines &amp; relational databases</span>
                    </div>
                  </div>
                </div>

              </div>
            </article>
          )}

        </div>

      </div>
    </section>
  );
};
