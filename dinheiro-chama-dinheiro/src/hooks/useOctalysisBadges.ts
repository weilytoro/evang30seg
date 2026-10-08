import { useMemo } from 'react';
import { OctalysisBadge } from '../types/finance';
import { useOctalysisScore } from './useOctalysisScore';

interface UseOctalysisBadgesProps {
  transactions: any[];
  budgets: any[];
  accounts: any[];
  goals: any[];
  quizResult: any;
  modulesCompleted: number[];
  trilaCompleted: boolean;
  currentMonth: string;
}

const DRIVE_COLORS = {
  epic: 'from-purple-500 to-indigo-600',
  achievement: 'from-amber-500 to-orange-600',
  empowerment: 'from-emerald-500 to-teal-600',
  ownership: 'from-cyan-500 to-blue-600',
  social: 'from-pink-500 to-rose-600',
  scarcity: 'from-red-500 to-orange-600',
  unpredictability: 'from-yellow-500 to-amber-600',
  loss: 'from-slate-500 to-gray-600',
};

const OCTALYSIS_BADGES = [
  // EPIC MEANING (🦅)
  {
    id: 'epic-1',
    title: 'Iniciado a Jornada',
    description: 'Completou o diagnóstico dos 5 níveis e começou sua transformação',
    emoji: '🌟',
    drive: 'epic' as const,
    driveName: 'Epic Meaning',
    threshold: 1,
    realMetric: 'modulesCompleted',
    requiresValue: 1,
  },
  {
    id: 'epic-2',
    title: 'Guardião do Legado',
    description: 'Completou a jornada inteira e transformou cicatrizes em sabedoria',
    emoji: '👑',
    drive: 'epic' as const,
    driveName: 'Epic Meaning',
    threshold: 7,
    realMetric: 'modulesCompleted',
    requiresValue: 7,
  },

  // ACHIEVEMENT (🏆)
  {
    id: 'achievement-1',
    title: 'Primeiro Inimigo Derrotado',
    description: 'Liquidou sua primeira dívida usando o Método JESUS',
    emoji: '⚔️',
    drive: 'achievement' as const,
    driveName: 'Achievement',
    threshold: 1,
    realMetric: 'debtsPaid',
    requiresValue: 1,
  },
  {
    id: 'achievement-2',
    title: 'Imparável',
    description: 'Quitou 3 ou mais dívidas - você é uma máquina de libertação',
    emoji: '💪',
    drive: 'achievement' as const,
    driveName: 'Achievement',
    threshold: 3,
    realMetric: 'debtsPaid',
    requiresValue: 3,
  },

  // EMPOWERMENT (💡)
  {
    id: 'empowerment-1',
    title: 'Insights Acionados',
    description: 'Implementou 3 sugestões de IA que realmente economizaram dinheiro',
    emoji: '🧠',
    drive: 'empowerment' as const,
    driveName: 'Empowerment',
    threshold: 300,
    realMetric: 'actualSavings',
    requiresValue: 300,
  },
  {
    id: 'empowerment-2',
    title: 'Padrões Descobertos',
    description: 'Seus gastos revelam padrões - você entende seu dinheiro',
    emoji: '📊',
    drive: 'empowerment' as const,
    driveName: 'Empowerment',
    threshold: 1000,
    realMetric: 'actualSavings',
    requiresValue: 1000,
  },

  // OWNERSHIP (👑)
  {
    id: 'ownership-1',
    title: 'Seu Santuário',
    description: 'Criou 3 contas diferentes para organizar sua vida financeira',
    emoji: '🏠',
    drive: 'ownership' as const,
    driveName: 'Ownership',
    threshold: 3,
    realMetric: 'accountsCreated',
    requiresValue: 3,
  },
  {
    id: 'ownership-2',
    title: 'Mestre de Metas',
    description: 'Criou 10+ metas personalizadas e está no controle total',
    emoji: '🎯',
    drive: 'ownership' as const,
    driveName: 'Ownership',
    threshold: 10,
    realMetric: 'goalsCreated',
    requiresValue: 10,
  },

  // SOCIAL (👥) - Futuro, mas mapeado
  {
    id: 'social-1',
    title: 'Compartilhador',
    description: 'Dividiu suas conquistas reais - inspire quem está ao seu redor',
    emoji: '🤝',
    drive: 'social' as const,
    driveName: 'Social',
    threshold: 3,
    realMetric: 'achievementsShared',
    requiresValue: 3,
  },
  {
    id: 'social-2',
    title: 'Mentor',
    description: 'Ajudou outro usuário com estratégias reais de progresso',
    emoji: '🌱',
    drive: 'social' as const,
    driveName: 'Social',
    threshold: 1,
    realMetric: 'helpProvided',
    requiresValue: 1,
  },

  // SCARCITY (⏰)
  {
    id: 'scarcity-1',
    title: 'Streak Lendário',
    description: '30+ dias consecutivos registrando ações - você é consistente',
    emoji: '🔥',
    drive: 'scarcity' as const,
    driveName: 'Scarcity',
    threshold: 30,
    realMetric: 'transactionStreak',
    requiresValue: 30,
  },
  {
    id: 'scarcity-2',
    title: 'Sprint Mensal',
    description: 'Respeitou o orçamento 6+ meses seguidos - disciplina real',
    emoji: '⚡',
    drive: 'scarcity' as const,
    driveName: 'Scarcity',
    threshold: 6,
    realMetric: 'budgetRespectedMonths',
    requiresValue: 6,
  },

  // UNPREDICTABILITY (🎲)
  {
    id: 'unpredictability-1',
    title: 'Descobridor',
    description: 'Encontrou padrões inesperados nos seus gastos',
    emoji: '🎊',
    drive: 'unpredictability' as const,
    driveName: 'Unpredictability',
    threshold: 5,
    realMetric: 'uniqueCategories',
    requiresValue: 5,
  },

  // LOSS/AVOIDANCE (🛡️)
  {
    id: 'loss-1',
    title: 'Resiliente',
    description: 'Recuperou-se após quebrar a streak - você não desistiu',
    emoji: '🛡️',
    drive: 'loss' as const,
    driveName: 'Loss Avoidance',
    threshold: 1,
    realMetric: 'streakRecoveries',
    requiresValue: 1,
  },
];

