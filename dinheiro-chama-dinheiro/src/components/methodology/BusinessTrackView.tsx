import React, { useState } from 'react';
import {
  Building2,
  Lock,
  Unlock,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';
import { useMethodology } from '../../context/MethodologyContext';
import { getBrand } from '../../utils/brand';
import { BizDiagnosisStep } from '../trilha2/BizDiagnosisStep';
import { PfPjStep } from '../trilha2/PfPjStep';
import { ToolsStep } from '../trilha2/ToolsStep';
import { GargalosStep } from '../trilha2/GargalosStep';

interface BusinessTrackViewProps {
  onNavigateToGerar: () => void;
  onNavigateToTrilha1?: () => void;
}

export const BusinessTrackView: React.FC<BusinessTrackViewProps> = ({
  onNavigateToGerar,
  onNavigateToTrilha1,
}) => {
  const {
    trilha1Completed,
    trilha1Progress,
    bizDiagnosisDone,
    bizPlanMode,
    pfPjStepCompleted,
    dreClosedMonths,
    cashflowConfirmed,
    savedPrices,
    reserveGoalAccepted,
  } = useJourney();

  const { platformMode } = useMethodology();
  const brand = getBrand(platformMode);

  // Determine which step is active (1 to 4)
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Step unlock conditions
  const isStep1Done = bizDiagnosisDone || bizPlanMode === 'abertura';
  const isStep2Done = pfPjStepCompleted;
  const isStep3Done =
    dreClosedMonths.length > 0 &&
    cashflowConfirmed &&
    savedPrices.length > 0 &&
    reserveGoalAccepted;

  const isStep2Unlocked = isStep1Done;
  const isStep3Unlocked = isStep2Done;
  const isStep4Unlocked = isStep3Done;

  // If Trilha 1 is NOT completed: show locked card
  if (!trilha1Completed) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm text-center max-w-lg mx-auto my-8 space-y-6 animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200/60 shadow-xs">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2.5 py-1 rounded-full">
            Interior antes de exterior
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Trilha 2 · {brand.trilha2Name} Bloqueada
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic max-w-sm mx-auto">
            &ldquo;Não se constrói um CNPJ próspero sobre um CPF desordenado.&rdquo;
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Conclua os 7 módulos da Trilha 1 (Educação Financeira Pessoal) para liberar a gestão e
            governança do seu negócio.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1.5">
          <div className="flex items-center justify-between font-bold">
            <span>Progresso da Trilha 1 (CPF):</span>
            <span className="text-slate-900">{trilha1Progress}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all"
              style={{ width: `${trilha1Progress}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onNavigateToTrilha1}
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Retornar à Trilha 1</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Steps definition for header navigation
  const steps = [
    {
      num: 1 as const,
      title: 'Diagnóstico',
      unlocked: true,
      done: isStep1Done,
      lockReason: '',
    },
    {
      num: 2 as const,
      title: 'Separação PF/PJ',
      unlocked: isStep2Unlocked,
      done: isStep2Done,
      lockReason: 'Conclua o Diagnóstico do Negócio primeiro.',
    },
    {
      num: 3 as const,
      title: 'Ferramentas',
      unlocked: isStep3Unlocked,
      done: isStep3Done,
      lockReason: 'Conclua a Separação PF/PJ e defina o pró-labore primeiro.',
    },
    {
      num: 4 as const,
      title: 'Gargalos',
      unlocked: isStep4Unlocked,
      done: isStep3Done,
      lockReason: 'Conclua as 4 ferramentas técnicas (DRE, Caixa, Preço e Reserva).',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Trilha 2 · {brand.trilha2Name}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Governança & Gestão Estratégica do Negócio
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Uma empresa saudável protege o caixa, honra seus compromissos e cresce sem desestabilizar
            a casa. Siga as 4 etapas sequenciais abaixo:
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToGerar}
          className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Acessar Hub GERAR (Radar 8D)</span>
        </button>
      </div>

      {/* 4 Sequential Steps Navigation Indicator */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {steps.map((st) => {
          const isCurrent = activeStep === st.num;
          return (
            <button
              key={st.num}
              type="button"
              disabled={!st.unlocked}
              onClick={() => setActiveStep(st.num)}
              className={`p-4 rounded-2xl border text-left transition-all relative ${
                isCurrent
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : st.unlocked
                  ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 cursor-pointer'
                  : 'bg-slate-100/70 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
              }`}
              title={!st.unlocked ? st.lockReason : `Ir para Etapa ${st.num}`}
            >
              <div className="flex items-center justify-between text-[11px] mb-1 font-bold">
                <span>Etapa {st.num}</span>
                {st.done ? (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrent ? 'text-emerald-400' : 'text-emerald-600'}`} />
                ) : st.unlocked ? (
                  <Unlock className="w-3.5 h-3.5 opacity-60" />
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="text-xs sm:text-sm font-black truncate">{st.title}</div>
            </button>
          );
        })}
      </div>

      {/* Render Active Step */}
      {activeStep === 1 && <BizDiagnosisStep onAdvanceToStep2={() => setActiveStep(2)} />}
      {activeStep === 2 && <PfPjStep onAdvanceToStep3={() => setActiveStep(3)} />}
      {activeStep === 3 && <ToolsStep onAdvanceToStep4={() => setActiveStep(4)} />}
      {activeStep === 4 && <GargalosStep onNavigateToGerar={onNavigateToGerar} />}
    </div>
  );
};
