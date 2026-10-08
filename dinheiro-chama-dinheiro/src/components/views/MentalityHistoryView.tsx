import React from 'react';
import { TrendingUp, Trophy, Calendar, Zap } from 'lucide-react';
import { useMethodology } from '../../context/MethodologyContext';

const LEVEL_LABELS = {
  bloqueada: { label: '🔒 Bloqueada', emoji: '🔒', color: 'bg-red-100 border-red-300 text-red-800' },
  estagnada: { label: '⏸️ Estagnada', emoji: '⏸️', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
  transicao: { label: '🌉 Transição', emoji: '🌉', color: 'bg-blue-100 border-blue-300 text-blue-800' },
  construcao: { label: '🏗️ Construção', emoji: '🏗️', color: 'bg-purple-100 border-purple-300 text-purple-800' },
  evoluida: { label: '⭐ Evoluída', emoji: '⭐', color: 'bg-emerald-100 border-emerald-300 text-emerald-800' },
};

export const MentalityHistoryView: React.FC = () => {
  const { mentalityHistory, quizResult } = useMethodology();

  if (!quizResult) {
    return (
      <div className="p-6 bg-slate-50 rounded-xl text-center">
        <Zap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-600 font-medium">Complete o Quiz para iniciar seu histórico de mentalidade</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold">Sua Jornada de Mentalidade</h2>
          </div>
          <div className="text-3xl">{mentalityHistory.length} marcos</div>
        </div>
        <p className="text-slate-300 text-sm">
          Acompanhe sua evolução através dos 5 níveis de mentalidade financeira
        </p>
      </div>

      {/* Timeline */}
      {mentalityHistory.length > 0 ? (
        <div className="space-y-4">
          {mentalityHistory.map((milestone, index) => {
            const levelInfo = LEVEL_LABELS[milestone.level];
            const isLast = index === mentalityHistory.length - 1;
            const nextMilestone = mentalityHistory[index + 1];

            return (
              <div key={milestone.id} className="relative">
                {/* Linha conectora */}
                {!isLast && (
                  <div className="absolute left-7 top-20 bottom-0 w-0.5 bg-gradient-to-b from-slate-300 to-slate-200" />
                )}

                {/* Card do Marco */}
                <div className="relative pl-20">
                  {/* Bolinha */}
                  <div className="absolute left-0 top-2 w-4 h-4 bg-white border-4 border-slate-400 rounded-full" />

                  <div
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isLast
                        ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-400 shadow-lg'
                        : 'bg-white border-slate-200 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className={`inline-block px-3 py-1 rounded-full border font-semibold text-sm ${levelInfo.color}`}>
                          {levelInfo.label}
                        </div>
                        <h3 className="font-bold text-slate-900 mt-2 text-lg">{milestone.title}</h3>
                      </div>
                      {isLast && <Trophy className="w-6 h-6 text-emerald-600 shrink-0" />}
                    </div>

                    {/* Detalhes */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <div className="text-slate-600 font-semibold">Pontuação</div>
                        <div className="text-xl font-bold text-slate-900">{milestone.score}</div>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <div className="text-slate-600 font-semibold">Data</div>
                        <div className="text-sm font-bold text-slate-900">
                          {new Date(milestone.reachedAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>

                    {/* Duração no nível */}
                    {milestone.daysAtLevel && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Permaneceu <strong>{milestone.daysAtLevel} dias</strong> neste nível
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Status */}
                    {isLast && (
                      <div className="mt-3 pt-3 border-t border-emerald-200">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" />
                          <span className="font-semibold text-emerald-800">Seu nível atual</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-xl">
          <Zap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600">Comece sua jornada respondendo o quiz</p>
        </div>
      )}

      {/* Próximo nível sugerido */}
      {quizResult && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4">
          <h3 className="font-bold text-slate-900 mb-2">📚 Seu Capítulo-Chave: {quizResult.keyChapter}</h3>
          <p className="text-slate-700 text-sm mb-3">{quizResult.recommendedAction}</p>
          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <p className="text-xs text-slate-600 leading-relaxed">{quizResult.description}</p>
          </div>
        </div>
      )}

      {/* Estatísticas de progresso */}
      {mentalityHistory.length > 1 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{mentalityHistory.length}</div>
            <div className="text-xs text-emerald-800 font-semibold">Marcos Atingidos</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.max(0, mentalityHistory[mentalityHistory.length - 1].score - mentalityHistory[0].score)}
            </div>
            <div className="text-xs text-blue-800 font-semibold">Pontos Ganhos</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.floor(
                (new Date(mentalityHistory[mentalityHistory.length - 1].reachedAt).getTime() -
                  new Date(mentalityHistory[0].reachedAt).getTime()) /
                  (1000 * 60 * 60 * 24)
              )}{' '}
              d
            </div>
            <div className="text-xs text-purple-800 font-semibold">Dias de Jornada</div>
          </div>
        </div>
      )}
    </div>
  );
};
