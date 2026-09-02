import { useEffect, useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Receipt, Plus } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import CategoryPieChart from '../components/CategoryPieChart';
import MonthlyBarChart from '../components/MonthlyBarChart';
import TransactionRow from '../components/TransactionRow';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import TransactionForm from '../components/TransactionForm';
import { StatCardSkeleton, RowSkeleton, ChartSkeleton } from '../components/Skeletons';
import PulseScoreCard from '../components/PulseScoreCard';
import { fetchSummary, fetchChartData, fetchCategories, createTransaction } from '../api/endpoints';
import { formatCurrency } from '../utils/format';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [summaryRes, chartsRes, catRes] = await Promise.all([
        fetchSummary(),
        fetchChartData(),
        fetchCategories(),
      ]);
      setSummary(summaryRes.data.summary);
      setCharts(chartsRes.data);
      setCategories(catRes.data.categories);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddTransaction = async (data) => {
    setSubmitting(true);
    try {
      await createTransaction(data);
      toast.success('Transaction added');
      setModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add transaction');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Dashboard">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-slate-400">Here's your financial overview</p>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={16} /> Add Transaction
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Total Balance" value={formatCurrency(summary?.totalBalance)} icon={Wallet} tone="brand" />
            <StatCard label="Total Income" value={formatCurrency(summary?.totalIncome)} icon={TrendingUp} tone="income" />
            <StatCard label="Total Expenses" value={formatCurrency(summary?.totalExpenses)} icon={TrendingDown} tone="expense" />
            <StatCard label="Savings" value={formatCurrency(summary?.savings)} icon={PiggyBank} tone="amber" />
          </>
        )}
      </div>

      <div className="mb-6">
        <PulseScoreCard pulseScore={summary?.pulseScore} loading={loading} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {loading ? <ChartSkeleton /> : <MonthlyBarChart data={charts?.barData || []} />}
        </div>
        <div className="lg:col-span-2">
          {loading ? <ChartSkeleton /> : <CategoryPieChart data={charts?.pieData || []} />}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Recent Transactions</h3>
          <Link to="/transactions" className="text-xs font-semibold text-brand-600 hover:underline">View all</Link>
        </div>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
        ) : summary?.recentTransactions?.length > 0 ? (
          summary.recentTransactions.map((t) => <TransactionRow key={t.id} transaction={t} onEdit={() => {}} onDelete={() => {}} />)
        ) : (
          <EmptyState
            icon={Receipt}
            title="No transactions yet"
            description="Start by adding your first income or expense."
            action={<button onClick={() => setModalOpen(true)} className="btn-primary">Add Transaction</button>}
          />
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Transaction">
        <TransactionForm categories={categories} onSubmit={handleAddTransaction} onCancel={() => setModalOpen(false)} submitting={submitting} />
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
