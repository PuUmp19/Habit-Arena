// Datos de ejemplo (solo diseño). Después vendrán de Supabase.
export const jugador = {
  nombre: "PLAYER 01",
  nivel: 8,
  xp: 340,
  xpSiguiente: 500,
  racha: 12,
  stats: [
    { id: "salud", nombre: "Salud", icono: "❤️", valor: 82, color: "var(--salud)" },
    { id: "inteligencia", nombre: "Inteligencia", icono: "🧠", valor: 67, color: "var(--inteligencia)" },
    { id: "energia", nombre: "Energía", icono: "⚡", valor: 74, color: "var(--energia)" },
  ],
};

export const habitos = [
  { id: 1, nombre: "Tomar agua", stat: "Salud", icono: "💧", xp: 10, hecho: true },
  { id: 2, nombre: "Leer 20 minutos", stat: "Inteligencia", icono: "📖", xp: 15, hecho: true },
  { id: 3, nombre: "Hacer ejercicio", stat: "Salud", icono: "🏃", xp: 20, hecho: false },
  { id: 4, nombre: "Dormir 8 horas", stat: "Energía", icono: "😴", xp: 15, hecho: false },
];

export const planes = [
  { nombre: "Gratis", precio: "$0", items: ["Hasta 5 hábitos", "Stats y racha", "Funciona sin internet"] },
  { nombre: "Premium", precio: "$49 / mes", items: ["Hábitos ilimitados", "Retos con amigos", "Avatares"], destacado: true },
];
