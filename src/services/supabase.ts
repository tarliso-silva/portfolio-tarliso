/**
 * Supabase client — single instance for the entire application.
 *
 * Importe este módulo quando precisar de acesso direto ao Supabase:
 *   import { supabase } from "@/services/supabase";
 *
 * O caminho legado "@/lib/supabase" é mantido como reexportação
 * para compatibilidade com hooks e componentes existentes.
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltam as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY",
  );
}

if (import.meta.env.DEV) {
  console.log("Supabase initialized with URL:", supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth state listener — logs events in dev and handles sign-out cleanup
supabase.auth.onAuthStateChange((event, _session) => {
  if (import.meta.env.DEV) {
    console.log(`Supabase Auth Event: ${event}`);
  }
});
