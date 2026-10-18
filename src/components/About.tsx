import React from 'react';

export const About: React.FC = () => {
  return (
    <section className="section about-section" id="about">
      <div className="container">
        
        <div className="about-grid">
          
          {/* Clay Portal with Profile Pic */}
          <div className="about-portal-col">
            <div className="clay-portal-container">
              
              {/* Handwritten annotation */}
              <div className="portal-handwritten-note">
                <span className="handwritten-script">Nice to meet you!</span>
                <span className="note-sparkle">✨</span>
              </div>

              {/* The Puffy Clay Portal Frame */}
              <div className="clay-avatar-portal">
                <div className="portal-rim-inner">
                  <img 
                    src="/assets/rajesh-profile.png" 
                    alt="Rajesh S I — Freelance Data Analyst and AI Automation Specialist" 
                    className="portal-profile-img" 
                  />
                </div>
                
                {/* Floating Availability Pill */}
                <div className="portal-status-badge clay-pill">
                  <span className="status-pulse-dot"></span>
                  <span className="portal-status-text">Open for Freelance Contracts</span>
                </div>
              </div>

              {/* Tactile Clay Quick Facts */}
              <div className="portal-quick-cards">
                <div className="clay-card-mini">
                  <span className="mini-icon">📍</span>
                  <div>
                    <span className="mini-label">Base</span>
                    <strong className="mini-val">Bangalore, India</strong>
                  </div>
                </div>
                <div className="clay-card-mini">
                  <span className="mini-icon">🎓</span>
                  <div>
                    <span className="mini-label">Education</span>
                    <strong className="mini-val">B.E in Engineering</strong>
                  </div>
                </div>
                <div className="clay-card-mini">
                  <span className="mini-icon">⏱️</span>
                  <div>
                    <span className="mini-label">Turnaround</span>
                    <strong className="mini-val">Rapid &amp; Reliable</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* About Narrative & Background */}
          <div className="about-content-col">
            <span className="section-kicker clay-pill-olive">About Rajesh S I</span>
            <h2 className="section-title">A data analyst who bridges spreadsheets and intelligent automation.</h2>
            
            <div className="about-bio">
              <p>
                I am a B.E graduate in Engineering from <strong>MS Engineering College, Bangalore</strong>, with a passion for transforming unstructured business data into clear, reliable decisions.
              </p>
              <p>
                During my internship as a <strong>Data Analytics &amp; Automation Intern (AI Focus) at Skill Course</strong>, I specialized in architecting automated data cleaning scripts, dynamic Excel summary models, and AI-driven analytical pipelines. 
              </p>
              <p>
                As a freelancer, my mission is straightforward: <strong>eliminate manual data headaches for founders, businesses, and operations teams</strong>. Whether you have messy CSVs scattered across Google Drive or need a live automated dashboard that updates itself, I deliver clean, robust solutions with transparent communication.
              </p>
            </div>

            {/* Strengths Grid */}
            <div className="strengths-wrapper">
              <h3 className="strengths-title">Core Strengths &amp; Working Style</h3>
              <div className="strengths-pills">
                <span className="strength-pill clay-pill-sand">⚡ Quick Learner</span>
                <span className="strength-pill clay-pill-sand">🧠 Analytical Thinking</span>
                <span className="strength-pill clay-pill-sand">🎯 Problem Solving</span>
                <span className="strength-pill clay-pill-sand">🔍 Attention to Detail</span>
                <span className="strength-pill clay-pill-sand">⏱️ Time Management</span>
                <span className="strength-pill clay-pill-sand">🤝 Team Collaboration</span>
              </div>
            </div>

            {/* Technical Skills Matrix */}
            <div className="skills-matrix clay-card">
              <h3 className="matrix-title">Technical Toolset</h3>
              <div className="matrix-categories">
                
                <div className="matrix-group">
                  <span className="group-title">Languages &amp; Code</span>
                  <div className="group-tags">
                    <span className="tech-chip">Python</span>
                    <span className="tech-chip">SQL</span>
                    <span className="tech-chip">C</span>
                  </div>
                </div>

                <div className="matrix-group">
                  <span className="group-title">Spreadsheets &amp; BI</span>
                  <div className="group-tags">
                    <span className="tech-chip">Advanced Excel</span>
                    <span className="tech-chip">Power Query</span>
                    <span className="tech-chip">Pivot Tables</span>
                    <span className="tech-chip">VLOOKUP / XLOOKUP</span>
                    <span className="tech-chip">Data Sanitization</span>
                  </div>
                </div>

                <div className="matrix-group">
                  <span className="group-title">Databases &amp; AI</span>
                  <div className="group-tags">
                    <span className="tech-chip">MySQL</span>
                    <span className="tech-chip">MongoDB</span>
                    <span className="tech-chip">Relational Schemas</span>
                    <span className="tech-chip">AI Workflow Tools</span>
                    <span className="tech-chip">Prompt Engineering</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
