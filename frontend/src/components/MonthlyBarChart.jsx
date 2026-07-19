import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatCurrency } from '../utils/format';

const MonthlyBarChart = ({ data }) => {
  return (
    <div className="card p-5">
      <h3 className="mb-4 text-sm font-bold text-slate-700 dark:text-slate-200">Income vs Expense (Monthly)</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(value) => formatCurrency(value)} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
          <Legend iconType="circle" />
          <Bar dataKey="income" fill="#10b981" name="Income" radius={[6, 6, 0, 0]} />
          <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyBarChart;
