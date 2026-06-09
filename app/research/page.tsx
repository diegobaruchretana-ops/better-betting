"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, type ResearchOutput } from "../lib/supabase";

type Competitor = {
  name: string;
  type: string;
  strength: string;
  weakness: string;
};

const SEED_COMPETITORS: Competitor[] = [
  {
    name: "Pinnacle",
    type: "Sportsbook",
    strength: "Best odds in market, never limits winning bettors",
    weakness: "No bonuses, restricted in many countries including Mexico",
  },
  {
    name: "Bet365",
    type: "Sportsbook",
    strength: "Massive market coverage, live betting and streaming",
    weakness: "Aggressively limits or bans sharp accounts",
  },
  {
    name: "Betfair Exchange",
    type: "Betting Exchange",
    strength: "Peer-to-peer model enables lay betting and in-play trading",
    weakness: "Commission on winnings, complex interface for new users",
  },
  {
    name: "OddsChecker",
    type: "Odds Comparison",
    strength: "Aggregates lines from 30+ books in real time",
    weakness: "Pure comparison tool — no analysis or betting context",
  },
  {
    name: "Infogol",
    type: "Prediction Model",
    strength: "xG-based match scores with clean, accessible UI",
    weakness: "Black-box model with no reasoning shown to the user",
  },
  {
    name: "WhoScored",
    type: "Stats Site",
    strength: "Deep tactical ratings and player performance data",
    weakness: "No betting angle — data needs manual interpretation",
  },
  {
    name: "Telegram Tipster Groups",
    type: "Tipster Community",
    strength: "Free tips, large Spanish-language communities, instant reach",
    weakness: "Zero accountability, high noise, no performance tracking",
  },
  {
    name: "Reddit r/sportsbook",
    type: "Community Forum",
    strength: "Collective wisdom, real bankroll tracking threads",
    weakness: "Very low signal-to-noise ratio, English-dominant",
  },
  {
    name: "SofaScore",
    type: "Stats App",
    strength: "Live scores, lineups, and match stats in one place",
    weakness: "Not betting-focused; odds integration is superficial",
  },
  {
    name: "Caliente",
    type: "Sportsbook",
    strength: "Dominant Mexican brand, OXXO/SPEI deposits, Liga MX coverage",
    weakness: "Margins are high; limits winners quickly",
  },
];

const BENCHMARK_CARDS = [
  {
    name: "Pinnacle",
    detail: "Gold standard for sharp bettors — best closing lines, no winner bans. The benchmark for odds quality.",
  },
  {
    name: "Betfair",
    detail: "Only major exchange model. Proves the market for peer pricing and lay strategies.",
  },
  {
    name: "Infogol",
    detail: "Closest product analogue. xG-based predictions with clean UX. Direct design and positioning reference.",
  },
  {
    name: "OddsChecker",
    detail: "Dominant aggregator. Proves the appetite for comparison tools and captures high-intent search traffic.",
  },
  {
    name: "Telegram Groups",
    detail: "Largest informal tipster ecosystem. Reveals the core pain points: trust, accountability, and track records.",
  },
];

const GLOBAL_EXAMPLES = [
  {
    name: "Betegy",
    region: "Europe",
    description: "AI-driven match prediction platform delivering structured betting tips across 20+ leagues. Monetizes via subscription and affiliate.",
  },
  {
    name: "Forebet",
    region: "Europe",
    description: "Mathematical football predictions based on historical stats and form. Millions of monthly visitors; no AI, pure statistical models.",
  },
  {
    name: "Betmate",
    region: "Australia",
    description: "Social betting app with community tips, a follow system, and a verified track record for each tipster.",
  },
  {
    name: "SBRodds",
    region: "USA",
    description: "Consensus odds tracker with sharp-money movement alerts. Trusted by sharp bettors for line-shopping and steam alerts.",
  },
  {
    name: "Handicapper.com",
    region: "USA",
    description: "Picks marketplace connecting bettors with verified professional handicappers. Revenue model: premium pick sales.",
  },
];

