import React from 'react';

export const Footer: React.FC = () => {
  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="site-footer">
      <div className="container footer-container">
        <div className="footer-left">
          <div className="footer-brand">
            <span className="brand-avatar-mini">
              <img src="/assets/rajesh-profile.png" alt="Rajesh S I" className="mini-avatar-img" />
            </span>
            <span className="brand-name">Rajesh S I</span>
          </div>
          <p className="footer-tagline">
            Freelance Data Analytics &amp; Workflow Automation Specialist. Based in Bangalore, serving clients globally.
          </p>
        </div>

        <div className="footer-links">
          <a href="#services" onClick={scrollTo('services')}>Services</a>
          <a href="#projects" onClick={scrollTo('projects')}>Projects</a>
          <a href="#about" onClick={scrollTo('about')}>About</a>
          <a href="#certifications" onClick={scrollTo('certifications')}>Credentials</a>
          <a href="#contact" onClick={scrollTo('contact')}>Contact</a>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © 2026 Rajesh S I. Designed with tactile claymorphism &amp; warm analog warmth.
          </p>
          <span className="footer-handwritten handwritten-script">Built with care &amp; clarity 🌿</span>
        </div>
      </div>
    </footer>
  );
};
