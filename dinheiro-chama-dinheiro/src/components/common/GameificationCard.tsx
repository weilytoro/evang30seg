import React from 'react';
import { Flame, Star, Trophy } from 'lucide-react';

interface GameificationCardProps {
  totalXP: number;
  levelTitle: string;
  progressToNextLevel: number;
  nextLevelXP: number;
  currentLevelXP: number;
  streakDays: number;
  badgesUnlocked: number;
  totalBadges: number;
  xpGainedToday: number;
}

export const GameificationCard: React.FC<GameificationCardProps> = ({
  totalXP,
  levelTitle,
  progressToNextLevel,
  nextLevelXP,
  currentLevelXP,
  streakDays,
  badgesUnlocked,
  totalBadges,
  xpGainedToday,
}) => {
  // Extract emoji from levelTitle
  const levelEmoji = levelTitle.split(' ')[0];
  const levelName = levelTitle.split(' ').slice(1).join(' ');

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-purple-500/5 to-amber-500/10 pointer-events-none" />

      <div className="relative p-6 sm:p-8 rounded-3xl border border-emerald-200/50 bg-gradient-to-br from-white via-emerald-50/30 to-purple-50/20 shadow-lg">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
              <Trophy className="w-3.5 h-3.5" />
              <span>Sistema de Gamificação</span>
            </div>
            <div className="flex items-end gap-3">
              <div className="text-6xl">{levelEmoji}</div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold">Seu Nível Atual</p>
                <h3 className="text-2xl font-black text-slate-900">{levelName}</h3>
              </div>
            </div>
          </div>

          {/* XP Badge */}
          <div className="text-right p-3 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl border border-amber-300">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
              Total de XP
            </p>
            <p className="text-3xl font-black text-amber-900 mt-1">
              {totalXP.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Progress Ring + XP Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* XP Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600">Progresso até próximo nível</span>
              <span className="text-sm font-black text-emerald-700">{progressToNextLevel}%</span>
            </div>
            <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 transition-all duration-500"
                style={{ width: `${progressToNextLevel}%` }}
              />
              <div
                className="absolute top-0 left-0 h-full bg-white/30 animate-pulse"
                style={{ width: `${progressToNextLevel}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {totalXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
            </p>
          </div>

          {/* Badges Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600">Badges Conquistados</span>
              <span className="text-sm font-black text-purple-700">
                {badgesUnlocked}/{totalBadges}
              </span>
            </div>
            <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 transition-all duration-500"
                style={{ width: `${(badgesUnlocked / totalBadges) * 100}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {Math.round((badgesUnlocked / totalBadges) * 100)}% do caminho para Herói Completo
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* Streak */}
          <div className="p-3 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-200 text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Flame className="w-4 h-4 text-orange-600" />
              <span className="text-2xl font-black text-orange-700">{streakDays}</span>
            </div>
            <p className="text-[10px] font-bold text-orange-700">Dias de Fogo</p>
          </div>

          {/* XP Today */}
          <div className="p-3 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200 text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Star className="w-4 h-4 text-amber-600" />
              <span className="text-2xl font-black text-amber-700">+{xpGainedToday}</span>
            </div>
            <p className="text-[10px] font-bold text-amber-700">XP Hoje</p>
          </div>

          {/* Badges Unlocked */}
          <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Trophy className="w-4 h-4 text-emerald-600" />
              <span className="text-2xl font-black text-emerald-700">{badgesUnlocked}</span>
            </div>
            <p className="text-[10px] font-bold text-emerald-700">Badges</p>
          </div>
        </div>

        {/* Motivational Text */}
        <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
          <p className="text-xs font-semibold text-indigo-900">
            💪 Você está {progressToNextLevel}% do caminho para {levelName}. Siga em frente!
          </p>
        </div>
      </div>
    </div>
  );
};
