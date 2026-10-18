export interface ToastMessage {
  id: string;
  message: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export interface KnowledgeItem {
  title: string;
  keywords: string[];
  content: string;
}

export type ProjectCategory = 'all' | 'excel' | 'automation' | 'database';

export interface ClientInquiry {
  id: string;
  clientName: string;
  clientEmail: string;
  selectedScope: string;
  serviceInterest?: string;
  projectDetails: string;
  signature: string;
  signaturePath?: string;
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

export interface DbStatus {
  isConnected: boolean;
  provider?: 'supabase';
  mode: 'supabase-active' | 'supabase-ready' | 'in-memory-fallback';
  projectId?: string;
  supabaseUrl?: string;
  restUrl?: string;
  apiKeyMasked?: string | null;
  apiKeyConfigured?: boolean;
  clusterHost?: string;
  totalInquiries: number;
  totalChatLogs: number;
  uriConfigured: boolean;
  connectionError: string | null;
}