export const useOctalysisBadges = (props: UseOctalysisBadgesProps) => {
  const octalysisMetrics = useOctalysisScore(props);

  const badges = useMemo(() => {
    const result: OctalysisBadge[] = [];

    // Map real metrics from props
    const debtsPaid = props.transactions.filter(
      (t) =>
        t.type === 'expense' &&
        t.category?.toLowerCase().includes('dívida')
    ).length;

    const monthStr = props.currentMonth.substring(0, 7);
    const monthlyExpenses = props.transactions
      .filter((t) => t.type === 'expense' && t.date.substring(0, 7) === monthStr)
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const totalBudget = props.budgets.reduce((sum: number, b: any) => sum + b.monthlyLimit, 0);
    const historicalAverage = props.budgets.reduce((sum: number, b: any) => sum + (b.averageSpending || 0), 0);
    const actualSavings = Math.max(historicalAverage - monthlyExpenses, 0);

    const accountsCreated = props.accounts.filter((a: any) => a.initialBalance > 0).length;
    const goalsCreated = props.goals.length;

    const uniqueCategories = new Set(
      props.transactions.filter((t: any) => t.type === 'expense').map((t: any) => t.category)
    ).size;

    // Streak calculation
    const uniqueDates = new Set(props.transactions.map((t: any) => t.date)).size;
    let streakDays = 0;
    let currentDate = new Date();
    const sortedDates = Array.from(
      new Set(props.transactions.map((t: any) => t.date))
    )
      .sort()
      .reverse();

    for (let i = 0; i < sortedDates.length; i++) {
      const txDate = new Date(sortedDates[i] as string);
      const expectedDate = new Date(currentDate);
      expectedDate.setDate(expectedDate.getDate() - i);
      if (txDate.toDateString() === expectedDate.toDateString()) {
        streakDays++;
      } else {
        break;
      }
    }

    const budgetRespectedMonths = Array.from(
      new Map(
        props.transactions
          .filter((t: any) => t.type === 'expense')
          .map((t: any) => [
            t.date.substring(0, 7),
            props.transactions
              .filter((tx: any) => tx.type === 'expense' && tx.date.substring(0, 7) === t.date.substring(0, 7))
              .reduce((sum: number, tx: any) => sum + tx.amount, 0),
          ])
      ).entries()
    ).filter(([_, expenses]) => (expenses as number) <= totalBudget).length;

    // Unlock badges baseado em métricas reais
    OCTALYSIS_BADGES.forEach((badgeTemplate: any) => {
      let currentValue = 0;
      let isUnlocked = false;

      switch (badgeTemplate.realMetric) {
        case 'modulesCompleted':
          currentValue = props.modulesCompleted.length;
          isUnlocked = currentValue >= badgeTemplate.requiresValue;
          break;
        case 'debtsPaid':
          currentValue = debtsPaid;
          isUnlocked = currentValue >= badgeTemplate.requiresValue;
          break;
        case 'actualSavings':
          currentValue = actualSavings;
          isUnlocked = currentValue >= badgeTemplate.requiresValue;
          break;
        case 'accountsCreated':
          currentValue = accountsCreated;
          isUnlocked = currentValue >= badgeTemplate.requiresValue;
          break;
        case 'goalsCreated':
          currentValue = goalsCreated;
          isUnlocked = currentValue >= badgeTemplate.requiresValue;
          break;
        case 'transactionStreak':
          currentValue = streakDays;
          isUnlocked = currentValue >= badgeTemplate.requiresValue;
          break;
        case 'budgetRespectedMonths':
          currentValue = budgetRespectedMonths;
          isUnlocked = currentValue >= badgeTemplate.requiresValue;
          break;
        case 'uniqueCategories':
          currentValue = uniqueCategories;
          isUnlocked = currentValue >= badgeTemplate.requiresValue;
          break;
      }

      const progress = Math.min(100, (currentValue / badgeTemplate.requiresValue) * 100);

      result.push({
        id: badgeTemplate.id,
        title: badgeTemplate.title,
        description: badgeTemplate.description,
        emoji: badgeTemplate.emoji,
        drive: badgeTemplate.drive,
        driveName: badgeTemplate.driveName,
        realMetric: badgeTemplate.realMetric,
        unlockedAt: isUnlocked ? new Date().toISOString() : undefined,
        progress,
        threshold: badgeTemplate.requiresValue,
        currentValue,
        color: DRIVE_COLORS[badgeTemplate.drive as keyof typeof DRIVE_COLORS],
      });
    });

    return result;
  }, [props.transactions, props.budgets, props.accounts, props.goals, props.currentMonth, props.modulesCompleted]);

  return {
    badges,
    summary: {
      unlocked: badges.filter((b) => b.unlockedAt).length,
      total: badges.length,
      unlockedPercentage: (badges.filter((b) => b.unlockedAt).length / badges.length) * 100,
    },
  };
};
