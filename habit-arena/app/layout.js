import { Press_Start_2P, Nunito } from "next/font/google";
import "./globals.css";

const pixel = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-pixel" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-body" });

export const metadata = {
  title: "HabitArena — Hábitos como videojuego",
  description: "Convierte tus hábitos diarios en estadísticas de personaje.",
  manifest: "/manifest.json",
};

export const viewport = { themeColor: "#3B2A7A" };

export default function RootLayout({ children }) {
  return (
    <html lang="es-MX">
      <body className={`${pixel.variable} ${nunito.variable}`}>{children}</body>
    </html>
  );
}
