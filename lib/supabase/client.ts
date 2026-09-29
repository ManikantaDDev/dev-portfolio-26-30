// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

// This creates a simple connection to your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);