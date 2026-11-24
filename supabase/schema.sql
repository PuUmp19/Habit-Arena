-- =====================================================================
-- HabitArena · Esquema de base de datos para Supabase
-- Ejecútalo completo en: Supabase → SQL Editor → New query → Run
-- Se puede volver a ejecutar sin romper nada (usa IF NOT EXISTS / OR REPLACE).
-- =====================================================================

-- 1) PERFIL DEL JUGADOR ------------------------------------------------
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  username        text not null default 'PLAYER 01',
  level           int  not null default 1  check (level >= 1),
  xp              int  not null default 0  check (xp >= 0),
  health          int  not null default 10 check (health between 0 and 100),
  intelligence    int  not null default 10 check (intelligence between 0 and 100),
  energy          int  not null default 10 check (energy between 0 and 100),
  streak          int  not null default 0  check (streak >= 0),
  best_streak     int  not null default 0  check (best_streak >= 0),
  total_completed int  not null default 0  check (total_completed >= 0),
  created_at      timestamptz not null default now()
);

-- 2) HÁBITOS PERSONALIZADOS -------------------------------------------
create table if not exists public.habits (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 60),
  description text not null default '',
  emoji       text not null default '✨',
  category    text not null default 'Bienestar',
  frequency   text not null default 'daily' check (frequency in ('daily', 'weekly')),
  days        smallint[] not null default '{}',   -- 0 = domingo ... 6 = sábado
  stat        text not null check (stat in ('health', 'intelligence', 'energy')),
  xp          int  not null default 10 check (xp between 1 and 100),
  stat_points int  not null default 5  check (stat_points between 1 and 20),
  created_at  timestamptz not null default now()
);
create index if not exists habits_user_idx on public.habits(user_id);

-- 3) HISTORIAL DE HÁBITOS COMPLETADOS ---------------------------------
-- Guarda una copia del nombre/emoji para conservar el historial aunque
-- el hábito se elimine (habit_id pasa a NULL).
create table if not exists public.habit_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  habit_id    uuid references public.habits(id) on delete set null,
  habit_name  text not null,
  habit_emoji text not null default '✨',
  log_date    date not null,
  stat        text not null check (stat in ('health', 'intelligence', 'energy')),
  stat_points int  not null default 0,
  xp_awarded  int  not null default 0,
  created_at  timestamptz not null default now(),
  unique (habit_id, log_date)       -- un hábito solo se completa una vez por día
);
create index if not exists logs_user_date_idx on public.habit_logs(user_id, log_date);

-- 4) DÍAS COMPLETOS (bonus diario y cálculo de racha) -----------------
create table if not exists public.daily_clears (
  user_id  uuid not null references auth.users(id) on delete cascade,
  day      date not null,
  bonus_xp int  not null default 0,
  primary key (user_id, day)
);

-- 5) HISTORIAL DE NIVELES ----------------------------------------------
create table if not exists public.level_history (
  user_id    uuid not null references auth.users(id) on delete cascade,
  level      int  not null,
  reached_at timestamptz not null default now(),
  primary key (user_id, level)
);

-- 6) SEGURIDAD (RLS): cada usuario solo ve y modifica lo suyo ---------
alter table public.profiles      enable row level security;
alter table public.habits        enable row level security;
alter table public.habit_logs    enable row level security;
alter table public.daily_clears  enable row level security;
alter table public.level_history enable row level security;

drop policy if exists "profiles: propio" on public.profiles;
create policy "profiles: propio" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "habits: propio" on public.habits;
create policy "habits: propio" on public.habits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "logs: propio" on public.habit_logs;
create policy "logs: propio" on public.habit_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "clears: propio" on public.daily_clears;
create policy "clears: propio" on public.daily_clears
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "levels: propio" on public.level_history;
create policy "levels: propio" on public.level_history
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 7) CREAR EL PERFIL AUTOMÁTICAMENTE AL REGISTRARSE --------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(nullif(new.raw_user_meta_data->>'username', ''), 'PLAYER 01'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
