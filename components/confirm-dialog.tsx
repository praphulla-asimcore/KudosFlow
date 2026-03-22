'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: 'danger' | 'warning';
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', variant = 'danger' }: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-full ${variant === 'danger' ? 'bg-red-100 text-danger' : 'bg-orange-100 text-warning'}`}>
                  <AlertTriangle size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{title ?? ''}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-6">{message ?? ''}</p>
              <div className="flex gap-3 justify-end">
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                  Cancel
                </button>
                <button
                  onClick={() => { onConfirm?.(); onClose?.(); }}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition ${
                    variant === 'danger' ? 'bg-danger hover:bg-red-600' : 'bg-warning hover:bg-amber-600'
                  }`}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
