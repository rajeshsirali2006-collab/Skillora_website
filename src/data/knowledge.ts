import { KnowledgeItem } from '../types';

export const clientKnowledgeBase: KnowledgeItem[] = [
  {
    title: "Contact & Direct Channels",
    keywords: ["contact", "email", "phone", "linkedin", "hire", "freelance", "reach", "location", "bangalore", "whatsapp", "call", "schedule"],
    content: "You can reach Rajesh S I directly via email at rajeshirali12@gmail.com or by phone/WhatsApp at +91 9380433994. He is based in Bangalore, Karnataka, India and is available for freelance contracts, consulting, and end-to-end data pipelines globally."
  },
  {
    title: "Services & What Rajesh Builds",
    keywords: ["services", "hire", "what do you do", "excel", "spreadsheets", "data cleaning", "automation", "dashboards", "sql", "offer", "capabilities", "kpi"],
    content: "Rajesh specializes in three core client services:\n1. Advanced Excel Dashboards & Automation: Dynamic KPI summaries, Power Query ETL pipelines, automated reconciliation, and interactive formula models (>20% error reduction).\n2. Automated Data Cleaning & Validation: Converting chaotic CSV/Excel dumps into structured, normalized datasets with Python and validation rules.\n3. Relational SQL & AI Integration: Schema design (3NF), sub-second query retrieval (Supabase/PostgreSQL/MySQL), and practical AI workflow automation."
  },
  {
    title: "Pricing, Rates & Engagement Model",
    keywords: ["rate", "price", "pricing", "cost", "charge", "how much", "quote", "budget", "fixed price", "milestone", "hourly", "payment"],
    content: "Rajesh works primarily on fixed-scope milestone deliverables or project-based agreements, ensuring complete transparency with no surprise hourly overruns. Pricing is tailored to your dataset volume, complexity, and turnaround speed. To receive an accurate quote within 24 hours, submit your project details via the contact form or email rajeshirali12@gmail.com."
  },
  {
    title: "Turnaround Time & Delivery Speed",
    keywords: ["turnaround", "delivery", "timeline", "how long", "urgent", "deadline", "fast", "speed", "eta", "days"],
    content: "Delivery timelines depend on scope:\n- Excel Cleanup & Quick Formulas: 24 to 48 hours.\n- Custom KPI Dashboard & Power Query Pipeline: 3 to 5 business days.\n- Full Data System / SQL Database Pipeline: 1 to 2 weeks with iterative milestone demos.\nRush delivery is available for urgent operational deadlines."
  },
  {
    title: "How to Get Started & Client Onboarding Process",
    keywords: ["process", "start", "get started", "onboarding", "how we work", "steps", "collaboration", "requirement"],
    content: "Getting started is straightforward:\n1. Brief & Review: Share your current spreadsheet, raw sample data, or bottleneck via the on-site Sign & Contact form or at rajeshirali12@gmail.com.\n2. Scope & Proposal: Rajesh reviews your requirements and provides a fixed timeline and clear milestone plan.\n3. Build & Preview: Rajesh builds the solution with regular video/screen updates.\n4. Handover & Walkthrough: Complete handover with documentation and post-delivery support."
  },
  {
    title: "Data Privacy, Confidentiality & NDAs",
    keywords: ["nda", "confidential", "privacy", "security", "safe", "confidentiality", "proprietary", "client data", "agreement"],
    content: "Client data security and confidentiality are taken with utmost seriousness. Rajesh is pleased to sign your company's Non-Disclosure Agreement (NDA) before any proprietary datasets or credentials are shared. All local data is handled securely and wiped upon project sign-off unless retention is requested."
  },
  {
    title: "Excel Technical Capabilities",
    keywords: ["power query", "pivot table", "xlookup", "vlookup", "macros", "formulas", "conditional formatting", "charts", "csv"],
    content: "In Excel, Rajesh handles: Power Query data ingestion and transformation, dynamic Pivot Tables, nested formulas (XLOOKUP, INDEX/MATCH, SUMIFS, LAMBDA), data validation, error handling, interactive slicing filters, executive presentation formatting, and automated template generation."
  },
  {
    title: "Python & SQL Technical Stack",
    keywords: ["python", "sql", "postgresql", "supabase", "mysql", "pandas", "openpyxl", "script", "database", "schema", "backend"],
    content: "For scripting and databases, Rajesh utilizes Python (Pandas, OpenPyXL, Requests), SQL (PostgreSQL, Supabase, MySQL), 3NF normalization, indexed queries, REST API integrations, and cloud storage pipelines."
  },
  {
    title: "Featured Case Studies & Results",
    keywords: ["case study", "portfolio", "projects", "proof", "experience", "results", "roi", "error reduction"],
    content: "Featured work includes:\n- Automated Data Processing & Analytics Dashboard in Excel: Reduced manual data entry error rates by >20% and automated weekly executive summaries.\n- Information Management & Workflow Optimization System: Scalable Python + relational SQL architecture with sub-second query latency and AI automation hooks."
  },
  {
    title: "Timezone & International Collaboration",
    keywords: ["timezone", "remote", "international", "us", "uk", "europe", "availability", "hours", "async"],
    content: "Rajesh is based in Bangalore, India (IST / UTC+5:30), but works with international clients across the US, UK, Europe, and Asia-Pacific. He provides flexible synchronous meeting windows and prompt asynchronous updates via email, WhatsApp, and Google Meet."
  },
  {
    title: "Education & Certified Credentials",
    keywords: ["education", "degree", "college", "certifications", "credential", "qualification", "b.e", "distinction"],
    content: "Rajesh holds a Bachelor of Engineering (B.E.) from MS Engineering College, Bangalore (2024–2028), achieved 88% distinction in PUC Science, and earned verified certifications in 'Microsoft Excel Beginners to Advance' (Credential ID: SC-G7CCPCI3PW) and 'Practical Data Analytics & AI Workflows' from SkillCourse."
  }
];

