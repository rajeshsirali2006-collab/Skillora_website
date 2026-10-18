export {
  createClient as createBrowserClient,
  supabase,
  supabaseUrl,
  supabaseKey,
} from './client';

export {
  createServerSupabaseClient,
  createExpressClient,
  type CookieAdapter,
} from './server';

export { supabaseMiddleware } from './middleware';

export {
  submitInquiry,
  fetchInquiries,
  type InquirySubmissionPayload,
  type InquirySubmissionResult,
} from './inquiries';
