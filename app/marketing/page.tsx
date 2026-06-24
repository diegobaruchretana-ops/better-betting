"use client";

import { useState, useEffect } from "react";
import { supabase, type MarketingAsset } from "../lib/supabase";

// ── Static content (simulated — Week 4) ────────────────────────────────────

const BRAND = {
  name: "Betting Advisor",
  tagline: "Stop Guessing. Start Winning.",
  toneOfVoice: "Confident, analytical, and direct. No hype, no fluff — data leads every claim.",
  palette: [
    { name: "Primary", hex: "#111827", bg: "bg-gray-900", text: "text-white" },
    { name: "Action", hex: "#16a34a", bg: "bg-green-600", text: "text-white" },
    { name: "Highlight", hex: "#d97706", bg: "bg-amber-600", text: "text-white" },
    { name: "Surface", hex: "#f9fafb", bg: "bg-gray-50 border border-gray-200", text: "text-gray-700" },
  ],
};

const PERSONA = {
  name: "Tyler Rodriguez",
  age: 22,
  role: "College junior, recreational sports bettor",
  behavior:
    "Bets on NFL and NBA with friends, uses ESPN for scores, follows Reddit and Discord tips. Places 3-5 bets per week of $20–$100 each.",
  goals: [
    "Build a repeatable profitable betting system",
    "Stop losing money on 'sure things' from the group chat",
    "Understand odds and expected value",
  ],
  painPoints: [
    "Overwhelmed by conflicting tips from social media",
    "No data-driven framework — bets on gut and loyalty",
    "Doesn't track his bets or know his actual ROI",
  ],
};

const COPY = {
  headline: "Stop Losing Money on Hunches. Bet with Data.",
  subheadline:
    "Betting Advisor analyzes odds, trends, and value bets so you always know where the edge is — before you place a dollar.",
  benefits: [
    "Structured AI analysis for any match in seconds",
    "Line movement tracking to spot +EV opportunities",
    "Bankroll modeling to bet a sustainable size every time",
  ],
  cta: "Get your first analysis free →",
};

const AB_HEADLINES = [
  {
    label: "Headline A",
    text: "Stop Losing Money on Hunches. Bet with Data.",
    rationale: "Pain-first framing. Leads with the problem the user already feels.",
  },
  {
    label: "Headline B",
    text: "The AI Co-Pilot for Serious Sports Bettors.",
    rationale: "Identity-first framing. Positions the tool as a tool for 'serious' bettors.",
  },
];

const SOCIAL_POSTS = [
  "Your group chat said it's a lock. The data disagrees. Stop betting on vibes — start betting on edges.",
  "Dropped money on a 'sure thing' last weekend? We've all been there. There's a smarter way to bet.",
  "Expected value isn't just for poker players. If you're not calculating +EV, you're donating to the book.",
  "Line movement tells you everything. When sharps move money, lines shift. Are you watching or guessing?",
  "You do your research for fantasy sports. Do it for real money too. Betting Advisor runs the numbers for you.",
  "The favorite wins 60% of the time — but covers the spread less than you think. Know the difference.",
  "3 units up on the week. Not luck — a system. Betting Advisor helps you build one.",
  "March Madness, NFL playoffs, NBA Finals — the edge is always in the data, never in the hype.",
  "Your sportsbook profits when you bet emotionally. Don't give them the edge. Bet with data.",
  "Track your bets. Know your ROI. Stop guessing what's working. Start with Betting Advisor.",
];

