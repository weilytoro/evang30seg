import React from 'react';
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';
import { BizDiagnosisAnswers } from '../../utils/bizCalc';

const QUESTIONS = [
  {
    key: 'faturamento' as keyof BizDiagnosisAnswers,
    title: '1. Você sabe quanto o negócio fatura por mês?',
    options: [
      { value: 1, text: 'Não sei com segurança' },
      { value: 2, text: 'Sei aproximadamente' },
      { value: 3, text: 'Sei o valor exato, mês a mês' },
    ],
  },
  {
    key: 'separacao' as keyof BizDiagnosisAnswers,
    title: '2. As contas pessoais e as da empresa são separadas?',
    options: [
      { value: 1, text: 'Uso a mesma conta para tudo' },
      { value: 2, text: 'Tenho conta PJ, mas às vezes misturo' },
      { value: 3, text: 'Totalmente separadas, com pró-labore fixo' },
    ],
  },
  {
    key: 'lucro' as keyof BizDiagnosisAnswers,
    title: '3. Você sabe qual é o lucro real depois de custos, despesas e pró-labore?',
    options: [
      { value: 1, text: 'Não sei' },
      { value: 2, text: 'Tenho uma ideia, mas não calculo' },
      { value: 3, text: 'Sim, calculo todo mês (DRE)' },
    ],
  },
  {
    key: 'preco' as keyof BizDiagnosisAnswers,
    title: '4. Como você forma o preço do que vende?',
    options: [
      { value: 1, text: 'No achismo' },
      { value: 2, text: 'Olhando o preço do concorrente' },
      { value: 3, text: 'Custo direto + despesas rateadas + margem' },
    ],
  },
  {
    key: 'caixa' as keyof BizDiagnosisAnswers,
    title: '5. Você registra entradas e saídas do caixa?',
    options: [
      { value: 1, text: 'Não registro' },
      { value: 2, text: 'Às vezes, em caderno ou planilha solta' },
      { value: 3, text: 'Sim, com projeção dos próximos dias' },
    ],
  },
  {
    key: 'reserva' as keyof BizDiagnosisAnswers,
    title: '6. O negócio tem reserva de emergência?',
    options: [
      { value: 1, text: 'Nenhuma' },
      { value: 2, text: 'Menos de 3 meses de despesas fixas' },
      { value: 3, text: '3 meses ou mais de despesas fixas' },
    ],
  },
];

interface BizDiagnosisStepProps {
  onAdvanceToStep2: () => void;
}

