import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

/**
 * The cookie-backed server client, narrowed to our schema so table names,
 * column names and row shapes are all checked at compile time.
 */
export async function database(): Promise<SupabaseClient<Database>> {
  return (await createClient()) as unknown as SupabaseClient<Database>;
}
