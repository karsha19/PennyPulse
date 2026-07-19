const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 dark:bg-brand-900/30">
      <Icon size={28} />
    </div>
    <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">{title}</h3>
    <p className="mt-1 max-w-xs text-sm text-slate-400">{description}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