const VIDEO_SCRIPTS = [
  {
    title: "Why You Keep Losing (60 sec)",
    script: `[HOOK — 0:00-0:05]
"You had a 90% lock last week. You lost. Here's why."

[PROBLEM — 0:05-0:25]
"Most bettors lose not because they're unlucky — it's because they're betting without an edge. You're reacting to tips, gut feelings, and group chats. None of that is a system."

[SOLUTION — 0:25-0:45]
"Betting Advisor gives you structured analysis for any match. It looks at odds movement, historical trends, and value gaps so you can make decisions based on data — not vibes."

[CTA — 0:45-1:00]
"Try your first analysis free. Link in bio. Stop guessing."`,
  },
  {
    title: "What is Expected Value? (60 sec)",
    script: `[HOOK — 0:00-0:05]
"One number separates profitable bettors from everyone else: expected value."

[EXPLAIN — 0:05-0:30]
"Expected value — or +EV — tells you whether a bet is profitable long-term. A +EV bet means the odds are in your favor based on the true probability of the outcome. A -EV bet means you're paying the book's juice with no edge."

[EXAMPLE — 0:30-0:50]
"Say you think a team has a 55% chance of winning, but the moneyline gives them 50% implied probability. That gap is your edge. You take it every time."

[CTA — 0:50-1:00]
"Betting Advisor helps you find those gaps. Try it free — link in bio."`,
  },
  {
    title: "How Betting Advisor Works (90 sec)",
    script: `[HOOK — 0:00-0:07]
"What if you had an AI analyst breaking down every bet before you made it? That's Betting Advisor."

[DEMO — 0:07-0:45]
"Here's how it works. You type in a match — say, Lakers vs Celtics. The system analyzes the matchup: recent form, line movement, injury reports, and historical head-to-head trends. It gives you a structured breakdown — analysis, recommendation, and a confidence level from Low to High."

[TRUST — 0:45-1:10]
"It doesn't tell you to blindly follow a pick. It gives you the reasoning so you can decide. Sharps don't follow tips — they build systems. Betting Advisor is your system."

[FEATURES — 1:10-1:25]
"You can save analyses to track your own accuracy over time. And the Research dashboard shows you how competitors and tools stack up — so you always know where the market is."

[CTA — 1:25-1:30]
"Try Betting Advisor free. Link below."`,
  },
];

const CAMPAIGN_CALENDAR: { day: number; content: string }[] = [
  { day: 1, content: "Social Post #1 — 'Your group chat said it's a lock'" },
  { day: 2, content: "Video #1 publish — 'Why You Keep Losing'" },
  { day: 3, content: "Social Post #3 — '+EV isn't just for poker players'" },
  { day: 4, content: "Community engagement — reply to comments, DMs" },
  { day: 5, content: "Social Post #7 — '3 units up on the week'" },
  { day: 6, content: "Re-share Video #1 with new caption variant" },
  { day: 7, content: "Week 1 recap thread — performance + learnings" },
  { day: 8, content: "Social Post #4 — 'Line movement tells you everything'" },
  { day: 9, content: "Video #2 publish — 'What is Expected Value?'" },
  { day: 10, content: "Social Post #5 — 'You research for fantasy, do it here'" },
  { day: 11, content: "Engagement prompt — 'What sport do you bet most?'" },
  { day: 12, content: "Video #3 publish — 'How Betting Advisor Works'" },
  { day: 13, content: "Social Post #9 — 'Your sportsbook profits from emotion'" },
  { day: 14, content: "Campaign close — Social Post #10 + full CTA push" },
];

const ASSET_TYPES = ["social_post", "video_script", "landing_copy", "persona", "brand", "other"];

// ── Component ───────────────────────────────────────────────────────────────

