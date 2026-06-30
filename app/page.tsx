import Link from "next/link";

const benefits = [
  {
    title: "AI-Powered Analysis",
    body: "Get a structured betting analysis for any match — odds context, trends, and a clear recommendation — in seconds.",
  },
  {
    title: "Market Intelligence",
    body: "Benchmark competitors, surface positioning gaps, and understand the landscape before you build or bet.",
  },
  {
    title: "Revenue Modeling",
    body: "Simulate pricing scenarios across tiers, toggle optimistic vs. conservative assumptions, and project growth.",
  },
  {
    title: "Marketing Engine",
    body: "Generate brand assets, social posts, video scripts, and A/B test headlines — all from one dashboard.",
  },
];

const pages = [
  {
    href: "/core",
    label: "Core Advisor",
    description: "Enter any match and get a structured AI analysis with a confidence score.",
  },
  {
    href: "/research",
    label: "Research Dashboard",
    description: "Competitor benchmarking, global examples, risk map, and Mexico localization brief.",
  },
  {
    href: "/product",
    label: "Product Architecture",
    description: "Feature map across three categories and three pricing tier cards.",
  },
  {
    href: "/pricing",
    label: "Pricing Simulator",
    description: "Live revenue calculator with scenario toggle and Supabase-backed save.",
  },
  {
    href: "/marketing",
    label: "Marketing Engine",
    description: "Brand system, persona, A/B headlines, social posts, video scripts, and campaign calendar.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="text-center py-12">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 leading-tight">
          Stop Guessing.<br />Start Winning.
        </h1>
        <p className="mt-5 text-xl text-gray-500 max-w-xl mx-auto leading-relaxed">
          Betting Advisor is an AI-powered analysis engine for serious sports bettors — built on
          data, not vibes.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/core"
            className="inline-block rounded-lg bg-gray-900 px-7 py-3.5 text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
          >
            Try the Core Advisor →
          </Link>
          <Link
            href="/demo"
            className="inline-block rounded-lg bg-amber-500 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-600"
          >
            View the guided demo →
          </Link>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────── */}
      <section className="mt-20">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
          What it does
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-semibold text-gray-900 mb-2">{b.title}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pages ────────────────────────────────────────────── */}
      <section className="mt-20">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
          Explore the app
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {pages.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:border-gray-400 hover:shadow-md transition-all"
            >
              <p className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 mb-1">
                {p.label}{" "}
                <span className="text-gray-400 font-normal">→</span>
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">{p.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
