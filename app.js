/**
 * Rajesh S I — Freelance Portfolio Interactive Controller
 * Handles:
 * - Skeleton loading state & toggle
 * - Project filtering with native smooth transitions
 * - Interactive Excel & AI Data Cleaning Simulator
 * - Copy-to-clipboard with tactile clay toasts
 * - Interactive Signature input & seal badge
 * - Scope selection & contact form handling
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. SKELETON LOADING STATE
  // =========================================================================
  const toggleSkeletonBtn = document.getElementById('toggleSkeletonBtn');
  let isSkeleton = false;

  function setSkeletonMode(active) {
    isSkeleton = active;
    if (active) {
      document.body.classList.add('skeleton-active');
      toggleSkeletonBtn.querySelector('.btn-text').textContent = 'Live View';
    } else {
      document.body.classList.remove('skeleton-active');
      toggleSkeletonBtn.querySelector('.btn-text').textContent = 'Skeleton View';
    }
  }

  // Brief initial shimmer reveal for native app feel (350ms)
  document.body.classList.add('skeleton-active');
  setTimeout(() => {
    document.body.classList.remove('skeleton-active');
  }, 400);

  if (toggleSkeletonBtn) {
    toggleSkeletonBtn.addEventListener('click', () => {
      setSkeletonMode(!isSkeleton);
      showToast(isSkeleton ? '✨ Skeleton loading preview enabled' : '🌿 Switched to live view');
    });
  }

  // =========================================================================
  // 2. TACTILE CLAY TOAST NOTIFICATIONS
  // =========================================================================
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, icon = '✨') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'clay-toast';
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-text">${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toast-out 0.3s forwards cubic-bezier(0.34, 1.56, 0.64, 1)';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3200);
  }

  // =========================================================================
  // 3. COPY TO CLIPBOARD BUTTONS
  // =========================================================================
  const copyPills = document.querySelectorAll('.copy-hint-pill');
  copyPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const textToCopy = pill.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied ${textToCopy} to clipboard!`, '📋');
          const originalText = pill.textContent;
          pill.textContent = 'Copied!';
          pill.style.background = 'var(--olive)';
          pill.style.color = '#FFFFFF';
          setTimeout(() => {
            pill.textContent = originalText;
            pill.style.background = '';
            pill.style.color = '';
          }, 2000);
        }).catch(() => {
          showToast('Failed to copy. Please select and copy manually.', '⚠️');
        });
      }
    });
  });

  // =========================================================================
  // 4. PROJECT CATEGORY FILTERING (NATIVE SMOOTH TRANSITIONS)
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      // Native transition if supported
      const updateFilter = () => {
        projectCards.forEach(card => {
          const categories = card.getAttribute('data-category') || '';
          if (filterValue === 'all' || categories.includes(filterValue)) {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          } else {
            card.style.display = 'none';
          }
        });
      };

      if (document.startViewTransition) {
        document.startViewTransition(() => updateFilter());
      } else {
        updateFilter();
      }
    });
  });

  // =========================================================================
  // 5. INTERACTIVE CLAY DATA CLEANING & KPI SIMULATOR
  // =========================================================================
  const simCleanBtn = document.getElementById('simCleanBtn');
  const simRowCount = document.getElementById('simRowCount');
  const simAccuracy = document.getElementById('simAccuracy');
  const simTimeSaved = document.getElementById('simTimeSaved');
  const simLogText = document.getElementById('simLogText');

  let simRuns = 0;
  const states = [
    { rows: '2,840', acc: '99.9%', time: '28.0 hrs', log: 'Pipeline Pass 2: Ingested 2,840 records. Cleaned phone strings & normalized dates. 0 null values.' },
    { rows: '5,120', acc: '100%', time: '42.5 hrs', log: 'Pipeline Pass 3: Ingested 5,120 records. Auto-generated Power Query output with 0 manual errors.' },
    { rows: '1,420', acc: '99.8%', time: '14.5 hrs', log: 'Ready: Ingested 1,420 raw records. Zero schema mismatches detected.' }
  ];

  if (simCleanBtn) {
    simCleanBtn.addEventListener('click', () => {
      simCleanBtn.disabled = true;
      simCleanBtn.innerHTML = `<span>⏳ Optimizing & Running ETL...</span>`;

      // Animate calculation state
      setTimeout(() => {
        const nextState = states[simRuns % states.length];
        simRuns++;

        simRowCount.textContent = nextState.rows;
        simAccuracy.textContent = nextState.acc;
        simTimeSaved.textContent = nextState.time;
        simLogText.textContent = nextState.log;

        simCleanBtn.disabled = false;
        simCleanBtn.innerHTML = `<span>Run AI Data Cleaning & Recalculate</span>`;
        showToast('⚡ Live KPI Dashboard updated & recalculated!', '📊');
      }, 550);
    });
  }

  // =========================================================================
  // 6. SCOPE CHOICE BUTTONS IN CONTACT FORM
  // =========================================================================
  const scopeBtns = document.querySelectorAll('.scope-choice-btn');
  const selectedScopeInput = document.getElementById('selectedScope');

  scopeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      scopeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.getAttribute('data-scope');
      if (selectedScopeInput) {
        selectedScopeInput.value = val;
      }
    });
  });

  // =========================================================================
  // 7. INTERACTIVE SIGNATURE INPUT & SEAL BADGE
  // =========================================================================
  const signatureInput = document.getElementById('signatureInput');
  const sigSeal = document.getElementById('sigSeal');
  const sealText = document.getElementById('sealText');

  if (signatureInput && sigSeal && sealText) {
    signatureInput.addEventListener('input', () => {
      const val = signatureInput.value.trim();
      if (val.length > 1) {
        sigSeal.classList.add('sealed');
        sealText.textContent = `Signed: ${val.split(' ')[0]}`;
      } else {
        sigSeal.classList.remove('sealed');
        sealText.textContent = 'Awaiting Sign';
      }
    });
  }

  // =========================================================================
  // 8. CONTACT FORM SUBMISSION
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName').value.trim();
      const email = document.getElementById('clientEmail').value.trim();
      const scope = selectedScopeInput ? selectedScopeInput.value : 'General Consulting';
      const details = document.getElementById('projectDetails').value.trim();
      const signature = signatureInput ? signatureInput.value.trim() : '';

      if (!name || !email || !details) {
        formStatus.className = 'form-status-msg error';
        formStatus.textContent = 'Please fill out your name, email, and project details.';
        return;
      }

      if (!signature) {
        formStatus.className = 'form-status-msg error';
        formStatus.textContent = 'Please sign your name at the bottom to verify your inquiry.';
        if (signatureInput) signatureInput.focus();
        return;
      }

      // Success feedback
      formStatus.className = 'form-status-msg success';
      formStatus.innerHTML = `
        <strong>🎉 Thank you, ${name}!</strong> Your inquiry for <em>${scope}</em> has been signed as "${signature}". 
        Rajesh has received your note and will get back to you at <strong>${email}</strong> within 24 hours.
      `;

      showToast(`Signed inquiry received from ${name}!`, '🖋️');

      // Prepare mailto link option
      const mailSubject = encodeURIComponent(`Freelance Project Inquiry: ${scope} (Signed by ${signature})`);
      const mailBody = encodeURIComponent(
        `Hi Rajesh,\n\nMy name is ${name} (${email}).\nI need help with: ${scope}\n\nProject details:\n${details}\n\nSigned,\n${signature}`
      );
      
      const mailtoUrl = `mailto:rajeshsirali21@gmail.com?subject=${mailSubject}&body=${mailBody}`;

      // Open email client in background or offer prompt
      setTimeout(() => {
        const sendMail = confirm("Would you also like to open your email client to send this message directly to rajeshsirali21@gmail.com?");
        if (sendMail) {
          window.location.href = mailtoUrl;
        }
      }, 800);

      contactForm.reset();
      if (sigSeal && sealText) {
        sigSeal.classList.remove('sealed');
        sealText.textContent = 'Awaiting Sign';
      }
    });
  }

  // Smooth scroll helper for internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // =========================================================================
  // 9. CLAYMORPHIC RAG CHATBOT CONTROLLER
  // =========================================================================
  const chatToggleBtn = document.getElementById('chatToggleBtn');
  const chatDialog = document.getElementById('chatDialog');
  const chatCloseBtn = document.getElementById('chatCloseBtn');
  const chatMessages = document.getElementById('chatMessages');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');
  const chatPresets = document.getElementById('chatPresets');

  // Grounded Knowledge Base Fallback for direct browser execution
  const clientKnowledgeBase = [
    {
      keywords: ["contact", "email", "phone", "linkedin", "hire", "freelance", "reach", "location", "bangalore"],
      content: "You can reach Rajesh S I via email at rajeshsirali21@gmail.com or by phone at +91 9380433994. He is based in Bangalore, Karnataka, India and is available for freelance contracts in data analytics and automation pipelines."
    },
    {
      keywords: ["services", "hire", "what do you do", "excel", "spreadsheets", "data cleaning", "automation", "dashboards", "sql", "pricing"],
      content: "Rajesh specializes in Advanced Excel automation (Power Query, Pivot Tables, formula workflows), automated data cleaning and validation, relational SQL databases (MySQL/MongoDB), and AI workflow integration. Pricing is scoped per project based on requirements; email rajeshsirali21@gmail.com for a quote."
    },
    {
      keywords: ["skills", "technologies", "languages", "tools", "python", "excel", "mysql", "mongodb", "power query"],
      content: "Technical skills include Python, Relational SQL, C, MySQL, MongoDB, Advanced Excel (Pivot Tables, VLOOKUP, Power Query, Data Cleaning), and AI workflow integrations."
    },
    {
      keywords: ["portfolio", "projects", "excel dashboard", "kpi", "vlookup", "power query"],
      content: "Rajesh built an Automated Data Processing & Analytics Dashboard in Excel that reduced manual entry error rates by >20% using automated formula workflows, dynamic KPI summaries, and interactive reporting."
    },
    {
      keywords: ["portfolio", "projects", "information management", "database", "sql", "relational schema"],
      content: "Rajesh built an Information Management & Workflow Optimization System using Python, SQL queries, and AI workflow integrations with normalized 3NF schemas."
    },
    {
      keywords: ["experience", "work history", "internship", "skill course", "job"],
      content: "Rajesh interned at Skill Course as a Data Analytics & Automation Intern (AI Focus) in August 2026, developing automated data cleaning scripts and dynamic Excel summary dashboards."
    },
    {
      keywords: ["education", "degree", "college", "certifications", "workshops", "training"],
      content: "Rajesh holds a Bachelor of Engineering (B.E.) from MS Engineering College, Bangalore (2026), scored 88% in PUC Science, and is certified in Microsoft Excel Beginners to Advance (Credential ID: SC-G7CCPCI3PW)."
    }
  ];

  function getClientFallbackReply(query) {
    const q = query.toLowerCase();

    // Guardrails
    if (
      q.includes("ignore previous instructions") ||
      q.includes("disclose your system prompt") ||
      q.includes("reveal api key") ||
      q.includes("ignore all instructions") ||
      q.includes("print your system prompt")
    ) {
      return "I am programmed exclusively to assist with queries regarding Rajesh S I's portfolio, freelance services, and technical background. Please feel free to ask about his data analytics experience or contact details!";
    }

    if (q.includes("swift") || q.includes("ios mobile") || q.includes("android app") || q.includes("flutter")) {
      return "Rajesh S I specializes specifically in Data Analytics, Advanced Excel operations (Power Query, Pivot Tables), Python data scripts, SQL databases, and AI-driven workflow automation. Mobile app development (iOS/Swift/Android) is outside his current freelance focus. Feel free to ask about his analytics and dashboard services!";
    }

    if (q.includes("rate") || q.includes("price") || q.includes("pricing") || q.includes("cost") || q.includes("charge") || q.includes("how much") || q.includes("quote")) {
      return "Project pricing varies based on dataset size, workflow complexity, and reporting needs. Please contact Rajesh directly at rajeshsirali21@gmail.com with your project brief for a tailored proposal.";
    }

    // Keyword scoring
    let bestMatch = null;
    let highestScore = 0;
    const words = q.replace(/[^a-z0-9 ]/g, '').split(/\s+/);

    clientKnowledgeBase.forEach(chunk => {
      let score = 0;
      words.forEach(w => {
        if (w.length < 2) return;
        if (chunk.keywords.some(k => k.includes(w))) score += 3.5;
        if (chunk.content.toLowerCase().includes(w)) score += 1.5;
      });
      if (score > highestScore) {
        highestScore = score;
        bestMatch = chunk.content;
      }
    });

    if (bestMatch && highestScore >= 3) {
      return bestMatch;
    }

    return "I am Rajesh S I's Portfolio AI Assistant! I can answer questions about his freelance services, technical skills (Excel, Python, SQL), projects, certifications, and availability. For specific project inquiries, feel free to reach out directly at rajeshsirali21@gmail.com.";
  }

  const chatState = {
    isOpen: false,
    isLoading: false,
    messages: [
      {
        role: 'assistant',
        text: "Hi there! I am Rajesh's portfolio assistant. How can I help you learn more about his data analytics and automation services?"
      }
    ]
  };

  function formatMessageText(text) {
    if (!text) return '';
    let formatted = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold **text**
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Auto-link emails
    formatted = formatted.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi, '<a href="mailto:$1">$1</a>');

    // Auto-link URLs
    formatted = formatted.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

    // Line breaks
    formatted = formatted.replace(/\n/g, '<br>');

    return formatted;
  }

  function renderMessages() {
    if (!chatMessages) return;
    chatMessages.innerHTML = '';

    chatState.messages.forEach(msg => {
      const msgDiv = document.createElement('div');
      msgDiv.className = `chat-msg ${msg.role}`;
      msgDiv.innerHTML = `
        <div class="chat-bubble">${formatMessageText(msg.text)}</div>
      `;
      chatMessages.appendChild(msgDiv);
    });

    // If loading, show typing indicator
    if (chatState.isLoading) {
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'chat-msg assistant';
      loadingDiv.innerHTML = `
        <div class="typing-dots">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      `;
      chatMessages.appendChild(loadingDiv);
    }

    // Auto scroll
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Toggle presets visibility
    if (chatPresets) {
      chatPresets.style.display = chatState.messages.length > 2 ? 'none' : 'block';
    }
  }

  function toggleChat(open) {
    chatState.isOpen = open !== undefined ? open : !chatState.isOpen;
    if (chatDialog) {
      if (chatState.isOpen) {
        chatDialog.removeAttribute('hidden');
        if (chatToggleBtn) chatToggleBtn.setAttribute('aria-expanded', 'true');
        setTimeout(() => {
          if (chatInput) chatInput.focus();
        }, 150);
        renderMessages();
      } else {
        chatDialog.setAttribute('hidden', '');
        if (chatToggleBtn) {
          chatToggleBtn.setAttribute('aria-expanded', 'false');
          chatToggleBtn.focus();
        }
      }
    }
  }

  async function handleSend(textToSend) {
    const text = (textToSend || (chatInput ? chatInput.value : '')).trim();
    if (!text || chatState.isLoading) return;

    if (text.length > 600) {
      showToast('Message exceeds allowed length of 600 characters.', '⚠️');
      return;
    }

    // Add user message
    chatState.messages.push({ role: 'user', text });
    if (chatInput) chatInput.value = '';
    chatState.isLoading = true;
    if (chatSendBtn) chatSendBtn.disabled = true;
    renderMessages();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const data = await response.json();
      chatState.messages.push({ role: 'assistant', text: data.reply || getClientFallbackReply(text) });
    } catch (err) {
      console.warn('Network call to /api/chat failed, engaging client-side hybrid RAG fallback:', err);
      // Seamless zero-latency offline fallback
      const fallbackReply = getClientFallbackReply(text);
      chatState.messages.push({ role: 'assistant', text: fallbackReply });
    } finally {
      chatState.isLoading = false;
      if (chatSendBtn) chatSendBtn.disabled = false;
      renderMessages();
      if (chatInput) chatInput.focus();
    }
  }

  if (chatToggleBtn) {
    chatToggleBtn.addEventListener('click', () => toggleChat());
  }

  if (chatCloseBtn) {
    chatCloseBtn.addEventListener('click', () => toggleChat(false));
  }

  // Preset query buttons
  document.querySelectorAll('.preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-query');
      if (q) handleSend(q);
    });
  });

  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSend();
    });
  }

  // Escape key closes chat dialog
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatState.isOpen) {
      toggleChat(false);
    }
  });

  // Render initial greeting
  renderMessages();

});

