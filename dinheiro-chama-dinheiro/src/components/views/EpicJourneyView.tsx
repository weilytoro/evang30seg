import React, { useMemo } from 'react';
import { Sword, Shield, Zap, Trophy, Heart, Map, Calendar, TrendingUp, Lock, Star } from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';
import { useFinance } from '../../context/FinanceContext';
import { TRILHA1_MODULES } from '../../data/journeyData';
import { formatCurrency } from '../../utils/formatters';

// Epic achievement definitions
const EPIC_ACHIEVEMENTS = [
  {
    id: 'hero_awakens',
    title: 'O Herói Acorda',
    emoji: '🧘',
    description: 'Completou o diagnóstico de mentalidade',
    moduleId: 0,
    type: 'milestone' as const,
  },
  {
    id: 'chains_broken',
    title: 'Correntes Quebradas',
    emoji: '⛓️‍♂️',
    description: 'Identificou e trabalhou suas crenças limitantes',
    moduleId: 1,
    type: 'milestone' as const,
  },
  {
    id: 'enemies_defeated',
    title: 'Inimigos Derrotados',
    emoji: '⚔️',
    description: 'Neutralizou os 7 Inimigos Financeiros',
    moduleId: 3,
    type: 'quest' as const,
  },
  {
    id: 'debt_slayer',
    title: 'Caçador de Dívidas',
    emoji: '🗡️',
    description: 'Iniciou o Método JESUS de eliminação de dívidas',
    moduleId: 4,
    type: 'quest' as const,
  },
  {
    id: 'wealth_multiplier',
    title: 'Multiplicador de Riqueza',
    emoji: '💰',
    description: 'Ativou fontes de renda multiplicadas',
    moduleId: 5,
    type: 'discovery' as const,
  },
  {
    id: 'master_of_destiny',
    title: 'Mestre do Destino',
    emoji: '👑',
    description: 'Consolidou seu propósito financeiro transcendental',
    moduleId: 6,
    type: 'milestone' as const,
  },
];

export const EpicJourneyView: React.FC = () => {
  const {
    completedModules = [],
    trilha1Progress = 0,
    trilha1Completed = false,
    isModuleCompleted,
  } = useJourney();

  const { totalCreditDebt = 0, totalBalance = 0 } = useFinance();

  // Calculate achievements
  const achievements = useMemo(() => {
    return EPIC_ACHIEVEMENTS.map((ach) => ({
      ...ach,
      unlocked: ach.moduleId === undefined || isModuleCompleted(ach.moduleId),
      unlockedAt: isModuleCompleted(ach.moduleId) ? new Date().toISOString() : undefined,
    }));
  }, [completedModules]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Epic Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(168,85,247,0.1) 0%, transparent 100%)',
          }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Sword className="w-8 h-8 text-amber-400" />
            <h1 className="text-3xl sm:text-4xl font-black">Sua Jornada Épica</h1>
            <Shield className="w-8 h-8 text-amber-400" />
          </div>

          <p className="text-lg text-slate-200 mb-6">
            Da Prisão Financeira à Liberdade Transcendental
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/10 backdrop-blur rounded-lg p-3 border border-white/20">
              <div className="text-sm text-slate-300">Progresso</div>
              <div className="text-2xl font-black">{trilha1Progress}%</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-3 border border-white/20">
              <div className="text-sm text-slate-300">Conquistas</div>
              <div className="text-2xl font-black">{unlockedCount}/{EPIC_ACHIEVEMENTS.length}</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-3 border border-white/20">
              <div className="text-sm text-slate-300">Saldo Líquido</div>
              <div className={`text-lg font-black ${totalBalance - totalCreditDebt > 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                {formatCurrency(Math.max(0, totalBalance - totalCreditDebt))}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-3 border border-white/20">
              <div className="text-sm text-slate-300">Módulos</div>
              <div className="text-2xl font-black">{completedModules.length}/{TRILHA1_MODULES.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-slate-900">Progresso da Jornada</h2>
          </div>
          <div className="text-sm font-bold text-emerald-600">
            {trilha1Completed ? '🏆 Jornada Completa!' : `${trilha1Progress}% Completo`}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-8 bg-gradient-to-r from-slate-100 to-slate-50 rounded-full overflow-hidden border-2 border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 flex items-center justify-end pr-3 transition-all duration-500"
            style={{ width: `${trilha1Progress}%` }}
          >
            {trilha1Progress > 10 && (
              <span className="text-white font-black text-sm drop-shadow">{trilha1Progress}%</span>
            )}
          </div>
        </div>

        {/* Module Timeline */}
        <div className="mt-6">
          <p className="text-xs font-bold text-slate-600 uppercase mb-3">Marcos da Jornada</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {TRILHA1_MODULES.map((mod, idx) => {
              const completed = isModuleCompleted(mod.id);
              const isNext = idx === completedModules.length;

              return (
                <div
                  key={mod.id}
                  className="flex flex-col items-center gap-1.5 flex-shrink-0"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                      completed
                        ? 'bg-emerald-100 text-emerald-700 shadow-md scale-105'
                        : isNext
                        ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-300 animate-pulse'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    M{mod.id}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 text-center w-14 truncate">
                    {mod.shortTitle}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-6 h-6 text-amber-600" />
          <h2 className="font-bold text-slate-900">Troféus & Realizações Épicas</h2>
          <span className="ml-auto text-xs font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
            {unlockedCount}/{EPIC_ACHIEVEMENTS.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                ach.unlocked
                  ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-4xl leading-none">{ach.emoji}</div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    {ach.title}
                    {ach.unlocked ? (
                      <Star className="w-4 h-4 text-amber-600 fill-amber-600" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{ach.description}</p>
                  {ach.unlocked && (
                    <div className="mt-2 text-[11px] font-semibold text-emerald-700 bg-emerald-100/60 rounded px-2 py-1 inline-block">
                      ✓ Desbloqueado
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Epic Quest Status */}
      <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-red-100 rounded-2xl p-6 border-2 border-purple-200">
        <div className="flex items-start gap-3">
          <Zap className="w-6 h-6 text-purple-700 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 mb-2">🗺️ A Sua Grande Quest</h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              Você está numa jornada de transformação financeira em 7 módulos. Cada passo superado
              o aproxima da <strong>Liberdade Transcendental</strong> — onde o dinheiro se torna
              ferramenta neutra a serviço do seu propósito.
            </p>
            <div className="p-3 bg-white/70 rounded-lg text-xs text-slate-600 space-y-1">
              <p>
                <strong>Etapa Atual:</strong> Módulo {completedModules.length} de {TRILHA1_MODULES.length}
              </p>
              <p>
                <strong>Objetivo Imediato:</strong> {
                  trilha1Completed
                    ? '🎉 Jornada Completada! Você alcançou a Liberdade Transcendental.'
                    : `Completar o Módulo ${completedModules.length + 1}`
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-slate-100 to-slate-50 rounded-xl p-4 border border-slate-200 italic text-center text-slate-700">
        "Cada dívida quitada é uma corrente quebrada. Cada hábito mudado é uma vitória. Você é
        guerreiro da sua própria história financeira."
      </div>
    </div>
  );
};
