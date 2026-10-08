import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => (prev ? prev.filter((t) => t.id !== id) : []));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...(prev || []), { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const success = useCallback((msg: string) => showToast(msg, 'success'), [showToast]);
  const error = useCallback((msg: string) => showToast(msg, 'error'), [showToast]);
  const info = useCallback((msg: string) => showToast(msg, 'info'), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}
      {/* Toast Notification Container (Apple / Notion Minimalist Style) */}
      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
        aria-live="polite"
      >
        {(toasts || [])?.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-lg text-xs font-medium transition-all transform animate-in slide-in-from-bottom-2 duration-200 ${
              t.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : t.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {t.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
              {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
              {t.type === 'info' && <Info className="w-4 h-4 text-slate-500 flex-shrink-0" />}
              <span className="truncate leading-relaxed">{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
              aria-label="Fechar notificação"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback if invoked outside provider to avoid crashes
    return {
      showToast: (msg: string) => console.log(msg),
      success: (msg: string) => console.log(msg),
      error: (msg: string) => console.error(msg),
      info: (msg: string) => console.log(msg),
    };
  }
  return context;
};
