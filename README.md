# Betting Advisor

AI-powered sports betting analysis. Betting Advisor is a student project that lets a user type in a match and instantly get a structured analysis (reasoning, recommendation, and confidence level) that can be saved and revisited.

## Status

- Week 0: Infrastructure setup (Next.js, Tailwind, Vercel, GitHub, Supabase)
- Week 1: Generative Core Agent — the /core page where a user generates, saves, and views match analyses.

Note: This week the analysis output is SIMULATED (no paid API). It is clearly labeled "Simulated / Demo" in the interface.

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- Supabase (core_outputs table)
- Vercel (hosting and auto-deploy)
- GitHub
- Claude Code (coding agent)

## Pages

- `/` — Homepage with project description and roadmap
- `/core` — Generative Core Agent (intake form, simulated analysis, save to Supabase, recent analyses)
- `/docs` — Documentation of prompts and core logic

## Running locally

1. Clone the repository
2. Run `npm install`
3. Create a `.env.local` file in the project root with your Supabase URL and key
4. Run `npm run dev`
5. Open http://localhost:3000

## Live

https://better-betting-dun.vercel.app