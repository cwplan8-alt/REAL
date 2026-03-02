# CLAUDE.md — Project REAL

## What this is
A startup validation monorepo. Two competing MVP ideas deployed as separate Next.js apps to test which has stronger product-market fit. The goal is NOT to build a full product — it's to validate demand cheaply and quickly before committing.

## The two ideas

### Idea A — Feasibility (`apps/feasibility`)
**Hypothesis:** Small developers, investor-agents, and homeowners will pay for fast, self-serve parcel feasibility screening — specifically "what can I build on this lot?"

**Strongest use case to validate:** ADU feasibility for homeowners ("Can I add a backyard unit / garage conversion to my property?"). Secondary: vacant lot screening for small developers.

**Live URL:** set in Vercel project for apps/feasibility

**What's built:**
- Landing page with waitlist capture
- Parcel search → zoning display → envelope estimate (buildable sqft, stories, FAR)
- Printable feasibility report
- Pricing page (3 tiers: $49/$149/$399)
- Mock auth (cookie-based, no real email)
- Admin dashboard at /admin (live event + lead metrics)
- Analytics tracking: page_view, search_submitted, report_generated, pricing_viewed, trial_started, waitlist_joined, contact_requested

**What's fake/placeholder:**
- Only 2 hardcoded parcels (APN: 100-200-01, 100-200-02). Real product needs zoning API (Regrid, Zoneomics, or local GIS).
- Auth is mocked (no real magic link email sent)
- Pricing buttons fire alert() — no real payment flow
- Print button on /report/[query] uses onClick in a server component (bug — needs "use client" wrapper)

---

### Idea B — Style Search (`apps/style-search`)
**Hypothesis:** Design-conscious homebuyers (and their agents) will pay for listing search filtered by architectural style — a gap that Zillow/Redfin don't fill.

**Live URL:** set in Vercel project for apps/style-search

**What's built:**
- Landing page with waitlist capture
- Listing search with filters: beds, price, architectural style
- Style confidence score + clue explanation per listing
- Listing detail with style feedback (correct/wrong style call)
- Pricing page (3 tiers: $29/$79/$199)
- Mock auth
- Admin dashboard at /admin
- Same analytics event schema as Idea A

**What's fake/placeholder:**
- Only 4 hardcoded listings (no real MLS/listing data)
- Search filters client-side from static data — the /api/listings route exists but isn't used by the UI
- "Save search + alert" button is a placeholder
- Auth mocked, pricing is alert()
- No real style classification (labels are hardcoded per listing)

**Data access options for real listings:**
- Realtor.com API (requires application)
- Attom Data / CoreLogic (paid, expensive)
- MLS partnership / IDX feed (requires broker relationship)
- Public records (slower, less rich)

---

## Repo structure

```
REAL/
├── apps/
│   ├── feasibility/     Next.js 16, React 19, Tailwind 4
│   └── style-search/    Next.js 16, React 19, Tailwind 4
├── packages/
│   ├── analytics/       Shared analytics schema (NOT currently used by apps)
│   ├── db/              Shared DB layer (NOT currently used by apps)
│   ├── shared/          Seed data utilities (NOT currently used by apps)
│   └── ui/              UI primitives (NOT currently used by apps)
├── tests/               Vitest test suite
└── CLAUDE.md            This file
```

The shared packages exist but both apps are self-contained — they import from their own `src/lib/` directory, not from `@repo/*`.

## Database
Both apps use **Upstash Redis** via `@upstash/redis` (connected through Vercel Storage).
- Feasibility keys: `feasibility:events`, `feasibility:leads`, `feasibility:user:{id}`
- Style-search keys: `style-search:events`, `style-search:leads`, `style-search:user:{id}`
- Required env vars: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (auto-set when Vercel Storage is connected)

## Deployment
Each app is its own Vercel project. Root Directory is set to the app's folder.
- `apps/feasibility/vercel.json` — installCommand runs `npm install` from repo root
- `apps/style-search/vercel.json` — same

## Validation criteria (from original design)
Success = one idea shows ≥25% better performance than the other on:
- Activation rate (waitlist_joined / page_view)
- Pricing engagement (pricing_viewed / page_view)
- Monetization signal (trial_started + contact_requested)

View live metrics at /admin on either app.

## Known bugs to fix
1. `/report/[query]` page.tsx — print button uses onClick in a server component. Needs a `"use client"` wrapper component.
2. Style search UI doesn't call /api/listings — it filters client-side from static data. Should route through the API.
3. Shared packages are unused dead weight — either wire them up or delete them.

