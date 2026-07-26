import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing in .env.local or .env.test.local");
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

// Dev-only: exposes the client to the browser console for manual testing.
// Stripped entirely from the production build by Vite's dead-code elimination.
if (import.meta.env.DEV && typeof window !== "undefined") {
  window.supabase = supabase;
}
