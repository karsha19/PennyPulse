import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Download, FileText, Receipt, ArrowUpDown } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import TransactionForm from '../components/TransactionForm';
import TransactionRow from '../components/TransactionRow';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { RowSkeleton } from '../components/Skeletons';
import { useDebounce } from '../hooks/useDebounce';
import {
  fetchTransactions, createTransaction, updateTransaction, deleteTransaction,
  fetchCategories, exportCSVUrl, exportPDFUrl,
} from '../api/endpoints';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadCategories = useCallback(async () => {
    const res = await fetchCategories();
    setCategories(res.data.categories);
  }, []);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchTransactions({
        search: debouncedSearch,
        type: typeFilter,
        categoryId: categoryFilter,
        sortBy,
        sortOrder,
        page,
        limit: 10,
      });
      setTransactions(res.data.transactions);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, typeFilter, categoryFilter, sortBy, sortOrder, page]);

  useEffect(() => { loadCategories(); }, [loadCategories]);
  useEffect(() => { loadTransactions(); }, [loadTransactions]);
  useEffect(() => { setPage(1); }, [debouncedSearch, typeFilter, categoryFilter, sortBy, sortOrder]);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editing) {
        await updateTransaction(editing.id, data);
        toast.success('Transaction updated');
      } else {
        await createTransaction(data);
        toast.success('Transaction added');
      }
      setModalOpen(false);
      setEditing(null);
      loadTransactions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTransaction(deleteTarget.id);
      toast.success('Transaction deleted');
      setDeleteTarget(null);
      loadTransactions();
    } catch (err) {
      toast.error('Failed to delete transaction');
    } finally {
      setDeleting(false);
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((o) => (o === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      setSortBy(field);
      setSortOrder('DESC');
    }
  };

  return (
    <DashboardLayout title="Transactions">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-400">Manage all your income and expenses</p>
        <div className="flex flex-wrap gap-2">
          <a href={exportCSVUrl()} target="_blank" rel="noreferrer" className="btn-secondary !px-3.5">
            <Download size={15} /> CSV
          </a>
          <a href={exportPDFUrl()} target="_blank" rel="noreferrer" className="btn-secondary !px-3.5">
            <FileText size={15} /> PDF
          </a>
          <button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-primary">
            <Plus size={16} /> Add Transaction
          </button>
        </div>
      </div>

      <div className="card mb-5 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="input-field pl-10"
          />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input-field sm:w-40">
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input-field sm:w-44">
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button
          onClick={() => toggleSort(sortBy === 'date' ? 'amount' : 'date')}
          className="btn-secondary shrink-0"
          title="Toggle sort field"
        >
          <ArrowUpDown size={15} /> {sortBy === 'date' ? 'Date' : 'Amount'} ({sortOrder})
        </button>
      </div>

      <div className="card">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} />)
        ) : transactions.length > 0 ? (
          <>
            {transactions.map((t) => (
              <TransactionRow
                key={t.id}
                transaction={t}
                onEdit={(tx) => { setEditing(tx); setModalOpen(true); }}
                onDelete={(tx) => setDeleteTarget(tx)}
              />
            ))}
            <div className="px-4">
              <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={setPage} />
            </div>
          </>
        ) : (
          <EmptyState
            icon={Receipt}
            title="No transactions found"
            description="Try adjusting your filters or add a new transaction."
            action={<button onClick={() => setModalOpen(true)} className="btn-primary">Add Transaction</button>}
          />
        )}
      </div>

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title={editing ? 'Edit Transaction' : 'Add Transaction'}>
        <TransactionForm
          categories={categories}
          initialData={editing}
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setEditing(null); }}
          submitting={submitting}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        message={`Delete "${deleteTarget?.title}"? This action cannot be undone.`}
        loading={deleting}
      />
    </DashboardLayout>
  );
};

export default Transactions;
