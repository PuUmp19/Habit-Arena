import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

// App Shell: encabezado + contenido + barra inferior
export default function AppLayout({ children }) {
  return (
    <div className="shell">
      <Header />
      <main className="shell-main">{children}</main>
      <BottomNav />
    </div>
  );
}
