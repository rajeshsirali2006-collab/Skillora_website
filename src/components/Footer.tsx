import React from 'react';
import { SkilloraLogo } from './SkilloraLogo';

interface FooterProps {
  onOpenInquiries?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenInquiries }) => {
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
          <div className="footer-brand" style={{ marginBottom: '10px' }}>
            <SkilloraLogo variant="full" height={44} idPrefix="ftr-logo" />
          </div>
          <p className="footer-tagline">
            Freelance Data Analytics &amp; Workflow Automation Specialist. Based in Bangalore, serving clients globally.
          </p>
        </div>

        <div className="footer-links" style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <a href="#services" onClick={scrollTo('services')}>Services</a>
          <a href="#projects" onClick={scrollTo('projects')}>Projects</a>
          <a href="#about" onClick={scrollTo('about')}>About</a>
          <a href="#certifications" onClick={scrollTo('certifications')}>Credentials</a>
          <a href="#contact" onClick={scrollTo('contact')}>Contact</a>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © 2026 Rajesh S I. Powered by Supabase &amp; Tactile Claymorphism.
          </p>
          <span className="footer-handwritten handwritten-script">Built with care &amp; clarity 🌿</span>
        </div>
      </div>
    </footer>
  );
};
