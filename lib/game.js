// ===== Reglas del juego y utilidades (sin dependencias) =====

export const STATS = [
  { key: "health", label: "Salud", icon: "❤️", color: "#FF5C8A" },
  { key: "intelligence", label: "Inteligencia", icon: "🧠", color: "#4DA3FF" },
  { key: "energy", label: "Energía", icon: "⚡", color: "#FFD84D" },
];
export const STAT_BY_KEY = Object.fromEntries(STATS.map((s) => [s.key, s]));

export const MAX_STAT = 100;
export const DAILY_BONUS = 20; // XP extra por completar todos los hábitos del día

export const CATEGORIES = ["Bienestar", "Ejercicio", "Estudio", "Trabajo", "Social", "Otro"];
export const EMOJIS = ["💧", "📖", "🏃", "🧘", "💻", "😴", "🍎", "✍️", "🎸", "🧹", "💪", "✨"];

export const DAYS = [
  { n: 1, short: "L", name: "Lunes" },
  { n: 2, short: "M", name: "Martes" },
  { n: 3, short: "X", name: "Miércoles" },
  { n: 4, short: "J", name: "Jueves" },
  { n: 5, short: "V", name: "Viernes" },
  { n: 6, short: "S", name: "Sábado" },
  { n: 0, short: "D", name: "Domingo" },
];

// Cada nivel pide más XP que el anterior: nivel 8 → 500 XP
export const xpNeeded = (level) => 100 + 50 * level;

export function addXp(level, xp, amount) {
  let l = level;
  let x = xp + amount;
  const reached = [];
  while (x >= xpNeeded(l)) {
    x -= xpNeeded(l);
    l += 1;
    reached.push(l);
  }
  return { level: l, xp: x, reached };
}

export function removeXp(level, xp, amount) {
  let l = level;
  let x = xp - amount;
  while (x < 0 && l > 1) {
    l -= 1;
    x += xpNeeded(l);
  }
  return { level: l, xp: Math.max(0, x) };
}

// ----- Fechas (siempre en hora local, formato YYYY-MM-DD) -----
const pad = (n) => String(n).padStart(2, "0");
export const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const fromISO = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d, 12);
};
export const todayISO = () => toISO(new Date());
export const addDays = (iso, n) => {
  const d = fromISO(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
};
export const dow = (iso) => fromISO(iso).getDay();

export function isScheduled(habit, iso) {
  return habit.frequency === "daily" || (habit.days || []).includes(dow(iso));
}

export function frequencyLabel(habit) {
  if (habit.frequency === "daily") return "Todos los días";
  return DAYS.filter((d) => habit.days.includes(d.n)).map((d) => d.short).join(" · ");
}

// Racha = días seguidos con todos los hábitos completados.
// Si hoy aún no está completo, la racha sigue viva contando desde ayer.
export function calcStreak(clearDays, today) {
  const set = new Set(clearDays);
  let d = set.has(today) ? today : addDays(today, -1);
  let count = 0;
  while (set.has(d)) {
    count += 1;
    d = addDays(d, -1);
  }
  return count;
}

export function motivation({ total, done, streak }) {
  if (total === 0) return "Crea tu primer hábito para comenzar tu aventura.";
  if (done === 0) return "¡Nueva misión! Completa tu primer hábito del día.";
  if (done < total) {
    const faltan = total - done;
    return `¡Vas bien! ${faltan === 1 ? "Te falta 1 hábito" : `Te faltan ${faltan} hábitos`} para el bonus del día.`;
  }
  return streak > 1
    ? `¡Día perfecto! Llevas ${streak} días de racha. Sigue así.`
    : "¡Día perfecto! Mañana puedes empezar tu racha.";
}

export const SUGGESTED = [
  { name: "Tomar agua", emoji: "💧", category: "Bienestar", stat: "health", xp: 10, stat_points: 5 },
  { name: "Leer 20 minutos", emoji: "📖", category: "Estudio", stat: "intelligence", xp: 10, stat_points: 5 },
  { name: "Hacer ejercicio", emoji: "🏃", category: "Ejercicio", stat: "energy", xp: 15, stat_points: 5 },
  { name: "Meditar", emoji: "🧘", category: "Bienestar", stat: "health", xp: 8, stat_points: 3 },
  { name: "Estudiar programación", emoji: "💻", category: "Estudio", stat: "intelligence", xp: 15, stat_points: 8 },
];

// ----- Logros (se calculan con los datos guardados) -----
export function getAchievements({ profile, habits, clears }) {
  const p = profile;
  const list = [
    { id: "first", icon: "🌟", title: "Primer paso", desc: "Completa tu primer hábito", value: p.total_completed, goal: 1 },
    { id: "c25", icon: "✅", title: "En marcha", desc: "Completa 25 hábitos", value: p.total_completed, goal: 25 },
    { id: "c100", icon: "💯", title: "Imparable", desc: "Completa 100 hábitos", value: p.total_completed, goal: 100 },
    { id: "perfect", icon: "🎯", title: "Día perfecto", desc: "Completa todos los hábitos de un día", value: clears.length, goal: 1 },
    { id: "s3", icon: "🔥", title: "Calentando", desc: "Racha de 3 días", value: p.best_streak, goal: 3 },
    { id: "s7", icon: "🔥", title: "Una semana", desc: "Racha de 7 días", value: p.best_streak, goal: 7 },
    { id: "s30", icon: "🏅", title: "Leyenda", desc: "Racha de 30 días", value: p.best_streak, goal: 30 },
    { id: "l5", icon: "⭐", title: "Aprendiz", desc: "Llega al nivel 5", value: p.level, goal: 5 },
    { id: "l10", icon: "👑", title: "Maestro", desc: "Llega al nivel 10", value: p.level, goal: 10 },
    { id: "mk", icon: "🛠️", title: "Creador", desc: "Ten 5 hábitos creados", value: habits.length, goal: 5 },
    {
      id: "max", icon: "💎", title: "Al máximo", desc: "Lleva una estadística a 100",
      value: Math.max(p.health, p.intelligence, p.energy), goal: 100,
    },
  ];
  return list.map((a) => ({ ...a, unlocked: a.value >= a.goal, shown: Math.min(a.value, a.goal) }));
}
