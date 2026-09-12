"use client";

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      setError("Please enter a research question.");
      return;
    }

    setError("");
    setIsAnalyzing(true);

    // API connection will be added in the next phase.
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsAnalyzing(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            AI Trading Research
          </h1>

          <p className="mt-4 text-lg text-slate-400">
            Turn your trading idea into a testable research experiment.
          </p>
        </div>

        <div className="w-full max-w-2xl">
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
      </div>
    </main>
  );
}