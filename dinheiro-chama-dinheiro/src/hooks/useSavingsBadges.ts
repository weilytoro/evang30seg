import { useMemo } from 'react';
import { SavingsBadge, Transaction, Budget } from '../types/finance';

interface UseSavingsBadgesProps {
  transactions: Transaction[];
  budgets: Budget[];
  currentMonth: string; // YYYY-MM
  selectedMonth?: string;
}

// All possible badges
const BADGE_DEFINITIONS: Omit<SavingsBadge, 'unlockedAt' | 'currentValue' | 'progress'>[] = [
  {
    id: 'economist',
    title: 'Economista',
    emoji: '💰',
    description: 'Economizou mais de 10% do seu orçamento em um mês',
    category: 'saver',
    threshold: 10,
    unit: '%',
  },
  {
    id: 'warrior',
    title: 'Guerreiro',
    emoji: '⚔️',
    description: 'Quitou sua primeira dívida usando o Método JESUS',
    category: 'debt-free',
    threshold: 1,
    unit: '',
  },
  {
    id: 'disciplined',
    title: 'Disciplinado',
    emoji: '🎯',
    description: 'Respeitou o orçamento em 3 meses consecutivos',
    category: 'disciplined',
    threshold: 3,
    unit: 'meses',
  },
  {
    id: 'thrifty_master',
    title: 'Mestre da Frugalidade',
    emoji: '🧠',
    description: 'Manteve gastos 20% abaixo do orçamento por 1 mês',
    category: 'saver',
    threshold: 20,
    unit: '%',
  },
  {
    id: 'accelerator',
    title: 'Acelerador',
    emoji: '🚀',
    description: 'Fez 5 pagamentos extras em um mês',
    category: 'multiplier',
    threshold: 5,
    unit: 'pagtos',
  },
  {
    id: 'unstoppable',
    title: 'Imparável',
    emoji: '💪',
    description: 'Quitou 3 dívidas ou mais',
    category: 'debt-free',
    threshold: 3,
    unit: 'dívidas',
  },
  {
    id: 'five_figure_saver',
    title: 'Economista Milionário',
    emoji: '🏆',
    description: 'Economizou mais de R$ 5.000 em um mês',
    category: 'milestone',
    threshold: 5000,
    unit: 'R$',
  },
  {
    id: 'zero_debt_hero',
    title: 'Herói Sem Dívidas',
    emoji: '👑',
    description: 'Quitou todas as dívidas cadastradas',
    category: 'debt-free',
    threshold: 100,
    unit: '%',
  },
];

export const useSavingsBadges = ({
  transactions,
  budgets,
  currentMonth,
  selectedMonth,
}: UseSavingsBadgesProps) => {
  const badges = useMemo(() => {
    const result: SavingsBadge[] = [];
    const monthToAnalyze = selectedMonth || currentMonth;
    const monthStr = monthToAnalyze.substring(0, 7);

    // Group transactions by month
    const monthlyExpenses = new Map<string, number>();
    const monthlyIncome = new Map<string, number>();
    const monthlyDebtPayments = new Map<string, number>();

    transactions.forEach((tx) => {
      const month = tx.date.substring(0, 7);

      if (tx.type === 'expense') {
        monthlyExpenses.set(month, (monthlyExpenses.get(month) || 0) + tx.amount);
      } else if (tx.type === 'income') {
        monthlyIncome.set(month, (monthlyIncome.get(month) || 0) + tx.amount);
      }

      // Count debt payments (detected by "pag", "dizia", "amorti" etc in description)
      if (
        tx.type === 'expense' &&
        tx.category &&
        tx.category.toLowerCase().includes('dívida')
      ) {
        monthlyDebtPayments.set(month, (monthlyDebtPayments.get(month) || 0) + 1);
      }
    });

    const currentExpenses = monthlyExpenses.get(monthStr) || 0;
    const currentIncome = monthlyIncome.get(monthStr) || 0;
    const currentDebtPayments = monthlyDebtPayments.get(monthStr) || 0;

    // Calculate savings
    const totalBudget = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
    const savingsPercentage = totalBudget > 0 ? ((totalBudget - currentExpenses) / totalBudget) * 100 : 0;
    const savingsAmount = currentIncome - currentExpenses;

    // Badge 1: Economist (saved 10%+)
    if (savingsPercentage >= 10) {
      result.push({
        ...BADGE_DEFINITIONS[0],
        unlockedAt: new Date().toISOString(),
        currentValue: savingsPercentage,
        progress: Math.min(100, (savingsPercentage / 50) * 100),
      });
    }

    // Badge 2: Warrior (paid a debt)
    if (currentDebtPayments >= 1) {
      result.push({
        ...BADGE_DEFINITIONS[1],
        unlockedAt: new Date().toISOString(),
        currentValue: currentDebtPayments,
        progress: 100,
      });
    }

    // Badge 3: Disciplined (respected budget for months)
    const monthsWithinBudget = Array.from(monthlyExpenses.entries())
      .filter(([_, expenses]) => {
        const totalLimit = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
        return expenses <= totalLimit;
      }).length;

    if (monthsWithinBudget >= 3) {
      result.push({
        ...BADGE_DEFINITIONS[2],
        unlockedAt: new Date().toISOString(),
        currentValue: monthsWithinBudget,
        progress: (monthsWithinBudget / 3) * 100,
      });
    }

    // Badge 4: Thrifty Master (20% below budget)
    const budgetPercentage = (currentExpenses / totalBudget) * 100;
    if (budgetPercentage <= 80 && totalBudget > 0) {
      result.push({
        ...BADGE_DEFINITIONS[3],
        unlockedAt: new Date().toISOString(),
        currentValue: 100 - budgetPercentage,
        progress: 100,
      });
    }

    // Badge 5: Accelerator (5+ extra payments)
    if (currentDebtPayments >= 5) {
      result.push({
        ...BADGE_DEFINITIONS[4],
        unlockedAt: new Date().toISOString(),
        currentValue: currentDebtPayments,
        progress: (currentDebtPayments / 5) * 100,
      });
    }

    // Badge 6: Unstoppable (3+ debts paid)
    if (currentDebtPayments >= 3) {
      result.push({
        ...BADGE_DEFINITIONS[5],
        unlockedAt: new Date().toISOString(),
        currentValue: currentDebtPayments,
        progress: (currentDebtPayments / 3) * 100,
      });
    }

    // Badge 7: Five Figure Saver (saved 5000+)
    if (savingsAmount >= 5000) {
      result.push({
        ...BADGE_DEFINITIONS[6],
        unlockedAt: new Date().toISOString(),
        currentValue: savingsAmount,
        progress: (savingsAmount / 10000) * 100,
      });
    }

    // Badge 8: Zero Debt Hero (all debts paid) - tricky to detect, showing progress
    result.push({
      ...BADGE_DEFINITIONS[7],
      currentValue: currentDebtPayments,
      progress: (currentDebtPayments / 3) * 50, // Half progress shown
    });

    return result;
  }, [transactions, budgets, selectedMonth, currentMonth]);

  // Summary
  const summary = useMemo(() => {
    const unlocked = badges.filter((b) => b.unlockedAt).length;
    const total = BADGE_DEFINITIONS.length;

    return {
      unlocked,
      total,
      unlockedPercentage: (unlocked / total) * 100,
    };
  }, [badges]);

  return {
    badges,
    summary,
    allBadgeDefinitions: BADGE_DEFINITIONS,
  };
};
