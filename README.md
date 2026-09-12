# AI Trading Research Assistant

An AI-native trading research assistant that transforms a natural-language trading question into a structured, testable research experiment.

The application follows the workflow:

**ASK → UNDERSTAND → IDENTIFY MISSING INFORMATION → DEFINE EXPERIMENT → SHOW RESULT**

The goal of this project is to demonstrate how an AI system can help turn an ambiguous trading idea into a structured research experiment. It is a prototype for research exploration, not a production-grade trading or backtesting system.

---

## Overview

Trading research questions are often expressed in natural language.

For example:

> "Does buying NIFTY after a 1% fall work better during high-volatility periods?"

This question contains several parameters that may not be clearly defined:

* What timeframe should the price fall be measured on?
* What should the holding period be?
* What defines a high-volatility period?
* What historical period should be tested?
* What should the entry and exit rules be?

Instead of requiring the user to manually define every parameter, the application uses Gemini to understand the question, identify missing information, and help construct a structured experiment.

The user remains involved in defining important assumptions through the clarification step.

---

# Core User Journey

```text
                         USER
                           │
                           ▼
                    ┌─────────────┐
                    │     ASK     │
                    │             │
                    │ Enter a     │
                    │ research    │
                    │ question    │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ UNDERSTAND  │
                    │             │
                    │ Gemini      │
                    │ analyzes    │
                    │ the question│
                    └──────┬──────┘
                           │
                           ▼
                ┌──────────────────────┐
                │ IDENTIFY MISSING     │
                │ INFORMATION          │
                │                      │
                │ Gemini determines    │
                │ what needs to be     │
                │ clarified            │
                └──────────┬───────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  CLARIFY    │
                    │             │
                    │ User selects│
                    │ the required│
                    │ parameters  │
                    └──────┬──────┘
                           │
                           ▼
                ┌──────────────────────┐
                │ DEFINE EXPERIMENT    │
                │                      │
                │ Gemini combines the │
                │ question + user     │
                │ selections into a   │
                │ structured test     │
                └──────────┬───────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │    TEST     │
                    │             │
                    │ Lightweight │
                    │ simulated   │
                    │ backtest    │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │    SHOW     │
                    │   RESULT    │
                    │             │
                    │ Metrics +   │
                    │ trade data  │
                    │ + conclusion│
                    └─────────────┘
```

---

# Features

* Natural-language trading research questions
* AI-powered research question analysis
* Dynamic identification of missing information
* User-driven clarification
* AI-generated experiment definitions
* Structured AI responses
* Zod validation
* Lightweight simulated backtesting
* Trade-level result display
* Research conclusion
* Explicit simulated-data disclaimers
* Server-side Gemini API integration

---

# Architecture

```text
                         ┌──────────────────┐
                         │      User        │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   Next.js UI     │
                         │ React +          │
                         │ TypeScript +     │
                         │ Tailwind CSS     │
                         └────────┬─────────┘
                                  │
                 ┌────────────────┼────────────────┐
                 │                │                │
                 ▼                ▼                ▼
          /api/analyze     /api/experiment   /api/backtest
                 │                │                │
                 ▼                ▼                ▼
             Gemini           Gemini         Backtest Engine
                 │                │                │
                 ▼                ▼                ▼
           AI Analysis     Experiment       Simulated OHLC
                           Definition           Data
                 │                │                │
                 └────────────┬───┴────────────────┘
                              │
                              ▼
                         Results UI
```

## Design Principle

The application separates AI reasoning from deterministic application logic:

> **LLM interprets → Application validates → Application executes**

Gemini is responsible for interpreting the user's research question and generating the experiment definition.

The application validates the structured response and passes the resulting experiment to the execution layer.

The current execution layer is intentionally lightweight because the assignment does not require a production-grade backtesting engine.

---

# Technology Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

## AI

* Google Gemini API
* `@google/genai`
* Gemini Interactions API

## Validation

* Zod

Zod is used to validate structured responses returned by Gemini before they are used by the application.

## Data

* Local simulated OHLC market data
* No external market-data provider is required

## Deployment

The application is designed to be deployable on Vercel or a similar Next.js hosting platform.

---

# AI Workflow

## 1. Research Question Analysis

The user starts with a natural-language research question.

Example:

> "Does buying NIFTY after a 1% fall work better during high-volatility periods?"

The question is sent to Gemini.

Gemini analyzes the question and returns structured information such as:

* Research question
* Instrument
* Timeframe
* Entry condition
* Holding period
* Hypothesis
* Filters
* Missing information
* Status

Example:

```text
Instrument:
NIFTY

Timeframe:
Not specified

Entry Condition:
NIFTY drops by 1% in a single day

Holding Period:
Not specified

Hypothesis:
Buying NIFTY after a 1% daily decline generates
better performance during high-volatility regimes.

Filters:
High volatility regime
```

---

# 2. Identify Missing Information

If the research question is incomplete, Gemini identifies the information required to create a testable experiment.

