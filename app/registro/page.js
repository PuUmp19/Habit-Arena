"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, supabaseReady } from "@/lib/supabase";
import "../auth.css";

const traducir = (msg = "") => {
  if (msg.includes("already registered")) return "Ese correo ya tiene una cuenta. Inicia sesión.";
  if (msg.includes("Password should be")) return "La contraseña debe tener al menos 6 caracteres.";
  return msg || "No se pudo crear la cuenta.";
};

export default function Registro() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(supabaseReady ? "" : "Faltan las variables de Supabase en .env.local.");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");
    setLoading(true);
    const { data, error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { username: username.trim() || "PLAYER 01" } },
    });
    setLoading(false);
    if (err) return setError(traducir(err.message));
    if (data.session) return router.replace("/dashboard");
    setInfo("¡Cuenta creada! Revisa tu correo para confirmarla y después inicia sesión.");
  };

  return (
    <main className="ly">
      <Link href="/" className="ly-logo"><span aria-hidden>🏆</span> HabitArena</Link>
      <section className="ly-card">
        <h1>Crea tu personaje</h1>
        <p className="ly-sub">Solo te tomará un minuto.</p>
        <form className="ly-form" onSubmit={submit}>
          <label>Nombre de jugador
            <input type="text" maxLength={24} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="PLAYER 01" />
          </label>
          <label>Correo
            <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" />
          </label>
          <label>Contraseña
            <input type="password" required minLength={6} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
          </label>
          {error && <p className="ly-error" role="alert">{error}</p>}
          {info && <p className="ly-info" role="status">{info}</p>}
          <button type="submit" className="ly-btn" disabled={loading}>{loading ? "Creando…" : "Crear cuenta"}</button>
        </form>
        <p className="ly-alt">¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link></p>
      </section>
    </main>
  );
}
