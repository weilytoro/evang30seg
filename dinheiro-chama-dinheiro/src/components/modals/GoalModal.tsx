import React, { useEffect, useState } from 'react';
import { X, Target } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useToast } from '../../context/ToastContext';
import { FinancialGoal } from '../../types/finance';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalToEdit?: FinancialGoal | null;
}

const colorPalette = [
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#6366F1', // Indigo
  '#EF4444', // Red
];

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  goalToEdit,
}) => {
  const { addGoal, updateGoal } = useFinance();
  const { success, error } = useToast();

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('Segurança');
  const [color, setColor] = useState(colorPalette[0]);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    try {
      if (goalToEdit) {
        setTitle(goalToEdit?.title || '');
        setTargetAmount(goalToEdit?.targetAmount !== undefined ? goalToEdit.targetAmount.toString() : '');
        setCurrentAmount(goalToEdit?.currentAmount !== undefined ? goalToEdit.currentAmount.toString() : '0');
        setDeadline(goalToEdit?.deadline || '');
        setCategory(goalToEdit?.category || 'Segurança');
        setColor(goalToEdit?.color || colorPalette[0]);
      } else {
        setTitle('');
        setTargetAmount('');
        setCurrentAmount('0');
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        setDeadline(nextYear.toISOString().split('T')[0]);
        setCategory('Segurança');
        setColor(colorPalette[0]);
      }
      setLocalError('');
    } catch (err) {
      console.error(err);
    }
  }, [goalToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const numTarget = parseFloat(targetAmount.replace(',', '.'));
      const numCurrent = parseFloat(currentAmount.replace(',', '.')) || 0;

      if (!title.trim() || isNaN(numTarget) || numTarget <= 0) {
        setLocalError('Informe o título e o valor alvo da meta maior que zero.');
        error('Informe o título e o valor alvo da meta.');
        return;
      }

      const payload: Omit<FinancialGoal, 'id'> = {
        title: title.trim(),
        targetAmount: numTarget,
        currentAmount: numCurrent,
        deadline,
        category,
        color,
      };

      if (goalToEdit) {
        updateGoal(goalToEdit.id, payload);
        success('Meta financeira atualizada.');
      } else {
        addGoal(payload);
        success('Meta financeira criada com sucesso.');
      }

      onClose();
    } catch (err) {
      setLocalError('Falha ao processar meta financeira.');
      error('Falha ao processar meta financeira.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              {goalToEdit ? 'Editar Meta Financeira' : 'Nova Meta Financeira'}
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
              Título da Meta *
            </label>
            <input
              type="text"
              placeholder="Ex: Reserva de Emergência 6 Meses"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Valor Alvo (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Ex: 30000,00"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Valor Inicial Guardado (R$)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Data Limite Desejada
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                <option value="Segurança">Segurança / Emergência</option>
                <option value="Lazer">Lazer / Férias</option>
                <option value="Patrimônio">Patrimônio / Bens</option>
                <option value="Educação">Educação / Carreira</option>
                <option value="Aposentadoria">Aposentadoria</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Cor de Destaque
            </label>
            <div className="flex items-center gap-2">
              {(colorPalette || [])?.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                    color === c ? 'scale-110 border-slate-900 shadow-xs' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
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
              {goalToEdit ? 'Salvar Meta' : 'Criar Meta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