type RiskSeverity = "Low" | "Medium" | "High";

const RISKS: { title: string; description: string; severity: RiskSeverity }[] = [
  {
    title: "Data Accuracy",
    description: "Odds or stats from unofficial sources may be stale or incorrect, leading to bad recommendations.",
    severity: "High",
  },
  {
    title: "Regulatory Compliance",
    description: "Sports betting regulations vary by jurisdiction. The tool may require legal review before public launch.",
    severity: "High",
  },
  {
    title: "User Over-Reliance on AI Tips",
    description: "Users may treat simulated output as real predictions and lose money acting on it without disclaimers.",
    severity: "Medium",
  },
  {
    title: "Data Source Blocking",
    description: "Sportsbooks can block scraping or revoke API access, breaking any live odds pipeline.",
    severity: "Medium",
  },
  {
    title: "Mexico Payment Friction",
    description: "SPEI and OXXO integrations add development complexity and partner dependencies.",
    severity: "Medium",
  },
  {
    title: "Low Retention",
    description: "Users try the tool once but don't return without push notifications or personalization.",
    severity: "Low",
  },
  {
    title: "Model Accuracy Expectations",
    description: "Users expect high win rates; simulated or imperfect models can erode trust quickly.",
    severity: "Low",
  },
  {
    title: "Localization Scope Creep",
    description: "Full Spanish support and local league coverage significantly expands build scope and timeline.",
    severity: "Low",
  },
];

const SEVERITY_STYLES: Record<RiskSeverity, string> = {
  High: "bg-red-50 text-red-700 border border-red-200",
  Medium: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  Low: "bg-green-50 text-green-700 border border-green-200",
};

const ALL_TYPES = Array.from(new Set(SEED_COMPETITORS.map((c) => c.type))).sort();

