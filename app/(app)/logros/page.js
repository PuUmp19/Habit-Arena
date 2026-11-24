"use client";
import { useGame } from "@/components/GameProvider";
import { getAchievements } from "@/lib/game";

export default function Logros() {
  const { profile, habits, clears } = useGame();
  const list = getAchievements({ profile, habits, clears });
  const unlocked = list.filter((a) => a.unlocked).length;

  return (
    <div className="g-narrow">
      <div className="g-row-between">
        <h1 className="g-h1">Logros</h1>
        <b className="g-pixel g-small-pixel">{unlocked}/{list.length}</b>
      </div>
      <ul className="g-ach">
        {list.map((a) => (
          <li key={a.id} className={a.unlocked ? "on" : ""}>
            <span className="g-ach-icon" aria-hidden>{a.unlocked ? a.icon : "🔒"}</span>
            <div className="g-grow">
              <p className="g-habit-name">{a.title}</p>
              <p className="g-muted">{a.desc}</p>
              {!a.unlocked && (
                <div className="g-bar g-bar-thin"><i style={{ width: `${(a.shown / a.goal) * 100}%` }} /></div>
              )}
            </div>
            <b className="g-muted">{a.unlocked ? "✓" : `${a.shown}/${a.goal}`}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}
