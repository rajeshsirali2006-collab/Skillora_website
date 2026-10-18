import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  initDatabase,
  saveInquiry,
  getInquiries,
  saveChatLog,
  getChatLogs,
  getDbStatus,
  updateSupabaseAnonKey,
} from './server/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env and .env.local
function loadEnv() {
  const envFiles = ['.env', '.env.local'];
  for (const file of envFiles) {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        content.split('\n').forEach((line) => {
          const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
          if (match) {
            const key = match[1];
            let value = match[2] || '';
            if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
            if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
            process.env[key] = value.trim();
          }
        });
      } catch (e: any) {
        console.warn(`Could not read ${file}:`, e.message);
      }
    }
  }
}
loadEnv();

import { supabaseMiddleware } from './src/utils/supabase/middleware';

const PORT = Number(process.env.PORT) || 3000;
const app = express();

app.use(express.json({ limit: '50kb' }));
app.use(supabaseMiddleware);

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Load knowledge base
interface KnowledgeChunk {
  title: string;
  keywords: string[];
  content: string;
}

let knowledgeData: KnowledgeChunk[] = [];
try {
  const kbPath = path.join(__dirname, 'data', 'knowledge_base.json');
  if (fs.existsSync(kbPath)) {
    knowledgeData = JSON.parse(fs.readFileSync(kbPath, 'utf8'));
  } else {
    const srcKbPath = path.join(__dirname, 'src', 'data', 'knowledge_base.json');
    if (fs.existsSync(srcKbPath)) {
      knowledgeData = JSON.parse(fs.readFileSync(srcKbPath, 'utf8'));
    }
  }
} catch (err) {
  console.warn('Could not load knowledge_base.json from disk:', err);
}

// Fallback in case file read fails
if (!knowledgeData.length) {
  knowledgeData = [
    {
      title: "Contact & Availability",
      keywords: ["contact", "email", "phone", "linkedin", "hire", "freelance", "reach", "location", "bangalore"],
      content: "You can reach Rajesh S I via email at rajeshirali12@gmail.com or by phone at +91 9380433994. He is based in Bangalore, Karnataka, India and is available for freelance contracts in data analytics and automation pipelines."
    },
    {
      title: "Services Offered",
      keywords: ["services", "hire", "what do you do", "excel", "spreadsheets", "data cleaning", "automation", "dashboards", "sql", "pricing"],
      content: "Rajesh specializes in Advanced Excel automation (Power Query, Pivot Tables, formula workflows), automated data cleaning and validation, relational SQL databases (PostgreSQL/Supabase/MySQL), and AI workflow integration."
    },
    {
      title: "Projects",
      keywords: ["portfolio", "projects", "excel dashboard", "kpi", "vlookup", "power query", "information management"],
      content: "Featured projects include an Automated Data Processing & Analytics Dashboard in Excel (>20% manual error reduction) and an Information Management & Workflow Optimization System built with Python, SQL, and AI workflow integrations."
    },
    {
      title: "Credentials",
      keywords: ["education", "degree", "college", "certifications", "workshops", "training"],
      content: "Rajesh holds a Bachelor of Engineering (B.E.) from MS Engineering College, Bangalore (2024–2028), scored 88% in PUC Science, and is certified in Microsoft Excel Beginners to Advance (Credential ID: SC-G7CCPCI3PW)."
    }
  ];
}

function scoreChunk(chunk: KnowledgeChunk, queryTerms: string[]): number {
  let score = 0;
  const chunkText = (chunk.title + ' ' + chunk.content + ' ' + chunk.keywords.join(' ')).toLowerCase();
  for (const term of queryTerms) {
    if (term.length < 2) continue;
    if (chunk.keywords.some((k) => k.includes(term))) score += 3.5;
    if (chunkText.includes(term)) score += 1.5;
  }
  return score;
}

