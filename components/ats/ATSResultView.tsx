import type { AtsAnalysis, ResumeFeedback } from "@/types";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

export function ATSResultView({
  score,
  feedback,
}: {
  score: number;
  feedback: ResumeFeedback | AtsAnalysis;
}) {
  const radarData = feedback.radarMetrics ? [
    { subject: "Keywords", A: feedback.radarMetrics.keywordMatch, fullMark: 20 },
    { subject: "Projects", A: feedback.radarMetrics.projects, fullMark: 10 },
    { subject: "Skills", A: feedback.radarMetrics.skills, fullMark: 10 },
    { subject: "Impact", A: feedback.radarMetrics.impact, fullMark: 5 },
    { subject: "Format", A: feedback.radarMetrics.formatting, fullMark: 5 },
  ] : [];

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Score & Role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center">
          <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mb-2">
            Overall ATS Score
          </p>
          <ScoreRing score={score} size={120} />
        </div>
        
        {feedback.roleDetected && (
          <div className="glass-card rounded-2xl p-6 flex flex-col justify-center">
            <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mb-1">
              Role Detected
            </p>
            <h2 className="text-2xl font-bold text-primary mb-4">{feedback.roleDetected}</h2>
            
            <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mb-1">
              Role Alignment
            </p>
            <div className="flex items-center gap-3">
              <div className="h-3 flex-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-tertiary rounded-full" 
                  style={{ width: `${Math.round(((feedback.roleAlignmentScore || 0) / 30) * 100)}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-tertiary">
                {Math.round(((feedback.roleAlignmentScore || 0) / 30) * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Debug Panel (Temporary) */}
      {feedback.debugScores && (
        <div className="glass-card rounded-2xl p-5 border border-error/20">
          <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-error mb-4">
            <span className="material-symbols-outlined">bug_report</span>
            Role Classification Debug Scores
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(feedback.debugScores).sort((a,b) => b[1] - a[1]).map(([role, s]) => (
              <div key={role} className="flex justify-between items-center text-xs bg-black/20 p-2 rounded-lg">
                <span className="text-on-surface-variant truncate pr-2">{role}</span>
                <span className="text-on-surface font-mono bg-white/10 px-2 rounded">{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Advanced Metrics Row */}
      {feedback.resumeStrength && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricCard title="Strength" value={feedback.resumeStrength} icon="fitness_center" />
          <MetricCard title="Completeness" value={`${feedback.completeness}%`} icon="rule" />
          <MetricCard title="Tech Depth" value={`${feedback.technicalDepthScore} Tools`} icon="code" />
          <MetricCard title="Seniority" value={feedback.seniority || "Unknown"} icon="military_tech" />
        </div>
      )}

      {/* Main Charts & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar Chart */}
        {radarData.length > 0 && (
          <div className="glass-card rounded-2xl p-5 flex flex-col">
            <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-on-surface-variant mb-4">
              <span className="material-symbols-outlined text-primary">radar</span>
              Performance Radar
            </h2>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={false} axisLine={false} />
                  <Radar name="Score" dataKey="A" stroke="#c0c1ff" fill="#c0c1ff" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Priority Recommendations */}
        {feedback.recommendations && feedback.recommendations.length > 0 && (
          <div className="glass-card rounded-2xl p-5">
            <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-on-surface-variant mb-4">
              <span className="material-symbols-outlined text-tertiary">upgrade</span>
              Priority Skills To Learn
            </h2>
            <ul className="space-y-3">
              {feedback.recommendations.map((rec, i) => (
                <li key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-error/20 text-error flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium text-on-surface">{rec.skill}</span>
                  </div>
                  <span className="text-xs font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded-md">
                    +{rec.estimatedPointValue} ATS Pts
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Legacy/Detailed Breakdown */}
      {feedback.checklist && (
        <div className="glass-card rounded-2xl p-5">
           <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-on-surface-variant mb-4">
             <span className="material-symbols-outlined text-primary">fact_check</span>
             ATS Core Formatting
           </h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
             <CheckItem label="Email Included" passed={feedback.checklist.email} />
             <CheckItem label="Phone Included" passed={feedback.checklist.phone} />
             <CheckItem label="Professional Links" passed={feedback.checklist.links} />
             <CheckItem label="Action Verbs Used" passed={feedback.checklist.actionVerbs} />
             <CheckItem label="Quantified Impact" passed={feedback.checklist.quantifiedMetrics} />
           </div>
        </div>
      )}

    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string, value: string, icon: string }) {
  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col justify-center items-center text-center border border-white/5">
      <span className="material-symbols-outlined text-on-surface-variant mb-2">{icon}</span>
      <span className="text-xl font-bold text-on-surface">{value}</span>
      <span className="text-xs uppercase tracking-widest text-on-surface-variant mt-1">{title}</span>
    </div>
  );
}

function CheckItem({ label, passed }: { label: string, passed?: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm bg-white/5 p-2 rounded-lg border border-white/5">
      {passed ? (
        <span className="text-green-400 material-symbols-outlined text-sm">check_circle</span>
      ) : (
        <span className="text-red-400 material-symbols-outlined text-sm">cancel</span>
      )}
      <span className="text-on-surface-variant font-medium">{label}</span>
    </div>
  );
}

function ScoreRing({ score, size = 100 }: { score: number, size?: number }) {
  const radius = (size / 2) - 10;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;

  const strokeColor =
    clamped >= 80 ? "#4ade80"  // green
    : clamped >= 60 ? "#c0c1ff" // primary
    : clamped >= 40 ? "#f5ff7d" // yellow
    : "#ffb4ab"; // red

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={radius} className="score-ring-track" strokeWidth="8" />
        <circle
          cx={size/2}
          cy={size/2}
          r={radius}
          className="score-ring-progress"
          stroke={strokeColor}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold" style={{ color: strokeColor }}>
          {clamped}
        </span>
      </div>
    </div>
  );
}
