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
