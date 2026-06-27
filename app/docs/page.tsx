const sections = [
  {
    id: "week5",
    week: "Week 5",
    title: "Public Chatbot / Guided Assistant",
    content: [
      {
        heading: "Overview",
        body: "Week 5 adds a guided chat interface at /chat. The page walks the user through a 3-question intake flow (sport/match, risk comfort, and goal), then unlocks a free-form chat where every message is processed through a guardrail check before a simulated response is generated. Chat sessions can be saved to Supabase, rated with thumbs up/down, and browsed in a recent-sessions list.",
      },
      {
        heading: "Simulated Output — Important Note",
        body: "All chatbot output this week is simulated. The /chat experience uses deterministic local templates and React state only — no external API, no live odds feed, and no model inference is called.",
      },
      {
        heading: "3-Question Intake Flow",
        body: "Before normal chat is available, the assistant asks three questions in sequence: (1) What sport or match are you interested in? (2) What is your risk comfort — Low, Medium, or High? (3) What do you want to know? Q2 is answered via Quick-reply buttons (Low / Medium / High) to prevent free-text ambiguity. Answers are stored in React state as an intake object and shape every subsequent response. Normal chat is locked until all three questions are answered.",
      },
      {
        heading: "Guardrail Rules",
        body: "Before every assistant response, checkGuardrail(message) scans the user's message for any of these keywords or phrases: \"guaranteed\", \"guarantee\", \"sure bet\", \"sure win\", \"lock\", \"can't lose\", \"cant lose\", \"win back\", \"recover my losses\", \"all my money\", \"bet everything\". A match on any keyword bypasses generateResponse entirely and returns a fixed Responsible Gambling message that pauses the conversation, says no betting outcome is guaranteed, urges the user to bet only for entertainment, never to recover losses, and to contact a helpline if needed. The session's flagged flag is set to true.",
      },
      {
        heading: "Human Checkpoint",
        body: "When a session is flagged by the guardrail, its status is set to 'needs_review' when saved to Supabase (unflagged sessions use status 'completed'). This is the data hook for a future admin review dashboard — no admin UI is built this week.",
      },
      {
        heading: "Response Logic — Simulated",
        body: "generateResponse(intake, message) returns a three-part structured reply: a Read section (recent form / xG / market movement), a Suggestion section tailored to the user's chosen risk level (Low → Double Chance / favorite + draw; Medium → BTTS or 1X2; High → handicap or first-half market), and a closing disclaimer that the output is simulated. Template selection is seeded from message.length and the first character code of the message, so different messages produce different responses while remaining deterministic. No external API, AI model, or live odds feed is called.",
      },
      {
        heading: "Feedback Rating",
        body: "Thumbs up (👍) and thumbs down (👎) buttons appear below each assistant message once the intake is complete. Clicking a button highlights it and updates the session-level rating in React state. When the session is saved, the most recently selected rating (thumbs_up or thumbs_down) is written to the rating column of the chat_sessions row. Ratings in the recent-sessions list are shown as the corresponding emoji.",
      },
      {
        heading: "Supabase Table: chat_sessions",
        body: "Columns: id (uuid, primary key, default gen_random_uuid()), intake (jsonb — sport, risk, goal), messages (jsonb — array of message objects with id, role, content, rating), flagged (boolean, default false), rating (text — 'thumbs_up', 'thumbs_down', or null), status (text — 'completed' or 'needs_review'), created_at (timestamptz, default now()). Row Level Security must be disabled on this table so the anon key can insert and select without policy configuration.",
      },
      {
        heading: "Coding Agent Prompt",
        body: "This page was built with Claude Code using a single scoped prompt covering: chat UI with message window, 3-question intake, guardrail check, simulated generateResponse, thumbs up/down rating, Save chat button with Supabase insert, recent-sessions list, Navbar Chat link, ChatSession type in supabase.ts, and this docs entry. The agent was instructed to build only that scope and nothing extra.",
      },
    ],
  },
  {
    id: "week4",
    week: "Week 4",
    title: "Marketing Engine & Content System",
    content: [
      {
        heading: "Overview",
        body: "Week 4 adds two deliverables: (1) a redesigned homepage (/), rebuilt as a proper product landing page with a hero, benefit cards, and navigation to all app sections; (2) the Marketing Engine page (/marketing), which contains a full content system — brand identity, a target persona, landing page copy, an A/B headline test, 10 social posts, 3 video scripts, a 14-day campaign calendar, and a Supabase-backed asset save/list workflow.",
      },
      {
        heading: "Simulated Content — Important Note",
        body: "All marketing content on /marketing is manually written and statically defined in app/marketing/page.tsx. No AI model, external API, or content generation service is called. The persona, social posts, video scripts, brand system, and copy blocks are invented for this week's build to demonstrate the UI and Supabase pipeline before wiring a live content engine in a future week.",
      },
      {
        heading: "Homepage Upgrade",
        body: "The upgraded homepage communicates the Betting Advisor product through a simple hero section with a headline, subheadline, and a primary CTA that routes to /core. Below it, a benefits grid explains what the product does, and a navigation grid links to the main app areas (/core, /research, /product, /pricing, and /marketing). The existing minimalist style and the existing Navbar/Footer remain intact.",
      },
      {
        heading: "/marketing Page Sections",
        body: "The Marketing Engine page is organized into nine sections in order: Brand System (name, tagline, tone, colors), Target Persona (behavior, goals, pain points), Landing Page Copy (headline, subheadline, benefits, CTA), A/B Headline Test, 10 Social Posts, 3 Video Scripts, a 14-Day Campaign Calendar, a Save Marketing Asset form, and a Saved Assets list.",
      },
      {
        heading: "A/B Headline Test Logic",
        body: "Two headline variants are displayed side by side. Each has a Vote button and a live vote count stored in React state (starting at 0). Clicking Vote increments that headline's count immediately and the winner is recomputed inline: if voteA > voteB → 'Winner: Headline A'; if voteB > voteA → 'Winner: Headline B'; if equal → 'Tie'. The winning card receives a green border ring. Each headline also displays its share of total votes as a live percentage, and the result line shows the total number of votes cast.",
      },
      {
        heading: "Copy / Export Buttons",
        body: "Each social post card and video script card has a Copy button. On click it calls navigator.clipboard.writeText() with the card's text, adds the card's index to a Set stored in React state (copiedPosts or copiedScripts), and shows a 'Copied!' label. After 2 seconds, the index is removed from the Set and the button reverts to 'Copy'. Independent Sets for posts and scripts mean copying one does not affect the other.",
      },
      {
        heading: "Save to Supabase",
        body: "The Save Marketing Asset form collects a type, title, and content string. On submit, it inserts a row into the Supabase marketing_assets table and then reloads the most recent saved assets list so new entries appear immediately without a page refresh.",
      },
      {
        heading: "Supabase Table: marketing_assets",
        body: "Columns: id (uuid, primary key, gen_random_uuid()), type (text — one of: social_post, video_script, landing_copy, persona, brand, other), title (text), content (text), created_at (timestamptz, default now()). Two Row Level Security policies are required: a SELECT policy granting anon role access using (true), and an INSERT policy granting anon role access with check (true). RLS must be enabled on the table or both policies have no effect. The page fetches the 10 most recent rows on mount and after each successful insert.",
      },
      {
        heading: "Coding Agent Prompt",
        body: "These pages were built with Claude Code using a single scoped prompt covering: homepage hero/benefits/nav-cards, /marketing with all 9 sections, Navbar Marketing link, MarketingAsset type in supabase.ts, and this docs entry. The agent was instructed to build only that scope and nothing extra.",
      },
    ],
  },
  {
    id: "week3",
    week: "Week 3",
    title: "Product Architecture & Pricing Simulator",
    content: [
      {
        heading: "Overview",
        body: "Week 3 adds two new pages. /product presents a feature map organized into three categories (Analysis, History & Saving, Alerts & Extras), three pricing tier cards (Free / Pro / Premium), and two customer segments mapped to those tiers. /pricing is an interactive revenue simulator with a live-updating calculator, a Conservative / Optimistic scenario toggle, an assumptions table, and a Supabase-backed save/display workflow.",
      },
      {
        heading: "Product Architecture",
        body: "The pricing simulator is built with client-side React state for prices, customer counts, scenario selection, and live revenue totals. The existing minimalist layout, Navbar, and Footer are preserved; only the /pricing page contains the live calculator and Supabase save workflow, while /product remains a static feature map.",
      },
      {
        heading: "Revenue Calculation Logic",
        body: "Monthly revenue = (free customers × free price) + (pro customers × pro price) + (premium customers × premium price). Annual revenue = monthly × 12. All values update immediately on every keystroke — no submit button, no page reload. Prices are editable inputs defaulting to Free $0, Pro $99, Premium $199.",
      },
      {
        heading: "Scenario Toggle",
        body: "Two scenarios are available: Conservative (Free 100, Pro 20, Premium 5 customers) and Optimistic (Free 500, Pro 100, Premium 30 customers). Switching a scenario resets the customer counts to those defaults, but does not reset the tier prices. The toggle is the only control that changes the customer-count assumptions.",
      },
      {
        heading: "Pricing Tiers",
        body: "There are three pricing tiers: Free ($0/mo), Pro ($99/mo), and Premium ($199/mo). Users can edit the tier prices directly in the calculator inputs while the scenario toggle only affects customer assumptions.",
      },
      {
        heading: "Supabase Table: pricing_scenarios",
        body: "Columns: id (uuid, primary key, gen_random_uuid()), name (text), assumptions (text — stores a JSON string with scenario, prices, customers, and months), monthly_revenue (numeric), annual_revenue (numeric), created_at (timestamptz, default now()). The browser client reads and writes this table so saved scenarios can be displayed immediately in the Saved Scenarios list.",
      },
      {
        heading: "Simulated Assumptions — Important Note",
        body: "All numbers on the /pricing page are invented assumptions for this week's build. Customer counts (Conservative: 100 / 20 / 5, Optimistic: 500 / 100 / 30) and prices (Free $0, Pro $99, Premium $199) are not based on real market data. They are illustrative figures used to demonstrate the calculator UI and the Supabase save pipeline.",
      },
      {
        heading: "Coding Agent Prompt",
        body: "These pages were built with Claude Code using a single scoped prompt covering: /product feature map, three tier cards, two customer segments; /pricing live calculator, scenario toggle, assumptions table, Supabase save form, saved-scenarios list; Navbar links; supabase.ts PricingScenario type; and this docs entry. The agent was instructed to build only that scope and nothing extra.",
      },
    ],
  },
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
