import { jugador } from "@/lib/data";

export default function Header() {
  return (
    <header className="app-header">
      <span className="pixel logo-sm">HabitArena</span>
      <span className="level-chip pixel">NV {jugador.nivel}</span>
    </header>
  );
}
