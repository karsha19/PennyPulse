import { Pencil, Trash2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/format';

const TransactionRow = ({ transaction, onEdit, onDelete }) => {
  const isIncome = transaction.type === 'income';
  const category = transaction.Category;

  return (
    <div className="group flex items-center gap-4 border-b border-slate-100 px-4 py-3.5 transition-colors last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${category?.color || '#6366f1'}20`, color: category?.color || '#6366f1' }}
      >
        {isIncome ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{transaction.title}</p>
        <p className="text-xs text-slate-400">
          {category?.name || 'Uncategorized'} · {formatDate(transaction.date)}
        </p>
      </div>

      <p className={`text-sm font-bold ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
        {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
      </p>

      <div className="hidden shrink-0 items-center gap-1 group-hover:flex">
        <button onClick={() => onEdit(transaction)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-700">
          <Pencil size={15} />
        </button>
        <button onClick={() => onDelete(transaction)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950">
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

export default TransactionRow;
