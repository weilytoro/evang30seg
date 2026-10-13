import React from 'react';
import {
  Heart,
  Scroll,
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { useMethodology } from '../../context/MethodologyContext';
import { useJourney } from '../../context/JourneyContext';
import { getBrand } from '../../utils/brand';

interface PurposeViewProps {
  onUnlockTrilha2?: () => void;
}

export const PurposeView: React.FC<PurposeViewProps> = () => {
  const { platformMode } = useMethodology();
  const {
    purposeChallengingMoment,
    setPurposeChallengingMoment,
    purposeLessonsLearned,
    setPurposeLessonsLearned,
    purposeStatement,
    setPurposeStatement,
    purposeLegacyLetter,
    setPurposeLegacyLetter,
    purposeRereadDate,
    setPurposeRereadDate,
  } = useJourney();

  const brand = getBrand(platformMode);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
              <Heart className="w-4 h-4" />
              <span>Módulo 6 · Dor com Propósito & Rito de Passagem</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Transformando Cicatrizes em Sabedoria & Legado
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-3xl leading-relaxed">
              {brand.isBiblical
                ? '"Sabemos que Deus age em todas as coisas para o bem daqueles que o amam" (Romanos 8,28). Quando a dor encontra um sentido no Reino, ela vira semente, testemunho e alicerce.'
                : 'Resgate seus aprendizados de crises financeiras passadas, estruture seu propósito de longo prazo e crie sua carta de compromisso e legado familiar.'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atividade 1: Revisitar Histórias */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <h2 className="text-base font-bold text-slate-900">
              1. O Momento Mais Desafiador
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Qual foi o momento financeiro mais difícil que você já enfrentou? Nomear o medo tira o poder dele.
          </p>

          <textarea
            rows={4}
            value={purposeChallengingMoment}
            onChange={(e) => setPurposeChallengingMoment(e.target.value)}
            placeholder="Ex.: Quando o aluguel atrasou e eu não sabia como pagar as contas básicas da casa..."
            className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-slate-200 bg-slate-50 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Atividade 2: Lições Aprendidas */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">
              2. Lições Aprendidas na Crise *
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Quais foram as verdades inegociáveis que essa dor ensinou para você e sua família? (Critério do módulo)
          </p>

          <textarea
            rows={4}
            value={purposeLessonsLearned}
            onChange={(e) => setPurposeLessonsLearned(e.target.value)}
            placeholder="Ex.: 1. Crédito não é renda; 2. Preciso ter reserva de emergência antes de qualquer investimento; 3. Falar a verdade em família cura a vergonha..."
            className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-slate-200 bg-slate-50 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {purposeLessonsLearned.trim().length >= 3 && (
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Lições registradas com sucesso
            </span>
          )}
        </div>
      </div>

      {/* Atividade 3: Frase de Propósito */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-bold text-slate-900">
            3. Sua Frase de Propósito & Identidade *
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          Como a sua superação financeira se tornará instrumento para abençoar sua casa e outras pessoas?
        </p>

        <textarea
          rows={2}
          value={purposeStatement}
          onChange={(e) => setPurposeStatement(e.target.value)}
          placeholder="Ex.: Quero que minha história ajude meus filhos e minha comunidade a não viverem a escravidão das dívidas, mas a liberdade e a prosperidade com propósito."
          className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-slate-200 bg-slate-50 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        {purposeStatement.trim().length >= 3 && (
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Declaração de propósito preenchida
          </span>
        )}
      </div>

      {/* Atividade 4: Carta de Legado */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Scroll className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">
            4. Carta de Legado aos seus Sucessores
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          Escreva uma carta para seus filhos, sobrinhos ou gerações futuras sobre a sabedoria financeira que você está construindo.
        </p>

        <textarea
          rows={5}
          value={purposeLegacyLetter}
          onChange={(e) => setPurposeLegacyLetter(e.target.value)}
          placeholder="Ex.: Queridos filhos, escrevo esta carta para que vocês saibam que nosso sobrenome não será lembrado por dívidas ou vergonha, mas pela fidelidade, trabalho digno, generosidade e sabedoria..."
          className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-slate-200 bg-slate-50 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Data marcada para reler esta carta com a família:</span>
          </div>
          <input
            type="date"
            value={purposeRereadDate}
            onChange={(e) => setPurposeRereadDate(e.target.value)}
            className="text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:bg-white focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
