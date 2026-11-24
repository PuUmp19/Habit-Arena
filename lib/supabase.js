import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// true cuando el archivo .env.local está bien configurado
export const supabaseReady = Boolean(url && key);

// Solo se usa la clave pública (anon / publishable). La seguridad la dan las políticas RLS.
export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  key || "placeholder-key",
  { auth: { persistSession: true, autoRefreshToken: true } }
);
