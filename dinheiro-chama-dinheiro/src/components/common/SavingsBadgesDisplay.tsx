import React from 'react';
import { Trophy, Star, Lock } from 'lucide-react';
import { SavingsBadge } from '../../types/finance';

interface SavingsBadgesDisplayProps {
  badges: SavingsBadge[];
  summary: {
    unlocked: number;
    total: number;
    unlockedPercentage: number;
  };
}

export const SavingsBadgesDisplay: React.FC<SavingsBadgesDisplayProps> = ({
  badges,
  summary,
}) => {
  const unlockedBadges = badges.filter((b) => b.unlockedAt);
  const lockedBadges = badges.filter((b) => !b.unlockedAt);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-600 animate-bounce" />
          <h3 className="font-black text-slate-900 text-base">🏆 Badges de Poupança & Conquistas</h3>
        </div>
        <div className="text-sm font-black bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-900 px-4 py-2 rounded-full border-2 border-amber-300 shadow-md">
          {summary.unlocked}/{summary.total} Desbloqueados
        </div>
      </div>

      {/* Progress Bar with Animation */}
      <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-orange-400 transition-all duration-700 relative"
          style={{ width: `${summary.unlockedPercentage}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </div>
      </div>
      <p className="text-xs font-bold text-slate-600">
        {Math.round(summary.unlockedPercentage)}% concluído · {summary.total - summary.unlocked} badges restantes
      </p>

      {/* Unlocked Badges - Trophy Display */}
      {unlockedBadges.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-black text-emerald-700 uppercase tracking-wider">✨ Troféus Conquistados</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {unlockedBadges.map((badge, idx) => (
              <div
                key={badge.id}
                className="group relative animate-in fade-in slide-in-from-bottom duration-500"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Badge Card - Trophy Style */}
                <div className="p-3 rounded-2xl bg-gradient-to-b from-amber-50 via-yellow-50 to-amber-100 border-2 border-amber-300 shadow-lg hover:shadow-2xl transition-all hover:scale-110 cursor-pointer text-center relative overflow-hidden">
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Emoji - Very Large */}
                  <div className="text-6xl mb-1 drop-shadow-lg animate-bounce">{badge.emoji}</div>

                  {/* Title */}
                  <h4 className="font-black text-xs text-amber-900 line-clamp-2">{badge.title}</h4>

                  {/* Value */}
                  <div className="text-[10px] text-amber-700 mt-1 font-bold">
                    {badge.currentValue !== undefined && (
                      <span className="bg-amber-200/50 px-2 py-0.5 rounded-full inline-block">
                        {badge.currentValue.toFixed(0)}{badge.unit}
                      </span>
                    )}
                  </div>

                  {/* Unlocked indicator */}
                  <div className="absolute top-1 right-1 text-xs">🎯</div>
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-900 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">
                  <p className="font-black mb-1">{badge.title}</p>
                  <p className="text-slate-200">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Badges (In Progress) */}
      {lockedBadges.length > 0 && (
        <div>
          <p className="text-xs font-bold text-slate-600 uppercase mb-3">🔒 Próximos Desafios</p>
          <div className="space-y-2">
            {lockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all"
              >
                <div className="flex items-start gap-3">
                  {/* Lock Icon + Emoji */}
                  <div className="relative text-2xl shrink-0">
                    <span>{badge.emoji}</span>
                    <div className="absolute -bottom-1 -right-1 bg-slate-600 text-white rounded-full p-0.5">
                      <Lock className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-slate-900">{badge.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{badge.description}</p>

                    {/* Progress Bar */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold text-slate-600">Progresso</span>
                        <span className="text-[11px] font-bold text-slate-800">
                          {(badge.progress || 0).toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-slate-400 to-slate-500 transition-all duration-300"
                          style={{ width: `${badge.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {badges.length === 0 && (
        <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200">
          <Star className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-600 font-medium">Comece a poupar para desbloquear badges!</p>
        </div>
      )}

      {/* Tips */}
      <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
        <p className="text-xs text-indigo-900 font-semibold mb-2">💡 Dica de Gamificação</p>
        <p className="text-xs text-indigo-700 leading-relaxed">
          Cada badge representa um marco importante na sua jornada financeira. Eles são mais que símbolos — são provas de sua disciplina e progresso. Compartilhe suas conquistas e inspire quem está ao seu redor!
        </p>
      </div>
    </div>
  );
};
