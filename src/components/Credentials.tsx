import React from 'react';

export const Credentials: React.FC = () => {
  return (
    <section className="section certs-section" id="certifications">
      <div className="container">
        
        <div className="section-header text-center">
          <span className="section-kicker clay-pill-sand">Verified Credentials</span>
          <h2 className="section-title">Certifications, Training &amp; Education</h2>
          <p className="section-subtitle">
            Grounding continuous learning with hands-on technical execution.
          </p>
        </div>

        <div className="certs-grid">
          
          {/* Cert 1 */}
          <div className="clay-card cert-card">
            <div className="cert-ribbon clay-badge-terracotta">Official Credential</div>
            <div className="cert-icon-wrap">📜</div>
            <h3 className="cert-title">Microsoft Excel Beginners to Advance</h3>
            <p className="cert-issuer">SkillCourse • Issued August 2026</p>
            <div className="cert-id-pill clay-pill-sand">
              <span>Credential ID:</span>
              <code>SC-G7CCPCI3PW</code>
            </div>
            <p className="cert-summary">
              Covers deep formula construction, nested logic, dynamic array formulas, Pivot reporting, and automated Power Query ETL workflows.
            </p>
          </div>

          {/* Cert 2 */}
          <div className="clay-card cert-card">
            <div className="cert-ribbon clay-badge-olive">Specialization</div>
            <div className="cert-icon-wrap">🤖</div>
            <h3 className="cert-title">Practical Data Analytics &amp; AI Workflows</h3>
            <p className="cert-issuer">SkillCourse • May 2026</p>
            <div className="cert-id-pill clay-pill-sand">
              <span>Domain:</span>
              <strong>AI-Driven Analytics</strong>
            </div>
            <p className="cert-summary">
              Hands-on training in utilizing artificial intelligence pipelines to automate routine data validation, schema transformations, and analytical reporting.
            </p>
          </div>

          {/* Workshop */}
          <div className="clay-card cert-card">
            <div className="cert-ribbon clay-badge-sand">Intensive Workshop</div>
            <div className="cert-icon-wrap">💡</div>
            <h3 className="cert-title">Interacting with AI Tools &amp; Data Workshop</h3>
            <p className="cert-issuer">MS Engineering College • 3-Day Intensive (May 2026)</p>
            <div className="cert-id-pill clay-pill-sand">
              <span>Focus:</span>
              <strong>NLP &amp; Automated Pipelines</strong>
            </div>
            <p className="cert-summary">
              Built automated data pipelines and integrated AI tools for administrative and analytics optimization through hands-on technical sessions.
            </p>
          </div>

        </div>

        {/* Academic Foundation Banner */}
        <div className="education-banner clay-card">
          <div className="banner-icon">🎓</div>
          <div className="banner-body">
            <h3 className="banner-heading">Academic Foundation</h3>
            <p className="banner-text">
              <strong>Bachelor of Engineering / Technology</strong> from MS Engineering College, Bangalore (2024 – 2028) 
              • Prior: Pre-University Course (PUC Science PCMB) from Banajawad PU College, Athani with <strong>88% Distinction</strong>.
            </p>
          </div>
          <div className="banner-tag">
            <span className="clay-pill-olive">Engineering Graduate</span>
          </div>
        </div>

      </div>
    </section>
  );
};
