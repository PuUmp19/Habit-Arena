"use client";
import HabitCard from "@/components/HabitCard";
import { habitos } from "@/lib/data";

export default function Habitos() {
  return (
    <>
      <h2 className="section-title">Mis hábitos</h2>
      <ul className="list">
        {habitos.map((h) => <HabitCard key={h.id} habito={h} />)}
      </ul>
      <button type="button" className="btn full">+ Nuevo hábito</button>
      <p className="muted center">Gratis: hasta 5 hábitos</p>
    </>
  );
}
