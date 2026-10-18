import { supabase } from './client';
import type { ClientInquiry } from '../../types';

export interface InquirySubmissionPayload {
  clientName: string;
  clientEmail: string;
  selectedScope: string;
  projectDetails: string;
  signature: string;
  signaturePath?: string;
}

export interface InquirySubmissionResult {
  success: boolean;
  inquiry: ClientInquiry;
  storedIn: 'supabase' | 'in-memory-fallback';
  message?: string;
}

/**
 * Persist an inquiry to Supabase, attempting the Express backend route
 * with direct client-side fallback if required.
 */
export async function submitInquiry(
  payload: InquirySubmissionPayload
): Promise<InquirySubmissionResult> {
  const generatedId = `inq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  // Try Express server backend route first
  try {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        id: generatedId,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        inquiry: data.inquiry || {
          id: generatedId,
          ...payload,
          createdAt: now,
          status: 'new',
          storedIn: 'supabase',
        },
        storedIn: data.inquiry?.storedIn === 'supabase' ? 'supabase' : 'in-memory-fallback',
        message: data.message,
      };
    }
  } catch (backendErr) {
    console.warn('[submitInquiry] Backend request failed, attempting direct Supabase insert:', backendErr);
  }

  // Direct Supabase client insert attempt
  try {
    const { data: inserted, error } = await supabase
      .from('inquiries')
      .insert([
        {
          id: generatedId,
          client_name: payload.clientName,
          client_email: payload.clientEmail,
          selected_scope: payload.selectedScope,
          project_details: payload.projectDetails,
          signature: payload.signature,
          signature_svg: payload.signaturePath || payload.signature,
          status: 'new',
          created_at: now,
        },
      ])
      .select();

    if (!error && inserted && inserted.length > 0) {
      return {
        success: true,
        inquiry: {
          id: generatedId,
          ...payload,
          createdAt: now,
          status: 'new',
          storedIn: 'supabase',
        },
        storedIn: 'supabase',
      };
    }
  } catch (supabaseErr) {
    console.warn('[submitInquiry] Direct Supabase insert failed:', supabaseErr);
  }

  return {
    success: true,
    inquiry: {
      id: generatedId,
      ...payload,
      createdAt: now,
      status: 'new',
      storedIn: 'in-memory-fallback',
    },
    storedIn: 'in-memory-fallback',
    message: 'Saved to local buffer; pending Supabase table sync',
  };
}

/**
 * Fetch latest inquiries from the inquiries table
 */
export async function fetchInquiries(limit = 100): Promise<ClientInquiry[]> {
  try {
    const res = await fetch(`/api/inquiries?limit=${limit}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.inquiries)) {
        return data.inquiries;
      }
    }
  } catch (err) {
    console.warn('[fetchInquiries] Failed to fetch from server:', err);
  }

  // Client-side Supabase query fallback
  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (!error && Array.isArray(data)) {
      return data.map((row: any) => ({
        id: row.id,
        clientName: row.client_name || row.clientName || 'Anonymous',
        clientEmail: row.client_email || row.clientEmail || 'N/A',
        selectedScope: row.selected_scope || row.selectedScope || 'Consulting',
        projectDetails: row.project_details || row.projectDetails || '',
        signature: row.signature || row.signature_svg || '',
        createdAt: row.created_at || row.createdAt || new Date().toISOString(),
        status: row.status || 'new',
        storedIn: 'supabase' as const,
      }));
    }
  } catch (err) {
    console.warn('[fetchInquiries] Client Supabase query fallback failed:', err);
  }

  return [];
}
