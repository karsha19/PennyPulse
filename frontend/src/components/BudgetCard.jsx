import { Trash2, AlertTriangle, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../utils/format';

const BudgetCard = ({ budget, onDelete }) => {
  const { category, amount, spent, percentage, exceeded, projectedSpend, paceWarning } = budget;

  const barColor = exceeded ? 'bg-red-500' : percentage > 80 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold"
            style={{ backgroundColor: `${category?.color}20`, color: category?.color }}
          >
            {category?.name?.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-white">{category?.name}</p>
            <p className="text-xs text-slate-400">{formatCurrency(spent)} of {formatCurrency(amount)}</p>
          </div>
        </div>
        <button onClick={() => onDelete(budget)} className="rounded-lg p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950">
          <Trash2 size={15} />
        </button>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">{percentage}% used</span>
        {exceeded && (
          <span className="flex items-center gap-1 text-xs font-semibold text-red-500">
            <AlertTriangle size={13} /> Over budget
          </span>
        )}
      </div>

      {paceWarning && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-900 dark:bg-amber-950/40">
          <TrendingUp size={14} className="mt-0.5 shrink-0 text-amber-600" />
          <div>
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Pace warning</p>
            <p className="text-xs text-amber-600 dark:text-amber-500">
              On track to spend {formatCurrency(projectedSpend)} by month end
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetCard;
