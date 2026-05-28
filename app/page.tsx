const roadmap = [
  { week: 0, label: "Setup" },
  { week: 1, label: "Generative Core" },
  { week: 2, label: "Memory Layer" },
  { week: 3, label: "Multi-step Agent" },
  { week: 4, label: "Polish" },
  { week: 5, label: "Final Demo" },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-5xl font-bold tracking-tight text-gray-900">
        Betting Advisor
      </h1>
      <p className="mt-4 text-xl text-gray-500">
        AI-powered sports betting analysis
      </p>
      <p className="mt-6 max-w-2xl text-gray-600 leading-relaxed">
        Betting Advisor is a student project exploring how large language models
        can assist with sports betting analysis. It combines generative AI,
        memory systems, and multi-step agents to surface insights and help
        reason about odds, trends, and value bets.
      </p>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold text-gray-900">Roadmap</h2>
        <ul className="mt-6 space-y-3">
          {roadmap.map(({ week, label }) => (
            <li key={week} className="flex items-center gap-4">
              <span className="w-20 text-sm font-medium text-gray-400">
                Week {week}
              </span>
              <span className="text-gray-700">{label}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
