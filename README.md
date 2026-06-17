# Betting Advisor

AI-powered sports betting analysis. Betting Advisor is a student project that lets a user type in a match and instantly get a structured analysis (reasoning, recommendation, and confidence level) that can be saved and revisited.

## Status

- Week 0: Infrastructure setup (Next.js, Tailwind, Vercel, GitHub, Supabase)
- Week 1: Generative Core Agent — the /core page where a user generates, saves, and views match analyses.
- Week 2: Research + Benchmarking Dashboard — the /research page for competitor analysis, benchmarking, and risk mapping.

Note: All generated content is SIMULATED this week (no paid API). It is clearly labeled "Simulated / Demo" in the interface.

## Week 2 — Research + Benchmarking Dashboard

The `/research` page adds a structured research layer on top of the core agent. Key features:

- **Competitor / substitute table** — searchable and filterable list of competing products and substitute services in the sports betting advisory space.
- **Benchmark cards** — side-by-side comparison of key metrics across competitors.
- **5 global examples** — curated examples of similar products from international markets.
- **Mexico localization** — content and examples are contextualized for the Mexican market.
- **Risk map** — visual overview of strategic risks identified during research.
- **Save to Supabase** — research sessions can be persisted for later review.

Two Supabase tables back this feature: `research_outputs` (stores generated research sessions) and `competitors` (stores the competitor/substitute rows added during a session).

## Week 3 — Product Architecture & Pricing Simulator

Week 3 adds two new pages: `/product` and `/pricing`.

- **/product** — static feature map with three pricing tiers (Free / Pro / Premium) and two customer segments mapped to those tiers.
- **/pricing** — interactive revenue calculator with live monthly and annual revenue totals, a scenario toggle (Conservative / Optimistic), an assumptions table, and the ability to save pricing scenarios to Supabase.
- **Supabase table:** `pricing_scenarios` stores saved scenario names, input assumptions, monthly and annual revenue totals, and timestamps.
- **Simulated assumptions:** all pricing numbers this week are illustrative and not based on real market data.

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- Supabase (`core_outputs`, `research_outputs`, `competitors` tables)
- Vercel (hosting and auto-deploy)
- GitHub
- Claude Code (coding agent)

## Pages

- `/` — Homepage with project description and roadmap
- `/core` — Generative Core Agent (intake form, simulated analysis, save to Supabase, recent analyses)
- `/research` — Research + Benchmarking Dashboard (competitor table, benchmark cards, global examples, Mexico localization, risk map, save to Supabase)
- `/docs` — Documentation of prompts and core logic

## Running locally

1. Clone the repository
2. Run `npm install`
3. Create a `.env.local` file in the project root with your Supabase URL and key
4. Run `npm run dev`
5. Open http://localhost:3000

## Live

https://better-betting-dun.vercel.app