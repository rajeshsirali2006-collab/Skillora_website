import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { Request, Response } from 'express';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://rwjsepktqzgmbsslpusq.supabase.co';

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  '';
const keyToUse = supabaseKey || 'placeholder-anon-key';

export interface CookieAdapter {
  getAll: () => { name: string; value: string }[];
  setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => void;
}

/**
 * Creates a server-side Supabase client using `@supabase/ssr`.
 * Adapted for Express and custom Node.js server environments.
 */
export const createServerSupabaseClient = (adapter?: CookieAdapter) => {
  if (adapter) {
    return createServerClient(supabaseUrl, keyToUse, {
      cookies: {
        getAll() {
          return adapter.getAll();
        },
        setAll(cookiesToSet) {
          adapter.setAll(cookiesToSet);
        },
      },
    });
  }

  // Fallback memory cookie store for stateless API handlers
  const memoryCookies = new Map<string, string>();
  return createServerClient(supabaseUrl, keyToUse, {
    cookies: {
      getAll() {
        return Array.from(memoryCookies.entries()).map(([name, value]) => ({ name, value }));
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          memoryCookies.set(name, value);
        });
      },
    },
  });
};

/**
 * Express-specific helper to create a Supabase client bound to Express req & res cookies.
 */
export const createExpressClient = (req: Request, res: Response) => {
  return createServerClient(supabaseUrl, keyToUse, {
    cookies: {
      getAll() {
        const rawCookies = req.headers.cookie || '';
        return rawCookies
          .split(';')
          .filter(Boolean)
          .map((c) => {
            const [name, ...rest] = c.trim().split('=');
            return { name, value: rest.join('=') };
          });
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookie(name, value, options as any);
          });
        } catch {
          // Headers may already be sent
        }
      },
    },
  });
};

export const createClient = createServerSupabaseClient;
export default createServerSupabaseClient;
