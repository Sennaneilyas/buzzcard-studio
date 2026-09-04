import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

const isTest = import.meta.env.MODE === "test";

if ((!supabaseUrl || !supabaseAnonKey) && !isTest) {
  console.warn("Supabase credentials missing in .env.local or .env.test.local");
}

// Unit tests inject fake clients into data-layer functions. A syntactically
// valid local placeholder keeps module imports deterministic without putting
// real project credentials in the test environment or making network calls.
export const supabase = createClient(
  supabaseUrl || (isTest ? "http://127.0.0.1:54321" : ""),
  supabaseAnonKey || (isTest ? "unit-test-anon-key" : ""),
);

// Dev-only: exposes the client to the browser console for manual testing.
// Stripped entirely from the production build by Vite's dead-code elimination.
if (import.meta.env.DEV && typeof window !== "undefined") {
  window.supabase = supabase;
}
