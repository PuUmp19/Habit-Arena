import { Press_Start_2P, Nunito, Fredoka, Sora, Figtree } from "next/font/google";
import PwaRegister from "@/components/PwaRegister";
import "./globals.css";

// Fuentes del interior de la app
const pixel = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-pixel" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-body" });
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-display" });

// Fuentes de la página principal y del login
const sora = Sora({ subsets: ["latin"], variable: "--font-land-display" });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-land-body" });

export const metadata = {
  title: "HabitArena — Hábitos como videojuego",
  description: "Convierte tus hábitos diarios en estadísticas de personaje.",
  manifest: "/manifest.json",
  icons: { icon: "/icons/icon-192x192.png", apple: "/icons/icon-192x192.png" },
  appleWebApp: { capable: true, title: "HabitArena", statusBarStyle: "black-translucent" },
};

export const viewport = {
  themeColor: "#3B2A7A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-MX">
      <body className={`${pixel.variable} ${nunito.variable} ${fredoka.variable} ${sora.variable} ${figtree.variable}`}>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
