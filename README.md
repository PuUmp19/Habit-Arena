# HabitArena — Hábitos como videojuego (PWA)

Next.js 14 (App Router) + Supabase. Cada hábito completado da XP y sube una estadística
de tu personaje (Salud, Inteligencia, Energía). Hay niveles, racha, bonus diario, historial,
logros y funciona como PWA instalable.

## 1. Instalar dependencias
```bash
npm install
```

## 2. Configurar Supabase
1. En tu proyecto de Supabase abre **SQL Editor → New query**.
2. Pega todo el contenido de `supabase/schema.sql` y pulsa **Run**.
   (Crea las tablas, relaciones, índices, políticas RLS y el perfil automático al registrarse.)
3. Copia `.env.example` como `.env.local` y llena tus datos
   (**Project Settings → API**):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-o-publishable
   ```
   Usa solo la clave pública. **Nunca** pongas la `service_role` en el proyecto.
4. (Opcional, para probar más rápido) **Authentication → Providers → Email**:
   desactiva "Confirm email". Si lo dejas activo, el usuario debe confirmar su correo
   antes de iniciar sesión.

## 3. Ejecutar
```bash
npm run dev -- -p 3001
```
Abre http://localhost:3001, crea tu cuenta en **/registro** y empieza.

## 4. Probar la PWA (instalación y offline)
El Service Worker solo se activa en producción:
```bash
npm run build
npm start
```
Abre la app, inicia sesión y navega por las pantallas una vez con internet.
Luego en Chrome: menú → **Instalar app**. Sin internet verás tus últimos datos guardados
(modo solo lectura; para guardar cambios hace falta conexión).

## 5. Publicar en Vercel
Importa el repositorio y en **Settings → Environment Variables** agrega
`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Estructura
```
app/
  page.js, landing.css        página principal
  login/, registro/           autenticación (Supabase Auth)
  (app)/                      zona con sesión: dashboard, habitos, historial, logros, perfil
components/                   GameProvider (datos + reglas), PlayerCard, HabitForm, WeekChart...
lib/game.js                   reglas: XP, niveles, racha, logros
lib/supabase.js               cliente de Supabase
supabase/schema.sql           tablas + RLS
public/                       manifest.json, sw.js, icons/
```

## Reglas del juego
- Nivel N necesita `100 + 50 × N` XP (nivel 8 → 500 XP).
- Estadísticas con tope de 100.
- Un hábito se completa una vez al día y respeta su frecuencia (diaria o días elegidos).
- Completar todos los hábitos del día da **+20 XP** y suma un día de racha.
- Deshacer un hábito revierte XP, estadística y, si aplica, el bonus del día.
