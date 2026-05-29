import type { AtsAnalysis, ResumeFeedback } from "@/types";

export function ATSResultView({
  score,
  feedback,
}: {
  score: number;
  feedback: ResumeFeedback | AtsAnalysis;
}) {
  return (
    <div className="space-y-4">
      <div className="glass-card rounded-2xl p-6 text-center">
        <p className="font-mono text-xs uppercase text-on-surface-variant">
          ATS Score
        </p>
        <p className="mt-2 text-5xl font-bold text-primary">{score}</p>
      </div>
      <Section title="Missing keywords" items={feedback.missingKeywords} />
      <Section title="Strengths" items={feedback.strengths} />
      <Section title="Weaknesses" items={feedback.weaknesses} />
      <Section title="Suggestions" items={feedback.suggestions} />
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="glass-card rounded-2xl p-5">
      <h2 className="font-mono text-xs uppercase tracking-widest text-on-surface-variant">
        {title}
      </h2>
      <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-on-surface-variant">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