export const BizDiagnosisStep: React.FC<BizDiagnosisStepProps> = ({ onAdvanceToStep2 }) => {
  const {
    bizPlanMode,
    setBizPlanMode,
    bizDiagnosisAnswers,
    setBizDiagnosisAnswers,
    bizDiagnosisDone,
    setBizDiagnosisDone,
    bizLevel,
  } = useJourney();

  const handleSelectAnswer = (key: keyof BizDiagnosisAnswers, val: number) => {
    setBizDiagnosisAnswers({
      ...bizDiagnosisAnswers,
      [key]: val,
    });
  };

  const handleFinishQuestions = () => {
    setBizDiagnosisDone(true);
  };

  const handleSelectAbertura = () => {
    setBizPlanMode('abertura');
    setBizDiagnosisDone(true);
  };

  const handleSelectCnpj = () => {
    setBizPlanMode('cnpj');
    setBizDiagnosisDone(false);
  };

  const handleRefazer = () => {
    setBizDiagnosisDone(false);
    setBizPlanMode(null);
  };

  // If student hasn't chosen whether they already have a CNPJ or are planning opening:
  if (!bizPlanMode) {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Etapa 1 · Diagnóstico do Negócio
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Qual é a situação atual do seu empreendimento?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Escolha como você deseja conduzir a sua jornada na Trilha 2:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={handleSelectCnpj}
            className="p-6 rounded-2xl border border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50 text-left transition-all space-y-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-black text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
              Já tenho CNPJ ativo
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Diagnóstico de reorganização para identificar o nível atual da empresa (Caos total, Controle parcial ou Base organizada).
            </p>
          </button>

          <button
            type="button"
            onClick={handleSelectAbertura}
            className="p-6 rounded-2xl border border-slate-200 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/30 text-left transition-all space-y-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-black text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
              Ainda não tenho CNPJ (Plano de Abertura)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              O negócio já nasce blindado: contas separadas desde a concepção, com DRE, fluxo e preço projetados antes da primeira venda.
            </p>
          </button>
        </div>
      </div>
    );
  }

  // If Plano de Abertura is chosen
  if (bizPlanMode === 'abertura') {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Plano de Abertura de Negócio
            </span>
            <button
              type="button"
              onClick={handleRefazer}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Trocar modalidade</span>
            </button>
          </div>

          <h2 className="text-2xl font-black text-slate-900">
            O negócio que já nasce estruturado
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Parabéns pela decisão de planejar antes de executar. No Plano de Abertura, você dispensa
            o questionário de caos e avança diretamente para a definição do seu pró-labore e das
            ferramentas projetadas (DRE, Fluxo de Caixa e Formação de Preço) para iniciar com lucro real.
          </p>

          <div className="p-4 bg-white rounded-xl border border-emerald-200 text-xs text-emerald-950 font-semibold space-y-1">
            <span className="block font-bold">Pilares da Abertura Saudável:</span>
            <span>1. Conta bancária exclusiva aberta antes da primeira venda;</span>
            <span className="block">2. Preço de venda calculado com método técnico (não achismo);</span>
            <span>3. Pró-labore fixado para não sangrar o caixa no início.</span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onAdvanceToStep2}
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Avançar para Etapa 2: Separação PF/PJ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // If CNPJ questionnaire is completed: show result
  if (bizDiagnosisDone && bizLevel !== null) {
    const levelInfo = {
      1: {
        title: 'Nível 1 — Caos Total',
        badge: 'bg-rose-100 text-rose-800 border-rose-300',
        carac: 'Não sabe com clareza o faturamento; mistura despesas de casa com a empresa; sem DRE e sem fluxo de caixa.',
        recom: 'Abrir conta bancária exclusiva PJ imediatamente; definir pró-labore fixo; anotar 100% das movimentações pelos próximos 30 dias.',
      },
      2: {
        title: 'Nível 2 — Controle Parcial',
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        carac: 'Sabe o faturamento mensal, mas não o lucro real após pró-labore; forma preços baseando-se no concorrente ou achismo.',
        recom: 'Fechar o DRE de pelo menos 1 mês de referência; recalcular o preço com a fórmula correta de mark-up divisor.',
      },
      3: {
        title: 'Nível 3 — Base Organizada, Crescimento Travado',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        carac: 'Contas PF e PJ totalmente separadas com pró-labore fixo; calcula DRE e preço com rigor técnico; falta reserva de 3 meses.',
        recom: 'Construir a reserva técnica de 3 meses de despesas fixas e atacar gargalos fora do financeiro (Vendas, Processos ou Equipe).',
      },
    }[bizLevel as 1 | 2 | 3];

    return (
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Resultado do Diagnóstico do Negócio
            </span>
            <span className={`text-xs font-black px-3 py-1 rounded-full border ${levelInfo?.badge}`}>
              {levelInfo?.title}
            </span>
          </div>

          <h2 className="text-2xl font-black text-slate-900">{levelInfo?.title}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1 text-xs">
              <strong className="block text-slate-900 font-bold uppercase text-[10px]">
                Diagnóstico Identificado:
              </strong>
              <p className="text-slate-600">{levelInfo?.carac}</p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1 text-xs">
              <strong className="block text-emerald-900 font-bold uppercase text-[10px]">
                Ação Imediata Recomendada:
              </strong>
              <p className="text-emerald-900">{levelInfo?.recom}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleRefazer}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refazer Diagnóstico</span>
          </button>

          <button
            type="button"
            onClick={onAdvanceToStep2}
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Avançar para Etapa 2: Separação PF/PJ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Questionnaire form for CNPJ reorganization
  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Etapa 1 · Diagnóstico de Reorganização
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
            Autoavaliação das 6 Áreas de Gestão do CNPJ
          </h2>
        </div>
        <button
          type="button"
          onClick={handleRefazer}
          className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          Voltar
        </button>
      </div>

      <div className="space-y-5">
        {QUESTIONS.map((q) => {
          const currentVal = bizDiagnosisAnswers[q.key];
          return (
            <div key={q.key} className="space-y-2 p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">{q.title}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {q.options.map((opt) => {
                  const isSelected = currentVal === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectAnswer(q.key, opt.value)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleFinishQuestions}
          className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Calcular Nível do Negócio</span>
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
