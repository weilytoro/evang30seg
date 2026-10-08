import React, { useState } from 'react';
import { X, PiggyBank, ArrowRight, DollarSign } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useToast } from '../../context/ToastContext';
import { FinancialGoal } from '../../types/finance';
import { formatCurrency } from '../../utils/formatters';

interface ContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: FinancialGoal | null;
}

export const ContributionModal: React.FC<ContributionModalProps> = ({
  isOpen,
  onClose,
  goal,
}) => {
  const { accounts = [], addContributionToGoal } = useFinance();
  const { success, error } = useToast();

  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState(accounts?.[0]?.id || '');
  const [localError, setLocalError] = useState('');

  if (!isOpen || !goal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const numAmount = parseFloat(amount.replace(',', '.'));
      if (isNaN(numAmount) || numAmount <= 0) {
        setLocalError('Informe um valor de aporte válido maior que zero.');
        error('Informe um valor de aporte válido.');
        return;
      }

      addContributionToGoal(goal.id, numAmount, accountId);
      success(`Aporte de ${formatCurrency(numAmount)} realizado com sucesso na meta "${goal.title}".`);
      onClose();
    } catch (err) {
      setLocalError('Falha ao registrar aporte.');
      error('Falha ao registrar aporte.');
    }
  };

  const selectedAcc = (accounts || [])?.find((a) => a?.id === accountId);
  const remaining = Math.max(0, (goal.targetAmount || 0) - (goal.currentAmount || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <PiggyBank className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Fazer Aporte na Meta
              </h3>
              <span className="text-[11px] text-slate-500">{goal.title}</span>
            </div>
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
          {/* Card Resumo da Meta */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500">Valor Já Acumulado:</span>
              <div className="font-bold text-slate-900 text-sm">
                {formatCurrency(goal.currentAmount || 0)}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500">Falta para Atingir:</span>
              <div className="font-bold text-emerald-600 text-sm">
                {formatCurrency(remaining)}
              </div>
            </div>
          </div>

          {/* Valor do Aporte */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Valor do Aporte (R$) *
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
          </div>

          {/* Conta de Origem */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Debitar da Conta:
            </label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              {(accounts || [])
                ?.filter((a) => a?.type !== 'credit_card')
                ?.map((a) => (
                  <option key={a?.id} value={a?.id}>
                    {a?.name} (Saldo: {formatCurrency(a?.balance || 0)})
                  </option>
                ))}
            </select>
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
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Confirmar Aporte</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
