import React from 'react';
import { Lock, ArrowRight, Brain } from 'lucide-react';

interface BlockedModuleCardProps {
  moduleName?: string;
  onGoToQuiz: () => void;
}

export const BlockedModuleCard: React.FC<BlockedModuleCardProps> = ({
  moduleName,
  onGoToQuiz,
}) => {
  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm text-center max-w-lg mx-auto my-8 space-y-6 animate-in fade-in duration-200">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200/60 shadow-xs">
        <Lock className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2.5 py-1 rounded-full">
          Diagnóstico antes de solução
        </span>
        <h2 className="text-xl font-black text-slate-900">
          Comece pelo diagnóstico
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
          {moduleName ? `O módulo "${moduleName}" e os demais` : 'Os módulos desta trilha'}{' '}
          estão bloqueados até que você realize o seu <strong>Diagnóstico de Entrada (Módulo 0)</strong>.
          Descubra qual das 5 mentalidades rege sua vida antes de avançar.
        </p>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onGoToQuiz}
          className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
        >
          <Brain className="w-4 h-4" />
          <span>Fazer Diagnóstico dos 5 Níveis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
