import React, { useState } from 'react';
import {
  HeartHandshake,
  PlusCircle,
  Trash2,
  CheckCircle2,
  DollarSign,
  TrendingDown,
  PhoneCall,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  CircleCheck,
  AlertCircle,
} from 'lucide-react';
import { useMethodology } from '../../context/MethodologyContext';
import { useJourney } from '../../context/JourneyContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';
import { orderDebts, detectAppropriateDebtMethod } from '../../utils/debtOrder';
import { JesusMethodModal } from '../modals/JesusMethodModal';
import { getBrand } from '../../utils/brand';

export const JesusMethodView: React.FC = () => {
  const {
    jesusDebts = [],
    debtStrategy = 'combinada',
    setDebtStrategy,
    addJesusDebt,
    deleteJesusDebt,
    toggleDebtPaid,
    monthlyLiquidIncome = 0,
    setMonthlyLiquidIncome,
    monthlyEssentialExpenses = 0,
    setMonthlyEssentialExpenses,
    platformMode,
  } = useMethodology();

  const { success, error } = useToast();
  const brand = getBrand(platformMode);

  const [showAddDebtModal, setShowAddDebtModal] = useState(false);
  const [creditor, setCreditor] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [installment, setInstallment] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<'em_dia' | 'atrasada'>('em_dia');
  const [debtType, setDebtType] = useState<'consumo' | 'alavancagem'>('consumo');
  const [showJesusAIModal, setShowJesusAIModal] = useState(false);

  // Sobra calculada
  const realSurplus = (monthlyLiquidIncome || 0) - (monthlyEssentialExpenses || 0);

  // Total de dívidas ativas
  const totalDebtBalance = (jesusDebts || [])
    ?.filter((d) => !d?.paid)
    ?.reduce((sum, d) => sum + (d?.totalAmount || 0), 0);

  // Detecção Inteligente de Estratégia de Pagamento (Bola de Neve vs Avalanche)
  const detectedMethod = detectAppropriateDebtMethod(jesusDebts);

  // Sorting based on strategy using pure function orderDebts
  const orderedList = orderDebts(jesusDebts, debtStrategy);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const numAmount = parseFloat(totalAmount.replace(',', '.'));
      const numInterest = parseFloat(interestRate.replace(',', '.')) || 0;
      const numInstallment = parseFloat(installment.replace(',', '.')) || 0;

      if (!creditor.trim() || isNaN(numAmount) || numAmount <= 0) {
        error('Informe o credor e o valor total devido.');
        return;
      }

      addJesusDebt({
        creditor: creditor.trim(),
        totalAmount: numAmount,
        monthlyInterestRate: numInterest,
        installmentAmount: numInstallment,
        dueDate: dueDate.trim() || undefined,
        status,
        type: debtType,
      });

      success('Dívida adicionada à estratégia de libertação.');
      // Form reseta para "Em dia" e "Consumo"
      setCreditor('');
      setTotalAmount('');
      setInterestRate('');
      setInstallment('');
      setDueDate('');
      setStatus('em_dia');
      setDebtType('consumo');
      setShowAddDebtModal(false);
    } catch (err) {
      console.error(err);
      error('Ocorreu um erro ao salvar a dívida.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-600 text-white flex items-center justify-center shadow-md shadow-rose-600/20">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-rose-800 tracking-wider">
                Módulo 4 · Libertação
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                Método JESUS & Ordem de Ataque às Dívidas
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowJesusAIModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simulador Inteligente JESUS</span>
            </button>

            <button
              onClick={() => setShowAddDebtModal(true)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nova Dívida</span>
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 mt-4 leading-relaxed">
          O Método JESUS foi desenvolvido pelo Prof. Weily Toro para transformar o desespero do
          endividamento em um plano metódico de libertação: <strong>J</strong>untar informações,{' '}
          <strong>E</strong>stabelecer capacidade de pagamento, <strong>S</strong>olucionar com
          bens ou serviços, <strong>U</strong>nificar novas fontes de renda e <strong>S</strong>
          ustentar o progresso.
        </p>

        {brand.isBiblical && (
          <div className="mt-4 p-3 bg-slate-50 border-l-4 border-amber-500 rounded-r-xl text-xs text-slate-700 italic">
            &ldquo;O rico domina sobre o pobre, e o que toma emprestado é servo do que
            empresta.&rdquo;
            <span className="block mt-0.5 font-bold not-italic text-slate-900">— Provérbios 22,7</span>
          </div>
        )}
      </div>

      {/* Detecção Inteligente: Bola de Neve vs Avalanche (Design Branco e Dourado) */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-amber-300 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0 shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80 inline-block">
                Diagnóstico de Estratégia de Quitação
              </span>
              <h3 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
                Método Detectado: {detectedMethod.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {debtStrategy === detectedMethod.recommendedStrategy ? (
              <span className="px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                <span>Estratégia Recomendada Ativa</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setDebtStrategy(detectedMethod.recommendedStrategy);
                  success(`Estratégia alterada para ${detectedMethod.title}!`);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Aplicar {detectedMethod.title}</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed font-medium bg-amber-50/50 p-3 rounded-xl border border-amber-200/60">
          <strong>Por que esta indicação?</strong> {detectedMethod.explanation}
        </p>
      </div>

      {/* Cards de Métricas e Capacidade de Pagamento */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total de Dívidas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <span>Dívidas em Aberto (J)</span>
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600">
            {formatCurrency(totalDebtBalance)}
          </div>
          <span className="text-[11px] text-slate-400">
            {jesusDebts.filter((d) => !d.paid).length} pendência(s) ativa(s)
          </span>
        </div>

        {/* Renda Líquida Mensal */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <span>Renda Líquida (E)</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold">R$</span>
            <input
              type="number"
              value={monthlyLiquidIncome || ''}
              onChange={(e) => setMonthlyLiquidIncome(parseFloat(e.target.value) || 0)}
              placeholder="0,00"
              className="text-xl font-black text-slate-900 w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded px-1 bg-slate-50"
            />
          </div>
          <span className="text-[11px] text-slate-400">Base para capacidade de pagamento</span>
        </div>

        {/* Despesas Essenciais */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <span>Despesas Essenciais (E)</span>
            <DollarSign className="w-4 h-4 text-slate-500" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold">R$</span>
            <input
              type="number"
              value={monthlyEssentialExpenses || ''}
              onChange={(e) => setMonthlyEssentialExpenses(parseFloat(e.target.value) || 0)}
              placeholder="0,00"
              className="text-xl font-black text-slate-900 w-full focus:outline-none focus:ring-1 focus:ring-slate-900 rounded px-1 bg-slate-50"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
            <span className="text-slate-500">Sobra para ataque:</span>
            <span
              className={`font-black ${
                realSurplus > 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {formatCurrency(realSurplus)}
            </span>
          </div>
        </div>
      </div>

      {/* Lista e Ordem de Ataque */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Ordem de Ataque às Pendências Financeiras
            </h3>
            <p className="text-xs text-slate-500">
              Selecione a estratégia recomendada pelo livro para ordenar seus credores
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setDebtStrategy('combinada')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                debtStrategy === 'combinada'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Combinada (Mateus)
            </button>
            <button
              onClick={() => setDebtStrategy('bola_de_neve')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                debtStrategy === 'bola_de_neve'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Menor saldo primeiro para vitórias rápidas"
            >
              Bola de Neve
            </button>
            <button
              onClick={() => setDebtStrategy('avalanche')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                debtStrategy === 'avalanche'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Maior taxa de juros primeiro para estancar a sangria"
            >
              Avalanche
            </button>
          </div>
        </div>

        {/* Empty state when no debts */}
        {orderedList.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
            <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 text-slate-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900">
                Nenhuma dívida listada no momento
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Cadastre todas as suas pendências financeiras, com credor e taxa de juros,
                para que o sistema trace o diagnóstico exato de ataque (Bola de Neve ou Avalanche).
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddDebtModal(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Cadastrar Primeira Dívida</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                  <th className="py-2.5 px-3 w-16 text-center">Posição</th>
                  <th className="py-2.5 px-3">Credor & Motivo</th>
                  <th className="py-2.5 px-3 text-right">Valor Total</th>
                  <th className="py-2.5 px-3 text-right">Juros (a.m.)</th>
                  <th className="py-2.5 px-3 text-right">Parcela</th>
                  <th className="py-2.5 px-3 text-center">Vencimento</th>
                  <th className="py-2.5 px-3 text-center">Situação</th>
                  <th className="py-2.5 px-3 text-center w-28">Status / Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orderedList.map((debt, index) => {
                  const isPaid = debt?.paid;
                  return (
                    <tr
                      key={debt.id}
                      className={`transition-colors ${
                        isPaid ? 'bg-emerald-50/50 opacity-60' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3 px-3 text-center font-black">
                        <span
                          className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs ${
                            debt.attackPosition === 1 && !isPaid
                              ? 'bg-rose-600 text-white shadow-xs'
                              : debt.attackPosition
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isPaid ? '✓' : debt.attackPosition ? `${debt.attackPosition}º` : '-'}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`font-bold ${isPaid ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                            {debt.creditor}
                          </span>
                          {debt.attackPosition === 1 && !isPaid && (
                            <span className="text-[10px] font-black uppercase bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">
                              Alvo Atual
                            </span>
                          )}
                        </div>
                        {/* Motivo abaixo do nome */}
                        <p className="text-[11px] text-slate-500 mt-0.5">{debt.attackReason}</p>
                      </td>

                      <td className="py-3 px-3 text-right font-black text-rose-600">
                        {formatCurrency(debt.totalAmount)}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-slate-700">
                        {debt.monthlyInterestRate}%
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-slate-700">
                        {debt.installmentAmount ? formatCurrency(debt.installmentAmount) : '-'}
                      </td>
                      <td className="py-3 px-3 text-center font-medium text-slate-600">
                        {debt.dueDate || '-'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            debt.status === 'atrasada'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {debt.status === 'atrasada' ? 'Atrasada' : 'Em Dia'}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => toggleDebtPaid(debt.id)}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isPaid
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800'
                            }`}
                            title={isPaid ? 'Marcar como não paga' : 'Marcar como quitada'}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteJesusDebt(debt.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Excluir dívida"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Debt Modal */}
      {showAddDebtModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Cadastrar Nova Pendência</h3>
              <button
                type="button"
                onClick={() => setShowAddDebtModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Credor / Instituição *
                </label>
                <input
                  type="text"
                  value={creditor}
                  onChange={(e) => setCreditor(e.target.value)}
                  placeholder="Ex.: Cartão Nubank, Cheque Itaú, Empréstimo..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Valor Total (R$) *
                  </label>
                  <input
                    type="text"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    placeholder="Ex.: 1850,00"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Juros ao mês (% a.m.)
                  </label>
                  <input
                    type="text"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="Ex.: 14.5"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Valor da Parcela (R$)
                  </label>
                  <input
                    type="text"
                    value={installment}
                    onChange={(e) => setInstallment(e.target.value)}
                    placeholder="Ex.: 220,00"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Data de Vencimento
                  </label>
                  <input
                    type="text"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    placeholder="Ex.: Dia 10 ou 10/10"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Situação</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'em_dia' | 'atrasada')}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="em_dia">Em Dia</option>
                    <option value="atrasada">Atrasada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo</label>
                  <select
                    value={debtType}
                    onChange={(e) => setDebtType(e.target.value as 'consumo' | 'alavancagem')}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="consumo">Consumo</option>
                    <option value="alavancagem">Alavancagem</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDebtModal(false)}
                  className="px-4 py-2.5 text-xs text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Salvar Pendência
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Simulation Modal */}
      <JesusMethodModal
        isOpen={showJesusAIModal}
        onClose={() => setShowJesusAIModal(false)}
      />
    </div>
  );
};