The UI then displays those questions to the user.

Example:

```text
What chart timeframe would you like to use?

○ Daily
○ 1-Hour
○ 15-Minute
```

Another example:

```text
What is the holding period or exit rule?

○ 1 Day
○ 3 Days
○ 5 Days
○ Exit on profit target or stop loss
```

The important point is that the application does not blindly assume these values.

The user is given the opportunity to define the assumptions.

---

# 3. User Clarification

The user selects the desired values.

For example:

```text
Timeframe:
15-Minute

Holding Period:
5 Days

Volatility Definition:
India VIX > 20

Test Period:
Last 3 Years
```

These selections are sent back to Gemini along with the original research question and analysis.

---

# 4. Experiment Definition

Gemini uses the original question and the user's clarification selections to generate a structured experiment.

Example:

```text
Research Question:
Does buying NIFTY after a 1% fall work better
during high-volatility periods?

Instrument:
NIFTY

Timeframe:
15-Minute

Entry Condition:
NIFTY index declines by at least 1% within
a single 15-minute candle/bar.

Exit Condition:
Exit exactly 5 trading days after entry.

Holding Period:
5 Days

Test Period:
Last 3 Years

Transaction Costs:
Not specified

Hypothesis:
Buying NIFTY after a 1% decline during
high-volatility periods may produce better
risk-adjusted performance.
```

The generated experiment is validated with Zod before being passed to the backtesting API.

---

# Backtesting

The application includes a lightweight simulated backtesting layer.

The backtest receives the structured experiment and evaluates the supported conditions against the local simulated OHLC dataset.

The current prototype is intentionally simple.

It demonstrates the connection between:

```text
AI-generated experiment
        ↓
Execution layer
        ↓
Simulated market data
        ↓
Calculated results
```

The application does not attempt to implement a full production trading engine.

---

# Results

The Results screen displays the outcome of the simulated experiment.

Example:

```text
Total Trades

7

Winning Trades

7

Win Rate

100.0%

Average Return

0.93%

Total Return

+6.48%
```

It also displays individual trades:

| Entry            | Exit             | Entry Price | Exit Price | Return |
| ---------------- | ---------------- | ----------: | ---------: | -----: |
| 2023-01-02 10:45 | 2023-01-02 12:00 |       17920 |      18010 | +0.50% |
| 2023-01-02 11:00 | 2023-01-02 12:15 |       17870 |      18030 | +0.90% |
| 2023-01-02 11:15 | 2023-01-02 12:30 |       17900 |      18050 | +0.84% |

The result page clearly labels the dataset as simulated.

---

# Research Conclusion

The application separates the observed result from broader claims.

For example:

> The simulated experiment produced 7 trades with a win rate of 100.0% and an average return of 0.93%.

The application then explicitly states that:

> These results are based on simulated market data and should not be interpreted as evidence of real-world trading performance.

This prevents a small simulated result from being presented as proof that a trading strategy works.

---

# Key Engineering Decisions

## 1. Gemini is part of the research workflow

AI is not used only for generating a final explanation.

Gemini participates in the core research process:

```text
Question
   ↓
Interpretation
   ↓
Missing information
   ↓
Clarification
   ↓
Experiment definition
```

This makes the application AI-native.

---

## 2. User clarification instead of silent assumptions

When important information is missing, the system asks the user rather than silently inventing parameters.

This makes the experiment more transparent and keeps the researcher involved in defining assumptions.

---

## 3. Generic experiment structure

The experiment schema uses generic fields such as:

```text
entryCondition
exitCondition
filters
hypothesis
```

instead of hardcoding a specific strategy or indicator.

This allows Gemini to generate different experiment definitions without requiring the application to assume that every research question will use the same indicator.

---

## 4. AI output is validated

AI-generated responses are validated with Zod before being used by the application.

This creates a boundary between probabilistic AI output and deterministic application behavior.

---

## 5. Simulated data

The prototype uses local simulated OHLC data.

This keeps the application self-contained and makes it possible to demonstrate the complete research workflow without depending on an external market-data service.

---

## 6. Lightweight execution

A full trading/backtesting engine is outside the scope of this prototype.

The execution layer therefore focuses on demonstrating the research workflow rather than implementing every possible technical indicator or trading rule.

---

# Limitations

This project is a prototype and has several deliberate limitations.

## Simulated Data

The application does not currently use real historical NIFTY market data.

All displayed performance results are generated from a local simulated dataset.

Therefore, the results have no statistical significance for actual trading.

## Limited Backtest Execution

Gemini can generate experiment definitions containing conditions that the current lightweight execution layer may not fully support.

For example, Gemini may generate conditions involving:

* ATR
* India VIX
* RSI
* Moving averages
* Other technical indicators

The current prototype does not implement a universal natural-language strategy parser or every possible indicator.

## Approximate Holding Period

The simulated execution layer works with the available data bars rather than a complete historical trading calendar.

