import { useMemo } from 'react';
import { Transaction, Budget } from '../types/finance';

export interface OctalysisMetrics {
  epicMeaning: number;
  achievement: number;
  empowerment: number;
  ownership: number;
  social: number;
  scarcity: number;
  unpredictability: number;
  loss: number;
  totalScore: number;
  dominantDrive: string;
  balanceIndex: number;
}

interface UseOctalysisScorerProps {
  transactions: Transaction[];
  budgets: Budget[];
  accounts: any[];
  goals: any[];
  quizResult: any;
  modulesCompleted: number[];
  trilaCompleted: boolean;
  currentMonth: string;
}

export const useOctalysisScore = ({
  transactions,
  budgets,
  accounts,
  goals,
  quizResult,
  modulesCompleted,
  trilaCompleted,
  currentMonth,
}: UseOctalysisScorerProps): OctalysisMetrics => {
  const metrics = useMemo(() => {
    // ============================================
    // 1️⃣ EPIC MEANING - Módulos completados reais
    // ============================================
    const epicMeaning = Math.min(modulesCompleted.length * 100, 1000);

    // ============================================
    // 2️⃣ ACHIEVEMENT - Dívidas quitadas + Metas atingidas
    // ============================================
    const debtPayments = transactions.filter(
      (t) =>
        t.type === 'expense' &&
        t.category?.toLowerCase().includes('dívida')
    ).length;

    const goalsAchieved = (goals || []).filter(
      (g) => g.currentAmount >= g.targetAmount
    ).length;

    const quizScore = quizResult?.totalScore || 0;

    const achievement = Math.min(
      debtPayments * 150 + goalsAchieved * 100 + quizScore * 10,
      1000
    );

    // ============================================
    // 3️⃣ EMPOWERMENT - Economia real detectada
    // ============================================
    const totalBudget = (budgets || []).reduce((sum, b) => sum + b.monthlyLimit, 0);
    const monthStr = currentMonth.substring(0, 7);

    const monthlyExpenses = transactions
      .filter((t) => t.type === 'expense' && t.date.substring(0, 7) === monthStr)
      .reduce((sum, t) => sum + t.amount, 0);

    const historicalAverage = (budgets || []).reduce((sum, b) => sum + (b.averageSpending || 0), 0);
    const actualSavings = Math.max(historicalAverage - monthlyExpenses, 0);

    // Baseado em economia real: 1 ponto a cada R$100 economizado
    const empowerment = Math.min(actualSavings / 100, 1000);

    // ============================================
    // 4️⃣ OWNERSHIP - Contas + Metas customizadas
    // ============================================
    const accountsCreated = (accounts || []).filter((a) => a.initialBalance > 0).length;
    const goalsCreated = (goals || []).length;

    const ownership = Math.min(
      accountsCreated * 80 + goalsCreated * 60,
      1000
    );

    // ============================================
    // 5️⃣ SOCIAL - Compartilhamentos (futuro)
    // ============================================
    // Por enquanto, baseado em conquistas reais que merecem ser compartilhadas
    const shareableAchievements = debtPayments + goalsAchieved + modulesCompleted.length;
    const social = Math.min(shareableAchievements * 50, 1000);

    // ============================================
    // 6️⃣ SCARCITY - Streak de dias com transações
    // ============================================
    const today = new Date().toISOString().split('T')[0];
    const uniqueDates = new Set(transactions.map((t) => t.date)).size;

    // Calcular streak real
    let streakDays = 0;
    let currentDate = new Date();
    const sortedDates = Array.from(
      new Set(transactions.map((t) => t.date))
    ).sort().reverse();

    for (let i = 0; i < sortedDates.length; i++) {
      const txDate = new Date(sortedDates[i]);
      const expectedDate = new Date(currentDate);
      expectedDate.setDate(expectedDate.getDate() - i);
      if (txDate.toDateString() === expectedDate.toDateString()) {
        streakDays++;
      } else {
        break;
      }
    }

    // Meses com orçamento respeitado
    const budgetRespectedMonths = Array.from(
      new Map(
        transactions
          .filter((t) => t.type === 'expense')
          .map((t) => [
            t.date.substring(0, 7),
            transactions
              .filter((tx) => tx.type === 'expense' && tx.date.substring(0, 7) === t.date.substring(0, 7))
              .reduce((sum, tx) => sum + tx.amount, 0),
          ])
      ).entries()
    ).filter(([_, expenses]) => expenses <= totalBudget).length;

    const scarcity = Math.min(
      streakDays * 10 + budgetRespectedMonths * 150,
      1000
    );

    // ============================================
    // 7️⃣ UNPREDICTABILITY - Insights descobertos
    // ============================================
    // Contador de padrões únicos detectados (categorias gastas, tendências)
    const uniqueCategories = new Set(
      transactions.filter((t) => t.type === 'expense').map((t) => t.category)
    ).size;

    const unpredictability = Math.min(uniqueCategories * 50, 1000);

    // ============================================
    // 8️⃣ LOSS/AVOIDANCE - Recuperação após falha
    // ============================================
    // Baseado em: manter streak mesmo com dificuldades (simplificado)
    const recoveryIndicator = streakDays > 0 ? 1 : 0;
    const loss = Math.min(budgetRespectedMonths * 100 + recoveryIndicator * 200, 1000);

    // ============================================
    // AGREGADOS
    // ============================================
    const drives = [
      epicMeaning,
      achievement,
      empowerment,
      ownership,
      social,
      scarcity,
      unpredictability,
      loss,
    ];

    const totalScore = Math.round(drives.reduce((a, b) => a + b, 0) / 8);

    // Drive dominante
    const driveNames = [
      'Epic Meaning',
      'Achievement',
      'Empowerment',
      'Ownership',
      'Social',
      'Scarcity',
      'Unpredictability',
      'Loss Avoidance',
    ];
    const maxDriveIndex = drives.indexOf(Math.max(...drives));
    const dominantDrive = driveNames[maxDriveIndex];

    // Balance index: quanto mais distribuído, melhor
    const mean = drives.reduce((a, b) => a + b, 0) / drives.length;
    const variance =
      drives.reduce((sum, d) => sum + Math.pow(d - mean, 2), 0) / drives.length;
    const stdDev = Math.sqrt(variance);
    const balanceIndex = Math.max(0, Math.min(100, 100 - (stdDev / 10)));

    return {
      epicMeaning: Math.round(epicMeaning),
      achievement: Math.round(achievement),
      empowerment: Math.round(empowerment),
      ownership: Math.round(ownership),
      social: Math.round(social),
      scarcity: Math.round(scarcity),
      unpredictability: Math.round(unpredictability),
      loss: Math.round(loss),
      totalScore,
      dominantDrive,
      balanceIndex: Math.round(balanceIndex),
    };
  }, [transactions, budgets, accounts, goals, quizResult, modulesCompleted, trilaCompleted, currentMonth]);

  return metrics;
};
