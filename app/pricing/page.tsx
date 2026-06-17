"use client";

import { useState, useEffect } from "react";
import { supabase, type PricingScenario } from "../lib/supabase";

type ScenarioKey = "conservative" | "optimistic";

const SCENARIO_DEFAULTS: Record<ScenarioKey, { free: number; pro: number; premium: number }> = {
  conservative: { free: 100, pro: 20, premium: 5 },
  optimistic: { free: 500, pro: 100, premium: 30 },
};

const DEFAULT_PRICES = { free: 0, pro: 99, premium: 199 };

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function normalizeNumberInput(value: string) {
  const parsed = Number(value);
  if (value.trim() === "" || Number.isNaN(parsed)) return 0;
  return Math.max(0, Math.trunc(parsed));
}

export default function PricingPage() {
  const [scenario, setScenario] = useState<ScenarioKey>("conservative");

  const [customers, setCustomers] = useState(SCENARIO_DEFAULTS.conservative);
  const [prices, setPrices] = useState(DEFAULT_PRICES);

  const [scenarioName, setScenarioName] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState("");

  const [savedScenarios, setSavedScenarios] = useState<PricingScenario[]>([]);

  const monthly =
    customers.free * prices.free +
    customers.pro * prices.pro +
    customers.premium * prices.premium;
  const annual = monthly * 12;
  const totalCustomers = customers.free + customers.pro + customers.premium;

  async function fetchScenarios() {
    const { data } = await supabase
      .from("pricing_scenarios")
      .select("id, name, assumptions, monthly_revenue, annual_revenue, created_at")
      .order("created_at", { ascending: false })
      .limit(10);
    if (data) setSavedScenarios(data as PricingScenario[]);
  }

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("pricing_scenarios")
        .select("id, name, assumptions, monthly_revenue, annual_revenue, created_at")
        .order("created_at", { ascending: false })
        .limit(10);
      if (active && data) setSavedScenarios(data as PricingScenario[]);
    })();
    return () => { active = false; };
  }, []);

  async function handleSave() {
    if (!scenarioName.trim()) return;
    setSaveStatus("saving");
    setSaveError("");

    const assumptions = {
      scenario,
      prices,
      customers,
      months: 12,
    };

    const { error } = await supabase.from("pricing_scenarios").insert({
      name: scenarioName.trim(),
      assumptions: JSON.stringify(assumptions),
      monthly_revenue: monthly,
      annual_revenue: annual,
    });

    if (error) {
      setSaveStatus("error");
      setSaveError(error.message);
    } else {
      setSaveStatus("saved");
      setScenarioName("");
      fetchScenarios();
    }
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500";

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">Pricing Simulator</h1>
      <p className="mt-3 text-gray-500">
        Model revenue across tiers. All numbers are simulated assumptions for Week 3.
      </p>

      {/* ── Scenario Toggle ───────────────────────────────────── */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Scenario</h2>
        <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
          {(["conservative", "optimistic"] as ScenarioKey[]).map((key) => (
            <button
              key={key}
              onClick={() => {
                setScenario(key);
                setCustomers(SCENARIO_DEFAULTS[key]);
              }}
              className={`px-5 py-2.5 text-sm font-medium capitalize transition-colors ${
                scenario === key
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </section>

      {/* ── Revenue Calculator ────────────────────────────────── */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue Calculator</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {(["free", "pro", "premium"] as const).map((tier) => (
            <div key={tier} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 capitalize">
                {tier}
              </p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Price ($/mo)</label>
                  <input
                    type="number"
                    min={0}
                    value={prices[tier]}
                    onChange={(e) =>
                      setPrices((p) => ({ ...p, [tier]: normalizeNumberInput(e.target.value) }))
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Customers</label>
                  <input
                    type="number"
                    min={0}
                    value={customers[tier]}
                    onChange={(e) =>
                      setCustomers((c) => ({ ...c, [tier]: normalizeNumberInput(e.target.value) }))
                    }
                    className={inputClass}
                  />
                </div>
                <p className="text-xs text-gray-400 pt-1">
                  Subtotal: {fmt(customers[tier] * prices[tier])}/mo
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Monthly Revenue
            </p>
            <p className="text-4xl font-bold text-gray-900">{fmt(monthly)}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Annual Revenue
            </p>
            <p className="text-4xl font-bold text-gray-900">{fmt(annual)}</p>
            <p className="text-xs text-gray-400 mt-1">monthly × 12</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Total customers
            </p>
            <p className="text-4xl font-bold text-gray-900">{totalCustomers.toLocaleString()}</p>
          </div>
        </div>
      </section>

      {/* ── Assumptions Table ─────────────────────────────────── */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Assumptions</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Parameter
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Free
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Pro
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Premium
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              <tr>
                <td className="px-4 py-3 text-gray-700">Price ($/mo)</td>
                <td className="px-4 py-3 text-right text-gray-900">{fmt(prices.free)}</td>
                <td className="px-4 py-3 text-right text-gray-900">{fmt(prices.pro)}</td>
                <td className="px-4 py-3 text-right text-gray-900">{fmt(prices.premium)}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-700">Customers</td>
                <td className="px-4 py-3 text-right text-gray-900">{customers.free.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-gray-900">{customers.pro.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-gray-900">{customers.premium.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-700">Months</td>
                <td className="px-4 py-3 text-right text-gray-500" colSpan={3}>
                  12
                </td>
              </tr>
              <tr className="bg-gray-50 font-medium">
                <td className="px-4 py-3 text-gray-900">Scenario</td>
                <td className="px-4 py-3 text-right text-gray-600 capitalize" colSpan={3}>
                  {scenario}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Save Scenario ─────────────────────────────────────── */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Save Scenario</h2>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
              Scenario name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={scenarioName}
              onChange={(e) => { setScenarioName(e.target.value); setSaveStatus("idle"); }}
              placeholder="e.g. Conservative baseline — June 2026"
              className={inputClass}
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={!scenarioName.trim() || saveStatus === "saving"}
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
            >
              {saveStatus === "saving" ? "Saving…" : "Save scenario"}
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

      {/* ── Saved Scenarios ───────────────────────────────────── */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Saved Scenarios</h2>
        {savedScenarios.length === 0 ? (
          <p className="text-sm text-gray-400">No scenarios saved yet.</p>
        ) : (
          <ul className="space-y-3">
            {savedScenarios.map((s) => {
              let parsed: { scenario?: string; customers?: { free?: number; pro?: number; premium?: number }; prices?: { free?: number; pro?: number; premium?: number } } | null = null;
              try { parsed = JSON.parse(s.assumptions); } catch { /* ignore */ }
              return (
                <li
                  key={s.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                    <span className="shrink-0 text-xs text-gray-400">
                      {new Date(s.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {parsed && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
                      {parsed.scenario && (
                        <span className="capitalize">Scenario: {parsed.scenario}</span>
                      )}
                      {parsed.customers && (
                        <>
                          <span>Free: {parsed.customers.free ?? 0}</span>
                          <span>Pro: {parsed.customers.pro ?? 0}</span>
                          <span>Premium: {parsed.customers.premium ?? 0}</span>
                        </>
                      )}
                      {parsed.prices && (
                        <>
                          <span>@${parsed.prices.pro ?? 99}/mo Pro</span>
                          <span>@${parsed.prices.premium ?? 199}/mo Premium</span>
                        </>
                      )}
                    </div>
                  )}
                  <div className="flex gap-6 text-sm font-medium">
                    <span className="text-gray-700">
                      Monthly:{" "}
                      <span className="text-gray-900">{fmt(s.monthly_revenue)}</span>
                    </span>
                    <span className="text-gray-700">
                      Annual:{" "}
                      <span className="text-gray-900">{fmt(s.annual_revenue)}</span>
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
