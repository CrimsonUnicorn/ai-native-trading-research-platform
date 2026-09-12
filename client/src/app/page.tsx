"use client";

import { useState } from "react";
import ClarificationCard from "@/components/ClarificationCard";

interface ClarificationField {
  key: string;
  label: string;
  type: "text" | "select";
  options?: string[];
}

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
  missingInformation: ClarificationField[];
  status: "needs_clarification" | "ready";
}

interface Experiment {
  researchQuestion: string;
  instrument: string;
  timeframe: string;
  entryCondition: string;
  exitCondition: string;
  holdingPeriod: string;
  testPeriod: string;
  transactionCosts: string;
  filters: string[];
  hypothesis: string;
}

export default function Home() {
  const [question, setQuestion] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [error, setError] = useState("");

  const [analysis, setAnalysis] = useState<ResearchAnalysis | null>(null);
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [backtestResult, setBacktestResult] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleAnalyze = async () => {
    if (!question.trim()) {
      setError("Please enter a research question.");
      return;
    }

    setIsAnalyzing(true);
    setError("");
    setAnalysis(null);
    setExperiment(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze question.");
      }

      setAnalysis(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while analyzing the question.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBuildExperiment = async (
    answers: Record<string, string>,
  ) => {
    if (!analysis) return;

    setIsBuilding(true);
    setError("");
    setExperiment(null);

    try {
      const response = await fetch("/api/experiment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          analysis,
          answers,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to build experiment.");
      }

      setExperiment(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while building the experiment.",
      );
    } finally {
      setIsBuilding(false);
    }
  };

  const handleRunExperiment = async () => {
    if (!experiment) return;

    setIsRunning(true);
    setError("");
    setBacktestResult(null);

    try {
      const response = await fetch("/api/backtest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          holdingDays: 3,
          fallThresholdPercent: 1,
          volatilityThreshold: 20,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to run experiment.");
      }

      setBacktestResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while running the experiment.",
      );
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">
            AI Trading Research
          </h1>

          <p className="mt-3 text-zinc-400">
            Turn a trading idea into a structured research experiment.
          </p>
        </div>

        {/* Question Input */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <label className="mb-3 block text-sm font-medium text-zinc-300">
            Research Question
          </label>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Example: Does buying NIFTY after a 1% fall work better during high-volatility periods?"
            className="min-h-32 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-sm outline-none transition focus:border-zinc-500"
          />

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="mt-4 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Question"}
          </button>
        </section>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Analysis */}
        {analysis && (
          <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-xl font-semibold">Research Analysis</h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-zinc-500">Instrument</p>
                <p className="mt-1 text-sm">
                  {analysis.instrument || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-xs text-zinc-500">Timeframe</p>
                <p className="mt-1 text-sm">
                  {analysis.timeframe || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-xs text-zinc-500">Entry Condition</p>
                <p className="mt-1 text-sm">
                  {analysis.entryCondition || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-xs text-zinc-500">Holding Period</p>
                <p className="mt-1 text-sm">
                  {analysis.holdingPeriod || "Not specified"}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs text-zinc-500">Hypothesis</p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                {analysis.hypothesis}
              </p>
            </div>

            {analysis.filters.length > 0 && (
              <div className="mt-6">
                <p className="text-xs text-zinc-500">Filters</p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {analysis.filters.map((filter) => (
                    <span
                      key={filter}
                      className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-300"
                    >
                      {filter}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Clarification */}
        {analysis &&
          analysis.status === "needs_clarification" &&
          analysis.missingInformation.length > 0 && (
            <div className="mt-8">
              <ClarificationCard
                fields={analysis.missingInformation}
                onSubmit={handleBuildExperiment}
              />

              {isBuilding && (
                <p className="mt-4 text-center text-sm text-zinc-500">
                  Building experiment...
                </p>
              )}
            </div>
          )}

        {/* Experiment */}
        {experiment && (
          <section className="mt-8 rounded-2xl border border-emerald-900/50 bg-zinc-900 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Experiment Definition
              </h2>

              <span className="rounded-full bg-emerald-950 px-3 py-1 text-xs font-medium text-emerald-400">
                Ready
              </span>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs text-zinc-500">Research Question</p>
                <p className="mt-1 text-sm text-zinc-200">
                  {experiment.researchQuestion}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-zinc-500">Instrument</p>
                  <p className="mt-1 text-sm">{experiment.instrument}</p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">Timeframe</p>
                  <p className="mt-1 text-sm">{experiment.timeframe}</p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">Entry Condition</p>
                  <p className="mt-1 text-sm">
                    {experiment.entryCondition}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">Exit Condition</p>
                  <p className="mt-1 text-sm">
                    {experiment.exitCondition}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">Holding Period</p>
                  <p className="mt-1 text-sm">
                    {experiment.holdingPeriod}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">Test Period</p>
                  <p className="mt-1 text-sm">
                    {experiment.testPeriod}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-zinc-500">Transaction Costs</p>
                <p className="mt-1 text-sm">
                  {experiment.transactionCosts}
                </p>
              </div>

              <div>
                <p className="text-xs text-zinc-500">Hypothesis</p>
                <p className="mt-1 text-sm leading-6 text-zinc-300">
                  {experiment.hypothesis}
                </p>
              </div>
            </div>
            <div className="mt-8 border-t border-zinc-800 pt-6">
              <button
                onClick={handleRunExperiment}
                disabled={isRunning}
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isRunning ? "Running Experiment..." : "Run Experiment"}
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}