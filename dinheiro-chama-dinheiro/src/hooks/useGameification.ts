import { useMemo } from 'react';
import { Transaction, Budget } from '../types/finance';

interface GameificationStats {
  totalXP: number;
  currentLevel: number;
  levelTitle: string;
  nextLevelXP: number;
  progressToNextLevel: number;
  streakDays: number;
  allBadgesUnlocked: number;
  totalBadges: number;
  xpGainedToday: number;
}

const LEVEL_THRESHOLDS = [
  { min: 0, max: 5000, title: '🥚 Aprendiz', emoji: '🥚' },
  { min: 5000, max: 15000, title: '⚔️ Guerreiro', emoji: '⚔️' },
  { min: 15000, max: 40000, title: '👑 Mestre', emoji: '👑' },
  { min: 40000, max: Infinity, title: '🔥 Lenda', emoji: '🔥' },
];

const XP_ACTIONS = {
  moduleComplete: 1000,
  debtPaid: 500,
  budgetRespected: 250,
  badgeUnlocked: 100,
  transactionLogged: 10,
};

export const useGameification = (
  transactions: Transaction[],
  budgets: Budget[],
  allBadgesUnlocked: number,
  totalBadges: number,
  currentMonth: string
): GameificationStats => {
  const stats = useMemo(() => {
    // Calculate total XP from transactions
    const today = new Date().toISOString().split('T')[0];
    let totalXP = 0;
    let xpGainedToday = 0;

    // XP from logging transactions (10 per transaction)
    totalXP += transactions.length * XP_ACTIONS.transactionLogged;

    // XP from transactions today
    transactions.forEach((tx) => {
      if (tx.date === today) {
        xpGainedToday += XP_ACTIONS.transactionLogged;
      }
    });

    // XP from badges
    totalXP += allBadgesUnlocked * XP_ACTIONS.badgeUnlocked;
    xpGainedToday += Math.min(allBadgesUnlocked * XP_ACTIONS.badgeUnlocked, 500); // Cap today

    // XP from debt payments
    const debtPayments = transactions.filter(
      (t) => t.type === 'expense' && t.category?.toLowerCase().includes('dívida')
    ).length;
    totalXP += debtPayments * XP_ACTIONS.debtPaid;

    // Get current level
    const currentLevel = LEVEL_THRESHOLDS.findIndex(
      (level) => totalXP >= level.min && totalXP < level.max
    );
    const levelData = LEVEL_THRESHOLDS[currentLevel] || LEVEL_THRESHOLDS[3];
    const nextLevel = LEVEL_THRESHOLDS[currentLevel + 1] || LEVEL_THRESHOLDS[3];

    // Calculate progress
    const currentLevelMin = levelData.min;
    const nextLevelMin = nextLevel.min;
    const xpInCurrentLevel = totalXP - currentLevelMin;
    const xpNeededForNextLevel = nextLevelMin - currentLevelMin;
    const progressToNextLevel = Math.min(100, (xpInCurrentLevel / xpNeededForNextLevel) * 100);

    // Calculate streak (simplified - consecutive days with transactions)
    const uniqueDates = new Set(transactions.map((t) => t.date));
    const sortedDates = Array.from(uniqueDates).sort().reverse();
    let streakDays = 0;
    let currentDate = new Date();
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

    return {
      totalXP: Math.floor(totalXP),
      currentLevel,
      levelTitle: levelData.title,
      nextLevelXP: nextLevelMin,
      progressToNextLevel: Math.round(progressToNextLevel),
      streakDays,
      allBadgesUnlocked,
      totalBadges,
      xpGainedToday: Math.floor(xpGainedToday),
    };
  }, [transactions, budgets, allBadgesUnlocked, totalBadges, currentMonth]);

  return stats;
};
