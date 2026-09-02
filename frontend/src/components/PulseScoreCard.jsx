import { Activity } from 'lucide-react';

const PulseScoreCard = ({ pulseScore, loading }) => {
  if (loading) {
    return (
      <div className="card p-5">
        <div className="skeleton h-32 w-full" />
      </div>
    );
  }

  if (!pulseScore) return null;

  const { score, label, color, breakdown } = pulseScore;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="card relative overflow-hidden p-5">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-10" style={{ backgroundColor: color }} />

      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          <svg width="120" height="120" className="-rotate-90">
            <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-100 dark:text-slate-800" />
            <circle
              cx="60" cy="60" r="54" fill="none"
              stroke={color} strokeWidth="10" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-slate-800 dark:text-white">{score}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Pulse</span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <Activity size={16} style={{ color }} />
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Pulse Score</span>
          </div>
          <p className="text-lg font-extrabold" style={{ color }}>{label}</p>
          <p className="mt-1 text-xs text-slate-400">Your financial wellness at a glance</p>

          <div className="mt-3 space-y-1.5">
            {[
              { label: 'Savings', value: breakdown.savings, max: 40 },
              { label: 'Budgets', value: breakdown.budgetAdherence, max: 35 },
              { label: 'Consistency', value: breakdown.consistency, max: 25 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="w-20 text-[10px] font-medium text-slate-400">{item.label}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all"
                    style={{ width: `${(item.value / item.max) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right text-[10px] font-semibold text-slate-500">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PulseScoreCard;
