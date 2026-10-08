import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Award,
  ChevronRight,
  Building2,
  User,
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../../data/methodologyData';
import { useMethodology } from '../../context/MethodologyContext';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToChapter?: (chapter: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  onNavigateToChapter,
}) => {
  const { quizResult, saveQuizResult, retakeQuiz, hasCnpjOrIntends } = useMethodology();

  const [currentStep, setCurrentStep] = useState(0); // 0 to 9 for questions, 10 for context, 11 for result
  const [answers, setAnswers] = useState<{ [qId: number]: { letter: string; points: number } }>({});
  const [cnpjAnswer, setCnpjAnswer] = useState<boolean>(hasCnpjOrIntends);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = QUIZ_QUESTIONS[currentStep];

  const handleSelectOption = (letter: any, points: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: { letter, points },
    }));
  };

  const handleNext = () => {
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep === QUIZ_QUESTIONS.length - 1) {
      // Step to context question (CNPJ)
      setCurrentStep(QUIZ_QUESTIONS.length);
    } else {
      // Finalize
      const total = Object.values(answers || {})?.reduce((sum, a) => sum + (a?.points || 0), 0);
      saveQuizResult(total, cnpjAnswer);
      setIsFinished(true);
    }
  };

  const handleFinishAndNavigate = (chapter: number) => {
    onClose();
    if (onNavigateToChapter) {
      onNavigateToChapter(chapter);
    }
  };

  // If already has quiz result and not in retake mode, show result view directly
  const showExistingResult = quizResult && !isFinished && currentStep === 0 && Object.keys(answers).length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200/90 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Diagnóstico dos 5 Níveis de Mentalidade Financeira
              </h3>
              <span className="text-xs text-slate-500">
                Baseado no livro oficial "Dinheiro Chama Dinheiro?"
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Show Existing Result or Start Retake */}
        {showExistingResult && (
          <div className="mt-6 space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Seu Diagnóstico Atual
                </span>
                <span className="text-sm font-black bg-emerald-600 text-white px-3 py-1 rounded-full shadow-sm">
                  {quizResult.totalScore} / 50 pontos
                </span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                {quizResult.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
                {quizResult.description}
              </p>
              <div className="mt-4 p-3.5 bg-white/90 rounded-xl border border-emerald-200 text-xs sm:text-sm text-emerald-950 font-semibold flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{quizResult.recommendedAction}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  retakeQuiz();
                  setAnswers({});
                  setCurrentStep(0);
                  setIsFinished(false);
                }}
                className="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
              >
                Refazer Teste (10 Perguntas)
              </button>

              <button
                type="button"
                onClick={() => handleFinishAndNavigate(quizResult.keyChapter)}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Acessar Capítulo {quizResult.keyChapter} Recomendado</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* In-Progress Quiz Questions */}
        {!showExistingResult && !isFinished && currentStep < QUIZ_QUESTIONS.length && (
          <div className="mt-6 space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-semibold">
                <span>Pergunta {currentStep + 1} de {QUIZ_QUESTIONS.length}</span>
                <span>{Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Box */}
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200">
              <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {currentQ.question}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Responda pelo que você fez nos últimos 3 meses, não pelo que gostaria de ter feito.
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {(currentQ?.options || [])?.map((opt) => {
                const isSelected = answers[currentQ.id]?.letter === opt.letter;
                return (
                  <button
                    key={opt.letter}
                    type="button"
                    onClick={() => handleSelectOption(opt.letter, opt.points)}
                    className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold shadow-sm ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {opt.letter}
                    </span>
                    <span className="pt-0.5">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
                className="px-4 py-2 text-xs sm:text-sm text-slate-500 disabled:opacity-30 hover:bg-slate-100 rounded-xl font-medium"
              >
                Voltar
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!answers[currentQ.id]}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>Próxima</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Context Question (Passo 1 do Roteiro Integrado: pergunta de contexto CNPJ) */}
        {!showExistingResult && !isFinished && currentStep === QUIZ_QUESTIONS.length && (
          <div className="mt-6 space-y-6">
            <div className="p-6 rounded-2xl bg-indigo-50/80 border border-indigo-200">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase">
                <Building2 className="w-4 h-4" />
                <span>Pergunta de Contexto & Trilha Futura</span>
              </div>
              <h4 className="text-lg font-black text-slate-900 mt-2">
                Você já tem CNPJ aberto ou pretende abrir um negócio próprio?
              </h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Essa resposta prepara a sua jornada: após concluir a Trilha de Educação Financeira Cristã (CPF), você destravá a Trilha de Empreendedorismo Cristão (CNPJ).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setCnpjAnswer(true)}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  cnpjAnswer
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold shadow-md ring-2 ring-indigo-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Building2 className="w-6 h-6 text-indigo-600" />
                  {cnpjAnswer && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                </div>
                <div className="font-black text-base text-slate-900">Sim, já tenho ou pretendo</div>
                <p className="text-xs text-slate-500 mt-1">
                  Quero organizar minhas finanças pessoais primeiro e depois estruturar meu negócio com base bíblica.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setCnpjAnswer(false)}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  !cnpjAnswer
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold shadow-md ring-2 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <User className="w-6 h-6 text-emerald-600" />
                  {!cnpjAnswer && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                </div>
                <div className="font-black text-base text-slate-900">Apenas Pessoa Física (CPF)</div>
                <p className="text-xs text-slate-500 mt-1">
                  Meu foco é exclusivamente gerenciar e prosperar minhas finanças pessoais e familiares.
                </p>
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(QUIZ_QUESTIONS.length - 1)}
                className="px-4 py-2 text-xs sm:text-sm text-slate-500 hover:bg-slate-100 rounded-xl font-medium"
              >
                Voltar
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
              >
                <span>Concluir Diagnóstico</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Newly Finished Result View */}
        {isFinished && quizResult && (
          <div className="mt-6 space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Diagnóstico Concluído
                </span>
                <span className="text-sm font-black bg-emerald-600 text-white px-3 py-1 rounded-full shadow-sm">
                  {quizResult.totalScore} / 50 pontos
                </span>
              </div>
              <h4 className="text-2xl font-black text-slate-900 mt-2">
                {quizResult.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
                {quizResult.description}
              </p>
              <div className="mt-4 p-3.5 bg-white/90 rounded-xl border border-emerald-200 text-xs sm:text-sm text-emerald-950 font-semibold flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{quizResult.recommendedAction}</span>
              </div>
            </div>

            {hasCnpjOrIntends && (
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-xs sm:text-sm text-indigo-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>
                    <strong>Trilha 2 (Empreendedorismo Cristão)</strong> preparada para você! Complete a Trilha 1 para desbloquear.
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => handleFinishAndNavigate(quizResult.keyChapter)}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Acessar Capítulo {quizResult.keyChapter} Recomendado</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
