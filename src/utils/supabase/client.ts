import { createBrowserClient } from '@supabase/ssr';
import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';

export const supabaseUrl =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_SUPABASE_URL) ||
  '';

export const supabaseKey =
  (typeof process !== 'undefined' &&
    (process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env?.SUPABASE_ANON_KEY)) ||
  (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY) ||
  '';

let browserClient: SupabaseClient | null = null;

export const createClient = (): SupabaseClient => {
  if (!browserClient) {
    const key = supabaseKey;
    try {
      if (supabaseKey) {
        browserClient = createBrowserClient(supabaseUrl, key);
      } else {
        browserClient = createSupabaseClient(supabaseUrl, key);
      }
    } catch {
      browserClient = createSupabaseClient(supabaseUrl, key);
    }
  }
  return browserClient;
};

export const supabase = createClient();
export default supabase;