export function getClientFallbackReply(query: string): string {
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

  // Client question: Turnaround & timeline
  if (q.includes("turnaround") || q.includes("timeline") || q.includes("how long") || q.includes("delivery") || q.includes("deadline") || q.includes("when can")) {
    return "Delivery timelines depend on scope:\n• Excel Cleanup & Formulas: 24 to 48 hours.\n• Custom KPI Dashboard & Power Query: 3 to 5 business days.\n• Complete SQL / Python Automation Pipeline: 1 to 2 weeks with milestone reviews.\nRush delivery is available for urgent deadlines!";
  }

  // Client question: Pricing & rates
  if (q.includes("rate") || q.includes("price") || q.includes("pricing") || q.includes("cost") || q.includes("charge") || q.includes("how much") || q.includes("quote") || q.includes("budget") || q.includes("payment")) {
    return "Rajesh works primarily on fixed-scope milestone deliverables, giving you predictable costs without hourly surprises. Pricing is scoped based on data volume, workflow complexity, and reporting needs. For a quick quote within 24 hours, email your project brief to rajeshirali12@gmail.com or submit via the on-site Sign & Contact form!";
  }

  // Client question: Privacy & NDA
  if (q.includes("nda") || q.includes("confidential") || q.includes("privacy") || q.includes("safe") || q.includes("security") || q.includes("protect")) {
    return "Client data privacy and security are top priorities. Rajesh is pleased to sign your company's Non-Disclosure Agreement (NDA) before any spreadsheets or raw datasets are shared. All data is handled securely and wiped post-project unless retention is explicitly requested.";
  }

  // Client question: Process & Getting started
  if (q.includes("process") || q.includes("how do we work") || q.includes("get started") || q.includes("start") || q.includes("step") || q.includes("onboard")) {
    return "Getting started takes just 4 simple steps:\n1. Share your spreadsheet, raw data sample, or problem brief via email (rajeshirali12@gmail.com) or the Contact form.\n2. Rajesh reviews the data and provides a clear fixed scope and milestone timeline.\n3. He builds the solution with progress demos.\n4. Full handover with documentation and walkthrough support.";
  }

  // Client question: Contact & Booking
  if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("hire") || q.includes("reach") || q.includes("call") || q.includes("whatsapp") || q.includes("talk")) {
    return "You can reach Rajesh directly via email at rajeshirali12@gmail.com or phone/WhatsApp at +91 9380433994. He responds promptly and can set up a quick Google Meet to discuss your project requirements.";
  }

  // Client question: Excel capabilities
  if (q.includes("excel") || q.includes("spreadsheet") || q.includes("power query") || q.includes("pivot") || q.includes("formula") || q.includes("vlookup") || q.includes("xlookup") || q.includes("macro")) {
    return "Rajesh is certified in Microsoft Excel (Beginners to Advance) and handles: Power Query automated ETL pipelines, dynamic KPI executive dashboards, multi-table reconciliations, nested XLOOKUP/INDEX-MATCH formulas, error-handling rules, and automated reporting templates that eliminate repetitive manual spreadsheet work.";
  }

  // Client question: Python, SQL & Database
  if (q.includes("python") || q.includes("sql") || q.includes("database") || q.includes("postgres") || q.includes("supabase") || q.includes("mysql") || q.includes("pipeline")) {
    return "Rajesh builds data scripts and databases using Python (Pandas, OpenPyXL), normalized relational SQL schemas (PostgreSQL, Supabase, MySQL), and automated ETL pipelines with sub-second query retrieval and automated data cleaning.";
  }

  // Keyword scoring algorithm for context chunk
  let bestMatch: string | null = null;
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

  return "I am Rajesh S I's Portfolio AI Assistant! I can assist you with details on his freelance data services, Excel dashboard projects, Python/SQL pipelines, delivery timelines, pricing quotes, and NDA agreements. How can I help with your project today?";
}
