"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", icono: "🏠", texto: "Inicio" },
  { href: "/habitos", icono: "✅", texto: "Hábitos" },
  { href: "/stats", icono: "📊", texto: "Stats" },
  { href: "/perfil", icono: "👤", texto: "Perfil" },
];

export default function BottomNav() {
  const ruta = usePathname();
  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {items.map((i) => (
        <Link key={i.href} href={i.href} className={ruta === i.href ? "active" : ""}>
          <span aria-hidden>{i.icono}</span>
          {i.texto}
        </Link>
      ))}
    </nav>
  );
}
