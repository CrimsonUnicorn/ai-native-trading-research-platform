import { useState } from "react";

interface ClarificationField {
  key: string;
  label: string;
  type: "text" | "select";
  options?: string[];
}

interface ClarificationCardProps {
  fields: ClarificationField[];
  onSubmit: (answers: Record<string, string>) => void;
}

export default function ClarificationCard({
  fields,
  onSubmit,
}: ClarificationCardProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    setAnswers((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    const unanswered = fields.some(
      (field) => !answers[field.key]?.trim(),
    );

    if (unanswered) {
      return;
    }

    onSubmit(answers);
  };

  return (
    <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          A few details are needed
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Answer these questions so we can define a testable experiment.
        </p>
      </div>

      <div className="space-y-6">
        {fields.map((field) => (
          <div key={field.key}>
            <label
              htmlFor={field.key}
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              {field.label}
            </label>

            {field.type === "select" ? (
              <select
                id={field.key}
                value={answers[field.key] ?? ""}
                onChange={(event) =>
                  handleChange(field.key, event.target.value)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
              >
                <option value="">Select an option</option>

                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={field.key}
                type="text"
                value={answers[field.key] ?? ""}
                onChange={(event) =>
                  handleChange(field.key, event.target.value)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
              />
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="mt-8 w-full rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-200"
      >
        Build Experiment
      </button>
    </div>
  );
}