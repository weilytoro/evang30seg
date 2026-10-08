import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Building2,
  ChevronRight,
  BookOpen,
  Calendar,
  TrendingUp,
  TrendingDown,
  User,
  AlertCircle,
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../../data/methodologyData';
import { useMethodology } from '../../context/MethodologyContext';
import { useJourney } from '../../context/JourneyContext';
import { getBrand } from '../../utils/brand';

interface QuizViewProps {
  onNavigateToChapter: (chapter: number) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ onNavigateToChapter }) => {
  const { quizResult, saveQuizResult, hasCnpjOrIntends, platformMode } = useMethodology();
  const {
    userName,
    setUserName,
    quizHistory,
    recordQuizCompleted,
    nextQuizAvailableDate,
    is90DaysReviewDue,
    scoreDifferenceFromLast,
    trilha1Completed,
  } = useJourney();

  const brand = getBrand(platformMode);

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [qId: number]: { letter: string; points: number } }>({});
  const [cnpjAnswer, setCnpjAnswer] = useState<boolean>(hasCnpjOrIntends);
  const [tempUserName, setTempUserName] = useState<string>(userName);
  const [isRetakingLocally, setIsRetakingLocally] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentStep];

  const handleSelectOption = (letter: string, points: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: { letter, points },
    }));
  };

  const handleNext = () => {
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep === QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(QUIZ_QUESTIONS.length);
    } else {
      // Calculate score
      const total = Object.values(answers || {}).reduce((sum, a) => sum + (a?.points || 0), 0);

      const finalName = tempUserName.trim() || userName.trim();
      if (finalName) {
        setUserName(finalName);
      }

      saveQuizResult(total, cnpjAnswer, finalName);

      // Determine level title for history
      let levelKey = 'transicao';
      let levelTitle = 'Mentalidade Financeira em Transição';
      if (total <= 19) {
        levelKey = 'bloqueada';
        levelTitle = 'Mentalidade Financeira Bloqueada';
      } else if (total <= 27) {
        levelKey = 'estagnada';
        levelTitle = 'Mentalidade Financeira Estagnada';
      } else if (total <= 35) {
        levelKey = 'transicao';
        levelTitle = 'Mentalidade Financeira em Transição';
      } else if (total <= 43) {
        levelKey = 'construcao';
        levelTitle = 'Mentalidade Financeira em Construção';
      } else {
        levelKey = 'evoluida';
        levelTitle = 'Mentalidade Financeira Evoluída';
      }

      recordQuizCompleted(total, levelKey, levelTitle, cnpjAnswer);

      setIsFinished(true);
      setIsRetakingLocally(false);
    }
  };

  const showExisting = quizResult && !isFinished && !isRetakingLocally;

  const displayName = userName.trim() ? userName.trim() : 'Aluno';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 90 Days Review Alert if due */}
      {is90DaysReviewDue && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-900 shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold block">Ciclo de 90 dias concluído!</span>
              <span>
                Já se passaram 90 dias desde o seu último teste. Refaça o diagnóstico para medir a
                sua evolução real de mentalidade.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setCurrentStep(0);
              setIsFinished(false);
              setIsRetakingLocally(true);
            }}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shrink-0 cursor-pointer"
          >
            Refazer Agora
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-emerald-800 tracking-wider">
                Módulo 0 · Diagnóstico de Entrada
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                Diagnóstico dos 5 Níveis de Mentalidade Financeira
              </h1>
            </div>
          </div>

          {showExisting && (
            <button
              onClick={() => {
                setAnswers({});
                setCurrentStep(0);
                setIsFinished(false);
                setIsRetakingLocally(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refazer Teste</span>
            </button>
          )}
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Baseado na regra de ouro de Weily Toro Machado:{' '}
          <em className="text-slate-800">
            &ldquo;Responda pelo que você fez nos últimos três meses, não pelo que gostaria de fazer. Se
            ficar em dúvida entre duas alternativas, escolha a mais desconfortável — é ela que
            costuma dizer a verdade.&rdquo;
          </em>
        </p>
      </div>

      {/* Existing Result Card */}
      {showExisting && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Seu Diagnóstico Financeiro, {displayName}
              </span>
              <div className="flex items-center gap-2">
                {scoreDifferenceFromLast !== null && (
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full ${
                      scoreDifferenceFromLast >= 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {scoreDifferenceFromLast >= 0 ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    {scoreDifferenceFromLast > 0 ? `+${scoreDifferenceFromLast}` : scoreDifferenceFromLast} pts
                  </span>
                )}
                <span className="text-base font-black bg-emerald-600 text-white px-3.5 py-1 rounded-full shadow-sm">
                  {quizResult.totalScore} / 50 pontos
                </span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              {quizResult.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-700 mt-2.5 leading-relaxed">
              {quizResult.description}
            </p>

            <div className="mt-5 p-4 bg-white rounded-xl border border-emerald-200 text-xs sm:text-sm text-emerald-950 font-bold flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] uppercase text-emerald-800 font-extrabold tracking-wider">
                  Recomendação do Método:
                </span>
                <span>{quizResult.recommendedAction}</span>
              </div>
            </div>

            {/* CNPJ expectation banner if applicable */}
            {hasCnpjOrIntends && !trilha1Completed && (
              <div className="mt-4 p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-2.5 text-xs text-indigo-950 font-semibold">
                <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  Ao concluir sua jornada pessoal (Trilha 1), você vai destravar a{' '}
                  <strong>Trilha 2 — {brand.trilha2Name}</strong>.
                </span>
              </div>
            )}

            {/* 90 Days Review Badge */}
            {nextQuizAvailableDate && (
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>
                  <strong>Revisão de 90 dias:</strong> Refaça o teste a partir de{' '}
                  <span className="font-bold text-slate-700">{nextQuizAvailableDate}</span>.
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => onNavigateToChapter(quizResult.keyChapter)}
              className="p-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-sm transition-all flex items-center justify-between cursor-pointer"
            >
              <span>Ir para o Módulo {quizResult.keyChapter} Indicado</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setAnswers({});
                setCurrentStep(0);
                setIsFinished(false);
                setIsRetakingLocally(true);
              }}
              className="p-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Responder Novamente o Teste</span>
            </button>
          </div>

          {/* History of Last 12 Diagnoses */}
          {quizHistory && quizHistory.length > 1 && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Histórico de Diagnósticos Recentes
              </h3>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
                {quizHistory.slice(0, 12).map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{item.completedAt}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-700 font-medium">{item.levelTitle}</span>
                    </div>
                    <span className="font-black bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800">
                      {item.score} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Taking Quiz Questions */}
      {(!showExisting || isRetakingLocally) && !isFinished && currentStep < QUIZ_QUESTIONS.length && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-bold">
              <span>
                Questão {currentStep + 1} de {QUIZ_QUESTIONS.length}
              </span>
              <span>{Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <h4 className="text-base sm:text-lg font-black text-slate-900">
              {currentQ.question}
            </h4>
          </div>

          <div className="space-y-3">
            {(currentQ?.options || []).map((opt) => {
              const isSelected = answers[currentQ.id]?.letter === opt.letter;
              return (
                <button
                  key={opt.letter}
                  type="button"
                  onClick={() => handleSelectOption(opt.letter, opt.points)}
                  className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all flex items-start gap-3.5 cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/90 text-emerald-950 font-bold shadow-sm ring-2 ring-emerald-500'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center shrink-0 ${
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

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2 text-xs sm:text-sm text-slate-500 disabled:opacity-30 hover:bg-slate-100 rounded-xl font-medium cursor-pointer"
            >
              Voltar
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!answers[currentQ.id]}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              <span>Próxima</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Context Step (CNPJ + Name) */}
      {(!showExisting || isRetakingLocally) && !isFinished && currentStep === QUIZ_QUESTIONS.length && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-200">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase">
              <Building2 className="w-4 h-4" />
              <span>Direcionamento Estratégico</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 mt-2">
              Você já possui CNPJ aberto ou pretende empreender?
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Conforme o Método: primeiro estruturamos a base financeira pessoal (Trilha 1), e em
              seguida destravamos a Trilha de Empreendedorismo (Trilha 2).
            </p>
          </div>

          {/* Name input */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-500" />
              <span>Como você quer ser chamado no seu diagnóstico? (Opcional)</span>
            </label>
            <input
              type="text"
              value={tempUserName}
              onChange={(e) => setTempUserName(e.target.value)}
              placeholder="Digite seu nome ou como prefere ser chamado..."
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setCnpjAnswer(true)}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                cnpjAnswer
                  ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="font-bold text-base text-slate-900">Sim, pretendo ou tenho CNPJ</div>
              <p className="text-xs text-slate-500 mt-1">
                Ao concluir sua jornada pessoal, você vai destravar a Trilha 2 — {brand.trilha2Name}.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setCnpjAnswer(false)}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                !cnpjAnswer
                  ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="font-bold text-base text-slate-900">Apenas Pessoa Física (CPF)</div>
              <p className="text-xs text-slate-500 mt-1">
                Foco integral em finanças pessoais, quitação de dívidas e multiplicação de talentos.
              </p>
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentStep(QUIZ_QUESTIONS.length - 1)}
              className="px-4 py-2 text-xs sm:text-sm text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Ver Meu Diagnóstico</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Finished Result View */}
      {isFinished && quizResult && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Seu Diagnóstico Financeiro, {displayName}
              </span>
              <span className="text-base font-black bg-emerald-600 text-white px-3.5 py-1 rounded-full shadow-sm">
                {quizResult.totalScore} / 50 pontos
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              {quizResult.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-700 mt-2.5 leading-relaxed">
              {quizResult.description}
            </p>

            <div className="mt-5 p-4 bg-white rounded-xl border border-emerald-200 text-xs sm:text-sm text-emerald-950 font-bold flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] uppercase text-emerald-800 font-extrabold tracking-wider">
                  Recomendação do Livro:
                </span>
                <span>{quizResult.recommendedAction}</span>
              </div>
            </div>

            {hasCnpjOrIntends && !trilha1Completed && (
              <div className="mt-4 p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-2.5 text-xs text-indigo-950 font-semibold">
                <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  Ao concluir sua jornada pessoal, você vai destravar a{' '}
                  <strong>Trilha 2 — {brand.trilha2Name}</strong>.
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => onNavigateToChapter(quizResult.keyChapter)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Acessar Módulo {quizResult.keyChapter} Indicado</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
