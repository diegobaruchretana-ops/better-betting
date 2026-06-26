"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../lib/supabase";

type Intake = {
  sport: string;
  risk: "Low" | "Medium" | "High" | "";
  goal: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  rating: "up" | "down" | null;
};

type ChatSession = {
  id: string;
  intake: Intake;
  messages: Message[];
  flagged: boolean;
  rating: string | null;
  status: string;
  created_at: string;
};

// ── Guardrail ────────────────────────────────────────────────────────────────

const GUARDRAIL_KEYWORDS = [
  "guaranteed",
  "guarantee",
  "sure bet",
  "sure win",
  "lock",
  "can't lose",
  "cant lose",
  "win back",
  "recover my losses",
  "all my money",
  "bet everything",
];

function checkGuardrail(message: string): boolean {
  const lower = message.toLowerCase();
  return GUARDRAIL_KEYWORDS.some((kw) => lower.includes(kw));
}

const RESPONSIBLE_GAMBLING_MSG =
  "I need to pause here. No sports betting outcome is guaranteed — not this one, not any. Betting should always be for entertainment, with money you can afford to lose. Never bet to recover losses or chase a win. Please set a firm limit before you place any bet and stick to it.\n\nIf you feel pressure to keep betting or you're trying to win back losses, please reach out to a responsible gambling helpline in your country. I'm here to share analysis only — I won't provide advice that encourages harmful betting behavior.\n\nThis session has been flagged for review.";

// ── Response generation ───────────────────────────────────────────────────────

const reads = [
  (sport: string) =>
    `Read: Looking at ${sport}, there is a clear asymmetry in recent form. The side with home advantage has covered the spread in 4 of their last 5 fixtures, while the away team's defensive record on the road has been inconsistent — conceding in all but one away fixture this season.`,
  (sport: string) =>
    `Read: Underlying xG data from recent ${sport} matches suggests the current favorite may be slightly overvalued at market prices. Head-to-head history over the past three seasons shows tighter margins than the current lines imply.`,
  (sport: string) =>
    `Read: ${sport} shows both teams performing strongly in the first half but diverging significantly in second-half output. Fatigue and lineup rotation have played a larger role in second-half results than pre-match analysis typically accounts for.`,
  (sport: string) =>
    `Read: Market movement on ${sport} over the past 48 hours suggests sharp-money positioning toward the underdog. This kind of line movement often indicates professional bettor activity rather than recreational volume.`,
];

const suggestionsByRisk: Record<string, string[]> = {
  Low: [
    "Suggestion: For Low risk comfort, the Double Chance market covers two of three outcomes and significantly reduces variance. The return is compressed, but exposure is limited.",
    "Suggestion: Given Low risk preference, a small stake on the clear favorite to win or draw limits downside while keeping the bet relevant to the match.",
  ],
  Medium: [
    "Suggestion: At Medium risk, Both Teams to Score offers a balanced profile here. Recent scoring form on both sides supports the premise, and the odds typically sit at a level that provides fair expected value.",
    "Suggestion: With Medium risk tolerance, a 1X2 market bet on the home side at current odds represents reasonable value given the home form and defensive stability data.",
  ],
  High: [
    "Suggestion: With High risk appetite, a handicap bet on the stronger side carries elevated variance but meaningful upside if the performance gap is as pronounced as the statistics suggest.",
    "Suggestion: For High risk comfort, a first-half result market could be attractive — both teams have shown strong opening halves, and the odds on this sub-market often lag behind full-match pricing.",
  ],
};

