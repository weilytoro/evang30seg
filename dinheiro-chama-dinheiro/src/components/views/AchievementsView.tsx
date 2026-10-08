import React from 'react';
import {
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  Star,
  ShieldCheck,
  Flame,
  HeartHandshake,
  TrendingUp,
  Unlock,
  Coins,
  Scroll,
  Building2,
  Split,
  FileSpreadsheet,
  Receipt,
  Tag,
  Target,
} from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';
import { useMethodology } from '../../context/MethodologyContext';
import { useFinance } from '../../context/FinanceContext';
import { useSavingsBadges } from '../../hooks/useSavingsBadges';
import { SavingsBadgesDisplay } from '../common/SavingsBadgesDisplay';

export const AchievementsView: React.FC = () => {
  const {
    isModuleCompleted,
    trilha1Completed,
    trilha1CompletedAt,
    bizDiagnosisDone,
    bizPlanMode,
    pfPjStepCompleted,
    dreClosedMonths,
    cashflowConfirmed,
    savedPrices,
    reserveGoalAccepted,
    resolvedGargalos,
  } = useJourney();

  const { quizResult, jesusDebts = [] } = useMethodology();
  const { transactions, budgets, selectedMonth } = useFinance();

  // Savings badges
  const { badges, summary } = useSavingsBadges({
    transactions,
    budgets,
    currentMonth: selectedMonth,
  });

  const isQuizDone = isModuleCompleted(0) || Boolean(quizResult);
  const isM1Done = isModuleCompleted(1);
  const isM2Done = isModuleCompleted(2);
  const isM3Done = isModuleCompleted(3);
  const isM4Done = isModuleCompleted(4);
  const hasPaidDebt = (jesusDebts || []).some((d) => d?.paid);
  const isM5Done = isModuleCompleted(5);
  const isM6Done = isModuleCompleted(6);

  // Trilha 2 badges status
  const isT2DiagDone = trilha1Completed && (bizDiagnosisDone || bizPlanMode === 'abertura');
  const isT2PfpjDone = trilha1Completed && pfPjStepCompleted;
  const isT2DreDone = trilha1Completed && dreClosedMonths.length > 0;
  const isT2CashflowDone = trilha1Completed && cashflowConfirmed;
  const isT2PriceDone = trilha1Completed && savedPrices.length > 0;
  const isT2ReserveDone = trilha1Completed && reserveGoalAccepted;
  const isT2GargaloDone = trilha1Completed && resolvedGargalos.length > 0;

  const trilha1Badges = [
    {
      id: 'b1',
      title: 'Raio-X de Consciência',
      description: 'Concluiu o Diagnóstico dos 5 Níveis e descobriu o seu padrão mental.',
      icon: Star,
      isUnlocked: isQuizDone,
      detail: isQuizDone && quizResult ? `${quizResult.totalScore}/50 pontos` : 'Pendente',
    },
    {
      id: 'b2',
      title: 'Espelho Renovado',
      description: 'Compreendeu o dinheiro como espelho da mente e assumiu a frase-marco.',
      icon: Sparkles,
      isUnlocked: isM1Done,
      detail: isM1Done ? 'Conquistado' : 'Módulo 1',
    },
    {
      id: 'b3',
      title: 'Quebrador de Correntes',
      description: 'Identificou e quebrou padrões herdados de escassez e culpa.',
      icon: ShieldCheck,
      isUnlocked: isM2Done,
      detail: isM2Done ? 'Conquistado' : 'Módulo 2',
    },
    {
      id: 'b4',
      title: 'Guardião dos Hábitos',
      description: 'Mapeou os 7 Inimigos Ocultos e colocou barreiras protetoras na rotina.',
      icon: Flame,
      isUnlocked: isM3Done,
      detail: isM3Done ? 'Conquistado' : 'Módulo 3',
    },
    {
      id: 'b5',
      title: 'Plano de Libertação',
      description: 'Estruturou a ordem de ataque às pendências pelo Método JESUS.',
      icon: HeartHandshake,
      isUnlocked: isM4Done,
      detail: isM4Done ? 'Conquistado' : 'Módulo 4',
    },
    {
      id: 'b6',
      title: 'Dívida Quitada',
      description: 'Liquidou e honrou ao menos uma pendência financeira da sua lista.',
      icon: CheckCircle2,
      isUnlocked: hasPaidDebt,
      detail: hasPaidDebt ? 'Celebrado!' : 'Pendente',
    },
    {
      id: 'b7',
      title: 'Semeador Fértil',
      description: 'Mapeou talentos adormecidos e ativou novas fontes de renda familiar.',
      icon: Coins,
      isUnlocked: isM5Done,
      detail: isM5Done ? 'Conquistado' : 'Módulo 5',
    },
    {
      id: 'b8',
      title: 'Dor com Propósito',
      description: 'Transformou cicatrizes em sabedoria e escreveu sua carta de legado.',
      icon: Scroll,
      isUnlocked: isM6Done,
      detail: isM6Done ? 'Conquistado' : 'Módulo 6',
    },
    {
      id: 'b9',
      title: 'Rito de Passagem',
      description: 'Concluiu integralmente a Trilha 1 pessoal e destravou o CNPJ.',
      icon: Award,
      isUnlocked: trilha1Completed,
      detail:
        trilha1Completed && trilha1CompletedAt
          ? new Date(trilha1CompletedAt).toLocaleDateString('pt-BR')
          : 'Pendente',
    },
  ];

  const trilha2Badges = [
    {
      id: 'b10',
      title: 'Negócio Diagnosticado',
      description: 'Mapeou a maturidade da empresa ou estruturou o Plano de Abertura.',
      icon: Building2,
      isUnlocked: isT2DiagDone,
      detail: !trilha1Completed ? 'Após a Trilha 1' : isT2DiagDone ? 'Conquistado' : 'Pendente',
    },
    {
      id: 'b11',
      title: 'Contas Separadas',
      description: 'Ergueu a muralha PF/PJ e fixou o pró-labore mensal inegociável.',
      icon: Split,
      isUnlocked: isT2PfpjDone,
      detail: !trilha1Completed ? 'Após a Trilha 1' : isT2PfpjDone ? 'Conquistado' : 'Pendente',
    },
    {
      id: 'b12',
      title: 'DRE do Mês 1 Fechado',
      description: 'Fechou o primeiro demonstrativo oficial com cálculo de lucro real.',
      icon: FileSpreadsheet,
      isUnlocked: isT2DreDone,
      detail: !trilha1Completed ? 'Após a Trilha 1' : isT2DreDone ? 'Fechado ✓' : 'Pendente',
    },
    {
      id: 'b13',
      title: 'Caixa à Vista',
      description: 'Projetou o fluxo de caixa dos próximos 30 dias com saldo diário.',
      icon: Receipt,
      isUnlocked: isT2CashflowDone,
      detail: !trilha1Completed ? 'Após a Trilha 1' : isT2CashflowDone ? 'Conquistado' : 'Pendente',
    },
    {
      id: 'b14',
      title: 'Preço com Método',
      description: 'Calculou o preço de venda através da fórmula de mark-up divisor.',
      icon: Tag,
      isUnlocked: isT2PriceDone,
      detail: !trilha1Completed ? 'Após a Trilha 1' : isT2PriceDone ? 'Conquistado' : 'Pendente',
    },
    {
      id: 'b15',
      title: 'Reserva PJ em Construção',
      description: 'Assumiu a meta de 3 meses de despesas fixas para blindagem do negócio.',
      icon: ShieldCheck,
      isUnlocked: isT2ReserveDone,
      detail: !trilha1Completed ? 'Após a Trilha 1' : isT2ReserveDone ? 'Meta Assumida' : 'Pendente',
    },
    {
      id: 'b16',
      title: 'Gargalo Vencido',
      description: 'Focou em até 2 frentes e marcou um gargalo estratégico como resolvido.',
      icon: Target,
      isUnlocked: isT2GargaloDone,
      detail: !trilha1Completed ? 'Após a Trilha 1' : isT2GargaloDone ? 'Vencido!' : 'Pendente',
    },
  ];

  const totalUnlocked =
    trilha1Badges.filter((b) => b.isUnlocked).length +
    trilha2Badges.filter((b) => b.isUnlocked).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200/60 mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Gamificação Baseada em Conquistas Reais</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Quadro de 16 Selos & Marcos Conquistados
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Nenhum selo aqui é fictício. Cada medalha reflete uma vitória verdadeira na sua vida
            financeira pessoal (Trilha 1) ou na governança da sua empresa (Trilha 2).
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Selos Desbloqueados
          </span>
          <div className="text-2xl font-black text-slate-900 mt-0.5">
            {totalUnlocked} <span className="text-sm font-medium text-slate-400">/ 16</span>
          </div>
        </div>
      </div>

      {/* Savings Badges - Gamificação de Poupança */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <SavingsBadgesDisplay badges={badges} summary={summary} />
      </div>

      {/* Trilha 1 Badges (9 Selos) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h2 className="text-base font-bold text-slate-900">
            Trilha 1 · Educação Financeira Pessoal (9 Selos)
          </h2>
          <span className="text-xs text-slate-500">
            {trilha1Badges.filter((b) => b.isUnlocked).length} de 9
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {trilha1Badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  badge.isUnlocked
                    ? 'bg-white border-emerald-300 shadow-xs ring-1 ring-emerald-500/10'
                    : 'bg-slate-50/60 border-slate-200 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        badge.isUnlocked
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {badge.isUnlocked ? (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {badge.detail}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        {badge.detail}
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-sm text-slate-900">{badge.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trilha 2 Badges (7 Selos) */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h2 className="text-base font-bold text-slate-900">
            Trilha 2 · Empreendedorismo & CNPJ (7 Selos)
          </h2>
          <span className="text-xs text-slate-500">
            {trilha2Badges.filter((b) => b.isUnlocked).length} de 7
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {trilha2Badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  badge.isUnlocked
                    ? 'bg-white border-indigo-300 shadow-xs ring-1 ring-indigo-500/10'
                    : 'bg-slate-50/60 border-slate-200 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        badge.isUnlocked
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {badge.isUnlocked ? (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {badge.detail}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        {badge.detail}
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-sm text-slate-900">{badge.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
