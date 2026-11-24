"use client";
import { useEffect, useState } from "react";

// Botón "Instalar app" (aparece cuando el navegador permite instalarla)
export default function InstallButton() {
  const [evt, setEvt] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const onPrompt = (e) => { e.preventDefault(); setEvt(e); };
    const onInstalled = () => { setDone(true); setEvt(null); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (done) return <p className="g-muted">✅ App instalada</p>;
  if (!evt) {
    return <p className="g-muted">Para instalarla: menú del navegador → “Instalar app” o “Agregar a pantalla de inicio”.</p>;
  }
  return (
    <button type="button" className="g-btn" onClick={async () => { evt.prompt(); await evt.userChoice; setEvt(null); }}>
      📲 Instalar app
    </button>
  );
}
