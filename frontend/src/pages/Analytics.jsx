import { useEffect, useState } from 'react';
import { TrendingUp, Receipt, Award, Calculator } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import CategoryPieChart from '../components/CategoryPieChart';
import MonthlyBarChart from '../components/MonthlyBarChart';
import { StatCardSkeleton, ChartSkeleton } from '../components/Skeletons';
import PulseScoreCard from '../components/PulseScoreCard';
import MoodBreakdown from '../components/MoodBreakdown';
import { fetchAnalytics, fetchChartData } from '../api/endpoints';
import { formatCurrency } from '../utils/format';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAnalytics(), fetchChartData()])
      .then(([aRes, cRes]) => {
        setAnalytics(aRes.data.analytics);
        setCharts(cRes.data);
      })
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  const categoryPieData = analytics?.categoryBreakdown?.map((c) => ({
    name: c.name, value: c.total, color: c.color,
  })) || [];

  return (
    <DashboardLayout title="Analytics">
      <p className="mb-6 text-sm text-slate-400">Deep dive into your spending patterns</p>

      <div className="mb-6">
        <PulseScoreCard pulseScore={analytics?.pulseScore} loading={loading} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="Highest Spending Category"
              value={analytics?.highestSpendingCategory?.name || '—'}
              icon={Award}
              tone="amber"
              trend={analytics?.highestSpendingCategory ? formatCurrency(analytics.highestSpendingCategory.total) : ''}
            />
            <StatCard label="Total Transactions" value={analytics?.totalTransactions ?? 0} icon={Receipt} tone="brand" />
            <StatCard label="Avg. Monthly Spending" value={formatCurrency(analytics?.averageMonthlySpending)} icon={Calculator} tone="expense" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {loading ? <ChartSkeleton /> : <MonthlyBarChart data={charts?.barData || []} />}
        </div>
        <div className="lg:col-span-2 space-y-4">
          {loading ? <ChartSkeleton /> : <CategoryPieChart data={categoryPieData.length ? categoryPieData : charts?.pieData || []} />}
          {loading ? <ChartSkeleton /> : <MoodBreakdown data={analytics?.moodBreakdown || []} />}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
