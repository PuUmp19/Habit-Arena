# HabitArena — Hábitos como videojuego

Avance de frontend (solo diseño, sin funcionalidad). Next.js 14 (App Router) + Supabase.

## Cómo correrlo
```bash
npm install
npm run dev
```
Abre http://localhost:3000

## Estructura
- `app/` páginas. `app/page.js`, `login`, `registro` = SSR (públicas).
- `app/(app)/` dashboard, hábitos, stats, perfil = CSR con App Shell (encabezado + barra inferior).
- `components/` piezas reutilizables (PlayerCard, StatBar, HabitCard, BottomNav...).
- `lib/data.js` datos de ejemplo (después se reemplazan con Supabase).
- `lib/supabase.js` cliente de Supabase (pendiente de conectar).
- `public/manifest.json` manifiesto PWA. `public/sw.js` Service Worker (pendiente).

## Pendiente
- [ ] Íconos reales en `public/icons/` (192, 512 y maskable)
- [ ] Service Worker + caché offline
- [ ] Auth y base de datos con Supabase
- [ ] Lógica de hábitos, racha y nivel
- [ ] Notificaciones push
