import GameProvider from "@/components/GameProvider";
import AppNav from "@/components/AppNav";
import "./app.css";

// App Shell: todo lo de adentro requiere sesión (GameProvider redirige a /login si no hay)
export default function AppLayout({ children }) {
  return (
    <GameProvider>
      <div className="g-shell">
        <AppNav />
        <main className="g-main">{children}</main>
      </div>
    </GameProvider>
  );
}
