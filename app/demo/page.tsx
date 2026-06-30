import Link from "next/link";
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const steps = [
  {
    num: 1,
    title: "Research the Market",
    description: "Benchmark competitors, map risks, and localize strategy before building.",
    href: "/research",
    icon: (props: IconProps) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
        <circle cx="11" cy="11" r="6" />
        <path d="m20 20-4.2-4.2" />
      </svg>
    ),
    chipClass: "bg-teal-50 text-teal-700",
  },
  {
    num: 2,
    title: "Generate Analysis",
    description: "Enter any match and get a structured AI-powered betting analysis with a confidence score.",
    href: "/core",
    icon: (props: IconProps) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
      </svg>
    ),
    chipClass: "bg-violet-50 text-violet-700",
  },
  {
    num: 3,
    title: "Product & Pricing",
    description: "Define your feature tiers, then simulate revenue across Conservative and Optimistic scenarios.",
    href: "/product",
    icon: (props: IconProps) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
        <path d="M4 7h16" />
        <path d="M7 7v10" />
        <path d="M12 7v10" />
        <path d="M17 7v10" />
      </svg>
    ),
    chipClass: "bg-rose-50 text-rose-700",
  },
  {
    num: 4,
    title: "Marketing Engine",
    description: "Create brand assets, social posts, video scripts, and A/B-test headlines.",
    href: "/marketing",
    icon: (props: IconProps) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
        <path d="M3 5h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H3" />
        <path d="M15 9h4l2 2-2 2h-4" />
      </svg>
    ),
    chipClass: "bg-amber-50 text-amber-700",
  },
  {
    num: 5,
    title: "Guided Chat with Guardrail",
    description: "Talk to the AI advisor — a responsible-gambling guardrail blocks harmful requests automatically.",
    href: "/chat",
    icon: (props: IconProps) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
        <path d="M7 7h10" />
        <path d="M7 11h7" />
        <path d="M7 15h5" />
        <path d="M4 4h16v10H8l-4 4V4Z" />
      </svg>
    ),
    chipClass: "bg-sky-50 text-sky-700",
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
    <div className="mx-auto max-w-5xl px-6 py-20">
      <section className="text-center">
        <span className="inline-flex rounded-full border border-gray-200 bg-white px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-500 shadow-sm">
          Guided walkthrough
        </span>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          How Betting Advisor Works
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-500 sm:text-lg">
          A five-module venture built in five weeks — each step feeds into the next.
          Follow the walkthrough below to explore the full system.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href="/research"
            className="inline-flex items-center rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-600"
          >
            Start the demo
          </Link>
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-400">
              The five steps
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Each module opens a focused experience that builds toward the full product story.
            </p>
          </div>
        </div>
        <div className="mt-8 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Link
                key={step.num}
                href={step.href}
                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-400"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${step.chipClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-sm font-semibold text-gray-900">
                  {step.num}. {step.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {step.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-400">
          Agent map
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-500">
          Each module is an independent agent. Outputs flow downstream — all agents feed into the Dashboard.
        </p>
        <div className="mt-8 overflow-x-auto">
          <div className="flex min-w-max items-center gap-2 pb-2">
            {agents.map((agent, i) => (
              <div key={agent.label} className="flex items-center gap-2">
                <Link
                  href={agent.href}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900"
                >
                  {agent.label}
                </Link>
                {i < agents.length - 1 && (
                  <span className="select-none text-lg font-semibold text-gray-300">→</span>
                )}
              </div>
            ))}
            <span className="ml-1 select-none text-lg font-semibold text-gray-300">→</span>
            <Link
              href="/dashboard"
              className="rounded-full bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-400">
            Impact & viability
          </h2>
          <p className="mt-4 text-sm font-semibold text-gray-900">Creates value</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            Betting Advisor gives casual bettors access to structured, data-informed analysis
            that was previously available only to professional traders. It democratizes
            decision-making without requiring expertise in odds or statistics.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-400">
            Impact & viability
          </h2>
          <p className="mt-4 text-sm font-semibold text-gray-900">Avoids harm</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            Every chat session passes through a responsible-gambling guardrail. Messages
            that imply guaranteed wins, chasing losses, or reckless staking are
            intercepted before a response is generated — the session is flagged for
            human review and the user is referred to a helpline.
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-400">
          Version 2 roadmap
        </h2>
        <ul className="mt-6 space-y-3">
          {roadmap.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
