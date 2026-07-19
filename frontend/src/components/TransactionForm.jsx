import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const initialState = {
  title: '',
  amount: '',
  type: 'expense',
  categoryId: '',
  date: new Date().toISOString().split('T')[0],
  notes: '',
};

const TransactionForm = ({ categories, initialData, onSubmit, onCancel, submitting }) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        amount: initialData.amount,
        type: initialData.type,
        categoryId: initialData.categoryId || initialData.Category?.id || '',
        date: initialData.date,
        notes: initialData.notes || '',
      });
    } else {
      setForm(initialState);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.amount || Number(form.amount) <= 0) errs.amount = 'Enter a valid amount';
    if (!form.categoryId) errs.categoryId = 'Select a category';
    if (!form.date) errs.date = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the highlighted fields');
      return;
    }
    onSubmit({ ...form, amount: Number(form.amount), categoryId: Number(form.categoryId) });
  };

  const filteredCategories = categories.filter((c) => c.type === form.type || c.type === 'both');

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setForm((p) => ({ ...p, type: 'expense', categoryId: '' }))}
          className={`rounded-xl border py-2.5 text-sm font-semibold transition-all ${
            form.type === 'expense'
              ? 'border-rose-500 bg-rose-50 text-rose-600 dark:bg-rose-950/40'
              : 'border-slate-200 text-slate-500 dark:border-slate-700'
          }`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => setForm((p) => ({ ...p, type: 'income', categoryId: '' }))}
          className={`rounded-xl border py-2.5 text-sm font-semibold transition-all ${
            form.type === 'income'
              ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40'
              : 'border-slate-200 text-slate-500 dark:border-slate-700'
          }`}
        >
          Income
        </button>
      </div>

      <div>
        <label className="label-text">Title</label>
        <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Grocery shopping" className="input-field" />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-text">Amount</label>
          <input name="amount" type="number" step="0.01" value={form.amount} onChange={handleChange} placeholder="0.00" className="input-field" />
          {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
        </div>
        <div>
          <label className="label-text">Date</label>
          <input name="date" type="date" value={form.date} onChange={handleChange} className="input-field" />
          {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
        </div>
      </div>

      <div>
        <label className="label-text">Category</label>
        <select name="categoryId" value={form.categoryId} onChange={handleChange} className="input-field">
          <option value="">Select category</option>
          {filteredCategories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {errors.categoryId && <p className="mt-1 text-xs text-red-500">{errors.categoryId}</p>}
      </div>

      <div>
        <label className="label-text">Notes (optional)</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Add a note..." className="input-field resize-none" />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
        <button type="submit" disabled={submitting} className="btn-primary flex-1">
          {submitting ? 'Saving...' : initialData ? 'Update' : 'Add Transaction'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
