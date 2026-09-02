import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, PiggyBank, BarChart3, Wallet, X } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/transactions', label: 'Transactions', icon: Receipt },
  { to: '/budgets', label: 'Budgets', icon: PiggyBank },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
];

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          'fixed z-40 flex h-full w-64 flex-col border-r border-slate-100 bg-white transition-transform dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-soft">
              <Wallet size={18} className="text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-800 dark:text-white">PennyPulse</span>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mx-4 mb-6 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-4 text-white shadow-soft">
          <p className="text-sm font-semibold">Track smarter</p>
          <p className="mt-1 text-xs text-brand-100">Set budgets and get warned before you overspend.</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
