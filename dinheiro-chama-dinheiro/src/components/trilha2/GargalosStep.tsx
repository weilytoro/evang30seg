import React from 'react';
import {
  Compass,
  TrendingUp,
  Target,
  Users,
  Layers,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Heart,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';
import { useGerar } from '../../context/GerarContext';
import { GARGALOS_FRONTS } from '../../data/journeyData';
import { GargaloFrontId } from '../../types/journey';

interface GargalosStepProps {
  onNavigateToGerar: () => void;
}

export const GargalosStep: React.FC<GargalosStepProps> = ({ onNavigateToGerar }) => {
  const { activeGargalos, activateGargalo, resolveGargalo, resolvedGargalos } = useJourney();
  const { gargaloPrimario, hasCustomRadarScores } = useGerar();

  // Mapping from Radar 8D to Front
  const radarKeyToFront: Record<string, GargaloFrontId> = {
    vendas: 'vendas',
    estrategia: 'direcao',
    operacoes: 'operacao',
    pessoas: 'pessoas',
  };

  const suggestedFront = hasCustomRadarScores && gargaloPrimario ? radarKeyToFront[gargaloPrimario.key] : null;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-8 animate-in fade-in duration-200">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Etapa 4 · Gargalos Além do Financeiro
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
          Governança Estratégica em No Máximo 2 Frentes
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          Com a base financeira organizada, a empresa cresce atacando o verdadeiro teto do negócio.
          Pela regra de ouro do Método GERAR, você só pode ativar <strong>no máximo 2 frentes simultâneas</strong> para manter o foco total.
        </p>
      </div>

      {/* Radar 8D Recommendation Banner */}
      {suggestedFront ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-emerald-950 block">
                Sugestão do seu Radar GERAR 8D:
              </span>
              <span className="text-emerald-900">
                Sua menor pontuação foi na área de <strong>{gargaloPrimario.dimensao}</strong> ({gargaloPrimario.score}/10).
                Recomendamos priorizar essa frente primeiro.
              </span>
            </div>
          </div>
          {!activeGargalos.includes(suggestedFront) && (
            <button
              type="button"
              onClick={() => activateGargalo(suggestedFront)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shrink-0 cursor-pointer"
            >
              Ativar Frente Sugerida
            </button>
          )}
        </div>
      ) : (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              Quer uma recomendação personalizada sobre qual frente atacar primeiro?
              Avalie as 8 dimensões no Radar GERAR 8D.
            </span>
          </div>
          <button
            type="button"
            onClick={onNavigateToGerar}
            className="text-xs font-bold text-slate-900 underline shrink-0 cursor-pointer"
          >
            Acessar Radar 8D
          </button>
        </div>
      )}

      {/* Counter of active fronts */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-100 pb-2">
        <span>Frentes Ativas: {activeGargalos.length} de 2 permitidas</span>
        {activeGargalos.length >= 2 && (
          <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            Capacidade máxima atingida (resolva uma frente para liberar outra)
          </span>
        )}
      </div>

      {/* Grid of 4 Fronts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {GARGALOS_FRONTS.map((front) => {
          const isActive = activeGargalos.includes(front.id);
          const isResolved = resolvedGargalos.includes(front.id);
          const isFull = activeGargalos.length >= 2 && !isActive;

          return (
            <div
              key={front.id}
              className={`p-6 rounded-2xl border transition-all space-y-4 ${
                isActive
                  ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                  : isResolved
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : 'bg-slate-50/60 border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-black text-slate-900">{front.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{front.subtitle}</p>
                </div>
                {isActive ? (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white px-2.5 py-1 rounded-full">
                    Ativa
                  </span>
                ) : isResolved ? (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2.5 py-1 rounded-full">
                    Resolvida ✓
                  </span>
                ) : isFull ? (
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-2.5 py-1 rounded-full">
                    Aguardando vaga
                  </span>
                ) : null}
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <strong className="block text-slate-700 font-bold uppercase text-[10px]">
                    Quando Atacar:
                  </strong>
                  <p className="text-slate-600">{front.whenToAttack}</p>
                </div>

                <div>
                  <strong className="block text-slate-700 font-bold uppercase text-[10px]">
                    Primeiro Passo Prático:
                  </strong>
                  <p className="text-slate-900 font-semibold">{front.firstStep}</p>
                </div>

                <div>
                  <strong className="block text-slate-700 font-bold uppercase text-[10px]">
                    Ferramentas Indicadas:
                  </strong>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {front.tools.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Warning for active front */}
              {isActive && (
                <div className="p-3 bg-white rounded-xl border border-indigo-200 text-[11px] text-indigo-950 font-medium">
                  <em>
                    O conteúdo técnico completo chega na fase 2; até lá, trabalhe estas ferramentas
                    com o auxílio da mentoria ou de um parceiro curado.
                  </em>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-200/60">
                {isActive ? (
                  <button
                    type="button"
                    onClick={() => resolveGargalo(front.id)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Marcar Frente como Resolvida</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isFull}
                    onClick={() => activateGargalo(front.id)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                      isFull
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                    }`}
                  >
                    {isFull ? 'Aguardando Vaga (Max 2)' : 'Atacar Este Gargalo'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cartão do Hub GERAR & Revisões de Ciclos */}
      <div className="p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Acompanhamento de Ciclos (30 e 90 Dias)
          </span>
          <h3 className="text-lg font-black text-white">
            Hub GERAR · Radar 8D & Triagem de Decisão
          </h3>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Utilize o Radar GERAR 8D a cada 30 e 90 dias para reavaliar os gargalos da empresa,
            aplicar a análise dos 5 Porquês e firmar o Compromisso dos 3 Dias.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToGerar}
          className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <span>Abrir Hub GERAR</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Faixa: Ecossistema de Famílias */}
      <div className="p-5 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-center gap-3 text-xs text-amber-950">
        <Heart className="w-5 h-5 text-amber-600 shrink-0" />
        <div>
          <strong className="block uppercase text-[10px] tracking-wider text-amber-800">
            O Ecossistema das 3 Famílias
          </strong>
          <span>
            Um negócio nunca impacta apenas o faturamento. Uma empresa curada abençoa a{' '}
            <strong>família do empresário</strong>, sustenta com dignidade a{' '}
            <strong>família dos colaboradores</strong> e gera valor genuíno para a{' '}
            <strong>família dos clientes</strong>.
          </span>
        </div>
      </div>
    </div>
  );
};