function generateResponse(intake: Intake, message: string): string {
  const { sport, risk } = intake;
  const readIdx = message.length % reads.length;
  const riskKey = risk || "Medium";
  const sugs = suggestionsByRisk[riskKey];
  const sugIdx = (message.charCodeAt(0) ?? 0) % sugs.length;

  return [
    reads[readIdx](sport),
    sugs[sugIdx],
    "Note: This is simulated output for demo purposes. No real odds data, AI model, or external API was used. Always bet within your limits and for entertainment only.",
  ].join("\n\n");
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeId(): string {
  return Math.random().toString(36).slice(2, 9);
}

const INTAKE_QUESTIONS = [
  "Welcome! Before I can help, I have three quick questions.\n\nFirst — what sport or match are you interested in today?",
  "Got it! Second — what's your risk comfort level for this session?",
  "Almost there. Last question: what do you want to know? For example: \"find value bets\", \"compare odds\", or \"get a recommendation\".",
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const [phase, setPhase] = useState<"intake" | "chat">("intake");
  const [intakeStep, setIntakeStep] = useState(0);
  const [intake, setIntake] = useState<Intake>({ sport: "", risk: "", goal: "" });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [flagged, setFlagged] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState("");
  const [recentSessions, setRecentSessions] = useState<ChatSession[]>([]);
  const [sessionRating, setSessionRating] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: makeId(),
        role: "assistant",
        content: INTAKE_QUESTIONS[0],
        rating: null,
      },
    ]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchRecentSessions = useCallback(() => {
    void supabase
      .from("chat_sessions")
      .select("id, intake, messages, flagged, rating, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data) setRecentSessions(data as ChatSession[]);
      });
  }, []);

  useEffect(() => {
    fetchRecentSessions();
  }, [fetchRecentSessions]);

  function addMessage(role: "user" | "assistant", content: string) {
    setMessages((prev) => [...prev, { id: makeId(), role, content, rating: null }]);
  }

  function handleRate(msgId: string, rating: "up" | "down") {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, rating } : m))
    );
    setSessionRating(rating === "up" ? "thumbs_up" : "thumbs_down");
  }

  function handleIntakeAnswer(text: string) {
    if (intakeStep === 0) {
      const newIntake = { ...intake, sport: text };
      setIntake(newIntake);
      setIntakeStep(1);
      setTimeout(() => addMessage("assistant", INTAKE_QUESTIONS[1]), 300);
    } else if (intakeStep === 2) {
      const newIntake = { ...intake, goal: text };
      setIntake(newIntake);
      setIntakeStep(3);
      setPhase("chat");
      setTimeout(() => {
        addMessage("assistant", generateResponse(newIntake, text));
      }, 600);
    }
  }

  function handleRiskClick(risk: "Low" | "Medium" | "High") {
    addMessage("user", risk);
    const newIntake = { ...intake, risk };
    setIntake(newIntake);
    setIntakeStep(2);
    setTimeout(() => addMessage("assistant", INTAKE_QUESTIONS[2]), 300);
  }

  function handleChatMessage(text: string) {
    if (checkGuardrail(text)) {
      setFlagged(true);
      setTimeout(() => addMessage("assistant", RESPONSIBLE_GAMBLING_MSG), 400);
    } else {
      setTimeout(() => addMessage("assistant", generateResponse(intake, text)), 600);
    }
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    addMessage("user", text);
    if (phase === "intake") {
      handleIntakeAnswer(text);
    } else {
      handleChatMessage(text);
    }
  }

  async function handleSave() {
    setSaveStatus("saving");
    setSaveError("");

    const { error } = await supabase.from("chat_sessions").insert({
      intake,
      messages,
      flagged,
      rating: sessionRating,
      status: flagged ? "needs_review" : "completed",
    });

    if (error) {
      setSaveStatus("error");
      setSaveError(error.message);
    } else {
      setSaveStatus("saved");
      fetchRecentSessions();
    }
  }

  const canSend = input.trim().length > 0;
  const showRiskButtons = phase === "intake" && intakeStep === 1;

  function sessionPreview(session: ChatSession): string {
    const sport = session.intake?.sport;
    return sport ? `Match: ${sport}` : "Chat session";
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        Chat Assistant
      </h1>
      <p className="mt-3 text-gray-500">
        A guided betting advisor. Answer three quick questions to get started, then ask anything. All output is simulated — no external APIs are called.
      </p>

      {/* ── Message window ──────────────────────────────────── */}
      <div className="mt-8 h-[440px] overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" ? (
              <div className="max-w-[82%]">
                <div className="mb-1.5">
                  <span className="rounded-full bg-gray-100 border border-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-400">
                    Simulated / Demo
                  </span>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap shadow-sm">
                  {msg.content}
                </div>
                {phase === "chat" && (
                  <div className="flex gap-1.5 mt-1.5">
                    <button
                      onClick={() => handleRate(msg.id, "up")}
                      title="Helpful"
                      className={`text-sm px-2 py-0.5 rounded-md border transition-colors ${
                        msg.rating === "up"
                          ? "border-green-300 bg-green-50 text-green-700"
                          : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
                      }`}
                    >
                      👍
                    </button>
                    <button
                      onClick={() => handleRate(msg.id, "down")}
                      title="Not helpful"
                      className={`text-sm px-2 py-0.5 rounded-md border transition-colors ${
                        msg.rating === "down"
                          ? "border-red-300 bg-red-50 text-red-700"
                          : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
                      }`}
                    >
                      👎
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="max-w-[82%] rounded-xl bg-gray-900 px-4 py-3 text-sm text-white shadow-sm">
                {msg.content}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ── Input area ──────────────────────────────────────── */}
      {showRiskButtons ? (
        <div className="mt-4 flex gap-3">
          {(["Low", "Medium", "High"] as const).map((r) => (
            <button
              key={r}
              onClick={() => handleRiskClick(r)}
              className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              {r}
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-4 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && canSend && handleSend()}
            placeholder={
              phase === "intake"
                ? intakeStep === 0
                  ? "e.g. Real Madrid vs Barcelona…"
                  : "Type your answer…"
                : "Ask anything about your match…"
            }
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
          <button
            onClick={handleSend}
            disabled={!canSend}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
          >
            Send
          </button>
        </div>
      )}

      {/* ── Save + flag indicator ────────────────────────────── */}
      {phase === "chat" && (
        <div className="mt-4 flex items-center gap-4 flex-wrap">
          <button
            onClick={handleSave}
            disabled={saveStatus === "saving" || saveStatus === "saved"}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
          >
            {saveStatus === "saving"
              ? "Saving…"
              : saveStatus === "saved"
              ? "Saved ✓"
              : "Save chat"}
          </button>
          {flagged && (
            <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
              Session flagged — marked for review
            </span>
          )}
          {saveStatus === "error" && (
            <p className="text-sm text-red-600">Error: {saveError}</p>
          )}
        </div>
      )}

      {/* ── Recent saved chats ──────────────────────────────── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Saved Chats
        </h2>
        {recentSessions.length === 0 ? (
          <p className="text-sm text-gray-400">No saved chats yet.</p>
        ) : (
          <ul className="space-y-2">
            {recentSessions.map((session) => (
              <li
                key={session.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-800">
                    {sessionPreview(session)}
                  </span>
                  {session.flagged && (
                    <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-600">
                      Flagged
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {session.rating && (
                    <span className="text-sm">
                      {session.rating === "thumbs_up" ? "👍" : "👎"}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {new Date(session.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
