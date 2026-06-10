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
        heading: "Research Logic",
        body: "The research methodology follows a structured competitive-landscape framework. The 10 seed competitors were manually selected to cover every category a betting-advice product competes against: direct sportsbooks (Pinnacle, Bet365, Caliente), betting infrastructure (Betfair Exchange), aggregators (OddsChecker), xG-based prediction models (Infogol, WhoScored), stats apps (SofaScore), and informal substitutes (Telegram tipster groups, Reddit r/sportsbook). Strength and weakness fields were written by hand based on publicly available product knowledge — no scraping or API was used. The five benchmark cards highlight the most strategically relevant players for product positioning. Global examples (Betegy, Forebet, Betmate, SBRodds, Handicapper.com) were chosen to represent distinct monetization models across EU, AU, and US markets.",
      },
      {
        heading: "Simulated / Manually Researched Content",
        body: "All competitor entries, benchmark cards, global product examples, risk descriptions, and Mexico localization text are statically defined in app/research/page.tsx. No AI model, live odds feed, or external API is called by the /research page. The content was manually researched and written for this week. The purpose is to establish the research UI and Supabase pipeline before connecting live intelligence sources in a future week.",
      },
      {
        heading: "Supabase Tables",
        body: "Two tables are used by the Research Dashboard. (1) competitors — stores each competitor entry with columns: id (uuid, primary key), name (text), type (text), strength (text), weakness (text), created_at (timestamptz). On page load, all saved competitors are fetched and merged with the 10 hardcoded seed entries; duplicates are deduplicated by name+type key. (2) research_outputs — stores free-form research saves with columns: id (uuid, primary key), title (text), notes (text), created_at (timestamptz). The five most recent rows are shown in the Recent Saved Research widget and refresh automatically after each insert.",
      },
      {
        heading: "Bug Fix: Add to Research Persistence",
        body: "In the initial Week 2 build, the Add to Research form added new competitors to local component state only — entries were lost on page reload. This was fixed by wiring the form's submit handler to insert each new entry into the Supabase competitors table before updating local state. The returned row (with its server-assigned id and created_at) is now used to update the table, so persisted competitors survive reloads and appear for all sessions.",
      },
      {
        heading: "Filters & Search",
        body: "The competitors table supports real-time name search and type-based filtering. New entries added via the intake form are immediately reflected in both filter options.",
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
