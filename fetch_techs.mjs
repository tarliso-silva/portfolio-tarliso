import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não configuradas.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchTechs() {
  const { data, error } = await supabase.from("technologies").select("*");

  if (error) {
    console.error("Erro ao buscar tecnologias:", error.message);
    process.exit(1);
  }

  console.log(JSON.stringify(data, null, 2));
}

fetchTechs();
