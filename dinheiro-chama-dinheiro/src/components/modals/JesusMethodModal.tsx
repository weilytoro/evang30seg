import React, { useState } from 'react';
import {
  X,
  HeartHandshake,
  Sparkles,
  Loader2,
  TrendingDown,
  Flame,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Scale,
  BookOpen,
} from 'lucide-react';
import { useMethodology } from '../../context/MethodologyContext';
import { formatCurrency } from '../../utils/formatters';
import { JesusDebtItem } from '../../types/methodology';

interface JesusMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PlanDebtItem {
  ordem: number;
  nome: string;
  valor: number;
  juros: number;
  motivoPsicologico?: string;
  economiaJuros?: string;
}

interface JesusPlanResult {
  bolaDeNeve: PlanDebtItem[];
  avalanche: PlanDebtItem[];
  comparativo: string;
  recomendacaoEstrategica: string;
  orientacaoEspiritual: string;
}

export const JesusMethodModal: React.FC<JesusMethodModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    jesusDebts,
    addJesusDebt,
    deleteJesusDebt,
    toggleDebtPaid,
    setDebtStrategy,
    debtStrategy,
    monthlyLiquidIncome,
    monthlyEssentialExpenses,
  } = useMethodology();

  // Local state for new debt form
  const [newDebtName, setNewDebtName] = useState('');
  const [newDebtValue, setNewDebtValue] = useState('');
  const [newDebtInterest, setNewDebtInterest] = useState('');
  const [newDebtCreditor, setNewDebtCreditor] = useState('');

  // AI loading and result states
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiPlan, setAiPlan] = useState<JesusPlanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeStrategyView, setActiveStrategyView] = useState<'bola_de_neve' | 'avalanche'>('bola_de_neve');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  if (!isOpen) return null;

  const totalDebtValue = (jesusDebts || [])
    ?.filter((d) => !d?.paid)
    ?.reduce((sum, d) => sum + (d?.totalAmount || 0), 0);

  const handleAddDebt = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newDebtValue.replace(',', '.'));
    const juros = parseFloat(newDebtInterest.replace(',', '.')) || 0;

    if (!newDebtName.trim() || isNaN(val) || val <= 0) {
      setErrorMessage('Por favor, insira o nome da dívida e um valor válido.');
      return;
    }

    addJesusDebt({
      creditor: newDebtCreditor.trim() || newDebtName.trim(),
      totalAmount: val,
      monthlyInterestRate: juros,
      installmentAmount: Math.round(val / 10),
      status: 'em_dia',
      type: 'consumo',
      attackOrder: jesusDebts.length + 1,
      paid: false,
    });

    setNewDebtName('');
    setNewDebtValue('');
    setNewDebtInterest('');
    setNewDebtCreditor('');
    setErrorMessage(null);
  };

  const handleGenerateAIPlan = async () => {
    if (jesusDebts.length === 0) {
      setErrorMessage('Adicione pelo menos uma dívida antes de gerar o plano de ataque.');
      return;
    }

    setIsLoadingAI(true);
    setErrorMessage(null);

    try {
      const payload = {
        debts: (jesusDebts || [])?.map((d) => ({
          name: d?.creditor || '',
          value: d?.totalAmount || 0,
          interestRate: d?.monthlyInterestRate || 0,
        })),
        monthlyLiquidIncome,
        monthlyEssentialExpenses,
      };

      const response = await fetch('/api/jesus-method/analyze-debts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Falha ao gerar plano com IA.');
      }

      setAiPlan(data.plan);
    } catch (err: any) {
      console.error('Erro na chamada IA do Método JESUS:', err);
      setErrorMessage(err.message || 'Erro ao conectar com o serviço de IA.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleApplyStrategy = (strategy: 'bola_de_neve' | 'avalanche') => {
    setDebtStrategy(strategy);
    setAppliedSuccess(true);
    setTimeout(() => setAppliedSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-rose-300">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black">
                  Método JESUS • Libertação de Dívidas
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-200 border border-rose-400/30">
                  IA Gemini
                </span>
              </div>
              <p className="text-xs text-rose-200">
                Ordem de ataque estratégico: Bola de Neve (motivação) & Avalanche (economia)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-rose-200 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 no-scrollbar text-slate-900">
          {/* Top Explanation & Acronym */}
          <div className="p-4 bg-rose-50/70 border border-rose-200/80 rounded-2xl text-xs space-y-2">
            <div className="font-bold text-rose-950 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-rose-600" />
              <span>O Princípio dos 5 Passos (Capítulo 4):</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              <strong>J</strong>ustificar dívidas • <strong>E</strong>liminar supérfluos • <strong>S</strong>ubstituir juros altos • <strong>U</strong>nificar e atacar em ordem • <strong>S</strong>ustentar a liberdade.
            </p>
            <div className="text-[11px] text-slate-600 pt-1 border-t border-rose-200/60 flex items-center justify-between">
              <span>Total de Dívidas Ativas: <strong className="text-rose-700 font-mono text-sm">{formatCurrency(totalDebtValue)}</strong></span>
              <span>Dívidas cadastradas: <strong>{jesusDebts.length}</strong></span>
            </div>
          </div>

          {/* Form to Insert New Debt */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Adicionar Dívida para o Plano
              </span>
              <span className="text-[11px] text-slate-500">Insira valores e taxas</span>
            </div>

            <form onSubmit={handleAddDebt} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Nome (ex: Cartão de Crédito Nubank)"
                  value={newDebtName}
                  onChange={(e) => setNewDebtName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Valor R$ (ex: 2500)"
                  value={newDebtValue}
                  onChange={(e) => setNewDebtValue(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Juros % a.m. (ex: 12.5)"
                  value={newDebtInterest}
                  onChange={(e) => setNewDebtInterest(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              <div className="sm:col-span-4 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar à Lista</span>
                </button>
              </div>
            </form>
          </div>

          {/* Current Debts List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Suas Dívidas Cadastradas ({jesusDebts.length})</span>
              <span className="text-[11px] text-slate-500">Marque como paga para celebrar a vitória</span>
            </div>

            {jesusDebts.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-xs text-slate-500">
                Nenhuma dívida cadastrada no momento. Insira acima para começar a estratégia!
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 no-scrollbar">
                {(jesusDebts || [])?.map((debt) => (
                  <div
                    key={debt.id}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                      debt.paid
                        ? 'bg-emerald-50/70 border-emerald-200 line-through opacity-70'
                        : 'bg-white border-slate-200/90 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        type="button"
                        onClick={() => toggleDebtPaid(debt.id)}
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          debt.paid
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 hover:border-emerald-500 text-transparent'
                        }`}
                        title={debt.paid ? 'Reabrir dívida' : 'Marcar como quitada'}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>

                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 truncate">
                          {debt.creditor}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2">
                          <span>Status: {debt.status === 'em_dia' ? 'Em dia' : 'Atrasada'}</span>
                          <span>•</span>
                          <span className="text-rose-600 font-semibold">Juros: {debt.monthlyInterestRate}% a.m.</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold font-mono text-slate-900 text-sm">
                        {formatCurrency(debt.totalAmount)}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteJesusDebt(debt.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg"
                        title="Remover"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Button: Generate AI Plan */}
          <div className="pt-2">
            <button
              onClick={handleGenerateAIPlan}
              disabled={isLoadingAI || jesusDebts.length === 0}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-md ${
                isLoadingAI || jesusDebts.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-500 hover:to-rose-600 text-white shadow-rose-600/20 active:scale-[0.99]'
              }`}
            >
              {isLoadingAI ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Estruturando Plano com o Cérebro da IA (Gemini)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span>Gerar Plano de Quitação com IA (Bola de Neve & Avalanche)</span>
                </>
              )}
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* AI Plan Presentation Area */}
          {aiPlan && (
            <div className="space-y-4 pt-4 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    Plano Personalizado do Método JESUS
                  </h3>
                  <p className="text-xs text-slate-500">
                    Gerado com sabedoria bíblica e rigor financeiro
                  </p>
                </div>

                {/* Strategy Tabs */}
                <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setActiveStrategyView('bola_de_neve')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      activeStrategyView === 'bola_de_neve'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Bola de Neve
                  </button>
                  <button
                    onClick={() => setActiveStrategyView('avalanche')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      activeStrategyView === 'avalanche'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Avalanche
                  </button>
                </div>
              </div>

              {/* Strategy Comparison Badge */}
              <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-indigo-900">
                  <Scale className="w-4 h-4" /> Comparativo Estratégico da IA:
                </div>
                <p className="leading-relaxed">{aiPlan.comparativo}</p>
                <div className="pt-1 text-[11px] font-semibold text-indigo-800">
                  Recomendação: {aiPlan.recomendacaoEstrategica}
                </div>
              </div>

              {/* Ordered Debt Attack Sequence */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  {activeStrategyView === 'bola_de_neve' ? (
                    <>
                      <Flame className="w-4 h-4 text-amber-500" />
                      <span>Ordem de Ataque: Bola de Neve (Menor Saldo Primeiro)</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 text-emerald-600" />
                      <span>Ordem de Ataque: Avalanche (Maior Juro Primeiro)</span>
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  {((activeStrategyView === 'bola_de_neve' ? aiPlan?.bolaDeNeve : aiPlan?.avalanche) || [])?.map(
                    (item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {item.ordem || idx + 1}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{item.nome}</div>
                            <div className="text-[11px] text-slate-500">
                              {item.motivoPsicologico || item.economiaJuros}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 sm:text-right pl-9 sm:pl-0">
                          <div>
                            <div className="font-bold font-mono text-slate-900">
                              {formatCurrency(item.valor)}
                            </div>
                            <div className="text-[10px] text-rose-600 font-semibold">
                              {item.juros}% a.m.
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Spiritual / Mindset Insight */}
              <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 text-xs space-y-1.5">
                <div className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5" /> Orientação de Sabedoria do Autor
                </div>
                <p className="italic text-slate-300 leading-relaxed font-serif">
                  "{aiPlan.orientacaoEspiritual}"
                </p>
                <div className="text-[10px] text-slate-400 pt-1">
                  — Weily Toro Machado, Livro "Dinheiro Chama Dinheiro"
                </div>
              </div>

              {/* Apply Strategy Button */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleApplyStrategy(activeStrategyView)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    Aplicar Estratégia {activeStrategyView === 'bola_de_neve' ? 'Bola de Neve' : 'Avalanche'} às Minhas Dívidas
                  </span>
                </button>
              </div>

              {appliedSuccess && (
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs text-center font-bold">
                  Estratégia aplicada com sucesso ao seu plano!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Metodologia Weily Toro Machado</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 font-semibold text-slate-700"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
