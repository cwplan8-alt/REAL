# Startup Validation Monorepo (Idea A vs Idea B)

Two head-to-head MVPs in one monorepo to measure traction and monetization quickly.

## Apps
- `apps/feasibility` (Idea A): Parcel feasibility screener for one city
- `apps/style-search` (Idea B): Architectural-style home search for one metro

## Shared Packages
- `packages/db`: in-memory data store + starter Postgres/PostGIS and SQLite schemas
- `packages/analytics`: event schema validation + tracker helpers
- `packages/shared`: shared seed data, envelope calc, style filter/classifier, metrics helpers
- `packages/ui`: minimal shared UI primitives

## Quick Start
1. `npm run setup`
2. `npm run seed`
3. `npm run run:both`

App URLs:
- Idea A: `http://localhost:3000`
- Idea B: `http://localhost:3001`

## Scripts
- `npm run setup` install all workspace deps
- `npm run seed` generate seed summary artifact
- `npm run run:both` run both Next apps
- `npm run dev:feasibility` run Idea A only
- `npm run dev:style-search` run Idea B only
- `npm run test` run unit tests

## Implemented MVP Features

### Shared (both apps)
- Landing page with value prop + CTA
- Waitlist/lead capture form (name/email/role/use case)
- Mock auth (email magic-link behavior simulated locally)
- Shared analytics event schema and tracking utility
- Pricing page with test plans + trial/contact CTA
- Admin-lite metrics dashboard

### Idea A (Feasibility)
- Parcel input by address/APN (seed/mock dataset)
- Zoning + allowed uses + key constraints display
- Simplified build envelope estimate with explicit assumptions
- Climate/risk panel from mock overlays
- Printable feasibility report
- Prominent legal disclaimer

### Idea B (Style Search)
- Listing search with normal filters
- Architectural style filter + confidence score
- Listing detail with style clues/explanation
- `Not this style` feedback flow
- Save-search placeholder + alert signup CTA

## Event Instrumentation
All events include `timestamp` and `app_id`.
Tracked events:
- `page_view`
- `search_submitted`
- `result_clicked`
- `report_generated` (A)
- `style_feedback_submitted` (B)
- `pricing_viewed`
- `trial_started`
- `waitlist_joined`
- `contact_requested`

## Funnel Queries (Postgres)

### 1) Visitor -> search -> key action -> pricing -> trial/contact
```sql
with s as (
  select
    app_id,
    session_id,
    max((event = 'page_view')::int) as visited,
    max((event = 'search_submitted')::int) as searched,
    max((event in ('report_generated','style_feedback_submitted'))::int) as key_action,
    max((event = 'pricing_viewed')::int) as pricing,
    max((event in ('trial_started','contact_requested'))::int) as trial_or_contact
  from analytics_events
  group by app_id, session_id
)
select
  app_id,
  sum(visited) as visitors,
  sum(searched) as searched,
  sum(key_action) as key_action,
  sum(pricing) as pricing,
  sum(trial_or_contact) as trial_or_contact
from s
group by app_id;
```

### 2) Funnel by user role
```sql
select
  app_id,
  coalesce(role, 'unknown') as role,
  count(*) filter (where event = 'page_view') as page_views,
  count(*) filter (where event = 'search_submitted') as searches,
  count(*) filter (where event in ('trial_started','contact_requested')) as monetization_signals
from analytics_events
group by app_id, coalesce(role, 'unknown')
order by app_id, role;
```

### 3) Funnel by traffic source
```sql
select
  app_id,
  coalesce(source, 'unknown') as source,
  count(*) filter (where event = 'page_view') as page_views,
  count(*) filter (where event = 'search_submitted') as searches,
  count(*) filter (where event = 'pricing_viewed') as pricing_views,
  count(*) filter (where event in ('trial_started','contact_requested')) as monetization_signals
from analytics_events
group by app_id, coalesce(source, 'unknown')
order by app_id, source;
```

## 14-Day Validation Plan
- Drive equal traffic to both landing pages
- Run both pricing experiments live
- Collect quantitative + qualitative signals daily

Decision thresholds (example baseline):
- Activation rate (search after visit): target `>= 35%`
- Pricing reach (% users hitting pricing): target `>= 20%`
- Lead/contact submit rate: target `>= 8%`
- Trial/contact monetization signal: target `>= 4%`
- Qualitative pain intensity: at least 5 interviews rating pain `>= 8/10`

## Decision Framework: Choose A, B, or Hybrid
- Choose **A** if A beats B on activation and monetization signal by `>= 25%` relative and interview pain is urgent for developers/investor-agents.
- Choose **B** if B beats A on pricing reach and contact/trial conversion and style feedback indicates repeatable differentiation.
- Choose **Hybrid** if A has stronger monetization intent but B has stronger top-of-funnel pull, and cross-sell narrative tests well.

## Assumptions and Limitations
- External APIs are mocked/seeded (parcel/zoning, climate overlays, listings/styles)
- Auth is mock local auth
- DB layer is in-memory for speed; SQL schemas included for production hardening
- Results are preliminary and explicitly not legal advice
