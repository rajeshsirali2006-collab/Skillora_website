# Rajesh S I — Freelance Portfolio & RAG Chatbot (React + TypeScript)

![Hero Preview](Screenshot%202026-10-18%20225608.png)
![About & Portal Preview](Screenshot%202026-10-18%20230145.png)

An interactive, responsive portfolio web application for **Rajesh S I**, a freelance Data Analyst and Workflow Automation Specialist based in Bangalore. Built with **React 19, TypeScript, and Vite**, featuring tactile claymorphic aesthetics, an interactive data cleaning simulator, dynamic signature signing, and an embedded full-stack RAG assistant powered by Google Gemini (with an automatic offline fallback engine).

---

## 1. Project Overview & Features

The portfolio serves as an interactive hub for client inquiries, technical credential verification, and demonstration of data engineering capabilities.

### Key Features

* **Tactile Claymorphism UI**: Custom tactile design using earthy tones (terracotta, olive, and sand) along with analog grain overlays and soft specular depth.
* **Interactive Data Simulator**: An in-browser ETL simulation demonstrating automated data cleaning, record normalization, and real-time metric recalculation with live toast feedback.
* **Project Categorization**: Filterable case studies with category pills for Excel, Python/AI Automation, and Databases/SQL.
* **Digital Signature & Inquiry Form**: Interactive client inquiry submission form with dynamic signature pad (live seal badge) and direct `mailto` integration.
* **Full-Stack RAG Chatbot**: An embedded AI chatbot that uses in-memory keyword/BM25 scoring against a domain-specific knowledge base. It calls Google Gemini (`gemini-1.5-flash`) when configured, and gracefully defaults to a client/server offline local engine if unconfigured or unreachable.
* **Skeleton Loading Mode**: Native-feeling toggleable skeleton view with shimmer placeholders.

---

## 2. Architecture & Tech Stack

* **Frontend**: React 19, TypeScript, Vite, Modular Functional Components.
* **Styling**: Tactile Claymorphism CSS (`src/index.css`) with tokens, analog grain filter, and ambient lighting blobs.
* **Backend**: Express server (`server.ts`) with Vite dev middleware mode, providing `/api/chat` with BM25 context retrieval and Gemini API integration.
* **Data Layer**: Domain knowledge base (`src/data/knowledge_base.json` & `src/data/knowledge.ts`) enabling 100% offline availability for client queries.

---

## 3. Project Structure

```text
├── index.html                    # Main HTML entry with fonts & meta tags
├── metadata.json                 # AI Studio metadata & capabilities
├── package.json                  # Scripts & dependencies
├── tsconfig.json                 # TypeScript compiler configuration
├── vite.config.ts                # Vite React configuration
├── server.ts                     # Express server & /api/chat RAG endpoint
├── public/
│   └── assets/                   # Public images (clay art & profile)
├── src/
│   ├── main.tsx                  # React DOM mount entry
│   ├── App.tsx                   # Main application layout & state
│   ├── types.ts                  # Shared TypeScript interfaces
│   ├── index.css                 # Claymorphism design system & styles
│   ├── components/
│   │   ├── Header.tsx            # Navigation & skeleton toggle
│   │   ├── Hero.tsx              # Hero banner & trust metrics
│   │   ├── Services.tsx          # 3 core freelance offerings
│   │   ├── Projects.tsx          # Case studies & interactive ETL simulator
│   │   ├── About.tsx             # Clay avatar portal, bio & toolset matrix
│   │   ├── Credentials.tsx       # Certifications & academic foundation
│   │   ├── Contact.tsx           # Channels & interactive signature form
│   │   ├── Footer.tsx            # Footer navigation & copyright
│   │   ├── Chatbot.tsx           # Floating RAG AI assistant & presets
│   │   └── Toast.tsx             # Tactile notifications
│   └── data/
│       ├── knowledge.ts          # Client-side RAG fallback engine
│       └── knowledge_base.json   # Structured knowledge chunks
```

---

## 4. Setup & Running

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Runs the development server listening on `http://0.0.0.0:3000`.

### Production Build

```bash
npm run build
npm start
```

---

## 5. License

MIT License © 2026 Rajesh S I.
