-- PostgreSQL + PostGIS starter schema
create extension if not exists postgis;

create table if not exists analytics_events (
  id bigserial primary key,
  app_id text not null,
  event text not null,
  timestamp timestamptz not null,
  session_id text not null,
  user_id text,
  role text,
  source text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists waitlist_leads (
  id bigserial primary key,
  app_id text not null,
  name text not null,
  email text not null,
  role text not null,
  use_case text not null,
  created_at timestamptz not null default now()
);

create table if not exists parcels (
  id bigserial primary key,
  apn text unique not null,
  address text not null,
  zoning_district text not null,
  geom geometry(Polygon, 4326)
);
