// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Note: This is a client-side-only client. 
// Do not use it in server components or server-side functions.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);