export default function MarketingPage() {
  const [votes, setVotes] = useState([0, 0]);
  const [copiedPosts, setCopiedPosts] = useState<Set<number>>(new Set());
  const [copiedScripts, setCopiedScripts] = useState<Set<number>>(new Set());

  const [assetType, setAssetType] = useState(ASSET_TYPES[0]);
  const [assetTitle, setAssetTitle] = useState("");
  const [assetContent, setAssetContent] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState("");
  const [savedAssets, setSavedAssets] = useState<MarketingAsset[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("marketing_assets")
        .select("id, type, title, content, created_at")
        .order("created_at", { ascending: false })
        .limit(10);
      if (active && data) setSavedAssets(data as MarketingAsset[]);
    })();
    return () => { active = false; };
  }, []);

  async function fetchAssets() {
    const { data } = await supabase
      .from("marketing_assets")
      .select("id, type, title, content, created_at")
      .order("created_at", { ascending: false })
      .limit(10);
    if (data) setSavedAssets(data as MarketingAsset[]);
  }

  function vote(index: number) {
    setVotes((v) => v.map((count, i) => (i === index ? count + 1 : count)));
  }

  const totalVotes = votes[0] + votes[1];

  function winnerLabel() {
    if (votes[0] > votes[1]) return "Winner: Headline A";
    if (votes[1] > votes[0]) return "Winner: Headline B";
    return "Tie";
  }

  function copyText(text: string, index: number, setter: React.Dispatch<React.SetStateAction<Set<number>>>) {
    navigator.clipboard.writeText(text);
    setter((prev) => new Set([...prev, index]));
    setTimeout(() => setter((prev) => { const s = new Set(prev); s.delete(index); return s; }), 2000);
  }

  async function handleSave() {
    if (!assetTitle.trim() || !assetContent.trim()) return;
    setSaveStatus("saving");
    setSaveError("");
    const { error } = await supabase.from("marketing_assets").insert({
      type: assetType,
      title: assetTitle.trim(),
      content: assetContent.trim(),
    });
    if (error) {
      setSaveStatus("error");
      setSaveError(error.message);
    } else {
      setSaveStatus("saved");
      setAssetTitle("");
      setAssetContent("");
      fetchAssets();
    }
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500";

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-baseline gap-3 mb-2">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Marketing Engine</h1>
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-0.5">
          Simulated — Week 4
        </span>
      </div>
      <p className="mt-2 text-gray-500">
        Brand assets, persona, copy, A/B tests, social posts, video scripts, and a 14-day campaign calendar.
        All content is manually written for this week.
      </p>

      {/* ── 1. Brand System ───────────────────────────────────── */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Brand System</h2>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Brand Name</p>
            <p className="text-sm font-semibold text-gray-900">{BRAND.name}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Tagline</p>
            <p className="text-sm text-gray-700 italic">&ldquo;{BRAND.tagline}&rdquo;</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Tone of Voice</p>
            <p className="text-sm text-gray-700">{BRAND.toneOfVoice}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Color Palette</p>
            <div className="flex flex-wrap gap-3">
              {BRAND.palette.map((color) => (
                <div key={color.name} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-md ${color.bg} shrink-0`} />
                  <div>
                    <p className="text-xs font-medium text-gray-700">{color.name}</p>
                    <p className="text-xs text-gray-400 font-mono">{color.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Target Persona ─────────────────────────────────── */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Target Persona</h2>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <p className="text-base font-semibold text-gray-900">{PERSONA.name}</p>
              <p className="text-sm text-gray-500">{PERSONA.role} · Age {PERSONA.age}</p>
            </div>
            <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-gray-400 bg-gray-100 rounded px-2 py-1">
              Primary Persona
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Behavior</p>
              <p className="text-sm text-gray-700">{PERSONA.behavior}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Goals</p>
              <ul className="space-y-1">
                {PERSONA.goals.map((g) => (
                  <li key={g} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-green-600 mt-0.5 shrink-0">✓</span>{g}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Pain Points</p>
              <ul className="space-y-1">
                {PERSONA.painPoints.map((p) => (
                  <li key={p} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-red-500 mt-0.5 shrink-0">✕</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Landing Page Copy ──────────────────────────────── */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Landing Page Copy</h2>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Headline</p>
            <p className="text-lg font-bold text-gray-900">{COPY.headline}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Subheadline</p>
            <p className="text-sm text-gray-700 leading-relaxed">{COPY.subheadline}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Benefits</p>
            <ul className="space-y-1">
              {COPY.benefits.map((b) => (
                <li key={b} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5 shrink-0">—</span>{b}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">CTA</p>
            <p className="text-sm font-semibold text-gray-900">{COPY.cta}</p>
          </div>
        </div>
      </section>

      {/* ── 4. A/B Headline Test ──────────────────────────────── */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">A/B Headline Test</h2>
        <p className="text-sm text-gray-500 mb-4">Vote for the headline you&apos;d click on. Updates live.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {AB_HEADLINES.map((h, i) => (
            <div
              key={h.label}
              className={`rounded-xl border p-6 shadow-sm bg-white flex flex-col gap-4 ${
                votes[0] === votes[1]
                  ? "border-gray-200"
                  : votes[i] > votes[1 - i]
                  ? "border-green-400 ring-1 ring-green-200"
                  : "border-gray-200"
              }`}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                  {h.label}
                </p>
                <p className="text-sm font-semibold text-gray-900 leading-snug">{h.text}</p>
                <p className="text-xs text-gray-500 mt-2">{h.rationale}</p>
              </div>
              <div className="flex items-center gap-4 mt-auto">
                <button
                  onClick={() => vote(i)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Vote
                </button>
                <div>
                  <span className="text-2xl font-bold text-gray-900">{votes[i]}</span>
                  <p className="text-xs text-gray-400">
                    {totalVotes === 0 ? "0%" : `${Math.round((votes[i] / totalVotes) * 100)}%`}
                  </p>
                </div>
                {votes[0] !== votes[1] && votes[i] > votes[1 - i] && (
                  <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded px-2 py-0.5">
                    Winning
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-gray-500">
          Current result:{" "}
          <span className="font-semibold text-gray-900">{winnerLabel()}</span>
          {" "}({votes[0]} vs {votes[1]} votes) - {totalVotes} total vote{totalVotes === 1 ? "" : "s"}
        </p>
      </section>

      {/* ── 5. Social Posts ───────────────────────────────────── */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Social Posts</h2>
        <p className="text-sm text-gray-500 mb-4">10 posts for Instagram, X, and TikTok captions aimed at young sports bettors.</p>
        <div className="space-y-3">
          {SOCIAL_POSTS.map((post, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex items-start justify-between gap-4"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                  Post {i + 1}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">{post}</p>
              </div>
              <button
                onClick={() => copyText(post, i, setCopiedPosts)}
                className="shrink-0 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {copiedPosts.has(i) ? "Copied!" : "Copy"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. Video Scripts ──────────────────────────────────── */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Video Scripts</h2>
        <p className="text-sm text-gray-500 mb-4">3 short-form video scripts for TikTok / Instagram Reels.</p>
        <div className="space-y-5">
          {VIDEO_SCRIPTS.map((script, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <p className="text-sm font-semibold text-gray-900">{script.title}</p>
                <button
                  onClick={() => copyText(script.script, i, setCopiedScripts)}
                  className="shrink-0 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {copiedScripts.has(i) ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap font-mono bg-gray-50 rounded-lg p-4">
                {script.script}
              </pre>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. 14-Day Campaign Calendar ───────────────────────── */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">14-Day Campaign Calendar</h2>
        <p className="text-sm text-gray-500 mb-4">A planned content schedule for the first two weeks of launch.</p>
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-3">
          {CAMPAIGN_CALENDAR.map(({ day, content }) => (
            <div
              key={day}
              className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
            >
              <p className="text-xs font-bold text-gray-400 mb-1">Day {day}</p>
              <p className="text-xs text-gray-700 leading-snug">{content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. Save Marketing Asset ───────────────────────────── */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Save Marketing Asset</h2>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
              Asset Type
            </label>
            <select
              value={assetType}
              onChange={(e) => { setAssetType(e.target.value); setSaveStatus("idle"); }}
              className={inputClass}
            >
              {ASSET_TYPES.map((t) => (
                <option key={t} value={t}>{t.replace("_", " ")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={assetTitle}
              onChange={(e) => { setAssetTitle(e.target.value); setSaveStatus("idle"); }}
              placeholder="e.g. Launch week social post — Day 1"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
              Content <span className="text-red-400">*</span>
            </label>
            <textarea
              value={assetContent}
              onChange={(e) => { setAssetContent(e.target.value); setSaveStatus("idle"); }}
              placeholder="Paste the asset content here…"
              rows={4}
              className={inputClass + " resize-none"}
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={!assetTitle.trim() || !assetContent.trim() || saveStatus === "saving"}
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
            >
              {saveStatus === "saving" ? "Saving…" : "Save asset"}
            </button>
            {saveStatus === "saved" && (
              <span className="text-sm text-green-700 font-medium">Saved ✓</span>
            )}
            {saveStatus === "error" && (
              <span className="text-sm text-red-600">Error: {saveError}</span>
            )}
          </div>
        </div>
      </section>

      {/* ── 9. Saved Assets List ──────────────────────────────── */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Saved Assets</h2>
        {savedAssets.length === 0 ? (
          <p className="text-sm text-gray-400">No assets saved yet.</p>
        ) : (
          <ul className="space-y-3">
            {savedAssets.map((a) => (
              <li key={a.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{a.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 capitalize">
                      {a.type.replace("_", " ")}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-gray-400">
                    {new Date(a.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
