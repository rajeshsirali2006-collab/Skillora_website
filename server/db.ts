import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Ensure .env and .env.local are parsed immediately before constants initialize
(function loadEnv() {
  const root = process.cwd();
  const envFiles = ['.env', '.env.local'];
  for (const file of envFiles) {
    const fullPath = path.join(root, file);
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
            if (value.trim()) {
              process.env[key] = value.trim();
            }
          }
        });
      } catch {
        // ignore
      }
    }
  }
})();

export interface ClientInquiry {
  id: string;
  clientName: string;
  clientEmail: string;
  selectedScope: string;
  projectDetails: string;
  signature: string;
  createdAt: string;
  status: 'new' | 'reviewed' | 'archived';
  storedIn?: 'supabase' | 'in-memory-fallback';
}

export interface ChatLogEntry {
  id: string;
  sessionId?: string;
  userMessage: string;
  assistantReply: string;
  timestamp: string;
}

// In-memory fallback stores
let fallbackInquiries: ClientInquiry[] = [
  {
    id: 'demo-inq-1',
    clientName: 'Alex Sharma (Acme Ops)',
    clientEmail: 'alex@acmeops.io',
    selectedScope: 'Excel Dashboard',
    projectDetails: 'We have weekly sales CSVs that take our team 4 hours to clean and format into our executive report. Looking for dynamic Pivot Tables & Power Query pipelines.',
    signature: 'Alex S',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'new',
    storedIn: 'in-memory-fallback'
  },
  {
    id: 'demo-inq-2',
    clientName: 'Priya Mehta',
    clientEmail: 'priya.mehta@fintechlabs.com',
    selectedScope: 'Python & AI Pipeline',
    projectDetails: 'Need an automated script to parse bank statements and classify transaction categories into our normalized SQL database.',
    signature: 'Priya',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'reviewed',
    storedIn: 'in-memory-fallback'
  }
];

let fallbackChatLogs: ChatLogEntry[] = [];

