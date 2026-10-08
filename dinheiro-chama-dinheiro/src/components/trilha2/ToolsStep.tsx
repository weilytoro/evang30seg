import React, { useState } from 'react';
import {
  Calculator,
  Calendar,
  DollarSign,
  PieChart,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Trash2,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';
import { formatCurrency } from '../../utils/formatters';
import { calculateCashflow, calculateDRE, calculatePrice } from '../../utils/bizCalc';

interface ToolsStepProps {
  onAdvanceToStep4: () => void;
}

export const ToolsStep: React.FC<ToolsStepProps> = ({ onAdvanceToStep4 }) => {
  const {
    proLaboreMonthly,
    proLaborePaymentDay,
    dreFaturamento,
    setDreFaturamento,
    dreImpostosPerc,
    setDreImpostosPerc,
    dreCustosDiretos,
    setDreCustosDiretos,
    dreDespesasFixas,
    setDreDespesasFixas,
    dreMesReferencia,
    setDreMesReferencia,
    dreClosedMonths,
    closeDREMonth,

    cashflowInitialBalance,
    setCashflowInitialBalance,
    cashflowEntries,
    addCashflowEntry,
    deleteCashflowEntry,
    cashflowConfirmed,
    setCashflowConfirmed,

    savedPrices,
    savePriceItem,
    deletePriceItem,

    reserveSavedAmount,
    setReserveSavedAmount,
    reserveGoalAccepted,
    setReserveGoalAccepted,
  } = useJourney();

  const [activeTab, setActiveTab] = useState<'dre' | 'fluxo' | 'preco' | 'reserva'>('dre');

  // Formação de Preço Form Local State
  const [productName, setProductName] = useState('');
  const [directCost, setDirectCost] = useState('10');
  const [overheadPerc, setOverheadPerc] = useState('20');
  const [marginPerc, setMarginPerc] = useState('30');
  const [taxPerc, setTaxPerc] = useState('6');

  // Fluxo de Caixa Entry Form Local State
  const todayStr = new Date().toISOString().split('T')[0];
  const [entryDate, setEntryDate] = useState(todayStr);
  const [entryType, setEntryType] = useState<'entrada' | 'saida'>('entrada');
  const [entryDesc, setEntryDesc] = useState('');
  const [entryAmount, setEntryAmount] = useState('');

  // 1. DRE Calculation
  const dreResult = calculateDRE(
    dreFaturamento,
    dreImpostosPerc,
    dreCustosDiretos,
    dreDespesasFixas,
    proLaboreMonthly
  );

  const isDreDone = dreClosedMonths.length > 0;

  // 2. Cashflow Calculation
  const cashflowResult = calculateCashflow(cashflowInitialBalance, cashflowEntries, todayStr);
  const hasEntradaInWindow = cashflowResult.items.some((i) => i.type === 'entrada');
  const hasSaidaInWindow = cashflowResult.items.some((i) => i.type === 'saida');
  const isCashflowDone = cashflowConfirmed && hasEntradaInWindow && hasSaidaInWindow;

  // 3. Pricing Calculation
  const priceResult = calculatePrice(
    parseFloat(directCost.replace(',', '.')) || 0,
    parseFloat(overheadPerc.replace(',', '.')) || 0,
    parseFloat(marginPerc.replace(',', '.')) || 0,
    parseFloat(taxPerc.replace(',', '.')) || 0
  );
  const isPricingDone = savedPrices.length > 0;

  // 4. Reserve Calculation
  const targetReserve = (dreDespesasFixas || 0) * 3;
  const reserveMonths = dreDespesasFixas > 0 ? reserveSavedAmount / dreDespesasFixas : 0;
  const reserveProgressPerc =
    targetReserve > 0 ? Math.min(100, (reserveSavedAmount / targetReserve) * 100) : 0;
  const isReserveDone = reserveGoalAccepted;

  // All 4 tools completed check
  const allToolsCompleted = isDreDone && isCashflowDone && isPricingDone && isReserveDone;

  const handleCloseDRE = () => {
    closeDREMonth(
      dreMesReferencia,
      dreResult.lucroLiquido,
      dreResult.faturamentoBruto,
      proLaboreMonthly
    );
  };

  const handleAddCashflowEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(entryAmount.replace(',', '.'));
    if (!entryDesc.trim() || isNaN(val) || val <= 0) return;

    addCashflowEntry({
      date: entryDate,
      type: entryType,
      description: entryDesc.trim(),
      amount: val,
    });

    setEntryDesc('');
    setEntryAmount('');
  };

  const handleIncludeProLaboreInCashflow = () => {
    const today = new Date();
    let targetPaymentDate = new Date(today.getFullYear(), today.getMonth(), proLaborePaymentDay);
    if (targetPaymentDate < today) {
      targetPaymentDate = new Date(today.getFullYear(), today.getMonth() + 1, proLaborePaymentDay);
    }
    const dateFormatted = targetPaymentDate.toISOString().split('T')[0];

    addCashflowEntry({
      date: dateFormatted,
      type: 'saida',
      description: `Retirada de Pró-labore (${proLaborePaymentDay}º dia)`,
      amount: proLaboreMonthly,
    });
  };

  const handleSavePrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !priceResult.isValid) return;

    savePriceItem({
      productName: productName.trim(),
      directCost: priceResult.custoDireto,
      fixedOverheadPerc: priceResult.rateioFixoPerc,
      marginPerc: priceResult.margemLucroPerc,
      taxPerc: priceResult.impostosPerc,
      finalPrice: priceResult.precoFinal,
    });

    setProductName('');
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6 animate-in fade-in duration-200">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Etapa 3 · Ferramentas Técnicas de Gestão
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
          A Base Numérica para Decisões Profissionais
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Conclua as 4 ferramentas fundamentais para certificar que a fundação financeira da empresa
          está sólida antes de avançar para gargalos de mercado e processos.
        </p>
      </div>

      {/* Tabs of 4 Tools */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-slate-100 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab('dre')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'dre'
              ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-mono">1. DRE</span>
            {isDreDone ? (
              <span className="text-[10px] font-bold text-emerald-400">Feito ✓</span>
            ) : (
              <span className="text-[10px] font-bold text-slate-400">Pendente ○</span>
            )}
          </div>
          <div className="text-xs font-black truncate">DRE Mensal</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('fluxo')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'fluxo'
              ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-mono">2. Caixa</span>
            {isCashflowDone ? (
              <span className="text-[10px] font-bold text-emerald-400">Feito ✓</span>
            ) : (
              <span className="text-[10px] font-bold text-slate-400">Pendente ○</span>
            )}
          </div>
          <div className="text-xs font-black truncate">Fluxo de 30 Dias</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preco')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'preco'
              ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-mono">3. Preço</span>
            {isPricingDone ? (
              <span className="text-[10px] font-bold text-emerald-400">Feito ✓</span>
            ) : (
              <span className="text-[10px] font-bold text-slate-400">Pendente ○</span>
            )}
          </div>
          <div className="text-xs font-black truncate">Formação de Preço</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reserva')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'reserva'
              ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-mono">4. Reserva</span>
            {isReserveDone ? (
              <span className="text-[10px] font-bold text-emerald-400">Feito ✓</span>
            ) : (
              <span className="text-[10px] font-bold text-slate-400">Pendente ○</span>
            )}
          </div>
          <div className="text-xs font-black truncate">Reserva PJ</div>
        </button>
      </div>

      {/* 1. DRE Tab Content */}
      {activeTab === 'dre' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Demonstrativo de Resultado do Exercício (DRE Simplificado)
            </h3>
            <span className="text-xs text-slate-500">
              Pró-labore considerado: <strong>{formatCurrency(proLaboreMonthly)}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form Inputs */}
            <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mês de Referência *
                  </label>
                  <input
                    type="text"
                    value={dreMesReferencia}
                    onChange={(e) => setDreMesReferencia(e.target.value)}
                    placeholder="Ex.: 09/2026"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Impostos (% sobre faturamento)
                  </label>
                  <input
                    type="number"
                    value={dreImpostosPerc || ''}
                    onChange={(e) => setDreImpostosPerc(parseFloat(e.target.value) || 0)}
                    placeholder="6"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Faturamento Bruto Mensal (R$) *
                </label>
                <input
                  type="number"
                  value={dreFaturamento || ''}
                  onChange={(e) => setDreFaturamento(parseFloat(e.target.value) || 0)}
                  placeholder="20000"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Custos Diretos / Mercadorias / Insumos (R$)
                </label>
                <input
                  type="number"
                  value={dreCustosDiretos || ''}
                  onChange={(e) => setDreCustosDiretos(parseFloat(e.target.value) || 0)}
                  placeholder="7000"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Despesas Fixas da Empresa (Aluguel, Software, Contabilidade) (R$)
                </label>
                <input
                  type="number"
                  value={dreDespesasFixas || ''}
                  onChange={(e) => setDreDespesasFixas(parseFloat(e.target.value) || 0)}
                  placeholder="5000"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <button
                type="button"
                onClick={handleCloseDRE}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Fechar DRE de {dreMesReferencia}</span>
              </button>
            </div>

            {/* Live DRE Statement */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Demonstrativo em Tempo Real
              </h4>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2 flex justify-between font-bold text-slate-900">
                  <span>(+) Faturamento Bruto</span>
                  <span>{formatCurrency(dreResult.faturamentoBruto)}</span>
                </div>
                <div className="py-2 flex justify-between text-rose-600 font-medium">
                  <span>(-) Impostos ({dreResult.impostosPerc}%)</span>
                  <span>- {formatCurrency(dreResult.valorImpostos)}</span>
                </div>
                <div className="py-2 flex justify-between font-bold text-slate-800 bg-slate-50/50 px-2 rounded">
                  <span>(=) Receita Líquida</span>
                  <span>{formatCurrency(dreResult.receitaLiquida)}</span>
                </div>
                <div className="py-2 flex justify-between text-rose-600 font-medium">
                  <span>(-) Custos Diretos</span>
                  <span>- {formatCurrency(dreResult.custosDiretos)}</span>
                </div>
                <div className="py-2 flex justify-between font-bold text-slate-800 bg-slate-50/50 px-2 rounded">
                  <span>(=) Lucro Bruto</span>
                  <span>{formatCurrency(dreResult.lucroBruto)}</span>
                </div>
                <div className="py-2 flex justify-between text-rose-600 font-medium">
                  <span>(-) Despesas Fixas</span>
                  <span>- {formatCurrency(dreResult.despesasFixas)}</span>
                </div>
                <div className="py-2 flex justify-between font-bold text-slate-800 bg-slate-50/50 px-2 rounded">
                  <span>(=) Lucro Operacional</span>
                  <span>{formatCurrency(dreResult.lucroOperacional)}</span>
                </div>
                <div className="py-2 flex justify-between text-indigo-700 font-semibold">
                  <span>(-) Pró-labore do Sócio (Etapa 2)</span>
                  <span>- {formatCurrency(dreResult.proLabore)}</span>
                </div>
                <div className={`py-3 flex justify-between text-sm font-black px-2 rounded ${
                  dreResult.isNegative ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-800'
                }`}>
                  <span>(=) LUCRO LÍQUIDO DO NEGÓCIO</span>
                  <span>{formatCurrency(dreResult.lucroLiquido)}</span>
                </div>
              </div>

              {dreResult.isNegative && (
                <div className="p-3 bg-rose-100/70 border border-rose-200 rounded-xl text-xs text-rose-900 font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>Alerta: O negócio não cobre o pró-labore! Ajuste despesas ou receita.</span>
                </div>
              )}
            </div>
          </div>

          {/* History of Closed DRE Months */}
          {dreClosedMonths.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Meses com DRE Fechado (Histórico)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {dreClosedMonths.map((m) => (
                  <div key={m.mesReferencia} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>Mês {m.mesReferencia}</span>
                      <span className={m.lucroLiquido >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                        {formatCurrency(m.lucroLiquido)}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex justify-between">
                      <span>Faturamento: {formatCurrency(m.faturamentoBruto)}</span>
                      <span>Pró-labore: {formatCurrency(m.proLabore)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Fluxo de Caixa (Projeção de 30 Dias) Tab Content */}
      {activeTab === 'fluxo' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Fluxo de Caixa — Projeção dos Próximos 30 Dias
              </h3>
              <p className="text-xs text-slate-500">
                Antecipe os dias em que o saldo pode ficar negativo para tomar decisões antes que falte caixa
              </p>
            </div>

            <button
              type="button"
              onClick={handleIncludeProLaboreInCashflow}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
            >
              + Incluir Saída de Pró-labore
            </button>
          </div>

          {/* Saldo Inicial e Totais */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                Saldo Atual em Caixa (R$)
              </label>
              <input
                type="number"
                value={cashflowInitialBalance || ''}
                onChange={(e) => setCashflowInitialBalance(parseFloat(e.target.value) || 0)}
                placeholder="1000,00"
                className="w-full text-base font-black p-2 rounded-xl border border-slate-200 bg-white"
              />
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                Entradas Previstas (30d)
              </span>
              <div className="text-base font-black text-emerald-700">
                + {formatCurrency(cashflowResult.totalEntradas)}
              </div>
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                Saídas Previstas (30d)
              </span>
              <div className="text-base font-black text-rose-700">
                - {formatCurrency(cashflowResult.totalSaidas)}
              </div>
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                Saldo Final Previsto
              </span>
              <div
                className={`text-base font-black ${
                  cashflowResult.finalBalance >= 0 ? 'text-slate-900' : 'text-rose-700'
                }`}
              >
                {formatCurrency(cashflowResult.finalBalance)}
              </div>
            </div>
          </div>

          {/* Negative alert if applicable */}
          {cashflowResult.firstNegativeDate && (
            <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-xs text-rose-900 font-bold flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>
                Alerta de Caixa: O caixa fica negativo em{' '}
                {new Date(`${cashflowResult.firstNegativeDate}T00:00:00`).toLocaleDateString('pt-BR')}.
                Negocie prazos com fornecedores ou antecipe recebimentos antes dessa data.
              </span>
            </div>
          )}

          {/* Form to Add Entry */}
          <form onSubmit={handleAddCashflowEntry} className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div>
              <label className="block font-bold text-slate-600 mb-1">Data</label>
              <input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="w-full p-2 bg-white rounded-lg border border-slate-200"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 mb-1">Tipo</label>
              <select
                value={entryType}
                onChange={(e) => setEntryType(e.target.value as 'entrada' | 'saida')}
                className="w-full p-2 bg-white rounded-lg border border-slate-200 font-bold"
              >
                <option value="entrada">Entrada (+)</option>
                <option value="saida">Saída (-)</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-600 mb-1">Descrição</label>
              <input
                type="text"
                value={entryDesc}
                onChange={(e) => setEntryDesc(e.target.value)}
                placeholder="Ex.: Recebimento cliente X / Boleto internet"
                className="w-full p-2 bg-white rounded-lg border border-slate-200"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 mb-1">Valor (R$)</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={entryAmount}
                  onChange={(e) => setEntryAmount(e.target.value)}
                  placeholder="Ex.: 1500,00"
                  className="w-full p-2 bg-white rounded-lg border border-slate-200 font-bold"
                  required
                />
                <button
                  type="submit"
                  className="px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold cursor-pointer shrink-0"
                >
                  +
                </button>
              </div>
            </div>
          </form>

          {/* Table of Entries in Window */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 uppercase text-[10px] text-slate-500 font-bold">
                  <th className="py-2.5 px-3">Data</th>
                  <th className="py-2.5 px-3">Tipo</th>
                  <th className="py-2.5 px-3">Descrição</th>
                  <th className="py-2.5 px-3 text-right">Valor</th>
                  <th className="py-2.5 px-3 text-right">Saldo Acumulado</th>
                  <th className="py-2.5 px-3 text-center w-16">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cashflowResult.items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-700">
                      {new Date(`${item.date}T00:00:00`).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          item.type === 'entrada'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.type === 'entrada' ? 'Entrada' : 'Saída'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">{item.description}</td>
                    <td
                      className={`py-2.5 px-3 text-right font-black ${
                        item.type === 'entrada' ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {item.type === 'entrada' ? '+' : '-'} {formatCurrency(item.amount)}
                    </td>
                    <td
                      className={`py-2.5 px-3 text-right font-black ${
                        item.balanceAfter >= 0 ? 'text-slate-900' : 'text-rose-700'
                      }`}
                    >
                      {formatCurrency(item.balanceAfter)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => deleteCashflowEntry(item.id)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {cashflowResult.outOfWindowCount > 0 && (
            <p className="text-[11px] text-slate-400 italic">
              * {cashflowResult.outOfWindowCount} lançamento(s) fora da janela dos próximos 30 dias foram desconsiderados na projeção.
            </p>
          )}

          {/* Confirmation button to conclude Cashflow tool */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={!hasEntradaInWindow || !hasSaidaInWindow}
              onClick={() => setCashflowConfirmed(true)}
              className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                isCashflowDone
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : hasEntradaInWindow && hasSaidaInWindow
                  ? 'bg-slate-900 hover:bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isCashflowDone ? 'Projeção de 30 Dias Concluída ✓' : 'Concluir Projeção de 30 Dias'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Formação de Preço Tab Content */}
      {activeTab === 'preco' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Formação de Preço com Mark-up Divisor
              </h3>
              <p className="text-xs text-slate-500">
                Fórmula técnica do livro: Preço = Custo Direto ÷ (1 − % Rateio − % Margem − % Impostos)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form onSubmit={handleSavePrice} className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nome do Produto / Serviço *
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Ex.: Consultoria Básica / Marmita Fit"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Custo Direto Unitário (R$) *
                </label>
                <input
                  type="text"
                  value={directCost}
                  onChange={(e) => setDirectCost(e.target.value)}
                  placeholder="10,00"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Rateio Fixo (%)
                  </label>
                  <input
                    type="text"
                    value={overheadPerc}
                    onChange={(e) => setOverheadPerc(e.target.value)}
                    placeholder="20"
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Margem Lucro (%)
                  </label>
                  <input
                    type="text"
                    value={marginPerc}
                    onChange={(e) => setMarginPerc(e.target.value)}
                    placeholder="30"
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Impostos (%)
                  </label>
                  <input
                    type="text"
                    value={taxPerc}
                    onChange={(e) => setTaxPerc(e.target.value)}
                    placeholder="6"
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!priceResult.isValid}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Salvar Produto Precificado
              </button>
            </form>

            {/* Price Preview Card */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Composição do Preço de Venda
              </span>

              {!priceResult.isValid ? (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{priceResult.errorMessage}</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-800 uppercase block">
                        Preço de Venda Sugerido:
                      </span>
                      <div className="text-3xl font-black text-emerald-950">
                        {formatCurrency(priceResult.precoFinal)}
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="py-2 flex justify-between">
                      <span className="text-slate-600">Custo Direto:</span>
                      <span className="font-bold text-slate-900">{formatCurrency(priceResult.custoDireto)}</span>
                    </div>
                    <div className="py-2 flex justify-between">
                      <span className="text-slate-600">Rateio Despesas ({priceResult.rateioFixoPerc}%):</span>
                      <span className="font-bold text-slate-900">{formatCurrency(priceResult.valorRateio)}</span>
                    </div>
                    <div className="py-2 flex justify-between">
                      <span className="text-slate-600">Margem Líquida ({priceResult.margemLucroPerc}%):</span>
                      <span className="font-bold text-emerald-700">{formatCurrency(priceResult.valorMargem)}</span>
                    </div>
                    <div className="py-2 flex justify-between">
                      <span className="text-slate-600">Impostos ({priceResult.impostosPerc}%):</span>
                      <span className="font-bold text-slate-900">{formatCurrency(priceResult.valorImpostos)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Saved Products List */}
          {savedPrices.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Tabela de Preços Salva
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {savedPrices.map((p) => (
                  <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">{p.productName}</span>
                      <span className="text-[11px] text-slate-500">Custo: {formatCurrency(p.directCost)}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-emerald-800 block">{formatCurrency(p.finalPrice)}</span>
                      <button
                        type="button"
                        onClick={() => deletePriceItem(p.id)}
                        className="text-[10px] text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Reserva PJ Tab Content */}
      {activeTab === 'reserva' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Reserva de Emergência PJ (Meta de 3 Meses)
            </h3>
            <p className="text-xs text-slate-500">
              A reserva da empresa protege o negócio contra sazonalidades, inadimplência e crises sem comprometer o pró-labore do sócio.
            </p>
          </div>

          {dreDespesasFixas <= 0 ? (
            <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 font-semibold space-y-2">
              <p>
                As despesas fixas da empresa ainda não foram preenchidas no DRE.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('dre')}
                className="text-xs font-bold text-amber-950 underline cursor-pointer"
              >
                Ir para o DRE e preencher despesas fixas
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                    Despesas Fixas Mensais (DRE)
                  </span>
                  <div className="text-xl font-black text-slate-900">
                    {formatCurrency(dreDespesasFixas)}
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <span className="text-[10px] font-bold uppercase text-emerald-800 block mb-1">
                    Meta de Reserva (3 Meses)
                  </span>
                  <div className="text-xl font-black text-emerald-950">
                    {formatCurrency(targetReserve)}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">
                    Quanto o negócio já tem guardado (R$)
                  </span>
                  <input
                    type="number"
                    value={reserveSavedAmount || ''}
                    onChange={(e) => setReserveSavedAmount(parseFloat(e.target.value) || 0)}
                    placeholder="0,00"
                    className="w-full text-lg font-black p-1.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Progresso da Reserva PJ</span>
                  <span>{Math.round(reserveProgressPerc)}% ({reserveMonths.toFixed(1)} meses cobertos)</span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all"
                    style={{ width: `${reserveProgressPerc}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setReserveGoalAccepted(true)}
                  className={`px-6 py-3.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                    reserveGoalAccepted
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {reserveGoalAccepted ? 'Meta de Reserva Assumida ✓' : 'Assumir a Meta de Reserva PJ'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Button to unlock Step 4 if all 4 tools completed */}
      <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {allToolsCompleted ? (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              As 4 ferramentas técnicas foram cumpridas com sucesso!
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              Complete o DRE, Fluxo de Caixa, Formação de Preço e Reserva PJ para avançar.
            </span>
          )}
        </div>

        {allToolsCompleted && (
          <button
            type="button"
            onClick={onAdvanceToStep4}
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Base financeira estabilizada — identificar o próximo gargalo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
