import type { Request, Response, NextFunction } from 'express';
import { createExpressClient } from './server';

declare global {
  namespace Express {
    interface Request {
      supabase?: ReturnType<typeof createExpressClient>;
    }
  }
}

/**
 * Express Middleware to attach an authenticated/session-aware Supabase client
 * to each incoming request via `req.supabase`.
 */
export const supabaseMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.supabase = createExpressClient(req, res);
  } catch (err) {
    console.warn('[Supabase Middleware] Failed to attach client to request:', err);
  }
  next();
};

export default supabaseMiddleware;