## What to build next (pending validation results)
- If Idea A wins: integrate real zoning data (Regrid API or Zoneomics), focus on ADU use case, add real auth (Resend for magic links)
- If Idea B wins: get real listing data (Realtor.com API or MLS partnership), build real style classifier (image ML or structured-data rules), add saved search + email alerts
- Either way: replace mock auth with Resend magic links, replace pricing alerts with Stripe Checkout

---

## Market Research Findings (March 2026)

### Idea B — Style Search

**Demand is real and documented.**
- Buyers routinely use year-built as a crude style proxy (e.g. "built 1950-1969" to find MCM) — a workaround, not a solution
- Facebook groups like "Mid Century Modern Homes for Sale" have 10k+ members doing this manually
- Reddit threads in r/homebuying, r/midcenturymodern, r/Austin etc. show recurring frustration
- No major portal (Zillow, Redfin, Realtor.com) has a style filter as of early 2026

**The gap is data quality + classification, not just UI.**
- MLS standard (RESO) includes an `ArchitecturalStyle` field — it exists in feeds but is sparsely populated and inconsistent
- Restb.ai (B2B) already sells style classification from listing photos to MLS boards — this is both a threat (Zillow could license it) and an opportunity (data enrichment exists)

**Best monetization path:** Agent lead gen (style-matched buyers = higher-intent leads) + agent SaaS ($50-200/month for design-specialized agents)

**Biggest risk:** Zillow could ship a style filter in a quarter. The moat is owning the audience (design-conscious buyers who identify with the brand) and going deeper than a portal would (confidence scores, clues, neighborhood style profiles, community).

**Data access path:** IDX broker sponsor in 3 target metros (LA, Seattle, Denver) + Estated API for base property records + computer vision on listing photos for classification

---

### Idea A — Feasibility

**ADU market is large and growing fast.**
- California: 25,000+ ADU permits/year (up from 1,500 in 2016)
- National: 60,000-80,000/year and growing as WA, CO, OR, FL, TX pass reform legislation
- Millions of homeowners have considered adding an ADU; most have no idea what's actually allowed on their lot

**Use case ranking (strongest PMF first):**
1. **Small developer/investor lot screening** — professional buyers, $200-500/month SaaS, thin competition, clear ROI (one bad land buy >> annual SaaS cost)
2. **Homeowner ADU feasibility** — huge top-of-funnel, but low ARPU unless you sell contractor referrals or financing
3. **Multifamily pre-due-diligence** — highest ARPU ($500-2,000/report) but more complex product and longer sales cycles

**The real moat is zoning data encoding.**
- Regrid gives parcel geometry; Zoneomics gives zone name — neither gives the actual development envelope (setbacks, FAR, height limits, unit counts)
- That data lives in 30,000 municipal code PDFs. No vendor has it in a clean API.
- Competitive advantage = per-jurisdiction rule encoding + LLM parsing of municipal code
- Strategy: go deep on 10-20 California counties first (largest ADU market, most reform-driven demand)

**Existing competitors:**
- Symbium — B2G (city licensing), free to homeowners, CA-focused. Not a direct SaaS competitor.
- Cottage / Villa — design-build funnels, feasibility is free lead-gen. Not a data product.
- Maxable — homeowner education, manually mediated. Doesn't scale.
- No dominant SaaS player for developer-facing infill screening.

**Best early monetization:** $200-500/month SaaS for small developers/investors in CA. 200 customers = $500K-$1.2M ARR.

---

## Strategic takeaway

Both ideas have legs — for different reasons:

| | Idea A (Feasibility) | Idea B (Style Search) |
|---|---|---|
| **Buyer** | Professional (developer/investor) | Consumer (design-conscious buyer) |
| **ARPU** | High ($200-500/month) | Low-medium ($10-15/month or lead gen) |
| **Competition** | Thin | None yet (but Zillow is a risk) |
| **Data moat** | Zoning encoding (hard to replicate) | CV classification (can be copied) |
| **Market size** | Smaller but high-value | Large, lower monetization per user |
| **Speed to revenue** | Slower (B2B sales) | Faster (consumer + agent leads) |

**Near-term recommendation:** Use Style Search as the consumer top-of-funnel (faster to get users, validate demand signal). Build Feasibility as the B2B revenue engine (higher ARPU, defensible moat). They can feed each other — a developer finding a lot on Feasibility is also a buyer who might use Style Search.
