import React from 'react';
import {
  Target,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  PiggyBank,
  Sparkles,
  TrendingUp,
  Edit2,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Plane,
  Car,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { Budget, FinancialGoal } from '../../types/finance';
import { formatCurrency, formatDate, getCategoryMeta } from '../../utils/formatters';
import { useBudgetIntelligence } from '../../hooks/useBudgetIntelligence';
import { BudgetInsightsCard } from '../common/BudgetInsightsCard';

interface BudgetsGoalsViewProps {
  onOpenBudgetModal: () => void;
  onEditBudget: (b: Budget) => void;
  onOpenGoalModal: () => void;
  onEditGoal: (g: FinancialGoal) => void;
  onOpenContributionModal: (goal: FinancialGoal) => void;
}

export const BudgetsGoalsView: React.FC<BudgetsGoalsViewProps> = ({
  onOpenBudgetModal,
  onEditBudget,
  onOpenGoalModal,
  onEditGoal,
  onOpenContributionModal,
}) => {
  const { budgets, goals, categorySpendings, deleteBudget, deleteGoal, selectedMonth, transactions } =
    useFinance();

  // IA-powered budget insights
  const { insights, summary } = useBudgetIntelligence({
    budgets,
    transactions,
    currentMonth: selectedMonth,
  });

  return (
    <div className="space-y-8">
      {/* SECTION 0: IA-Powered Budget Insights */}
      {budgets.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Inteligência Orçamentária IA</h2>
          </div>
          <BudgetInsightsCard insights={insights} summary={summary} />
        </div>
      )}

      {/* SECTION 1: Orçamentos Mensais por Categoria */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                <Target className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Planejamento & Tetos de Gastos
              </h2>
            </div>
            <p className="text-xs text-slate-700 mt-1">
              Defina limites mensais para cada categoria e evite surpresas no final do mês
            </p>
          </div>

          <button
            onClick={onOpenBudgetModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Definir Novo Teto</span>
          </button>
        </div>

        {budgets.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Target className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-semibold text-slate-600">
              Nenhum teto de gasto orçamentário configurado.
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Crie limites para alimentação, moradia, lazer e monitore em tempo real.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(budgets || [])?.map((budget) => {
              const spent = (categorySpendings && categorySpendings[budget.category]) || 0;
              const percent = Math.min(100, (spent / budget.monthlyLimit) * 100);
              const isOver = spent > budget.monthlyLimit;
              const isWarning = !isOver && percent >= 80;
              const remaining = budget.monthlyLimit - spent;
              const meta = getCategoryMeta(budget.category, 'expense');

              return (
                <div
                  key={budget.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isOver
                      ? 'bg-rose-50/50 border-rose-300/80'
                      : isWarning
                      ? 'bg-amber-50/40 border-amber-300/80'
                      : 'bg-white border-slate-200/90'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: meta.color }}
                      />
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {budget.category}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditBudget(budget)}
                        className="p-1 text-slate-400 hover:text-emerald-600 rounded"
                        title="Editar limite"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Excluir o orçamento de "${budget.category}"?`)) {
                            deleteBudget(budget.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between">
                    <div className="text-xs text-slate-700">
                      Gasto:{' '}
                      <strong
                        className={`text-sm font-black ${
                          isOver ? 'text-rose-700' : isWarning ? 'text-amber-800' : 'text-slate-900'
                        }`}
                      >
                        {formatCurrency(spent)}
                      </strong>{' '}
                      / {formatCurrency(budget.monthlyLimit)}
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        isOver
                          ? 'text-rose-700'
                          : isWarning
                          ? 'text-amber-800'
                          : 'text-slate-700'
                      }`}
                    >
                      {percent.toFixed(0)}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2 w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOver
                          ? 'bg-rose-500'
                          : isWarning
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px]">
                    <span className="text-slate-700">
                      {isOver ? (
                        <span className="text-rose-800 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Estourou por {formatCurrency(Math.abs(remaining))}
                        </span>
                      ) : (
                        <span>
                          Resta gastar:{' '}
                          <strong className="text-emerald-800 font-bold">
                            {formatCurrency(remaining)}
                          </strong>
                        </span>
                      )}
                    </span>
                    <span className="text-slate-700 font-medium">Período ativo</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: Metas de Poupança & Sonhos */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <PiggyBank className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Metas Financeiras & Sonhos
              </h2>
            </div>
            <p className="text-xs text-slate-700 mt-1">
              Acompanhe sua reserva de emergência, viagens e conquistas financeiras
            </p>
          </div>

          <button
            onClick={onOpenGoalModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Criar Nova Meta</span>
          </button>
        </div>

        {goals.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <PiggyBank className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-semibold text-slate-600">
              Nenhuma meta cadastrada ainda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(goals || [])?.map((goal) => {
              const progress = Math.min(100, ((goal?.currentAmount || 0) / (goal?.targetAmount || 1)) * 100);
              const remaining = Math.max(0, (goal?.targetAmount || 0) - (goal?.currentAmount || 0));

              return (
                <div
                  key={goal.id}
                  className="p-5 rounded-2xl border border-slate-200/90 hover:shadow-md transition-all flex flex-col justify-between bg-white relative group"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                          style={{ backgroundColor: goal.color || '#10B981' }}
                        >
                          <PiggyBank className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 leading-snug">
                            {goal.title}
                          </h4>
                          <span className="text-[11px] text-slate-700">
                            {goal.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEditGoal(goal)}
                          className="p-1 text-slate-400 hover:text-emerald-600 rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Excluir a meta "${goal.title}"?`)) {
                              deleteGoal(goal.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-black text-slate-900">
                          {formatCurrency(goal.currentAmount)}
                        </span>
                        <span className="text-xs font-bold text-emerald-800">
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                      <div className="text-xs text-slate-700 mt-0.5">
                        Alvo: <strong>{formatCurrency(goal.targetAmount)}</strong>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-3 w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: goal.color || '#10B981',
                        }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-700">
                      <span>Faltam: {formatCurrency(remaining)}</span>
                      <span>Prazo: {formatDate(goal.deadline)}</span>
                    </div>
                  </div>

                  {/* Quick Contribution Button */}
                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => onOpenContributionModal(goal)}
                      className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Fazer Aporte</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
