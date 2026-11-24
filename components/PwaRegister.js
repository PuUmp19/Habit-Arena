"use client";
import { useEffect } from "react";

// Registra el Service Worker (solo en producción: npm run build && npm start)
export default function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}
