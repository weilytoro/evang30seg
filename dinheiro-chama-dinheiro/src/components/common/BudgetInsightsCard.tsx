import React from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Info,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { BudgetInsight } from '../../types/finance';
import { formatCurrency } from '../../utils/formatters';

interface BudgetInsightsCardProps {
  insights: BudgetInsight[];
  summary: {
    warnings: number;
    successes: number;
    suggestions: number;
    totalSavingsPotential: number;
    overallScore: number;
  };
}

const getInsightIcon = (type: BudgetInsight['type']) => {
  switch (type) {
    case 'warning':
      return <AlertTriangle className="w-4 h-4" />;
    case 'success':
      return <CheckCircle className="w-4 h-4" />;
    case 'suggestion':
      return <Lightbulb className="w-4 h-4" />;
    case 'info':
      return <Info className="w-4 h-4" />;
  }
};

const getInsightColor = (type: BudgetInsight['type'], severity: BudgetInsight['severity']) => {
  if (type === 'warning' && severity === 'high') {
    return 'border-red-200 bg-red-50';
  }
  if (type === 'warning') {
    return 'border-yellow-200 bg-yellow-50';
  }
  if (type === 'success') {
    return 'border-emerald-200 bg-emerald-50';
  }
  if (type === 'suggestion') {
    return 'border-blue-200 bg-blue-50';
  }
  return 'border-slate-200 bg-slate-50';
};

export const BudgetInsightsCard: React.FC<BudgetInsightsCardProps> = ({ insights, summary }) => {
  if (insights.length === 0) {
    return (
      <div className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border-2 border-emerald-200 text-center">
        <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
        <h3 className="font-bold text-emerald-900 mb-1">Tudo Sob Controle! 🎉</h3>
        <p className="text-sm text-emerald-700">
          Seus orçamentos estão bem ajustados e dentro dos limites.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-2">
        {/* Overall Score */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-3 border border-slate-200">
          <div className="text-[11px] font-bold text-slate-600 uppercase">Score</div>
          <div className="text-2xl font-black text-slate-900">{summary.overallScore}</div>
          <div className="text-[10px] text-slate-500 mt-1">/ 100</div>
        </div>

        {/* Warnings */}
        {summary.warnings > 0 && (
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-3 border border-red-200">
            <div className="text-[11px] font-bold text-red-600 uppercase">Alertas</div>
            <div className="text-2xl font-black text-red-700">{summary.warnings}</div>
            <div className="text-[10px] text-red-600 mt-1">críticos</div>
          </div>
        )}

        {/* Successes */}
        {summary.successes > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-3 border border-emerald-200">
            <div className="text-[11px] font-bold text-emerald-600 uppercase">Sucesso</div>
            <div className="text-2xl font-black text-emerald-700">{summary.successes}</div>
            <div className="text-[10px] text-emerald-600 mt-1">categorias</div>
          </div>
        )}

        {/* Savings Potential */}
        {summary.totalSavingsPotential > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200">
            <div className="text-[11px] font-bold text-blue-600 uppercase">Economia</div>
            <div className="text-lg font-black text-blue-700 truncate">
              {formatCurrency(summary.totalSavingsPotential)}
            </div>
            <div className="text-[10px] text-blue-600 mt-1">potencial</div>
          </div>
        )}
      </div>

      {/* Insights List */}
      <div className="space-y-2">
        {insights.map((insight, idx) => (
          <div
            key={`${insight.category}-${idx}`}
            className={`p-4 rounded-xl border-2 transition-all ${getInsightColor(insight.type, insight.severity)}`}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="mt-0.5 shrink-0">
                {insight.type === 'warning' && insight.severity === 'high' && (
                  <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">
                    !
                  </div>
                )}
                {getInsightIcon(insight.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{insight.message}</p>

                {insight.suggestedAction && (
                  <p className="text-xs mt-1.5 opacity-75 leading-relaxed">
                    💡 {insight.suggestedAction}
                  </p>
                )}

                {insight.savings !== undefined && insight.savings > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-xs font-bold">
                    <Zap className="w-3 h-3" />
                    <span>Impacto: {formatCurrency(insight.savings)}</span>
                  </div>
                )}
              </div>

              {/* Type Badge */}
              <div className="shrink-0">
                <span className="text-[11px] font-bold uppercase px-1.5 py-0.5 bg-white/60 rounded">
                  {insight.type === 'suggestion' && '💡'}
                  {insight.type === 'warning' && '⚠️'}
                  {insight.type === 'success' && '✅'}
                  {insight.type === 'info' && 'ℹ️'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <strong className="text-indigo-900 block">Dica de Inteligência Orçamentária</strong>
            <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
              Ajuste seus orçamentos com base nas médias reais de gastos. Use os alertas para
              identificar padrões de consumo e tomar decisões mais conscientes sobre seu dinheiro.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
