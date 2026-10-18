import { createBrowserClient } from '@supabase/ssr';
import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';

export const supabaseUrl =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_SUPABASE_URL) ||
  'https://rwjsepktqzgmbsslpusq.supabase.co';

export const supabaseKey =
  (typeof process !== 'undefined' &&
    (process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env?.SUPABASE_ANON_KEY)) ||
  (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY) ||
  'sb_publishable_FWKVT96az_e4SHwEkB2L_g_jimu3X0s';

let browserClient: SupabaseClient | null = null;

export const createClient = (): SupabaseClient => {
  if (!browserClient) {
    try {
      browserClient = createBrowserClient(supabaseUrl, supabaseKey);
    } catch {
      browserClient = createSupabaseClient(supabaseUrl, supabaseKey);
    }
  }
  return browserClient;
};

export const supabase = createClient();
export default supabase;
