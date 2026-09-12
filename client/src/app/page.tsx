"use client";

import { useState } from "react";

interface ResearchAnalysis {
  researchQuestion: string;
  instrument: string | null;
  timeframe: string | null;
  entryCondition: string | null;
  exitCondition: string | null;
  holdingPeriod: string | null;
  testPeriod: string | null;
  transactionCosts: string | null;
  filters: string[];
  hypothesis: string;
  missingInformation: string[];
  status: "needs_clarification" | "ready";
}

export default function Home() {
  const [question, setQuestion] = useState("");
  const [analysis, setAnalysis] = useState<ResearchAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      setError("Please enter a research question.");
      return;
    }

    setError("");
    setAnalysis(null);
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: trimmedQuestion,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.details || data.error || "Failed to analyze question.",
        );
      }

      setAnalysis(data);
    } catch (error) {
      console.error("Analysis request failed:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while analyzing the question.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-16">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            AI Trading Research
          </h1>

          <p className="mt-4 text-lg text-slate-400">
            Turn your trading idea into a testable research experiment.
          </p>
        </div>

        <div className="w-full">
          <label
            htmlFor="research-question"
            className="mb-3 block text-sm font-medium text-slate-300"
          >
            Ask a research question
          </label>

          <textarea
            id="research-question"
            value={question}
            onChange={(event) => {
              setQuestion(event.target.value);

              if (error) {
                setError("");
              }
            }}
            placeholder="e.g. Does buying NIFTY after a 1% fall work better during high-volatility periods?"
            className="min-h-36 w-full resize-none rounded-xl border border-slate-700 bg-slate-900 p-4 text-white outline-none placeholder:text-slate-500 focus:border-slate-500"
            disabled={isAnalyzing}
          />

          {error && (
            <p className="mt-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="mt-4 w-full rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Question"}
          </button>
        </div>

        {analysis && (
          <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-6">
              <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
                Research Analysis
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                {analysis.researchQuestion}
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Instrument</p>
                <p className="mt-1">{analysis.instrument ?? "Not specified"}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Timeframe</p>
                <p className="mt-1">{analysis.timeframe ?? "Not specified"}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Entry Condition</p>
                <p className="mt-1">
                  {analysis.entryCondition ?? "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Holding Period</p>
                <p className="mt-1">
                  {analysis.holdingPeriod ?? "Not specified"}
                </p>
              </div>
            </div>

            {analysis.missingInformation.length > 0 && (
              <div className="mt-8 rounded-xl border border-amber-900/50 bg-amber-950/20 p-5">
                <h3 className="font-semibold text-amber-300">
                  More information needed
                </h3>

                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {analysis.missingInformation.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8">
              <h3 className="font-semibold">Hypothesis</h3>

              <p className="mt-2 text-slate-400">
                {analysis.hypothesis}
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}