"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, supabaseReady } from "@/lib/supabase";
import "../auth.css";

const traducir = (msg = "") => {
  if (msg.includes("Invalid login credentials")) return "Correo o contraseña incorrectos.";
  if (msg.includes("Email not confirmed")) return "Confirma tu correo antes de entrar (revisa tu bandeja).";
  return msg || "No se pudo iniciar sesión.";
};

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(supabaseReady ? "" : "Faltan las variables de Supabase en .env.local.");
  const [loading, setLoading] = useState(false);

  // Si ya hay sesión, ir directo al dashboard
  useEffect(() => {
    if (!supabaseReady) return;
    supabase.auth.getSession().then(({ data }) => { if (data.session) router.replace("/dashboard"); });
  }, [router]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (err) return setError(traducir(err.message));
    router.replace("/dashboard");
  };

  return (
    <main className="ly">
      <Link href="/" className="ly-logo"><span aria-hidden>🏆</span> HabitArena</Link>
      <section className="ly-card">
        <h1>Inicia sesión</h1>
        <p className="ly-sub">Tu personaje te está esperando.</p>
        <form className="ly-form" onSubmit={submit}>
          <label>Correo
            <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" />
          </label>
          <label>Contraseña
            <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </label>
          {error && <p className="ly-error" role="alert">{error}</p>}
          <button type="submit" className="ly-btn" disabled={loading}>{loading ? "Entrando…" : "Entrar"}</button>
        </form>
        <p className="ly-alt">¿Aún no tienes personaje? <Link href="/registro">Regístrate</Link></p>
      </section>
    </main>
  );
}
