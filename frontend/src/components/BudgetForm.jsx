import { useState } from 'react';
import toast from 'react-hot-toast';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const BudgetForm = ({ categories, month, year, onSubmit, onCancel, submitting }) => {
  const [form, setForm] = useState({ categoryId: '', amount: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.categoryId || !form.amount || Number(form.amount) <= 0) {
      toast.error('Select a category and enter a valid amount');
      return;
    }
    onSubmit({ categoryId: Number(form.categoryId), amount: Number(form.amount), month, year });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-slate-400">Setting budget for <span className="font-semibold text-slate-600 dark:text-slate-300">{months[month - 1]} {year}</span></p>
      <div>
        <label className="label-text">Category</label>
        <select
          value={form.categoryId}
          onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
          className="input-field"
        >
          <option value="">Select category</option>
          {categories.filter((c) => c.type !== 'income').map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label-text">Monthly Limit</label>
        <input
          type="number"
          step="0.01"
          value={form.amount}
          onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
          placeholder="0.00"
          className="input-field"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
        <button type="submit" disabled={submitting} className="btn-primary flex-1">
          {submitting ? 'Saving...' : 'Save Budget'}
        </button>
      </div>
    </form>
  );
};

export default BudgetForm;
