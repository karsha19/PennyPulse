import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

const ConfirmDialog = ({ open, onClose, onConfirm, title = 'Are you sure?', message, loading }) => (
  <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
    <div className="flex flex-col items-center text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-950">
        <AlertTriangle size={22} />
      </div>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">{message}</p>
      <div className="flex w-full gap-3">
        <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
        <button onClick={onConfirm} disabled={loading} className="btn-danger flex-1 !bg-red-600 !text-white hover:!bg-red-700">
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  </Modal>
);

export default ConfirmDialog;
