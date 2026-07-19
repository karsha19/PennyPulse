import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import EmptyState from './EmptyState';
import { PieChart as PieIcon } from 'lucide-react';
import { formatCurrency } from '../utils/format';

const CategoryPieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="card p-5">
        <h3 className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-200">Spending by Category</h3>
        <EmptyState icon={PieIcon} title="No expenses yet" description="Add transactions to see your category breakdown." />
      </div>
    );
  }

  return (
    <div className="card p-5">
      <h3 className="mb-4 text-sm font-bold text-slate-700 dark:text-slate-200">Spending by Category</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
            {data.map((entry, idx) => (
              <Cell key={idx} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;