function retrieveRelevantContext(query: string, limit = 3): string {
  const queryTerms = query.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/);
  const scored = knowledgeData.map((chunk) => ({
    chunk,
    score: scoreChunk(chunk, queryTerms),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.chunk.content).join('\n\n---\n\n');
}

function getOfflineFallback(query: string): string {
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

  if (q.includes("swift") || q.includes("ios") || q.includes("flutter") || q.includes("mobile app")) {
    return "Rajesh S I specializes specifically in Data Analytics, Advanced Excel operations (Power Query, Pivot Tables), Python data scripts, SQL databases, and AI-driven workflow automation. Mobile app development (iOS/Swift/Android) is outside his current freelance scope. Feel free to ask about his data analytics, dashboards, or workflow automation services!";
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
  if (q.includes("excel") || q.includes("spreadsheet") || q.includes("power query") || q.includes("pivot") || q.includes("formula") || q.includes("vlookup") || q.includes("xlookup") || q.includes("macro") || q.includes("sheet")) {
    return "Rajesh is certified in Microsoft Excel (Beginners to Advance) and handles: Power Query automated ETL pipelines, dynamic KPI executive dashboards, multi-table reconciliations, nested XLOOKUP/INDEX-MATCH formulas, error-handling rules, and automated reporting templates that eliminate repetitive manual spreadsheet work.";
  }

  // Client question: Python, SQL & Database
  if (q.includes("python") || q.includes("sql") || q.includes("database") || q.includes("postgres") || q.includes("supabase") || q.includes("mysql") || q.includes("pipeline")) {
    return "Rajesh builds data scripts and databases using Python (Pandas, OpenPyXL), normalized relational SQL schemas (PostgreSQL, Supabase, MySQL), and automated ETL pipelines with sub-second query retrieval and automated data cleaning.";
  }

  // Projects & Case Studies
  if (q.includes("project") || q.includes("portfolio") || q.includes("case study") || q.includes("dashboard") || q.includes("work")) {
    return "Rajesh's featured projects include an Automated Data Processing & Analytics Dashboard in Excel (>20% manual error reduction with dynamic KPI summaries) and an Information Management & Workflow Optimization System built with Python, SQL (Supabase/PostgreSQL), and AI workflow integrations.";
  }

  // Education & Credentials
  if (q.includes("education") || q.includes("degree") || q.includes("college") || q.includes("certification") || q.includes("credential")) {
    return "Rajesh holds a Bachelor of Engineering (B.E.) from MS Engineering College, Bangalore (2024–2028), scored 88% distinction in PUC Science, and holds official certifications in 'Microsoft Excel Beginners to Advance' (Credential ID: SC-G7CCPCI3PW) and 'Practical Data Analytics & AI Workflows' from SkillCourse.";
  }

  return "I am Rajesh S I's Portfolio AI Assistant! I can answer questions about his freelance data analytics services, Excel dashboards, Python/SQL pipelines, turnaround timelines, pricing quotes, and NDA agreements. For project inquiries, reach out directly at rajeshirali12@gmail.com.";
}

// Inquiries API
app.get('/api/inquiries', async (_req, res) => {
  try {
    const list = await getInquiries(100);
    res.json({ inquiries: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/inquiries', async (req, res) => {
  try {
    const {
      clientName,
      name,
      clientEmail,
      email,
      selectedScope,
      serviceInterest,
      service_interest,
      projectDetails,
      message,
      signature,
      signaturePath,
      signature_path,
    } = req.body || {};

    const resolvedName = String(clientName || name || '').trim();
    const resolvedEmail = String(clientEmail || email || '').trim();
    const resolvedDetails = String(projectDetails || message || '').trim();
    const resolvedSig = String(signature || signaturePath || signature_path || '').trim();
    const resolvedScope = String(selectedScope || serviceInterest || service_interest || 'General Consulting').trim();
    const resolvedSigPath = String(signaturePath || signature_path || resolvedSig).trim();

    if (!resolvedName || !resolvedEmail || !resolvedDetails || !resolvedSig) {
      return res.status(400).json({ error: 'Missing required inquiry fields (name, email, project details, signature)' });
    }

    const saved = await saveInquiry({
      clientName: resolvedName,
      clientEmail: resolvedEmail,
      selectedScope: resolvedScope,
      serviceInterest: resolvedScope,
      projectDetails: resolvedDetails,
      signature: resolvedSig,
      signaturePath: resolvedSigPath,
    });

    res.status(201).json({ success: true, inquiry: saved });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Database Status API
app.get('/api/status/db', async (_req, res) => {
  try {
    const status = await getDbStatus();
    res.json(status);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update Supabase Anon Key dynamically from UI
app.post('/api/config/supabase-key', (req, res) => {
  try {
    const { key } = req.body || {};
    const result = updateSupabaseAnonKey(String(key || ''));
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Chat Logs API
app.get('/api/chat/logs', async (_req, res) => {
  try {
    const logs = await getChatLogs(100);
    res.json({ logs });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// /api/chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = (req.body.message || (req.body.messages && req.body.messages[req.body.messages.length - 1]?.content) || '').trim();
    const sessionId = (req.body.sessionId || 'session-1').trim();

    if (!userMessage) {
      return res.status(400).json({ error: 'Message content cannot be empty.' });
    }

    if (userMessage.length > 600) {
      return res.status(400).json({ error: 'Message exceeds allowed length (600 characters).' });
    }

    const lowerMsg = userMessage.toLowerCase();
    if (
      lowerMsg.includes('ignore previous instructions') ||
      lowerMsg.includes('disclose your system prompt') ||
      lowerMsg.includes('reveal api key') ||
      lowerMsg.includes('ignore all instructions') ||
      lowerMsg.includes('print your system prompt')
    ) {
      const reply = "I am programmed exclusively to assist with queries regarding Rajesh S I's portfolio, freelance services, and technical background. Please feel free to ask about his data analytics experience or contact details!";
      await saveChatLog(userMessage, reply, sessionId);
      return res.json({ reply });
    }

    if (lowerMsg.includes('swift') || lowerMsg.includes('ios mobile') || lowerMsg.includes('android app') || lowerMsg.includes('flutter')) {
      const reply = "Rajesh S I specializes specifically in Data Analytics, Advanced Excel operations (Power Query, Pivot Tables), Python data scripts, SQL databases, and AI-driven workflow automation. Mobile app development (iOS/Swift/Android) is outside his current freelance focus. Feel free to ask about his analytics and dashboard services!";
      await saveChatLog(userMessage, reply, sessionId);
      return res.json({ reply });
    }

    const context = retrieveRelevantContext(userMessage);
    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      const reply = getOfflineFallback(userMessage);
      await saveChatLog(userMessage, reply, sessionId);
      return res.json({ reply });
    }

    const systemPrompt = `You are the Freelance Client Intake & Portfolio Assistant for Rajesh S I, a freelance data analyst and automation specialist based in Bangalore, India.
Your mission is to assist prospective enterprise clients, startup founders, and operational leaders in evaluating Rajesh for their data analytics, Excel dashboards, automated data cleaning, and Python/SQL projects.

Key Client Knowledge:
- Core Services: Advanced Excel Dashboards (Power Query, Pivot Tables, dynamic KPIs, automated formula models), Automated Data Cleaning & Validation (Python scripts, CSV normalization), Relational SQL Pipelines (Supabase/PostgreSQL/MySQL, 3NF schema, sub-second queries), and AI workflow integration.
- Typical Turnaround: 24–48 hours for Excel cleanup/formulas; 3–5 days for custom KPI dashboards; 1–2 weeks for end-to-end SQL/Python data systems.
- Pricing Model: Transparent fixed-scope milestone deliverables. Clients receive a clear quote and timeline within 24 hours. No surprise hourly overruns.
- Confidentiality: Rajesh readily signs client Non-Disclosure Agreements (NDAs) before inspecting proprietary data.
- Contact Channels: Email at rajeshirali12@gmail.com, Phone/WhatsApp at +91 9380433994, or via the on-site "Sign & Contact" form.

Guidelines:
1. Always maintain a professional, polite, and confident tone.
2. Provide direct, helpful answers formatted cleanly with bullet points when listing steps or timelines.
3. If asked about exact prices, explain that pricing is fixed-fee per milestone based on dataset size and reporting depth, and encourage them to share their brief or email rajeshirali12@gmail.com for a quote within 24 hours.
4. Ground your responses strictly in the provided context and never fabricate capabilities (e.g. mobile app development is not offered).

Context:
${context}
`;

    try {
      const apiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nClient Inquiry: ${userMessage}` }],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 250,
            },
          }),
        }
      );

      if (!apiRes.ok) {
        const reply = getOfflineFallback(userMessage);
        await saveChatLog(userMessage, reply, sessionId);
        return res.json({ reply });
      }

      const data = await apiRes.json();
      const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const finalReply = candidateText ? candidateText.trim() : getOfflineFallback(userMessage);
      await saveChatLog(userMessage, finalReply, sessionId);
      return res.json({ reply: finalReply });
    } catch {
      const reply = getOfflineFallback(userMessage);
      await saveChatLog(userMessage, reply, sessionId);
      return res.json({ reply });
    }
  } catch (err) {
    return res.status(400).json({ error: 'Invalid request' });
  }
});

async function startServer() {
  await initDatabase();

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Rajesh S I Portfolio Server listening on http://0.0.0.0:${PORT}`);
  });

  // Call this only when your application terminates
  process.on('SIGINT', async () => {
    console.log('[Server] Shutting down server gracefully...');
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('[Server] Terminating server gracefully...');
    process.exit(0);
  });
}

startServer();
