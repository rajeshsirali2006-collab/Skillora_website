# Supabase Architecture & Contact Inquiry Integration

Establish a unified Supabase client and server architecture adapted for the React and Express stack, providing reliable persistence for client contract inquiries, live database health telemetry, and seamless schema synchronization.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions have been locked based on your clarified direction:

- **Confirmed Decision 1 (Architecture)**: Adapt Supabase helpers (`@supabase/supabase-js`, `@supabase/ssr` patterns) directly to the existing React Vite and Express environment rather than introducing a breaking migration to Next.js App Router.
- **Confirmed Decision 2 (Core Scope)**: Prioritize client contact inquiry persistence in the `inquiries` table, live submission feedback, signature verification data, and instant Supabase database status reporting in the management modal.
- **Recommended Default (Credentials & Environment)**: Keep both `NEXT_PUBLIC_SUPABASE_*` and standard `SUPABASE_*` environment variables in sync across client and server environments so browser calls and backend routes share identical project credentials.

---

## 1. Overview & Core Concept

- **What It Does**: Bridges client-side portfolio actions (project quote requests, executive advisory bookings, and digital signature agreements) directly to your live Supabase project (`rwjsepktqzgmbsslpusq`), replacing volatile in-memory storage with persistent PostgreSQL records.
- **Target Audience / Persona**: High-value enterprise clients, founders, and CTOs submitting contract inquiries to Rajesh Irali, along with the portfolio owner auditing submissions in real-time.
- **Key Value**: Guarantees zero dropped inquiries with atomic database writes, immediate visual confirmation, and an embedded administrative reviewer for examining stored payload records.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Inquiry Submission**: Prospect completes the engagement builder, chooses service tracks (Architecture, AI Systems, Full-Stack Advisory), signs the digital NDA/pad, and submits.
  2. **Instant Visual Feedback**: Tactile submit button reflects optimistic processing state, submits via the resilient endpoint, and displays an unboxed success confirmation with submission ID and delivery timestamp.
  3. **Administrative Inspection**: Header action launches the Supabase management console with live connection badge, inquiries table explorer, and SQL schema definition copy tools.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Editorial executive portfolio with brutalist restraint and high-contrast typographic hierarchy.
  - *Color Palette & Mood (60-30-10)*: 60% monochromatic dark canvas (`#09090b` / deep zinc), 30% structural glass surfaces (`#18181b` with 1px hairline dividers), and 10% electric cobalt accent (`#2563eb`) reserved strictly for active tabs and primary submission actions.
  - *Typography*: Bold architectural display headings (`Outfit` / `Plus Jakarta Sans`) paired with clean editorial body typography and tabular figures (`tabular-nums`) for numeric metrics and timestamps.
  - *Anti-Slop Discipline*: Zero static rounded pill badges or colored candy chips on metadata; unboxed clean text separated by typographic middots (`·`).
- **Interactive Feedback & Motion**:
  - Micro-interactions settle smoothly within $\le 200\text{ms}$ using standard easing curves.
  - Modals feature backdrop blur with immediate keyboard escape (`ESC`) dismissibility.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: React + Express Adapter vs. Next.js App Router**
  - *Chosen Approach*: Implement browser-safe Supabase singleton in the React frontend while running server-side Supabase verification in Express routes.
  - *Why*: Preserves lightning-fast Vite compilation and existing full-stack endpoints without requiring full folder-structure overhaul or SSR hydration complexity.
  - *Alternatives Considered*: Migrating to Next.js App Router would have forced rewriting client routing, asset pipelines, and Vite middleware.
- **Decision 2: Dual Persistence Fallback**
  - *Chosen Approach*: Server queries live Supabase `inquiries` table as the primary source of truth, with automatic in-memory buffering only during temporary network interruptions.
  - *Why*: Ensures 100% submission availability even if database credentials undergo rotation or cold starts.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│                   React Client (Vite)                  │
│                                                        │
│  ┌───────────────────┐        ┌─────────────────────┐  │
│  │   Contact Form    │        │  Supabase DB Modal  │  │
│  │ (Quote & Sign Pad)│        │ (Records & Status)  │  │
│  └─────────┬─────────┘        └──────────▲──────────┘  │
│            │                             │             │
│            │ POST /api/inquiries         │ GET /status │
└────────────┼─────────────────────────────┼─────────────┘
             │                             │
             ▼                             │
┌──────────────────────────────────────────┴─────────────┐
│                 Express Backend Engine                 │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │    server/db.ts: Supabase JS Client Singleton    │  │
│  │  - URL: https://rwjsepktqzgmbsslpusq.supabase.co │  │
│  │  - Key: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY     │  │
│  └───────────────────────┬──────────────────────────┘  │
└──────────────────────────┼─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│            Supabase Cloud (PostgreSQL 15)              │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Table: public.inquiries                         │  │
│  │  - id: text primary key                          │  │
│  │  - client_name, client_email: text               │  │
│  │  - selected_scope, estimated_budget: text        │  │
│  │  - message, signature_svg: text                  │  │
│  │  - status: text default 'new'                    │  │
│  │  - created_at: timestamptz default now()         │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

- **Data Model & Schema**:
  - `inquiries`: Stores incoming engagement bids, contact metadata, scope selection, and vector signature paths.
  - Compatibility layer supporting both snake_case PostgreSQL columns and camelCase client payloads.
- **Interactive Component & State Mapping**:
  - `Contact.tsx`: Manages multi-step state, client-side email format validation, signature canvas export, and async submission with loading spinners.
  - `InquiryModal.tsx`: Polls live Supabase health, lists all stored submissions with timestamp formatting, and displays direct copyable SQL snippets for administrative management.
