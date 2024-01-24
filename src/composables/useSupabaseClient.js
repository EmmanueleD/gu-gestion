import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON;

// Create a single supabase client for interacting with your database
const supabaseClient = createClient(supabaseUrl, supabaseKey);

export default function useSupabaseClient() {
  return {
    sbAuth: supabaseClient.auth,
    sbDB: (table) => supabaseClient.from(table),
    sbStorage: supabaseClient.storage,
  };
}