export const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID?.trim() || 'rwjsepktqzgmbsslpusq';
export const SUPABASE_URL =
  process.env.SUPABASE_URL?.trim() ||
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
  process.env.VITE_SUPABASE_URL?.trim() ||
  `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_REST_URL =
  process.env.SUPABASE_REST_URL?.trim() ||
  `${SUPABASE_URL}/rest/v1/`;

let supabaseClient: SupabaseClient | null = null;
let currentAnonKey =
  process.env.SUPABASE_ANON_KEY?.trim() ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
  process.env.VITE_SUPABASE_ANON_KEY?.trim() ||
  process.env.SUPABASE_PUBLISHABLE_KEY?.trim() ||
  '';

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;
  if (currentAnonKey) {
    try {
      supabaseClient = createClient(SUPABASE_URL, currentAnonKey, {
        auth: { persistSession: false }
      });
      console.log(`[Supabase] Client initialized for project ${SUPABASE_PROJECT_ID}`);
      return supabaseClient;
    } catch (err: any) {
      console.warn('[Supabase] Initialization error:', err?.message);
    }
  }
  return null;
}

export function updateSupabaseAnonKey(newKey: string): { success: boolean; message: string } {
  const cleaned = newKey.trim();
  currentAnonKey = cleaned;
  process.env.SUPABASE_ANON_KEY = cleaned;
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = cleaned;

  if (!cleaned) {
    supabaseClient = null;
    return { success: true, message: 'Anon key cleared; operating in fallback mode.' };
  }

  try {
    supabaseClient = createClient(SUPABASE_URL, cleaned, {
      auth: { persistSession: false }
    });
    console.log(`[Supabase] Client re-initialized with new key for project ${SUPABASE_PROJECT_ID}`);
    return { success: true, message: `Connected to Supabase project ${SUPABASE_PROJECT_ID}!` };
  } catch (err: any) {
    supabaseClient = null;
    return { success: false, message: err?.message || 'Invalid Supabase key format' };
  }
}

export async function initDatabase(): Promise<void> {
  console.log(`[Database] Initializing Supabase connector for project: ${SUPABASE_PROJECT_ID}`);
  console.log(`[Database] Supabase URL: ${SUPABASE_URL}`);
  console.log(`[Database] REST Endpoint: ${SUPABASE_REST_URL}`);

  if (currentAnonKey) {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { count, error } = await client.from('inquiries').select('*', { count: 'exact', head: true });
        if (!error) {
          console.log(`[Database] Supabase connected successfully! "inquiries" table verified (${count ?? 0} rows).`);
        } else {
          console.log(`[Database] Supabase client initialized. Note on table: ${error.message}`);
        }
      } catch (err: any) {
        console.warn('[Database] Ping test note:', err?.message);
      }
    }
  } else {
    console.log('[Database] Supabase anon key not set in environment. Ready to receive anon key via UI or .env.');
  }
}

export async function saveInquiry(data: {
  clientName: string;
  clientEmail: string;
  selectedScope?: string;
  serviceInterest?: string;
  projectDetails: string;
  signature: string;
  signaturePath?: string;
}): Promise<ClientInquiry> {
  const scope = data.selectedScope || data.serviceInterest || 'Consulting';
  const sigPath = data.signaturePath || data.signature;

  const newInquiry: ClientInquiry = {
    id: `inq-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    selectedScope: scope,
    projectDetails: data.projectDetails,
    signature: data.signature,
    createdAt: new Date().toISOString(),
    status: 'new',
    storedIn: 'in-memory-fallback',
  };

  const client = getSupabaseClient();
  if (client) {
    // Attempt 1: Full schema with service_interest & signature_path
    const payloadVariantA: Record<string, any> = {
      id: newInquiry.id,
      client_name: newInquiry.clientName,
      client_email: newInquiry.clientEmail,
      selected_scope: newInquiry.selectedScope,
      service_interest: newInquiry.selectedScope,
      project_details: newInquiry.projectDetails,
      signature: newInquiry.signature,
      signature_path: sigPath,
      status: newInquiry.status,
      created_at: newInquiry.createdAt,
    };

    // Attempt 2: Standard schema
    const payloadVariantB: Record<string, any> = {
      id: newInquiry.id,
      client_name: newInquiry.clientName,
      client_email: newInquiry.clientEmail,
      selected_scope: newInquiry.selectedScope,
      project_details: newInquiry.projectDetails,
      signature: newInquiry.signature,
      status: newInquiry.status,
      created_at: newInquiry.createdAt,
    };

    try {
      let res = await client.from('inquiries').insert([payloadVariantA]).select();
      if (res.error) {
        // If columns like service_interest or signature_path don't exist in existing table, try variant B
        console.log('[Supabase] Retrying insert with standard column set:', res.error.message);
        res = await client.from('inquiries').insert([payloadVariantB]).select();
      }

      if (res.error) {
        console.warn('[Supabase] Failed to insert inquiry to Supabase table:', res.error.message);
      } else {
        console.log('[Supabase] Successfully stored inquiry in Supabase table "inquiries":', res.data);
        newInquiry.storedIn = 'supabase';
      }
    } catch (err: any) {
      console.warn('[Supabase] Insert exception:', err?.message);
    }
  } else {
    console.log(`[Database] Supabase anon key pending. Saved inquiry locally for client ${data.clientName}`);
  }

  // Always keep in local memory list as well for instant real-time access
  fallbackInquiries.unshift(newInquiry);
  return newInquiry;
}