Therefore, a generated holding period such as "10 trading days" should not be interpreted as an accurate 10-day historical simulation in the current prototype.

## No Real Transaction Costs

Transaction costs are included in the experiment definition but are not modeled using a real broker or exchange execution model.

## No Slippage

Market impact and slippage are not currently modeled.

## No Portfolio Simulation

The prototype does not model:

* Position sizing
* Portfolio allocation
* Capital constraints
* Leverage
* Multiple simultaneous positions
* Short selling
* Risk management

## No Advanced Performance Analysis

The current result layer does not calculate advanced metrics such as:

* Sharpe ratio
* Maximum drawdown
* Alpha
* Beta
* Confidence intervals
* Statistical significance
* Out-of-sample performance
* Walk-forward validation
* Robustness analysis

---

# Future Improvements

A production-oriented version could add:

1. Real historical market-data providers.
2. A structured machine-readable strategy representation generated by the AI.
3. Support for technical indicators such as ATR, RSI, moving averages, and volatility measures.
4. A more complete backtesting engine.
5. Transaction costs and slippage.
6. Position sizing and portfolio simulation.
7. Advanced performance metrics.
8. In-sample and out-of-sample testing.
9. Walk-forward validation.
10. Sensitivity and robustness analysis.
11. Persistent experiment history.
12. Charts showing entries, exits, indicators, and performance.
13. User authentication.
14. Saved and comparable research experiments.

---

# Thinking Note

The main design question for this project was:

> **How can an ambiguous natural-language trading idea be transformed into a testable experiment without silently inventing important assumptions?**

The solution was to make the LLM part of a structured research workflow.

Instead of:

```text
User question
     ↓
AI answer
```

the application uses:

```text
User question
     ↓
AI interpretation
     ↓
Identify missing information
     ↓
User clarification
     ↓
AI-generated experiment
     ↓
Validation
     ↓
Execution
     ↓
Observed result
```

This approach keeps the user involved in important assumptions while allowing the AI to handle natural-language interpretation.

Another key design decision was to avoid building a large rule-based system for interpreting every possible trading question.

The application keeps the experiment schema generic and allows Gemini to determine the experiment structure.

At the same time, the execution layer remains deliberately lightweight.

This creates a clear boundary:

> **Gemini determines what the experiment means; the application validates and executes the supported parts of that experiment.**

The limitations are explicitly documented rather than hiding them behind artificially complex logic.

---

# AI Usage Note

AI tools were used both as part of the application and during development.

## Gemini

Gemini is a core component of the application.

It is used to:

* Interpret natural-language research questions.
* Identify missing information.
* Generate clarification requirements.
* Incorporate user-selected clarification values.
* Generate structured experiment definitions.
* Generate research hypotheses.

The Gemini API is accessed server-side so that the API key is not exposed to the browser.

## ChatGPT

ChatGPT was used during development for:

* Architecture planning.
* Breaking the assignment into implementation phases.
* Debugging.
* Reviewing TypeScript and Next.js code.
* Designing the AI workflow.
* Reviewing API and validation logic.
* Refining the simulated backtesting approach.
* Reviewing documentation and project structure.

AI suggestions were reviewed and adapted during implementation rather than being treated as automatically correct.

---

# Project Structure

```text
ai-native-trading-research-platform/
│
├── client/
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── analyze/
│   │   │   │   │   └── route.ts
│   │   │   │   │
│   │   │   │   ├── experiment/
│   │   │   │   │   └── route.ts
│   │   │   │   │
│   │   │   │   └── backtest/
│   │   │   │       └── route.ts
│   │   │   │
│   │   │   └── page.tsx
│   │   │
│   │   └── lib/
│   │       ├── gemini.ts
│   │       ├── schemas.ts
│   │       ├── backtest.ts
│   │       └── mock-data.ts
│   │
│   ├── public/
│   ├── .env.local
│   ├── package.json
│   └── ...
│
└── README.md
```

---

# Environment Variables

Create a `.env.local` file inside the `client` directory:

```env
GEMINI_API_KEY=your_gemini_api_key
```

The API key should remain server-side and should not use a `NEXT_PUBLIC_` prefix.

Do not commit `.env.local` to Git.

---

# Getting Started

## 1. Clone the repository

```bash
git clone <your-repository-url>
cd ai-native-trading-research-platform
```

## 2. Install dependencies

```bash
cd client
npm install
```

## 3. Configure Gemini

Create:

```text
client/.env.local
```

Add:

```env
GEMINI_API_KEY=your_gemini_api_key
```

## 4. Start the development server

```bash
npm run dev
```

## 5. Open the application

Open the local URL displayed by the Next.js development server.

---

# Disclaimer

This project is an educational prototype demonstrating an AI-native trading research workflow.

It is **not financial advice**, a trading recommendation, or a production-grade backtesting platform.

The current prototype uses simulated market data. Results should not be interpreted as evidence of actual historical or future trading performance.