export default function ResearchPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>(SEED_COMPETITORS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const [form, setForm] = useState({ name: "", type: "", strength: "", weakness: "" });

  const [saveTitle, setSaveTitle] = useState("");
  const [saveNotes, setSaveNotes] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState("");

  const [recentResearch, setRecentResearch] = useState<ResearchOutput[]>([]);

  const fetchRecent = useCallback(async () => {
    const { data } = await supabase
      .from("research_outputs")
      .select("id, title, notes, created_at")
      .order("created_at", { ascending: false })
      .limit(5);
    if (data) setRecentResearch(data as ResearchOutput[]);
  }, []);

  useEffect(() => {
    fetchRecent();
  }, [fetchRecent]);

  function handleAddCompetitor() {
    if (!form.name.trim()) return;
    setCompetitors((prev) => [
      { name: form.name.trim(), type: form.type.trim() || "Other", strength: form.strength.trim(), weakness: form.weakness.trim() },
      ...prev,
    ]);
    setForm({ name: "", type: "", strength: "", weakness: "" });
  }

  const availableTypes = Array.from(new Set(competitors.map((c) => c.type))).sort();

  const filtered = competitors.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "All" || c.type === typeFilter;
    return matchesSearch && matchesType;
  });

  async function handleSaveResearch() {
    if (!saveTitle.trim()) return;
    setSaveStatus("saving");
    setSaveError("");

    const { error } = await supabase.from("research_outputs").insert({
      title: saveTitle.trim(),
      notes: saveNotes.trim(),
    });

    if (error) {
      setSaveStatus("error");
      setSaveError(error.message);
    } else {
      setSaveStatus("saved");
      fetchRecent();
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">Research Dashboard</h1>
      <p className="mt-3 text-gray-500">
        Benchmark competitors, map risks, and document research findings for the betting-advisor product.
      </p>

      {/* ── Benchmark Cards ───────────────────────────────────── */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Benchmarks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BENCHMARK_CARDS.map((card) => (
            <div key={card.name} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-gray-900">{card.name}</p>
              <p className="mt-2 text-xs text-gray-500 leading-relaxed">{card.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Research Intake Form ──────────────────────────────── */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Add to Research</h2>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Betcris"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Type</label>
              <input
                type="text"
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                placeholder="e.g. Sportsbook"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Strength</label>
              <input
                type="text"
                value={form.strength}
                onChange={(e) => setForm((f) => ({ ...f, strength: e.target.value }))}
                placeholder="Main competitive advantage"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Weakness</label>
              <input
                type="text"
                value={form.weakness}
                onChange={(e) => setForm((f) => ({ ...f, weakness: e.target.value }))}
                placeholder="Main limitation"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
              />
            </div>
          </div>
          <button
            onClick={handleAddCompetitor}
            disabled={!form.name.trim()}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
          >
            Add to research
          </button>
        </div>
      </section>

      {/* ── Competitors Table ─────────────────────────────────── */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Competitors &amp; Substitutes</h2>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
          >
            <option value="All">All types</option>
            {availableTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Strength</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Weakness</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">
                    No entries match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((c, i) => (
                  <tr key={`${c.name}-${i}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{c.name}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{c.type}</td>
                    <td className="px-4 py-3 text-gray-600">{c.strength}</td>
                    <td className="px-4 py-3 text-gray-600">{c.weakness}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Global Examples ───────────────────────────────────── */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Global Examples</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GLOBAL_EXAMPLES.map((ex) => (
            <div key={ex.name} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-900">{ex.name}</p>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{ex.region}</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{ex.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mexico Localization ───────────────────────────────── */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Mexico Localization</h2>
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-3 text-sm text-gray-700 leading-relaxed">
          <p>
            <span className="font-semibold text-gray-900">Dominant operator:</span> Caliente holds roughly 60% of the Mexican sports-betting market. Any comparison or value-finding tool must surface Caliente lines as a baseline.
          </p>
          <p>
            <span className="font-semibold text-gray-900">Growing challengers:</span> Codere and Betsson gained significant ground following Mexico&apos;s updated SEGOB licensing framework (2021). Betcris is also active in the LATAM corridor.
          </p>
          <p>
            <span className="font-semibold text-gray-900">Informal channels:</span> Spanish-language Telegram groups are the primary tipster ecosystem. Users distrust anonymous tips but use them anyway — a verified track record is a strong differentiator.
          </p>
          <p>
            <span className="font-semibold text-gray-900">Payment infrastructure:</span> Credit card penetration is low. OXXO Pay and SPEI are the dominant deposit methods, which shapes user friction and must be considered when describing the betting workflow.
          </p>
          <p>
            <span className="font-semibold text-gray-900">Key leagues:</span> Liga MX and the NFL are by far the highest-volume betting markets. Targeting these two leagues first covers the majority of Mexican bettor activity.
          </p>
        </div>
      </section>

      {/* ── Risk Map ──────────────────────────────────────────── */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Risk Map</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {RISKS.map((risk) => (
            <div key={risk.title} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="text-sm font-semibold text-gray-900">{risk.title}</p>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${SEVERITY_STYLES[risk.severity]}`}>
                  {risk.severity}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{risk.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Save Research to Supabase ─────────────────────────── */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Save Research</h2>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={saveTitle}
              onChange={(e) => { setSaveTitle(e.target.value); setSaveStatus("idle"); }}
              placeholder="e.g. Week 2 competitor research"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Notes</label>
            <textarea
              value={saveNotes}
              onChange={(e) => setSaveNotes(e.target.value)}
              placeholder="Key takeaways, open questions, next steps…"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 resize-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSaveResearch}
              disabled={!saveTitle.trim() || saveStatus === "saving"}
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
            >
              {saveStatus === "saving" ? "Saving…" : "Save research"}
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

      {/* ── Saved Research Widget ─────────────────────────────── */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Saved Research</h2>
        {recentResearch.length === 0 ? (
          <p className="text-sm text-gray-400">No research saved yet.</p>
        ) : (
          <ul className="space-y-2">
            {recentResearch.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.title}</p>
                  {item.notes && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.notes}</p>
                  )}
                </div>
                <span className="shrink-0 text-xs text-gray-400">
                  {new Date(item.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