export async function getInquiries(limit = 100): Promise<ClientInquiry[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!error && Array.isArray(data)) {
        return data.map((row: any) => ({
          id: row.id || `inq-${Date.now()}`,
          clientName: row.client_name || row.clientName || 'Anonymous',
          clientEmail: row.client_email || row.clientEmail || 'N/A',
          selectedScope: row.selected_scope || row.selectedScope || 'Consulting',
          projectDetails: row.project_details || row.projectDetails || '',
          signature: row.signature || '',
          createdAt: row.created_at || row.createdAt || new Date().toISOString(),
          status: (row.status as any) || 'new',
          storedIn: 'supabase' as const,
        }));
      }
    } catch (err: any) {
      console.warn('[Supabase] Fetch inquiries error:', err?.message);
    }
  }

  return fallbackInquiries.slice(0, limit);
}

export async function saveChatLog(userMessage: string, assistantReply: string, sessionId?: string): Promise<ChatLogEntry> {
  const entry: ChatLogEntry = {
    id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    sessionId: sessionId || 'default-session',
    userMessage,
    assistantReply,
    timestamp: new Date().toISOString(),
  };

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('chat_logs').insert([
        {
          id: entry.id,
          session_id: entry.sessionId,
          user_message: entry.userMessage,
          assistant_reply: entry.assistantReply,
          timestamp: entry.timestamp,
        }
      ]);
    } catch (err: any) {
      console.warn('[Supabase] Chat log insert error:', err?.message);
    }
  }

  fallbackChatLogs.unshift(entry);
  return entry;
}

export async function getChatLogs(limit = 100): Promise<ChatLogEntry[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('chat_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          sessionId: row.session_id || row.sessionId,
          userMessage: row.user_message || row.userMessage,
          assistantReply: row.assistant_reply || row.assistantReply,
          timestamp: row.timestamp,
        }));
      }
    } catch (err: any) {
      console.warn('[Supabase] Fetch chat logs error:', err?.message);
    }
  }

  return fallbackChatLogs.slice(0, limit);
}

export async function getDbStatus(): Promise<{
  isConnected: boolean;
  provider: 'supabase';
  mode: 'supabase-active' | 'supabase-ready' | 'in-memory-fallback';
  projectId: string;
  supabaseUrl: string;
  restUrl: string;
  apiKeyMasked: string | null;
  apiKeyConfigured: boolean;
  clusterHost: string;
  totalInquiries: number;
  totalChatLogs: number;
  uriConfigured: boolean;
  connectionError: string | null;
}> {
  const hasKey = Boolean(currentAnonKey && currentAnonKey.length > 10);
  let isConnected = false;
  let connectionError: string | null = null;
  let liveCount = 0;

  if (hasKey) {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { count, error } = await client
          .from('inquiries')
          .select('*', { count: 'exact', head: true });

        if (!error) {
          isConnected = true;
          liveCount = typeof count === 'number' ? count : 0;
        } else if (error.code === 'PGRST205') {
          // Table doesn't exist yet, but credentials & project are valid
          isConnected = true;
          connectionError = 'Connected to Supabase! Run the SQL snippet to create the "inquiries" table.';
        } else {
          connectionError = `Supabase error (${error.code || 'ERR'}): ${error.message}`;
        }
      } catch (e: any) {
        connectionError = e?.message || 'Unable to query Supabase table';
      }
    }
  } else {
    connectionError = 'Supabase key not configured in environment.';
  }

  const mode = isConnected ? 'supabase-active' : (hasKey ? 'supabase-ready' : 'in-memory-fallback');

  return {
    isConnected,
    provider: 'supabase',
    mode,
    projectId: SUPABASE_PROJECT_ID,
    supabaseUrl: SUPABASE_URL,
    restUrl: SUPABASE_REST_URL,
    apiKeyMasked: hasKey ? `${currentAnonKey.slice(0, 16)}...${currentAnonKey.slice(-6)}` : null,
    apiKeyConfigured: hasKey,
    clusterHost: `${SUPABASE_PROJECT_ID}.supabase.co`,
    totalInquiries: isConnected ? liveCount : fallbackInquiries.length,
    totalChatLogs: fallbackChatLogs.length,
    uriConfigured: true,
    connectionError: (isConnected && !connectionError) ? null : connectionError,
  };
}
