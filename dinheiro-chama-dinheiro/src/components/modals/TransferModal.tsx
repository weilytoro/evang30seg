import React, { useState } from 'react';
import { X, ArrowRightLeft, Calendar } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose }) => {
  const { accounts = [], transferFunds } = useFinance();
  const { success, error } = useToast();

  const [fromAccountId, setFromAccountId] = useState(accounts?.[0]?.id || '');
  const [toAccountId, setToAccountId] = useState(accounts?.[1]?.id || accounts?.[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('Transferência entre Contas');
  const [localError, setLocalError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const numAmount = parseFloat(amount.replace(',', '.'));
      if (isNaN(numAmount) || numAmount <= 0) {
        setLocalError('Informe um valor de transferência válido maior que zero.');
        error('Informe um valor válido.');
        return;
      }
      if (fromAccountId === toAccountId) {
        setLocalError('Selecione contas de origem e destino diferentes.');
        error('Selecione contas de origem e destino diferentes.');
        return;
      }

      transferFunds(fromAccountId, toAccountId, numAmount, description.trim(), date);
      success('Transferência realizada com sucesso.');
      onClose();
    } catch (err) {
      setLocalError('Falha ao realizar transferência.');
      error('Falha ao realizar transferência.');
    }
  };

  const fromAcc = (accounts || [])?.find((a) => a?.id === fromAccountId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              Transferência entre Contas
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {localError && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs sm:text-sm">
          {/* Valor */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Valor da Transferência (R$) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-slate-400">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                required
              />
            </div>
            {fromAcc && (
              <span className="text-[11px] text-slate-500 mt-1 block">
                Saldo disponível na origem: <strong>{formatCurrency(fromAcc.balance)}</strong>
              </span>
            )}
          </div>

          {/* Origem e Destino */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                De (Conta de Origem)
              </label>
              <select
                value={fromAccountId}
                onChange={(e) => setFromAccountId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                {(accounts || [])?.map((a) => (
                  <option key={a?.id} value={a?.id}>
                    {a?.name} ({formatCurrency(a?.balance || 0)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Para (Conta de Destino)
              </label>
              <select
                value={toAccountId}
                onChange={(e) => setToAccountId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                {(accounts || [])
                  ?.filter((a) => a?.id !== fromAccountId)
                  ?.map((a) => (
                    <option key={a?.id} value={a?.id}>
                      {a?.name} ({formatCurrency(a?.balance || 0)})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Data & Descrição */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Data
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Identificação
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors"
            >
              Confirmar Transferência
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
