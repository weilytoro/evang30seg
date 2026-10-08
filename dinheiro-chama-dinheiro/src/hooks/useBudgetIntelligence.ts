import { useMemo } from 'react';
import { Budget, BudgetInsight, Transaction } from '../types/finance';

interface UseBudgetIntelligenceProps {
  budgets: Budget[];
  transactions: Transaction[];
  currentMonth: string; // YYYY-MM
}

export const useBudgetIntelligence = ({
  budgets,
  transactions,
  currentMonth,
}: UseBudgetIntelligenceProps) => {
  const insights = useMemo(() => {
    const result: BudgetInsight[] = [];
    const currentMonthStr = currentMonth.substring(0, 7); // YYYY-MM

    // Group transactions by category and month
    const expensesByCategory = new Map<string, { current: number; historical: number[] }>();

    transactions.forEach((tx) => {
      if (tx.type !== 'expense') return;

      const month = tx.date.substring(0, 7);
      const category = tx.category || 'Outros';

      if (!expensesByCategory.has(category)) {
        expensesByCategory.set(category, { current: 0, historical: [] });
      }

      const data = expensesByCategory.get(category)!;

      if (month === currentMonthStr) {
        data.current += tx.amount;
      } else {
        data.historical.push(tx.amount);
      }
    });

    // Generate insights for each budget
    budgets.forEach((budget) => {
      const spent = budget.spent || 0;
      const limit = budget.monthlyLimit;
      const category = budget.category;

      const categoryData = expensesByCategory.get(category);
      const average = categoryData
        ? categoryData.historical.length > 0
          ? categoryData.historical.reduce((a, b) => a + b, 0) / categoryData.historical.length
          : categoryData.current
        : 0;

      const percentage = (spent / limit) * 100;
      const percentageOverAverage = average > 0 ? ((spent - average) / average) * 100 : 0;

      // Alert: Approaching limit (70%)
      if (percentage >= 70 && percentage < 90) {
        result.push({
          category,
          message: `Você já gastou ${percentage.toFixed(0)}% do orçamento de ${category}`,
          type: 'warning',
          severity: 'medium',
          actionable: true,
          suggestedAction: `Reduza gastos com ${category} nos próximos dias`,
          savings: Math.max(0, spent - limit),
        });
      }

      // Critical: Exceeded limit (90%+)
      if (percentage >= 90) {
        const excess = spent - limit;
        result.push({
          category,
          message: `⚠️ ATENÇÃO: Ultrapassou ${percentage.toFixed(0)}% do orçamento!`,
          type: 'warning',
          severity: 'high',
          actionable: true,
          suggestedAction: `Já gastou R$ ${excess.toFixed(2)} acima do limite. Pause novos gastos!`,
          savings: excess,
        });
      }

      // Success: Well within budget
      if (percentage <= 40) {
        const remaining = limit - spent;
        result.push({
          category,
          message: `✅ Bem dentro do orçamento! Apenas ${percentage.toFixed(0)}% utilizado.`,
          type: 'success',
          severity: 'low',
          actionable: false,
          savings: remaining,
        });
      }

      // Trend Analysis: Spending increased significantly
      if (average > 0 && percentageOverAverage > 30) {
        result.push({
          category,
          message: `📈 Gastos com ${category} aumentaram ${percentageOverAverage.toFixed(0)}% comparado à média`,
          type: 'info',
          severity: 'medium',
          actionable: true,
          suggestedAction: `Sua média é R$ ${average.toFixed(2)}/mês. Considere revisar essa categoria.`,
        });
      }

      // Trend Analysis: Spending decreased
      if (average > 0 && percentageOverAverage < -20) {
        result.push({
          category,
          message: `💰 Excelente controle! Gastos ${Math.abs(percentageOverAverage).toFixed(0)}% abaixo da média`,
          type: 'success',
          severity: 'low',
          actionable: false,
          savings: Math.abs(spent - average),
        });
      }

      // Suggestion: Auto-adjust budget recommendation
      if (categoryData && average > 0) {
        const safeLimit = average * 1.2; // 20% buffer
        if (safeLimit < limit && percentage > 60) {
          result.push({
            category,
            message: `💡 Sugestão: Sua média real é R$ ${average.toFixed(2)}. Seu orçamento poderia ser R$ ${safeLimit.toFixed(2)}.`,
            type: 'suggestion',
            severity: 'low',
            actionable: true,
            suggestedAction: `Ajustar orçamento para R$ ${safeLimit.toFixed(2)}?`,
          });
        }
      }
    });

    // Sort by severity (high first)
    const severityOrder = { high: 0, medium: 1, low: 2 };
    return result.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  }, [budgets, transactions, currentMonth]);

  // Summary stats
  const summary = useMemo(() => {
    const warnings = insights.filter((i) => i.severity === 'high').length;
    const successes = insights.filter((i) => i.type === 'success').length;
    const suggestions = insights.filter((i) => i.type === 'suggestion').length;
    const totalSavingsPotential = insights.reduce((sum, i) => sum + (i.savings || 0), 0);

    return {
      warnings,
      successes,
      suggestions,
      totalSavingsPotential: Math.max(0, totalSavingsPotential),
      overallScore: Math.max(0, 100 - warnings * 20 - (suggestions * 5)),
    };
  }, [insights]);

  return {
    insights,
    summary,
  };
};
