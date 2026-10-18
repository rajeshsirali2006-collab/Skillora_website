import { KnowledgeItem } from '../types';

export const clientKnowledgeBase: KnowledgeItem[] = [
  {
    title: "Contact & Availability",
    keywords: ["contact", "email", "phone", "linkedin", "hire", "freelance", "reach", "location", "bangalore"],
    content: "You can reach Rajesh S I via email at rajeshsirali21@gmail.com or by phone at +91 9380433994. He is based in Bangalore, Karnataka, India and is available for freelance contracts in data analytics and automation pipelines."
  },
  {
    title: "Services Offered",
    keywords: ["services", "hire", "what do you do", "excel", "spreadsheets", "data cleaning", "automation", "dashboards", "sql", "pricing"],
    content: "Rajesh specializes in Advanced Excel automation (Power Query, Pivot Tables, formula workflows), automated data cleaning and validation, relational SQL databases (MySQL/MongoDB), and AI workflow integration. Pricing is scoped per project based on requirements; email rajeshsirali21@gmail.com for a quote."
  },
  {
    title: "Technical Toolset & Languages",
    keywords: ["skills", "technologies", "languages", "tools", "python", "excel", "mysql", "mongodb", "power query"],
    content: "Technical skills include Python, Relational SQL, C, MySQL, MongoDB, Advanced Excel (Pivot Tables, VLOOKUP, Power Query, Data Cleaning), and AI workflow integrations."
  },
  {
    title: "Automated Data Processing Dashboard",
    keywords: ["portfolio", "projects", "excel dashboard", "kpi", "vlookup", "power query"],
    content: "Rajesh built an Automated Data Processing & Analytics Dashboard in Excel that reduced manual entry error rates by >20% using automated formula workflows, dynamic KPI summaries, and interactive reporting."
  },
  {
    title: "Information Management System",
    keywords: ["portfolio", "projects", "information management", "database", "sql", "relational schema"],
    content: "Rajesh built an Information Management & Workflow Optimization System using Python, SQL queries, and AI workflow integrations with normalized 3NF schemas."
  },
  {
    title: "Experience & Work History",
    keywords: ["experience", "work history", "internship", "skill course", "job"],
    content: "Rajesh interned at Skill Course as a Data Analytics & Automation Intern (AI Focus) in August 2026, developing automated data cleaning scripts and dynamic Excel summary dashboards."
  },
  {
    title: "Education & Credentials",
    keywords: ["education", "degree", "college", "certifications", "workshops", "training"],
    content: "Rajesh holds a Bachelor of Engineering (B.E.) from MS Engineering College, Bangalore (2026), scored 88% in PUC Science, and is certified in Microsoft Excel Beginners to Advance (Credential ID: SC-G7CCPCI3PW)."
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

  if (q.includes("rate") || q.includes("price") || q.includes("pricing") || q.includes("cost") || q.includes("charge") || q.includes("how much") || q.includes("quote")) {
    return "Project pricing varies based on dataset size, workflow complexity, and reporting needs. Please contact Rajesh directly at rajeshsirali21@gmail.com with your project brief for a tailored proposal.";
  }

  // Keyword scoring
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

  return "I am Rajesh S I's Portfolio AI Assistant! I can answer questions about his freelance services, technical skills (Excel, Python, SQL), projects, certifications, and availability. For specific project inquiries, feel free to reach out directly at rajeshsirali21@gmail.com.";
}
