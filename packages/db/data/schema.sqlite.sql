-- SQLite fallback schema
create table if not exists analytics_events (
  id integer primary key autoincrement,
  app_id text not null,
  event text not null,
  timestamp text not null,
  session_id text not null,
  user_id text,
  role text,
  source text,
  metadata text not null default '{}'
);

create table if not exists waitlist_leads (
  id integer primary key autoincrement,
  app_id text not null,
  name text not null,
  email text not null,
  role text not null,
  use_case text not null,
  created_at text not null
);
