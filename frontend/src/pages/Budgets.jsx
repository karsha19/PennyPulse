import { useEffect, useState, useCallback } from 'react';
import { Plus, PiggyBank, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import BudgetForm from '../components/BudgetForm';
import BudgetCard from '../components/BudgetCard';
import EmptyState from '../components/EmptyState';
import { StatCardSkeleton } from '../components/Skeletons';
import { fetchBudgets, setBudget, deleteBudget, fetchCategories } from '../api/endpoints';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const Budgets = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchBudgets({ month, year });
      setBudgets(res.data.budgets);
    } catch (err) {
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchCategories().then((res) => setCategories(res.data.categories));
  }, []);

  useEffect(() => { loadBudgets(); }, [loadBudgets]);

  const changeMonth = (delta) => {
    let m = month + delta;
    let y = year;
    if (m > 12) { m = 1; y += 1; }
    if (m < 1) { m = 12; y -= 1; }
    setMonth(m);
    setYear(y);
  };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      await setBudget(data);
      toast.success('Budget saved');
      setModalOpen(false);
      loadBudgets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save budget');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteBudget(deleteTarget.id);
      toast.success('Budget removed');
      setDeleteTarget(null);
      loadBudgets();
    } catch (err) {
      toast.error('Failed to delete budget');
    } finally {
      setDeleting(false);
    }
  };

  const anyExceeded = budgets.some((b) => b.exceeded);
  const anyPaceWarning = budgets.some((b) => b.paceWarning);

  return (
    <DashboardLayout title="Budgets">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => changeMonth(-1)} className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
            <ChevronLeft size={16} />
          </button>
          <span className="min-w-[140px] text-center text-sm font-semibold text-slate-700 dark:text-slate-200">
            {monthNames[month - 1]} {year}
          </span>
          <button onClick={() => changeMonth(1)} className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
            <ChevronRight size={16} />
          </button>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={16} /> Set Budget
        </button>
      </div>

      {anyExceeded && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
          ⚠️ You've exceeded the budget in one or more categories this month.
        </div>
      )}

      {anyPaceWarning && !anyExceeded && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400">
          📈 At your current spending pace, you may exceed one or more budgets before month end.
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
      ) : budgets.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {budgets.map((b) => <BudgetCard key={b.id} budget={b} onDelete={setDeleteTarget} />)}
        </div>
      ) : (
        <div className="card">
          <EmptyState
            icon={PiggyBank}
            title="No budgets set for this month"
            description="Set monthly spending limits for your categories to stay on track."
            action={<button onClick={() => setModalOpen(true)} className="btn-primary">Set Budget</button>}
          />
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Set Monthly Budget">
        <BudgetForm categories={categories} month={month} year={year} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} submitting={submitting} />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        message={`Remove budget for "${deleteTarget?.category?.name}"?`}
        loading={deleting}
      />
    </DashboardLayout>
  );
};

export default Budgets;
