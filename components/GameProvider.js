"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, supabaseReady } from "@/lib/supabase";
import {
  DAILY_BONUS, MAX_STAT, SUGGESTED, addDays, addXp, calcStreak, isScheduled, removeXp, todayISO,
} from "@/lib/game";

const Ctx = createContext(null);
export const useGame = () => useContext(Ctx);

const SNAP = "habitarena:snapshot:v1";
const readSnap = () => {
  try { return JSON.parse(localStorage.getItem(SNAP)); } catch { return null; }
};
const writeSnap = (v) => {
  try { localStorage.setItem(SNAP, JSON.stringify(v)); } catch {}
};

export default function GameProvider({ children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [offline, setOffline] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [levelUp, setLevelUp] = useState(null);
  const [today, setToday] = useState(todayISO());
  const dataRef = useRef(null);
  const userRef = useRef(null);
  const busyRef = useRef(false);

  const notify = useCallback((text, kind = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, text, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const commit = useCallback((next, u = userRef.current) => {
    dataRef.current = next;
    setData(next);
    if (u) writeSnap({ uid: u.id, email: u.email, data: next });
  }, []);

  // ---------- Carga inicial ----------
  const load = useCallback(async () => {
    if (!supabaseReady) {
      setError("Faltan las variables de entorno de Supabase. Revisa tu archivo .env.local.");
      setReady(true);
      return;
    }
    const snap = readSnap();
    try {
      if (!navigator.onLine && snap) throw new Error("offline");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }
      const uid = session.user.id;
      const u = { id: uid, email: session.user.email };
      userRef.current = u;
      setUser(u);

      let { data: profile, error: e1 } = await supabase.from("profiles").select("*").eq("id", uid).maybeSingle();
      if (e1) throw e1;
      if (!profile) {
        const { data: created, error: e2 } = await supabase
          .from("profiles")
          .insert({ id: uid, username: session.user.user_metadata?.username || "PLAYER 01" })
          .select().single();
        if (e2) throw e2;
        profile = created;
      }

      const since = addDays(todayISO(), -120);
      const [h, l, c, lv] = await Promise.all([
        supabase.from("habits").select("*").order("created_at"),
        supabase.from("habit_logs").select("*").gte("log_date", since).order("created_at", { ascending: false }),
        supabase.from("daily_clears").select("*").order("day"),
        supabase.from("level_history").select("*").order("level"),
      ]);
      for (const r of [h, l, c, lv]) if (r.error) throw r.error;

      commit({ profile, habits: h.data, logs: l.data, clears: c.data, levels: lv.data }, u);
      setOffline(false);
      setError("");
    } catch (e) {
      if (snap) {
        const u = { id: snap.uid, email: snap.email };
        userRef.current = u;
        setUser(u);
        dataRef.current = snap.data;
        setData(snap.data);
        setOffline(true);
      } else {
        setError(e?.message || "No se pudo cargar tu progreso.");
      }
    } finally {
      setReady(true);
    }
  }, [router, commit]);

  useEffect(() => {
    load();
    const goOnline = () => load();
    const goOffline = () => setOffline(true);
    const onVisible = () => { if (document.visibilityState === "visible") setToday(todayISO()); };
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  // ---------- Ayudantes ----------
  const guard = () => {
    if (offline) { notify("Sin conexión: conéctate para guardar cambios.", "error"); return false; }
    if (busyRef.current) return false;
    return true;
  };
  const run = async (fn) => {
    busyRef.current = true;
    setBusy(true);
    try { await fn(); }
    catch (e) {
      notify(e?.message || "Ocurrió un error. Intenta de nuevo.", "error");
      load(); // volver a sincronizar con el servidor
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };
  const must = (res) => { if (res.error) throw res.error; return res.data; };

  // ---------- Completar hábito ----------
  const completeHabit = async (habit) => {
    if (!guard()) return;
    const d = dataRef.current;
    const day = todayISO();
    if (d.logs.some((l) => l.habit_id === habit.id && l.log_date === day)) return;

    await run(async () => {
      const p = d.profile;
      const col = habit.stat;
      const gain = Math.max(0, Math.min(habit.stat_points, MAX_STAT - p[col]));
      let { level, xp, reached } = addXp(p.level, p.xp, habit.xp);

      const log = must(await supabase.from("habit_logs").insert({
        user_id: userRef.current.id, habit_id: habit.id, habit_name: habit.name, habit_emoji: habit.emoji,
        log_date: day, stat: col, stat_points: gain, xp_awarded: habit.xp,
      }).select().single());
      const logs = [log, ...d.logs];

      // ¿Completó todos los hábitos de hoy? → bonus de XP
      const scheduled = d.habits.filter((h) => isScheduled(h, day));
      const doneIds = new Set(logs.filter((l) => l.log_date === day).map((l) => l.habit_id));
      let clears = d.clears;
      let bonus = 0;
      if (scheduled.length && scheduled.every((h) => doneIds.has(h.id)) && !clears.some((c) => c.day === day)) {
        bonus = DAILY_BONUS;
        const r = addXp(level, xp, bonus);
        level = r.level; xp = r.xp; reached = [...reached, ...r.reached];
        const clr = must(await supabase.from("daily_clears")
          .insert({ user_id: userRef.current.id, day, bonus_xp: bonus }).select().single());
        clears = [...clears, clr];
      }

      const streak = calcStreak(clears.map((c) => c.day), day);
      const profile = must(await supabase.from("profiles").update({
        level, xp, [col]: p[col] + gain, streak,
        best_streak: Math.max(p.best_streak, streak),
        total_completed: p.total_completed + 1,
      }).eq("id", userRef.current.id).select().single());

      let levels = d.levels;
      if (reached.length) {
        const rows = reached.map((n) => ({ user_id: userRef.current.id, level: n }));
        await supabase.from("level_history").upsert(rows, { onConflict: "user_id,level", ignoreDuplicates: true });
        const have = new Set(levels.map((x) => x.level));
        const now = new Date().toISOString();
        levels = [...levels, ...reached.filter((n) => !have.has(n)).map((n) => ({ level: n, reached_at: now }))];
      }

      commit({ ...d, profile, logs, clears, levels });
      notify(`${habit.emoji} +${habit.xp} XP${gain ? ` · +${gain} ${statName(col)}` : ""}`, "reward");
      if (bonus) setTimeout(() => notify(`🎉 ¡Día perfecto! +${bonus} XP extra`, "reward"), 500);
      if (reached.length) setLevelUp(reached[reached.length - 1]);
    });
  };

  // ---------- Deshacer ----------
  const undoHabit = async (habit) => {
    if (!guard()) return;
    const d = dataRef.current;
    const day = todayISO();
    const log = d.logs.find((l) => l.habit_id === habit.id && l.log_date === day);
    if (!log) return;

    await run(async () => {
      const p = d.profile;
      must(await supabase.from("habit_logs").delete().eq("id", log.id).select());
      let { level, xp } = removeXp(p.level, p.xp, log.xp_awarded);
      const logs = d.logs.filter((l) => l.id !== log.id);

      let clears = d.clears;
      const clr = clears.find((c) => c.day === day);
      if (clr) {
        const scheduled = d.habits.filter((h) => isScheduled(h, day));
        const doneIds = new Set(logs.filter((l) => l.log_date === day).map((l) => l.habit_id));
        if (!(scheduled.length && scheduled.every((h) => doneIds.has(h.id)))) {
          must(await supabase.from("daily_clears").delete().eq("day", day).select());
          const r = removeXp(level, xp, clr.bonus_xp);
          level = r.level; xp = r.xp;
          clears = clears.filter((c) => c.day !== day);
        }
      }

      const streak = calcStreak(clears.map((c) => c.day), day);
      const profile = must(await supabase.from("profiles").update({
        level, xp, [log.stat]: Math.max(0, p[log.stat] - log.stat_points), streak,
        total_completed: Math.max(0, p.total_completed - 1),
      }).eq("id", userRef.current.id).select().single());

      commit({ ...d, profile, logs, clears });
      notify("Hábito desmarcado", "info");
    });
  };

  // ---------- Crear / editar / eliminar hábitos ----------
  const createHabit = async (values) => {
    if (!guard()) return false;
    let ok = false;
    await run(async () => {
      const d = dataRef.current;
      const row = must(await supabase.from("habits").insert({ ...values, user_id: userRef.current.id }).select().single());
      commit({ ...d, habits: [...d.habits, row] });
      notify("Hábito creado", "info");
      ok = true;
    });
    return ok;
  };

  const updateHabit = async (id, values) => {
    if (!guard()) return false;
    let ok = false;
    await run(async () => {
      const d = dataRef.current;
      const row = must(await supabase.from("habits").update(values).eq("id", id).select().single());
      commit({ ...d, habits: d.habits.map((h) => (h.id === id ? row : h)) });
      notify("Hábito actualizado", "info");
      ok = true;
    });
    return ok;
  };

  const deleteHabit = async (id) => {
    if (!guard()) return;
    await run(async () => {
      const d = dataRef.current;
      must(await supabase.from("habits").delete().eq("id", id).select());
      commit({
        ...d,
        habits: d.habits.filter((h) => h.id !== id),
        logs: d.logs.map((l) => (l.habit_id === id ? { ...l, habit_id: null } : l)),
      });
      notify("Hábito eliminado", "info");
    });
  };

  const seedHabits = async () => {
    if (!guard()) return;
    await run(async () => {
      const d = dataRef.current;
      const rows = must(await supabase.from("habits")
        .insert(SUGGESTED.map((h) => ({ ...h, user_id: userRef.current.id, frequency: "daily", days: [], description: "" })))
        .select());
      commit({ ...d, habits: [...d.habits, ...rows] });
      notify("Agregamos 5 hábitos de ejemplo", "info");
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    try { localStorage.removeItem(SNAP); } catch {}
    router.replace("/login");
  };

  // ---------- Pantallas de estado ----------
  if (!ready) {
    return <div className="g-splash"><span className="g-pixel">HabitArena</span><p>Cargando tu personaje…</p></div>;
  }
  if (!data) {
    return (
      <div className="g-splash">
        <span className="g-pixel">HabitArena</span>
        <p>{error || "No se pudo cargar tu progreso."}</p>
        <button type="button" className="g-btn" onClick={() => { setReady(false); load(); }}>Reintentar</button>
      </div>
    );
  }

  const value = {
    user, ...data, today, offline, busy,
    completeHabit, undoHabit, createHabit, updateHabit, deleteHabit, seedHabits, logout, notify,
  };

  return (
    <Ctx.Provider value={value}>
      {offline && <div className="g-offline">Sin conexión · estás viendo tus últimos datos guardados</div>}
      {children}

      <div className="g-toasts" aria-live="polite">
        {toasts.map((t) => <div key={t.id} className={`g-toast ${t.kind}`}>{t.text}</div>)}
      </div>

      {levelUp && (
        <div className="g-modal" role="dialog" aria-modal="true" aria-label="Subiste de nivel" onClick={() => setLevelUp(null)}>
          <div className="g-levelup" onClick={(e) => e.stopPropagation()}>
            <p className="g-levelup-star" aria-hidden>⭐</p>
            <h2 className="g-pixel">¡Nivel {levelUp}!</h2>
            <p>Tu personaje se hizo más fuerte. ¡Sigue así!</p>
            <button type="button" className="g-btn" onClick={() => setLevelUp(null)}>¡Genial!</button>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

function statName(key) {
  return { health: "Salud", intelligence: "Inteligencia", energy: "Energía" }[key];
}
