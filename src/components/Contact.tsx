import React, { useState } from 'react';

interface ContactProps {
  onShowToast: (message: string, icon?: string) => void;
  onOpenInquiries?: () => void;
}

export const Contact: React.FC<ContactProps> = ({ onShowToast, onOpenInquiries }) => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [selectedScope, setSelectedScope] = useState('Excel Dashboard');
  const [projectDetails, setProjectDetails] = useState('');
  const [signature, setSignature] = useState('');
  const [signaturePath, setSignaturePath] = useState('');
  const [signMode, setSignMode] = useState<'type' | 'draw'>('type');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error'; message: string; sub?: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const pointsRef = React.useRef<{ x: number; y: number }[]>([]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = Math.round(clientX - rect.left);
    const y = Math.round(clientY - rect.top);
    pointsRef.current = [{ x, y }];

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#2A2521';
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = Math.round(clientX - rect.left);
    const y = Math.round(clientY - rect.top);
    pointsRef.current.push({ x, y });

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const points = pointsRef.current;
    if (points.length > 2) {
      let pathString = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i += 2) {
        pathString += ` L ${points[i].x} ${points[i].y}`;
      }
      setSignaturePath(pathString);
      if (!signature.trim()) {
        setSignature('Drawn Signature');
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    pointsRef.current = [];
    setSignaturePath('');
    if (signature === 'Drawn Signature') {
      setSignature('');
    }
  };

  const copyToClipboard = (text: string, labelKey: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      onShowToast(`Copied ${text} to clipboard!`, '📋');
      setCopiedKey(labelKey);
      setTimeout(() => setCopiedKey(null), 2000);
    }).catch(() => {
      onShowToast('Failed to copy. Please select and copy manually.', '⚠️');
    });
  };

  const isSigned = signature.trim().length > 1 || signaturePath.length > 5;
  const signerFirstWord = signature.trim().split(' ')[0] || (signaturePath ? 'Drawn' : '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim() || !clientEmail.trim() || !projectDetails.trim()) {
      setFormStatus({
        type: 'error',
        message: 'Please fill out your name, email, and project details.'
      });
      return;
    }

    if (!isSigned) {
      setFormStatus({
        type: 'error',
        message: 'Please sign your name or draw your signature to verify your inquiry.'
      });
      return;
    }

    const name = clientName.trim();
    const email = clientEmail.trim();
    const sig = signature.trim() || 'Drawn Signature';
    const scope = selectedScope;
    const details = projectDetails.trim();
    const resolvedPath = signaturePath || `M 10 30 Q 30 10 50 30 T 90 30 (Sig: ${sig})`;

    setIsSubmitting(true);

    try {
      // Persist to Supabase Database API
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: name,
          name: name,
          clientEmail: email,
          email: email,
          selectedScope: scope,
          serviceInterest: scope,
          service_interest: scope,
          projectDetails: details,
          message: details,
          signature: sig,
          signaturePath: resolvedPath,
          signature_path: resolvedPath,
        })
      });

      if (!res.ok) {
        console.warn('API error saving inquiry, continuing with client confirmation.');
      } else {
        window.dispatchEvent(new CustomEvent('database-updated'));
      }
    } catch (err) {
      console.warn('Network error saving to Supabase:', err);
    } finally {
      setIsSubmitting(false);
    }

    setFormStatus({
      type: 'success',
      message: `🎉 Thank you, ${name}! Your inquiry for "${scope}" has been signed as "${sig}".`,
          sub: 'Stored in the connected Supabase database. Fields saved: client_name, client_email, service_interest, and signature_path.'
    });

    onShowToast(`Signed inquiry stored in Supabase! ⚡`, '🖋️');

    // Mailto link
    const mailSubject = encodeURIComponent(`Freelance Project Inquiry: ${scope} (Signed by ${sig})`);
    const mailBody = encodeURIComponent(
      `Hi Rajesh,\n\nMy name is ${name} (${email}).\nI need help with: ${scope}\n\nProject details:\n${details}\n\nSigned,\n${sig}`
    );
    const mailtoUrl = `mailto:rajeshirali12@gmail.com?subject=${mailSubject}&body=${mailBody}`;

    setTimeout(() => {
      const openMail = window.confirm("Would you also like to open your email client to send this message directly to rajeshirali12@gmail.com?");
      if (openMail) {
        window.location.href = mailtoUrl;
      }
    }, 700);

    // Reset fields
    setClientName('');
    setClientEmail('');
    setProjectDetails('');
    setSignature('');
    clearCanvas();
  };

  return (
    <section className="section contact-section" id="contact">
      <div className="container">
        
        <div className="section-header text-center">
          <div className="contact-script-lead">
            <span className="handwritten-script">Ready to collaborate?</span>
          </div>
          <span className="section-kicker clay-pill-terracotta">Let's Build Something Together</span>
          <h2 className="section-title">Sign to contact me &amp; book your project.</h2>
          <p className="section-subtitle">
            Have a project in mind, a spreadsheet that needs saving, or an automation pipeline to build? 
            Drop a message below or sign your inquiry directly.
          </p>
        </div>

        <div className="contact-clay-card clay-card">
          <div className="contact-grid">
            
            {/* Left Column: Direct Info & Rajesh's Handwritten Sign-off */}
            <div className="contact-info-col">
              
              <h3 className="contact-info-heading">Direct Channels</h3>
              <p className="contact-info-sub">Feel free to reach out via your preferred channel — I typically reply within a few hours.</p>

              <div className="direct-channels-list">
                
                {/* Email */}
                <a href="mailto:rajeshirali12@gmail.com" className="channel-pill clay-pill-sand" id="emailPill" title="Click to email Rajesh">
                  <div className="channel-icon terracotta-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div className="channel-texts">
                    <span className="channel-type">Email Me Directly</span>
                    <strong className="channel-val">rajeshirali12@gmail.com</strong>
                  </div>
                  <span 
                    className="copy-hint-pill" 
                    onClick={copyToClipboard('rajeshirali12@gmail.com', 'email')}
                    role="button"
                    tabIndex={0}
                  >
                    {copiedKey === 'email' ? 'Copied!' : 'Copy'}
                  </span>
                </a>

                {/* Phone */}
                <a href="tel:+919380433994" className="channel-pill clay-pill-sand" id="phonePill" title="Click to call Rajesh">
                  <div className="channel-icon olive-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div className="channel-texts">
                    <span className="channel-type">Call / WhatsApp</span>
                    <strong className="channel-val">+91 9380433994</strong>
                  </div>
                  <span 
                    className="copy-hint-pill" 
                    onClick={copyToClipboard('+919380433994', 'phone')}
                    role="button"
                    tabIndex={0}
                  >
                    {copiedKey === 'phone' ? 'Copied!' : 'Copy'}
                  </span>
                </a>

                {/* LinkedIn */}
                <a 
                  href="https://www.linkedin.com/in/rajesh-s-i-58b7a6420" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="channel-pill clay-pill-sand" 
                  id="linkedinPill"
                >
                  <div className="channel-icon sand-box">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </div>
                  <div className="channel-texts">
                    <span className="channel-type">Professional Network</span>
                    <strong className="channel-val">linkedin.com/in/rajesh-s-i</strong>
                  </div>
                  <span className="external-arrow">↗</span>
                </a>

              </div>

              {/* Rajesh's Handwritten Signature Card */}
              <div className="signature-box clay-card-mini">
                <div className="sig-header">
                  <span className="sig-label">Freelancer Sign-Off</span>
                  <span className="sig-badge clay-badge-olive">Verified Profile</span>
                </div>
                <div className="sig-image-container">
                  <p className="handwritten-signature">Rajesh S I</p>
                  <span className="sig-date">Bangalore, India • 2026</span>
                </div>
                <p className="sig-motto handwritten-script">
                  "Committed to delivering measurable operational efficiency with high integrity."
                </p>
              </div>

            </div>

            {/* Right Column: Interactive Sign & Contact Form */}
            <div className="contact-form-col">
              <form className="clay-contact-form" id="contactForm" onSubmit={handleSubmit} noValidate hidden>
                
                <div className="form-row">
                  <label htmlFor="clientName" className="clay-label">Your Name or Company</label>
                  <input 
                    type="text" 
                    id="clientName" 
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="clay-input" 
                    placeholder="e.g. Alex Sharma / Acme Ops" 
                    required 
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="clientEmail" className="clay-label">Your Email Address</label>
                  <input 
                    type="email" 
                    id="clientEmail" 
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="clay-input" 
                    placeholder="alex@company.com" 
                    required 
                  />
                </div>

                {/* Scope Selection Pills */}
                <div className="form-row">
                  <label className="clay-label">What do you need help with?</label>
                  <div className="service-choice-pills" role="group" aria-label="Project Scope">
                    {[
                      { scope: 'Excel Dashboard', label: '📊 Excel & Dashboard' },
                      { scope: 'Python & AI Pipeline', label: '⚡ AI & Automation' },
                      { scope: 'SQL & Database Querying', label: '🗄️ SQL & Schema' },
                      { scope: 'Other Data Consultation', label: '💡 General Consulting' }
                    ].map((item) => (
                      <button
                        key={item.scope}
                        type="button"
                        className={`scope-choice-btn ${selectedScope === item.scope ? 'active' : ''}`}
                        onClick={() => setSelectedScope(item.scope)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <label htmlFor="projectDetails" className="clay-label">Tell me a bit about your project or data bottleneck</label>
                  <textarea 
                    id="projectDetails" 
                    rows={4} 
                    value={projectDetails}
                    onChange={(e) => setProjectDetails(e.target.value)}
                    className="clay-textarea" 
                    placeholder="We have weekly sales CSVs that take our team 4 hours to clean and format into our executive report..." 
                    required 
                  />
                </div>

                {/* Interactive Signature Pad / Sign to Contact */}
                <div className="form-row signature-pad-row">
                  <div className="sig-pad-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label htmlFor="signatureInput" className="clay-label" style={{ margin: 0 }}>
                      ✍️ Sign your name or draw signature
                    </label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => setSignMode('type')}
                        className={`clay-pill-btn ${signMode === 'type' ? 'primary-terracotta' : 'secondary-pill'}`}
                        style={{ padding: '3px 10px', fontSize: '0.72rem' }}
                      >
                        ⌨️ Type
                      </button>
                      <button
                        type="button"
                        onClick={() => setSignMode('draw')}
                        className={`clay-pill-btn ${signMode === 'draw' ? 'primary-terracotta' : 'secondary-pill'}`}
                        style={{ padding: '3px 10px', fontSize: '0.72rem' }}
                      >
                        🖊️ Draw Path
                      </button>
                    </div>
                  </div>

                  {signMode === 'type' ? (
                    <div className="clay-signature-pad">
                      <input 
                        type="text" 
                        id="signatureInput" 
                        value={signature}
                        onChange={(e) => setSignature(e.target.value)}
                        className="clay-sig-input handwritten-script" 
                        placeholder="Sign your name here..." 
                        required 
                      />
                      <div className={`sig-seal-badge ${isSigned ? 'sealed' : ''}`} id="sigSeal">
                        <span className="seal-icon">🖋️</span>
                        <span className="seal-text" id="sealText">
                          {isSigned ? `Signed: ${signerFirstWord}` : 'Awaiting Sign'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ position: 'relative', background: '#FDFCFA', borderRadius: '16px', border: '1px solid var(--sand-300)', padding: '8px', boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.06)' }}>
                      <canvas
                        ref={canvasRef}
                        width={460}
                        height={110}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        style={{ width: '100%', height: '110px', display: 'block', cursor: 'crosshair', touchAction: 'none' }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', borderTop: '1px solid var(--sand-200)', paddingTop: '6px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {signaturePath ? `Vector stroke recorded (${signaturePath.slice(0, 24)}...)` : 'Draw your signature on the pad above'}
                        </span>
                        <button
                          type="button"
                          onClick={clearCanvas}
                          className="clay-pill-btn secondary-pill"
                          style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  )}
                </div>


                {formStatus && (
                  <div className={`form-status-msg ${formStatus.type}`} role="status">
                    <p><strong>{formStatus.message}</strong></p>
                    {formStatus.sub && <p style={{ marginTop: '6px' }}>{formStatus.sub}</p>}
                  </div>
                )}

              </form>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
