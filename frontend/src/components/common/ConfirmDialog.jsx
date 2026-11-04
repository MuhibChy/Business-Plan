import React from 'react'
import Modal from './Modal'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="flex items-start gap-4">
        <div
          className={`p-2.5 rounded-full shrink-0 ${
            danger ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm()
            onClose()
          }}
          className={`px-4 py-2 text-xs font-medium text-white rounded-lg transition-colors ${
            danger
              ? 'bg-rose-600 hover:bg-rose-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  )
}
