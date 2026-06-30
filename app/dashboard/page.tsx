"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type {
  CoreOutput,
  ResearchOutput,
  CompetitorRecord,
  PricingScenario,
  MarketingAsset,
  ChatSession,
} from "../lib/supabase";

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 py-8 text-center text-sm text-gray-400">
      No records yet in <span className="font-mono">{label}</span>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-0.5 text-sm text-gray-700 truncate">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const [coreOutputs, setCoreOutputs] = useState<CoreOutput[] | null>(null);
  const [researchOutputs, setResearchOutputs] = useState<ResearchOutput[] | null>(null);
  const [competitors, setCompetitors] = useState<CompetitorRecord[] | null>(null);
  const [pricingScenarios, setPricingScenarios] = useState<PricingScenario[] | null>(null);
  const [marketingAssets, setMarketingAssets] = useState<MarketingAsset[] | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[] | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchAll() {
      const results = await Promise.allSettled([
        supabase.from("core_outputs").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("research_outputs").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("competitors").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("pricing_scenarios").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("marketing_assets").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("chat_sessions").select("*").order("created_at", { ascending: false }).limit(5),
      ]);

      const tables = ["core_outputs", "research_outputs", "competitors", "pricing_scenarios", "marketing_assets", "chat_sessions"];
      const setters = [setCoreOutputs, setResearchOutputs, setCompetitors, setPricingScenarios, setMarketingAssets, setChatSessions];
      const newErrors: Record<string, string> = {};

      results.forEach((result, i) => {
        if (result.status === "fulfilled") {
          const { data, error } = result.value;
          if (error) {
            newErrors[tables[i]] = error.message;
            (setters[i] as (v: null) => void)(null);
          } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (setters[i] as (v: any[]) => void)(data ?? []);
          }
        } else {
          newErrors[tables[i]] = "Failed to fetch";
          (setters[i] as (v: null) => void)(null);
        }
      });

      setErrors(newErrors);
    }

    fetchAll();
  }, []);

  const loading = coreOutputs === null && researchOutputs === null && chatSessions === null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <div className="mb-14">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="mt-3 text-gray-500">
          Read-only view of the most recent records from every module.
        </p>
      </div>

      {loading && (
        <p className="text-sm text-gray-400">Loading records…</p>
      )}

      <div className="space-y-16">
        {/* ── Core Outputs ──────────────────────────────────────── */}
        <section>
          <SectionHeader title="Core Agent" subtitle="Table: core_outputs — Week 1" />
          {errors.core_outputs ? (
            <p className="text-sm text-red-500">{errors.core_outputs}</p>
          ) : coreOutputs && coreOutputs.length === 0 ? (
            <EmptyState label="core_outputs" />
          ) : coreOutputs ? (
            <div className="space-y-3">
              {coreOutputs.map((row) => (
                <div key={row.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Cell label="Match" value={row.match} />
                    <Cell label="Confidence" value={row.confidence} />
                    <Cell label="Recommendation" value={row.recommendation} />
                    <Cell label="Saved" value={fmt(row.created_at)} />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        {/* ── Research Outputs ──────────────────────────────────── */}
        <section>
          <SectionHeader title="Research Saves" subtitle="Table: research_outputs — Week 2" />
          {errors.research_outputs ? (
            <p className="text-sm text-red-500">{errors.research_outputs}</p>
          ) : researchOutputs && researchOutputs.length === 0 ? (
            <EmptyState label="research_outputs" />
          ) : researchOutputs ? (
            <div className="space-y-3">
              {researchOutputs.map((row) => (
                <div key={row.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Cell label="Title" value={row.title} />
                    <Cell label="Notes" value={row.notes} />
                    <Cell label="Saved" value={fmt(row.created_at)} />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        {/* ── Competitors ───────────────────────────────────────── */}
        <section>
          <SectionHeader title="Competitors" subtitle="Table: competitors — Week 2" />
          {errors.competitors ? (
            <p className="text-sm text-red-500">{errors.competitors}</p>
          ) : competitors && competitors.length === 0 ? (
            <EmptyState label="competitors" />
          ) : competitors ? (
            <div className="space-y-3">
              {competitors.map((row) => (
                <div key={row.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Cell label="Name" value={row.name} />
                    <Cell label="Type" value={row.type} />
                    <Cell label="Strength" value={row.strength} />
                    <Cell label="Weakness" value={row.weakness} />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        {/* ── Pricing Scenarios ─────────────────────────────────── */}
        <section>
          <SectionHeader title="Pricing Scenarios" subtitle="Table: pricing_scenarios — Week 3" />
          {errors.pricing_scenarios ? (
            <p className="text-sm text-red-500">{errors.pricing_scenarios}</p>
          ) : pricingScenarios && pricingScenarios.length === 0 ? (
            <EmptyState label="pricing_scenarios" />
          ) : pricingScenarios ? (
            <div className="space-y-3">
              {pricingScenarios.map((row) => (
                <div key={row.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Cell label="Name" value={row.name} />
                    <Cell label="Monthly Revenue" value={`$${row.monthly_revenue.toLocaleString()}`} />
                    <Cell label="Annual Revenue" value={`$${row.annual_revenue.toLocaleString()}`} />
                    <Cell label="Saved" value={fmt(row.created_at)} />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        {/* ── Marketing Assets ──────────────────────────────────── */}
        <section>
          <SectionHeader title="Marketing Assets" subtitle="Table: marketing_assets — Week 4" />
          {errors.marketing_assets ? (
            <p className="text-sm text-red-500">{errors.marketing_assets}</p>
          ) : marketingAssets && marketingAssets.length === 0 ? (
            <EmptyState label="marketing_assets" />
          ) : marketingAssets ? (
            <div className="space-y-3">
              {marketingAssets.map((row) => (
                <div key={row.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Cell label="Type" value={row.type} />
                    <Cell label="Title" value={row.title} />
                    <Cell label="Content" value={row.content.slice(0, 80) + (row.content.length > 80 ? "…" : "")} />
                    <Cell label="Saved" value={fmt(row.created_at)} />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        {/* ── Chat Sessions ─────────────────────────────────────── */}
        <section>
          <SectionHeader title="Chat Sessions" subtitle="Table: chat_sessions — Week 5" />
          {errors.chat_sessions ? (
            <p className="text-sm text-red-500">{errors.chat_sessions}</p>
          ) : chatSessions && chatSessions.length === 0 ? (
            <EmptyState label="chat_sessions" />
          ) : chatSessions ? (
            <div className="space-y-3">
              {chatSessions.map((row) => (
                <div key={row.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Cell label="Sport" value={(row.intake as Record<string, string>).sport ?? "—"} />
                    <Cell label="Status" value={row.status} />
                    <Cell
                      label="Flagged"
                      value={row.flagged ? "Yes — needs review" : "No"}
                    />
                    <Cell label="Saved" value={fmt(row.created_at)} />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
