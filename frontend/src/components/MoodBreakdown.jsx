import { MOOD_OPTIONS } from '../utils/mood';
import { formatCurrency } from '../utils/format';

const MoodBreakdown = ({ data = [] }) => {
  if (!data.length) {
    return (
      <div className="card p-5">
        <h3 className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-200">Emotional Spending</h3>
        <p className="text-xs text-slate-400">Tag expenses with a mood to see patterns here.</p>
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.total, 0);

  return (
    <div className="card p-5">
      <h3 className="mb-4 text-sm font-bold text-slate-700 dark:text-slate-200">Emotional Spending</h3>
      <div className="space-y-3">
        {data.map((item) => {
          const meta = MOOD_OPTIONS.find((m) => m.value === item.mood);
          const pct = total > 0 ? (item.total / total) * 100 : 0;
          return (
            <div key={item.mood}>
              <div className="mb-1 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <span>{meta?.emoji}</span>
                  {meta?.label || item.mood}
                  <span className="text-xs text-slate-400">({item.count})</span>
                </span>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{formatCurrency(item.total)}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: meta?.color || '#6366f1' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MoodBreakdown;
