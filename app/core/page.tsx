"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, type CoreOutput } from "../lib/supabase";

type Analysis = {
  analysis: string;
  recommendation: string;
  confidence: string;
  confidencePct: number;
};

const analysisTemplates = [
  (match: string) =>
    `${match} presents a compelling matchup with clear form differences between the two sides. Recent head-to-head records favor the home side, while the away team has shown inconsistency in travel fixtures. Key injuries and squad depth will likely tip the balance.`,
  (match: string) =>
    `The tactical setup in ${match} should produce an open game with both teams comfortable in possession. Underlying xG metrics from the past five games suggest the home side is outperforming their league position, creating a potential value window.`,
  (match: string) =>
    `${match} is a high-stakes fixture where neither side can afford a poor result. Pressure situations historically reduce scoring, and set-pieces may decide the outcome. Market lines appear slightly inflated relative to recent statistical output.`,
];

const recommendationTemplates = [
  (match: string) => `Lean toward Home Win in ${match}; value detected at current odds.`,
  (match: string) => `Consider Both Teams to Score in ${match} given recent attacking form on both sides.`,
  (match: string) => `Under 2.5 Goals looks attractive for ${match} given defensive solidity and low-scoring recent history.`,
  (match: string) => `Draw/Away Double Chance for ${match} offers the best expected value at current market prices.`,
];

const confidenceLevels: { label: string; pct: number }[] = [
  { label: "Low", pct: 35 },
  { label: "Low", pct: 42 },
  { label: "Medium", pct: 55 },
  { label: "Medium", pct: 61 },
  { label: "Medium", pct: 68 },
  { label: "High", pct: 74 },
  { label: "High", pct: 81 },
];

function simulateAnalysis(match: string): Analysis {
  const seed = match.length % analysisTemplates.length;
  const recSeed = (match.charCodeAt(0) ?? 0) % recommendationTemplates.length;
  const confSeed = (match.charCodeAt(match.length - 1) ?? 0) % confidenceLevels.length;

  const analysis = analysisTemplates[seed](match);
  const recommendation = recommendationTemplates[recSeed](match);
  const { label, pct } = confidenceLevels[confSeed];

  return { analysis, recommendation, confidence: label, confidencePct: pct };
}

const confidenceBadgeClass: Record<string, string> = {
  Low: "bg-red-50 text-red-700 border border-red-200",
  Medium: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  High: "bg-green-50 text-green-700 border border-green-200",
};

export default function CorePage() {
  const [match, setMatch] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<(Analysis & { match: string }) | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState("");
  const [recent, setRecent] = useState<CoreOutput[]>([]);

  const fetchRecent = useCallback(async () => {
    const { data } = await supabase
      .from("core_outputs")
      .select("id, match, created_at")
      .order("created_at", { ascending: false })
      .limit(3);
    if (data) setRecent(data as CoreOutput[]);
  }, []);

  useEffect(() => {
    fetchRecent();
  }, [fetchRecent]);

  function handleGenerate() {
    if (!match.trim()) return;
    setGenerating(true);
    setSaveStatus("idle");
    setResult(null);
    setTimeout(() => {
      const analysis = simulateAnalysis(match.trim());
      setResult({ ...analysis, match: match.trim() });
      setGenerating(false);
    }, 900);
  }

  async function handleSave() {
    if (!result) return;
    setSaveStatus("saving");
    setSaveError("");

    const { error } = await supabase.from("core_outputs").insert({
      match: result.match,
      analysis: result.analysis,
      recommendation: result.recommendation,
      confidence: `${result.confidence} (${result.confidencePct}%)`,
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
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        Core Agent
      </h1>
      <p className="mt-3 text-gray-500">
        Enter a match to generate a simulated betting analysis.
      </p>

      {/* Intake form */}
      <div className="mt-10 flex gap-3">
        <input
          type="text"
          value={match}
          onChange={(e) => setMatch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !generating && match.trim() && handleGenerate()}
          placeholder="e.g. Real Madrid vs Barcelona"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
        />
        <button
          onClick={handleGenerate}
          disabled={!match.trim() || generating}
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
        >
          {generating ? "Analyzing…" : "Generate Analysis"}
        </button>
      </div>

      {/* Output card */}
      {result && (
        <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-900">{result.match}</h2>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500 border border-gray-200">
              Simulated / Demo
            </span>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                Analysis
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{result.analysis}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                Recommendation
              </p>
              <p className="text-sm text-gray-700">{result.recommendation}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                Confidence Level
              </p>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${confidenceBadgeClass[result.confidence]}`}
              >
                {result.confidence} · {result.confidencePct}%
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saveStatus === "saving" || saveStatus === "saved"}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
            >
              {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "Saved ✓" : "Save"}
            </button>
            {saveStatus === "error" && (
              <p className="text-sm text-red-600">Error: {saveError}</p>
            )}
          </div>
        </div>
      )}

      {/* Recent analyses */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Analyses</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-gray-400">No analyses yet.</p>
        ) : (
          <ul className="space-y-2">
            {recent.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
              >
                <span className="text-sm font-medium text-gray-800">{item.match}</span>
                <span className="text-xs text-gray-400">
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
