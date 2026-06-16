const FEATURE_CATEGORIES = [
  {
    category: "Analysis",
    features: [
      { name: "Match Analysis", description: "Structured breakdown for any match you enter" },
      { name: "Confidence Score", description: "Low / Medium / High rating with a percentage" },
      { name: "League Coverage", description: "Liga MX and NFL (highest-volume markets first)" },
      { name: "AI Recommendations", description: "One-line bet recommendation per analysis" },
    ],
  },
  {
    category: "History & Saving",
    features: [
      { name: "Save Analyses", description: "Persist picks to your account for later review" },
      { name: "Recent Picks Feed", description: "Quick view of your last analyses on the home page" },
      { name: "Research Notes", description: "Free-form notes attached to any saved analysis" },
      { name: "Unlimited History", description: "No cap on stored analyses" },
    ],
  },
  {
    category: "Alerts & Extras",
    features: [
      { name: "Email Digest", description: "Weekly summary of your activity and top picks" },
      { name: "Push Notifications", description: "In-browser alerts for new high-confidence matches" },
      { name: "Priority Support", description: "Direct channel for bug reports and feature requests" },
      { name: "Early Access", description: "First look at features before general release" },
    ],
  },
];

type TierName = "Free" | "Pro" | "Premium";

const TIERS: {
  name: TierName;
  price: string;
  period: string;
  highlight: boolean;
  features: { category: string; items: string[] }[];
}[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    highlight: false,
    features: [
      {
        category: "Analysis",
        items: ["Match Analysis", "Confidence Score", "League Coverage", "AI Recommendations"],
      },
      {
        category: "History & Saving",
        items: ["Save Analyses (up to 3/month)", "Recent Picks Feed"],
      },
      { category: "Alerts & Extras", items: [] },
    ],
  },
  {
    name: "Pro",
    price: "$99",
    period: "per month",
    highlight: true,
    features: [
      {
        category: "Analysis",
        items: ["Match Analysis", "Confidence Score", "League Coverage", "AI Recommendations"],
      },
      {
        category: "History & Saving",
        items: ["Save Analyses", "Recent Picks Feed", "Research Notes", "Unlimited History"],
      },
      { category: "Alerts & Extras", items: ["Email Digest"] },
    ],
  },
  {
    name: "Premium",
    price: "$199",
    period: "per month",
    highlight: false,
    features: [
      {
        category: "Analysis",
        items: ["Match Analysis", "Confidence Score", "League Coverage", "AI Recommendations"],
      },
      {
        category: "History & Saving",
        items: ["Save Analyses", "Recent Picks Feed", "Research Notes", "Unlimited History"],
      },
      {
        category: "Alerts & Extras",
        items: ["Email Digest", "Push Notifications", "Priority Support", "Early Access"],
      },
    ],
  },
];

const SEGMENTS: { label: string; ages: string; description: string; tier: string; tierColor: string }[] = [
  {
    label: "Casual student bettors",
    ages: "18–25",
    description:
      "Occasional fans who want a quick tip before a game. Price-sensitive, not tracking performance, just looking for a confident pick.",
    tier: "Free",
    tierColor: "text-gray-700 bg-gray-100",
  },
  {
    label: "Serious / frequent bettors",
    ages: "Any age",
    description:
      "High-volume bettors who track ROI, review past picks, and want reliable analysis they can act on week after week.",
    tier: "Pro / Premium",
    tierColor: "text-indigo-700 bg-indigo-50",
  },
];

export default function ProductPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">Product</h1>
      <p className="mt-3 text-gray-500">
        Feature overview, pricing tiers, and target customer segments for Betting Advisor.
      </p>

      {/* ── Feature Map ───────────────────────────────────────── */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Feature Map</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {FEATURE_CATEGORIES.map((cat) => (
            <div key={cat.category} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                {cat.category}
              </p>
              <ul className="space-y-3">
                {cat.features.map((f) => (
                  <li key={f.name}>
                    <p className="text-sm font-medium text-gray-900">{f.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{f.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing Tiers ─────────────────────────────────────── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Pricing Tiers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl border p-6 flex flex-col ${
                tier.highlight
                  ? "border-gray-900 bg-gray-900 text-white shadow-lg"
                  : "border-gray-200 bg-white text-gray-900 shadow-sm"
              }`}
            >
              {tier.highlight && (
                <span className="mb-3 inline-block self-start rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white">
                  Most Popular
                </span>
              )}
              <p className={`text-sm font-semibold uppercase tracking-widest ${tier.highlight ? "text-gray-300" : "text-gray-400"}`}>
                {tier.name}
              </p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold">{tier.price}</span>
                <span className={`text-sm ${tier.highlight ? "text-gray-400" : "text-gray-400"}`}>
                  {tier.period}
                </span>
              </div>

              <div className="mt-6 flex-1 space-y-4">
                {tier.features.map((group) => (
                  <div key={group.category}>
                    <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${tier.highlight ? "text-gray-400" : "text-gray-400"}`}>
                      {group.category}
                    </p>
                    {group.items.length === 0 ? (
                      <p className={`text-xs ${tier.highlight ? "text-gray-500" : "text-gray-400"}`}>—</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {group.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm">
                            <svg
                              className={`mt-0.5 shrink-0 h-4 w-4 ${tier.highlight ? "text-white" : "text-gray-900"}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className={tier.highlight ? "text-gray-200" : "text-gray-700"}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Customer Segments ─────────────────────────────────── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Segments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {SEGMENTS.map((seg) => (
            <div key={seg.label} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{seg.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Age: {seg.ages}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${seg.tierColor}`}>
                  {seg.tier}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{seg.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
