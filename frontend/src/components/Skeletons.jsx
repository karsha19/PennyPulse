export const StatCardSkeleton = () => (
  <div className="card p-5">
    <div className="skeleton mb-3 h-3 w-20" />
    <div className="skeleton mb-2 h-7 w-28" />
    <div className="skeleton h-3 w-16" />
  </div>
);

export const RowSkeleton = () => (
  <div className="flex items-center gap-4 border-b border-slate-100 px-4 py-3.5 dark:border-slate-800">
    <div className="skeleton h-9 w-9 rounded-full" />
    <div className="flex-1">
      <div className="skeleton mb-2 h-3.5 w-1/3" />
      <div className="skeleton h-3 w-1/5" />
    </div>
    <div className="skeleton h-4 w-16" />
  </div>
);

export const ChartSkeleton = () => (
  <div className="card flex h-72 items-center justify-center p-5">
    <div className="skeleton h-full w-full" />
  </div>
);
