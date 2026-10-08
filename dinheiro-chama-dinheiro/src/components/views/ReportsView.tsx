import React from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatPercentage, getCategoryMeta } from '../../utils/formatters';

export const ReportsView: React.FC = () => {
  const {
    monthlyIncome,
    monthlyExpenses,
    monthlyBalance,
    savingsRate,
    filteredTransactions,
    selectedMonth,
  } = useFinance();

  // DRE breakdown calculation
  const fixosCategories = ['Moradia & Contas', 'Saúde & Cuidados', 'Impostos & Taxas'];
  const variaveisCategories = [
    'Alimentação & Mercado',
    'Transporte & Combustível',
    'Lazer & Restaurantes',
    'Compras & Vestuário',
    'Serviços & Assinaturas',
    'Educação & Cursos',
    'Outras Despesas',
  ];

  const gastosFixos = (filteredTransactions || [])
    ?.filter((t) => t?.type === 'expense' && fixosCategories.includes(t?.category))
    ?.reduce((sum, t) => sum + (t?.amount || 0), 0);

  const gastosVariaveis = (filteredTransactions || [])
    ?.filter(
      (t) =>
        t?.type === 'expense' &&
        (variaveisCategories.includes(t?.category) || !fixosCategories.includes(t?.category))
    )
    ?.reduce((sum, t) => sum + (t?.amount || 0), 0);

  const aportesInvestimentos = (filteredTransactions || [])
    ?.filter((t) => t?.category === 'Investimentos')
    ?.reduce((sum, t) => sum + (t?.amount || 0), 0);

  // Payment methods breakdown
  const paymentMethodsMap: { [key: string]: number } = {};
  (filteredTransactions || [])
    ?.filter((t) => t?.type === 'expense')
    ?.forEach((t) => {
      const pm = t?.paymentMethod || 'Outro';
      paymentMethodsMap[pm] = (paymentMethodsMap[pm] || 0) + (t?.amount || 0);
    });

  const paymentLabels: { [k: string]: string } = {
    credit_card: 'Cartão de Crédito',
    pix: 'PIX',
    boleto: 'Boleto Bancário',
    debit: 'Débito em Conta',
    transfer: 'Transferência / TED',
    cash: 'Dinheiro Físico',
  };

  // Top 5 individual expenses
  const topExpenses = [...(filteredTransactions || [])]
    ?.filter((t) => t?.type === 'expense')
    ?.sort((a, b) => (b?.amount || 0) - (a?.amount || 0))
    ?.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-2xl text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <BarChart3 className="w-4 h-4" />
              <span>Relatório Financeiro Estratégico</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-1">
              Demonstração do Resultado & Eficiência Financeira
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Análise aprofundada da sua saúde financeira pessoal e margem de economia
            </p>
          </div>

          <div className="flex items-center gap-6 bg-white/10 p-3.5 rounded-xl backdrop-blur-sm border border-white/10">
            <div>
              <span className="text-[10px] text-slate-300 uppercase font-semibold">
                Taxa de Poupança
              </span>
              <div className="text-xl font-black text-emerald-400">
                {savingsRate.toFixed(1)}%
              </div>
            </div>
            <div className="border-l border-white/20 pl-6">
              <span className="text-[10px] text-slate-300 uppercase font-semibold">
                Superávit do Mês
              </span>
              <div className="text-xl font-black text-white">
                {formatCurrency(monthlyBalance)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DRE Pessoal / Empresarial Simplificada */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              DRE - Demonstração do Resultado (Período)
            </h3>
            <p className="text-xs text-slate-700">
              Estruturação contábil por grupos de despesas
            </p>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            {/* 1. Receita Bruta */}
            <div className="p-3 bg-emerald-50/60 rounded-xl flex items-center justify-between font-bold text-emerald-900">
              <span>(+) Receitas Totais Realizadas</span>
              <span className="text-base text-emerald-700 font-black">
                {formatCurrency(monthlyIncome)}
              </span>
            </div>

            {/* 2. Custos Fixos & Moradia */}
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-slate-700 font-medium">
              <div>
                <span>(-) Custos Fixos & Habitação</span>
                <span className="block text-[11px] text-slate-700 font-normal">
                  Aluguel, condomínio, luz, internet, planos essenciais
                </span>
              </div>
              <span className="text-rose-700 font-bold">
                -{formatCurrency(gastosFixos)}
              </span>
            </div>

            {/* Subtotal Operacional */}
            <div className="px-3 py-1 flex items-center justify-between text-xs text-slate-700 font-semibold border-b border-dashed border-slate-200">
              <span>(=) Sobra após Custos Fixos</span>
              <span className="font-bold text-slate-800">
                {formatCurrency(monthlyIncome - gastosFixos)}
              </span>
            </div>

            {/* 3. Despesas Variáveis */}
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-slate-700 font-medium">
              <div>
                <span>(-) Despesas Variáveis & Estilo de Vida</span>
                <span className="block text-[11px] text-slate-700 font-normal">
                  Mercado, restaurantes, transporte, compras, lazer
                </span>
              </div>
              <span className="text-rose-700 font-bold">
                -{formatCurrency(gastosVariaveis)}
              </span>
            </div>

            {/* Resultado Líquido */}
            <div
              className={`p-3.5 rounded-xl flex items-center justify-between font-black ${
                monthlyBalance >= 0
                  ? 'bg-blue-50 text-blue-900 border border-blue-200'
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}
            >
              <span>(=) Resultado Líquido Final</span>
              <span className="text-lg">
                {formatCurrency(monthlyBalance)}
              </span>
            </div>

            {aportesInvestimentos > 0 && (
              <div className="p-3 bg-purple-50/70 rounded-xl flex items-center justify-between text-purple-900 font-bold text-xs">
                <span>(★) Aportes Realizados em Investimentos</span>
                <span className="text-purple-700">{formatCurrency(aportesInvestimentos)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Formas de Pagamento & Maiores Despesas */}
        <div className="space-y-6">
          {/* Formas de Pagamento */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Distribuição por Meio de Pagamento
            </h3>

            <div className="mt-4 space-y-3">
              {Object.keys(paymentMethodsMap).length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  Sem dados de pagamentos no período.
                </p>
              ) : (
                Object.entries(paymentMethodsMap)?.map(([method, amount]) => {
                  const percent = monthlyExpenses > 0 ? (amount / monthlyExpenses) * 100 : 0;
                  const label = paymentLabels[method] || method;

                  return (
                    <div key={method} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">{label}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">
                            {formatCurrency(amount)}
                          </span>
                          <span className="text-slate-700 text-[11px] font-medium w-8 text-right">
                            {percent.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Maiores Despesas do Período */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Top 5 Maiores Despesas Individuais
            </h3>

            <div className="mt-4 divide-y divide-slate-100">
              {topExpenses.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  Nenhuma despesa listada.
                </p>
              ) : (
                (topExpenses || [])?.map((tx, idx) => (
                  <div
                    key={tx.id}
                    className="py-2.5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 truncate block">
                          {tx.description}
                        </span>
                        <span className="text-[10px] text-slate-700">{tx.category}</span>
                      </div>
                    </div>
                    <span className="font-black text-rose-700 text-sm whitespace-nowrap">
                      -{formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
