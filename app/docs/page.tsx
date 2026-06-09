const sections = [
  {
    id: "week2",
    week: "Week 2",
    title: "Research + Benchmarking Dashboard",
    content: [
      {
        heading: "Overview",
        body: "The Research page (/research) provides a full competitive-intelligence dashboard: a competitor intake form, a filterable benchmarking table, benchmark cards for key players, global product examples, a Mexico localization brief, and a color-coded risk map.",
      },
      {
        heading: "Simulated Content (this week)",
        body: "All competitor data, benchmark cards, global examples, risk descriptions, and localization text are statically defined in the page component. No AI model or live data source is used. The purpose is to establish the research UI and Supabase pipeline before connecting live content in a future week.",
      },
      {
        heading: "Research Prompt / Logic",
        body: "The 10 seed competitors were chosen to represent the full competitive landscape: direct sportsbooks (Pinnacle, Bet365, Caliente), betting infrastructure (Betfair Exchange), aggregators (OddsChecker), prediction models (Infogol, WhoScored), and informal substitutes (Telegram groups, Reddit, SofaScore). The benchmark cards highlight the five most strategically relevant players. Global examples were selected to cover EU, US, and AU markets with distinct monetization models.",
      },
      {
        heading: "Filters & Search",
        body: "The competitors table supports real-time name search and type-based filtering. New entries added via the intake form are immediately reflected in both filter options.",
      },
      {
        heading: "Persistence",
        body: "Research summaries can be saved to Supabase (table: research_outputs, columns: id, title, notes, created_at). The five most recent saves are shown in the dashboard widget below the save form and refresh automatically after a successful insert.",
      },
      {
        heading: "Important Note",
        body: "All generated text this week is SIMULATED. No real AI model, live odds feed, or scraped data is used. The purpose is to establish the UI and data pipeline before connecting live intelligence sources in a future week.",
      },
      {
        heading: "Coding Agent Prompt",
        body: "This page was built with Claude Code using a single scoped prompt covering: intake form with validation, pre-seeded competitor table with search and type filter, benchmark cards, global examples, Mexico localization section, color-coded risk map, Supabase save to research_outputs, a saved-research widget, and this docs entry. The agent was instructed to build only that scope and nothing extra.",
      },
    ],
  },
  {
    id: "week1",
    week: "Week 1",
    title: "Generative Core Agent",
    content: [
      {
        heading: "Overview",
        body: "The Core Agent page (/core) lets users enter a sports match and receive a structured betting analysis: a 2–3 sentence analysis, a one-line recommendation, and a confidence level (Low / Medium / High with a percentage).",
      },
      {
        heading: "Simulated Logic (this week)",
        body: "Output is generated entirely client-side using deterministic template selection. The match string is used to seed which template is chosen (no randomness per run — the same match always yields the same output). This makes the demo reproducible without relying on an external AI API.",
      },
      {
        heading: "Prompt / Template Structure",
        body: "Three analysis templates, four recommendation templates, and seven confidence tiers are defined in app/core/page.tsx. Selection is driven by match.length % templates.length and character codes of the first/last characters of the match string.",
      },
      {
        heading: "Persistence",
        body: "Analyses can be saved to Supabase (table: core_outputs, columns: id, match, analysis, recommendation, confidence, created_at). The three most recent saves are shown below the form.",
      },
      {
        heading: "Important note",
        body: "All output this week is SIMULATED. No real AI model or odds data is used. The purpose is to establish the UI and data pipeline before connecting a live model in a future week.",
      },
      {
        heading: "Coding Agent Prompt",
        body: "This page and the /core logic were built with Claude Code using a single scoped prompt that requested only the agreed features: an intake form, simulated core logic with templates, an output card with a Simulated/Demo badge, Supabase save to the core_outputs table, a recent-analyses preview, and this docs entry. The agent was instructed to build only that scope and nothing extra.",
      },
    ],
  },
];

export default function Docs() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        Documentation
      </h1>
      <p className="mt-4 text-gray-500">
        Prompts, logic decisions, and implementation notes for each week.
      </p>

      <div className="mt-14 space-y-16">
        {sections.map((section) => (
          <article key={section.id}>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                {section.week}
              </span>
              <h2 className="text-2xl font-semibold text-gray-900">
                {section.title}
              </h2>
            </div>
            <dl className="space-y-6">
              {section.content.map((item) => (
                <div key={item.heading}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                    {item.heading}
                  </dt>
                  <dd className="text-sm text-gray-700 leading-relaxed">
                    {item.body}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}
