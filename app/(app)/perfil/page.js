"use client";
import PlayerCard from "@/components/PlayerCard";
import InstallButton from "@/components/InstallButton";
import { useGame } from "@/components/GameProvider";

export default function Perfil() {
  const { user, profile, habits, logout } = useGame();
  const since = new Date(profile.created_at).toLocaleDateString("es-MX");

  return (
    <div className="g-narrow">
      <h1 className="g-h1">Perfil</h1>
      <PlayerCard />

      <section className="g-card">
        <h2 className="g-h2">Tu aventura</h2>
        <ul className="g-summary">
          <li><b className="g-pixel g-small-pixel">{profile.total_completed}</b><span>Hábitos completados</span></li>
          <li><b className="g-pixel g-small-pixel">{profile.best_streak}</b><span>Mejor racha</span></li>
          <li><b className="g-pixel g-small-pixel">{habits.length}</b><span>Hábitos activos</span></li>
        </ul>
        <p className="g-muted">Cuenta: {user.email} · Jugando desde {since}</p>
      </section>

      <section className="g-card">
        <h2 className="g-h2">Instalar HabitArena</h2>
        <InstallButton />
      </section>

      <button type="button" className="g-btn g-btn-ghost g-btn-full" onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
