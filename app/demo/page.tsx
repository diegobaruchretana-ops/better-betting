import Link from "next/link";

const steps = [
  {
    num: 1,
    title: "Research the Market",
    description: "Benchmark competitors, map risks, and localize strategy before building.",
    href: "/research",
  },
  {
    num: 2,
    title: "Generate Analysis",
    description: "Enter any match and get a structured AI-powered betting analysis with a confidence score.",
    href: "/core",
  },
  {
    num: 3,
    title: "Product & Pricing",
    description: "Define your feature tiers, then simulate revenue across Conservative and Optimistic scenarios.",
    href: "/product",
  },
  {
    num: 4,
    title: "Marketing Engine",
    description: "Create brand assets, social posts, video scripts, and A/B-test headlines.",
    href: "/marketing",
  },
  {
    num: 5,
    title: "Guided Chat with Guardrail",
    description: "Talk to the AI advisor — a responsible-gambling guardrail blocks harmful requests automatically.",
    href: "/chat",
  },
];

const agents = [
  { label: "Research", href: "/research" },
  { label: "Core", href: "/core" },
  { label: "Pricing", href: "/pricing" },
  { label: "Marketing", href: "/marketing" },
  { label: "Chat", href: "/chat" },
];

const roadmap = [
  "Live odds feed integration via a real sportsbook API",
  "Authenticated user accounts with saved bet history",
  "Admin review dashboard for flagged chat sessions",
  "Multi-sport support (NFL, NBA, Tennis, MMA)",
  "Webhook alerts when a recommended bet moves in price",
  "LLM upgrade: replace simulated templates with a live Claude API call",
];

export default function Demo() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      {/* Hero */}
      <div className="text-center mb-16">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Guided Walkthrough
        </span>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
          How Betting Advisor Works
        </h1>
        <p className="mt-4 text-gray-500 max-w-xl mx-auto leading-relaxed">
          A five-module venture built in five weeks — each step feeds into the next.
          Follow the walkthrough below to explore the full system.
        </p>
      </div>

      {/* Step cards */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
          The Five Steps
        </h2>
        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className="flex items-start gap-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <span className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-900 text-white text-sm font-bold flex items-center justify-center">
                {step.num}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
              <Link
                href={step.href}
                className="flex-shrink-0 rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:border-gray-500 hover:text-gray-900 transition-colors whitespace-nowrap"
              >
                Go to this module
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Agent Map */}
      <section className="mt-20">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
          Agent Map
        </h2>
        <p className="text-sm text-gray-500 mb-8">
          Each module is an independent agent. Outputs flow downstream — all agents feed into the Dashboard.
        </p>
        <div className="overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max pb-2">
            {agents.map((agent, i) => (
              <div key={agent.label} className="flex items-center gap-2">
                <Link
                  href={agent.href}
                  className="rounded-lg border-2 border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 hover:border-gray-500 hover:shadow-sm transition-all"
                >
                  {agent.label}
                </Link>
                {i < agents.length - 1 && (
                  <span className="text-gray-400 font-bold text-lg select-none">&#8594;</span>
                )}
              </div>
            ))}
            <span className="text-gray-400 font-bold text-lg select-none ml-1">&#8594;</span>
            <Link
              href="/dashboard"
              className="rounded-lg border-2 border-gray-900 bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Impact & Viability */}
      <section className="mt-20">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
          Impact &amp; Viability
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-900 mb-2">Creates value</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Betting Advisor gives casual bettors access to structured, data-informed analysis
              that was previously available only to professional traders. It democratizes
              decision-making without requiring expertise in odds or statistics.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-900 mb-2">Avoids harm</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Every chat session passes through a responsible-gambling guardrail. Messages
              that imply guaranteed wins, chasing losses, or reckless staking are
              intercepted before a response is generated — the session is flagged for
              human review and the user is referred to a helpline.
            </p>
          </div>
        </div>
      </section>

      {/* Version 2 Roadmap */}
      <section className="mt-20">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
          Version 2 Roadmap
        </h2>
        <ul className="space-y-2">
          {roadmap.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
