import React, { useEffect, useState } from 'react';
import { X, Target } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useToast } from '../../context/ToastContext';
import { Budget } from '../../types/finance';
import { DEFAULT_EXPENSE_CATEGORIES } from '../../utils/formatters';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgetToEdit?: Budget | null;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  budgetToEdit,
}) => {
  const { addBudget, updateBudget, budgets = [] } = useFinance();
  const { success, error } = useToast();

  const [category, setCategory] = useState((DEFAULT_EXPENSE_CATEGORIES?.[0]?.name) || 'Alimentação');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    try {
      if (budgetToEdit) {
        setCategory(budgetToEdit.category || DEFAULT_EXPENSE_CATEGORIES?.[0]?.name || 'Alimentação');
        setMonthlyLimit(budgetToEdit.monthlyLimit ? budgetToEdit.monthlyLimit.toString() : '');
      } else {
        const existing = (budgets || [])?.map((b) => b?.category);
        const available = (DEFAULT_EXPENSE_CATEGORIES || [])?.find((c) => !existing?.includes(c?.name));
        setCategory(available ? available.name : (DEFAULT_EXPENSE_CATEGORIES?.[0]?.name || 'Alimentação'));
        setMonthlyLimit('1500');
      }
      setLocalError('');
    } catch (err) {
      console.error(err);
    }
  }, [budgetToEdit, isOpen, budgets]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const numLimit = parseFloat(monthlyLimit.replace(',', '.'));
      if (isNaN(numLimit) || numLimit <= 0) {
        setLocalError('Informe um limite mensal válido maior que zero.');
        error('Informe um limite mensal válido maior que zero.');
        return;
      }

      if (budgetToEdit) {
        updateBudget(budgetToEdit.id, {
          category,
          monthlyLimit: numLimit,
        });
        success('Limite orçamentário atualizado.');
      } else {
        addBudget({
          category,
          monthlyLimit: numLimit,
        });
        success('Novo limite orçamentário adicionado.');
      }

      onClose();
    } catch (err) {
      setLocalError('Falha ao processar orçamento.');
      error('Falha ao processar orçamento.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              {budgetToEdit ? 'Editar Teto de Gasto' : 'Novo Teto de Gasto Mensal'}
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
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              {(DEFAULT_EXPENSE_CATEGORIES || [])?.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Limite Máximo de Gasto Mensal (R$) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-slate-400">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                placeholder="Ex: 1500,00"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                required
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
              {budgetToEdit ? 'Salvar Alterações' : 'Criar Teto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
