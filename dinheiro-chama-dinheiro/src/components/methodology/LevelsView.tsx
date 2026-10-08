import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Target,
} from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';
import { useMethodology } from '../../context/MethodologyContext';
import { MENTAL_LEVELS_DETAILS } from '../../data/journeyData';
import { getBrand } from '../../utils/brand';

export const LevelsView: React.FC = () => {
  const {
    selectedNextLevelPhrase,
    setSelectedNextLevelPhrase,
    firstAction7Days,
    setFirstAction7Days,
  } = useJourney();

  const { quizResult, platformMode } = useMethodology();
  const brand = getBrand(platformMode);

  const currentLevelId = quizResult?.level || 'transicao';
  const levelOrder = ['bloqueada', 'estagnada', 'transicao', 'construcao', 'evoluida'];
  const userLevelIndex = Math.max(0, levelOrder.indexOf(currentLevelId));

  // Apresentação progressiva no curso: exibe estritamente UM NÍVEL POR VEZ
  const [activeStep, setActiveStep] = useState<number>(userLevelIndex);

  const activeLevel = MENTAL_LEVELS_DETAILS[activeStep] || MENTAL_LEVELS_DETAILS[0];
  const isUserCurrentLevel = activeLevel.id === currentLevelId;
  const isSelectedPhrase = selectedNextLevelPhrase === activeLevel.milestonePhrase;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner — Design em Branco e Dourado */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-amber-200/80 shadow-xs space-y-2.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
          <Brain className="w-3.5 h-3.5 text-amber-600" />
          <span>Módulo 1 · Consciência & Renovação</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          O Dinheiro como Espelho da Mente
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl font-medium">
          O saldo bancário reflete seu nível de consciência. Percorra os 5 níveis apresentados no livro,
          um por vez, e adote sua frase-marco para o próximo patamar.
        </p>

        {brand.isBiblical && (
          <div className="mt-2 p-3 bg-amber-50/60 border-l-4 border-amber-500 rounded-r-xl text-xs text-amber-950 italic">
            &ldquo;Transformai-vos pela renovação da vossa mente.&rdquo;
            <span className="block mt-0.5 font-bold not-italic text-amber-900">— Romanos 12,2</span>
          </div>
        )}
      </div>

      {/* Stepper do Curso — Apresentando UM NÍVEL POR VEZ */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-amber-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                Passo a Passo do Curso
              </span>
              <span className="text-xs text-slate-400 font-bold">
                Nível {activeStep + 1} de 5
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">
              {activeLevel.name}
            </h2>
          </div>

          {/* Navegação entre os níveis */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={activeStep === 0}
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              title="Nível Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-600 px-1">
              {activeStep + 1} / 5
            </span>
            <button
              type="button"
              disabled={activeStep === 4}
              onClick={() => setActiveStep((prev) => Math.min(4, prev + 1))}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              title="Próximo Nível"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Seletor rápido dos 5 Níveis */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {MENTAL_LEVELS_DETAILS.map((lvl, index) => {
            const isActive = index === activeStep;
            const isUserDiag = lvl.id === currentLevelId;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-white hover:bg-amber-50/50 text-slate-700 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] opacity-90">
                  <span>Nível {index + 1}</span>
                  {isUserDiag && (
                    <span className="w-2 h-2 rounded-full bg-amber-300 ring-2 ring-white" />
                  )}
                </div>
                <span className="block truncate mt-0.5">{lvl.name.split('—')[1]?.trim() || lvl.name}</span>
              </button>
            );
          })}
        </div>

        {/* Card do Nível Ativo (Apresentação Individual em Branco e Dourado) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-amber-50/40 to-white border border-amber-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-amber-800">
                Pontuação: {activeLevel.scoreRange}
              </span>
              <h3 className="text-base font-black text-slate-900">
                Metáfora: &ldquo;{activeLevel.imageMetaphor}&rdquo;
              </h3>
            </div>

            {isUserCurrentLevel && (
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-950 font-black text-xs border border-amber-300 flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Seu Nível Diagnosticado</span>
              </span>
            )}
          </div>

          {/* Resumo sucinto do livro */}
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {activeLevel.summary}
          </p>

          {/* Frase-Marco com Ação Direta */}
          <div className="pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
              Frase-Marco do Nível
            </span>
            <div className="p-4 rounded-xl bg-white border border-amber-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="italic text-xs sm:text-sm font-bold text-slate-800">
                &ldquo;{activeLevel.milestonePhrase}&rdquo;
              </div>

              <button
                type="button"
                onClick={() => setSelectedNextLevelPhrase(activeLevel.milestonePhrase)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isSelectedPhrase
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                }`}
              >
                {isSelectedPhrase ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>Frase Selecionada</span>
                  </>
                ) : (
                  <>
                    <Target className="w-3.5 h-3.5" />
                    <span>Adotar Esta Frase</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Rodapé de Navegação do Curso */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            disabled={activeStep === 0}
            onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Nível Anterior</span>
          </button>

          <button
            type="button"
            disabled={activeStep === 4}
            onClick={() => setActiveStep((prev) => Math.min(4, prev + 1))}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <span>Próximo Nível</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Seção Sucinta: Compromisso de 7 Dias */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-amber-200/80 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm sm:text-base font-black text-slate-900">
            Seu Compromisso dos Próximos 7 Dias
          </h2>
          <p className="text-xs text-slate-500">
            Fixe a frase-âncora e uma atitude prática para consolidar sua transição.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              Frase-Marco Ativa *
            </label>
            <input
              type="text"
              value={selectedNextLevelPhrase}
              onChange={(e) => setSelectedNextLevelPhrase(e.target.value)}
              placeholder="Clique em 'Adotar Esta Frase' acima ou digite sua afirmação..."
              className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              Primeira Ação Prática (7 dias) *
            </label>
            <input
              type="text"
              value={firstAction7Days}
              onChange={(e) => setFirstAction7Days(e.target.value)}
              placeholder="Ex.: Anotar todas as despesas diárias sem exceção..."
              className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
