"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGame } from "./GameProvider";

const items = [
  { href: "/dashboard", icono: "🏠", texto: "Inicio" },
  { href: "/habitos", icono: "✅", texto: "Hábitos" },
  { href: "/historial", icono: "📅", texto: "Historial" },
  { href: "/logros", icono: "🏆", texto: "Logros" },
  { href: "/perfil", icono: "👤", texto: "Perfil" },
];

// Barra inferior en el celular, menú lateral en escritorio
export default function AppNav() {
  const ruta = usePathname();
  const { profile } = useGame();
  return (
    <>
      <header className="g-top">
        <span className="g-brand"><i aria-hidden>🏆</i>HabitArena</span>
        <span className="g-lvl g-pixel">NV {profile.level}</span>
      </header>
      <nav className="g-nav" aria-label="Navegación principal">
        <span className="g-brand g-brand-side"><i aria-hidden>🏆</i>HabitArena</span>
        {items.map((i) => (
          <Link key={i.href} href={i.href} className={ruta === i.href ? "active" : ""}>
            <span aria-hidden>{i.icono}</span>
            {i.texto}
          </Link>
        ))}
      </nav>
    </>
  );
}
