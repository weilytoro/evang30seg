import React from 'react';
import { CheckCircle2, Circle, ArrowRight, RotateCcw, Lock, Unlock, Sparkles } from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';
import { useMethodology } from '../../context/MethodologyContext';
import { TRILHA1_MODULES } from '../../data/journeyData';
import { JourneyModuleId } from '../../types/journey';

interface ModuleFooterProps {
  moduleId: JourneyModuleId;
  onNavigateTab: (tab: string) => void;
}

export const ModuleFooter: React.FC<ModuleFooterProps> = ({ moduleId, onNavigateTab }) => {
  const {
    isModuleCompleted,
    canCompleteModule,
    getModuleCriteria,
    completeModule,
    reopenModule,
    pickNextModuleToFocus,
    enemiesChecklistConfirmed,
    setEnemiesChecklistConfirmed,
  } = useJourney();

  const { hasCnpjOrIntends } = useMethodology();

  const isCompleted = isModuleCompleted(moduleId);
  const canComplete = canCompleteModule(moduleId);
  const criteria = getModuleCriteria(moduleId);
  const currentMeta = TRILHA1_MODULES.find((m) => m.id === moduleId);
  const nextModuleId = pickNextModuleToFocus();
  const nextMeta = nextModuleId !== null ? TRILHA1_MODULES.find((m) => m.id === nextModuleId) : null;

  const handleNextClick = () => {
    if (nextMeta) {
      onNavigateTab(nextMeta.tab);
    } else {
      // Trilha 1 concluída, vai para Trilha 2 (ou Início)
      onNavigateTab('business');
    }
  };

  return (
    <div className="mt-10 pt-6 border-t border-slate-200/80 bg-white rounded-3xl p-6 sm:p-8 shadow-xs border">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Criteria checklist */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Critérios de Conclusão · {currentMeta?.shortTitle || `Módulo ${moduleId}`}
            </span>
            {isCompleted && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Módulo Concluído
              </span>
            )}
          </div>

          <div className="space-y-2">
            {criteria.map((crit) => {
              if (crit.isInteractiveCheck && moduleId === 3) {
                return (
                  <label
                    key={crit.id}
                    className="flex items-start gap-2.5 text-xs text-slate-700 font-semibold cursor-pointer select-none hover:text-slate-900 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={enemiesChecklistConfirmed}
                      onChange={(e) => setEnemiesChecklistConfirmed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                    />
                    <span>{crit.label}</span>
                  </label>
                );
              }

              return (
                <div key={crit.id} className="flex items-start gap-2 text-xs">
                  {crit.isSatisfied ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                  )}
                  <span
                    className={
                      crit.isSatisfied ? 'text-slate-700 font-medium' : 'text-slate-400 font-normal'
                    }
                  >
                    {crit.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Module 6 CNPJ unlock notice */}
          {moduleId === 6 && hasCnpjOrIntends && (
            <div className="mt-3 p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl flex items-center gap-2.5 text-xs text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Atenção:</strong> Concluir este módulo destrava imediatamente a{' '}
                <strong>Trilha 2 — Empreendedorismo Cristão (CNPJ)</strong>.
              </span>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {!isCompleted ? (
            <button
              type="button"
              disabled={!canComplete}
              onClick={() => completeModule(moduleId)}
              className={`px-6 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
                canComplete
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-[0.98]'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              {canComplete ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span>
                {moduleId === 6
                  ? 'Concluir Trilha 1 e liberar a Trilha 2'
                  : `Concluir Módulo ${moduleId}`}
              </span>
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <button
                type="button"
                onClick={() => reopenModule(moduleId)}
                className="px-4 py-3 rounded-xl font-semibold text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Permite editar os critérios novamente"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reabrir módulo</span>
              </button>

              <button
                type="button"
                onClick={handleNextClick}
                className="px-6 py-3.5 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <span>
                  {nextMeta
                    ? `Próximo: Módulo ${nextMeta.id} · ${nextMeta.shortTitle}`
                    : 'Acessar a Trilha 2 (CNPJ)'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
