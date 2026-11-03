"use client"; // CSR: datos personales que cambian
import PlayerCard from "@/components/PlayerCard";
import HabitCard from "@/components/HabitCard";
import { habitos } from "@/lib/data";

export default function Dashboard() {
  const hechos = habitos.filter((h) => h.hecho).length;
  return (
    <>
      <PlayerCard />
      <h2 className="section-title">Misión de hoy <span className="muted">{hechos}/{habitos.length}</span></h2>
      <ul className="list">
        {habitos.map((h) => <HabitCard key={h.id} habito={h} />)}
      </ul>
    </>
  );
}
