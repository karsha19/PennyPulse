import clsx from 'clsx';

const StatCard = ({ label, value, icon: Icon, tone = 'brand', trend }) => {
  const tones = {
    brand: 'from-brand-500 to-brand-700',
    income: 'from-emerald-500 to-emerald-700',
    expense: 'from-rose-500 to-rose-700',
    amber: 'from-amber-400 to-amber-600',
  };

  return (
    <div className="card group relative overflow-hidden p-5 transition-transform hover:-translate-y-0.5">
      <div className={clsx('absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-10 transition-opacity group-hover:opacity-20', tones[tone])} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-800 dark:text-white">{value}</p>
          {trend && <p className="mt-1 text-xs font-medium text-slate-400">{trend}</p>}
        </div>
        <div className={clsx('flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-soft', tones[tone])}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
