import React from 'react';
import {
  ArrowRight,
  Brain,
  Shield,
  ShieldAlert,
  Flame,
  HeartHandshake,
  TrendingUp,
  TrendingDown,
  Wallet,
  Landmark,
  CreditCard,
  Target,
  PlusCircle,
  ArrowRightLeft,
  Calendar,
  AlertCircle,
  Circle,
  Lock,
  Unlock,
  Sparkles,
  Building2,
  CheckCircle2,
  Sliders,
  DollarSign,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';
import { useMethodology } from '../../context/MethodologyContext';
import { useFinance } from '../../context/FinanceContext';
import { useOctalysisScore } from '../../hooks/useOctalysisScore';
import { OctalysisRadar } from '../common/OctalysisRadar';
import { TRILHA1_MODULES } from '../../data/journeyData';
import { getBrand } from '../../utils/brand';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface DashboardViewProps {
  setActiveTab: (tab: string) => void;
  onOpenTransactionModal?: () => void;
  onOpenTransferModal?: () => void;
  onOpenAdminModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  setActiveTab,
  onOpenTransactionModal,
  onOpenTransferModal,
  onOpenAdminModal,
}) => {
  const {
    completedModules = [],
    isModuleCompleted,
    isModuleUnlocked,
    pickNextModuleToFocus,
    trilha1Progress = 0,
    trilha1Completed = false,
    userName = '',
    nextQuizAvailableDate = null,
    is90DaysReviewDue = false,
    entryModule = 1,
    isAdmin = false,
    toggleAdminMode,
    adminUnlockAllModules,
    announcements = [],
  } = useJourney();

  const {
    quizResult = null,
    hasCnpjOrIntends = false,
    platformMode = 'casa',
  } = useMethodology();

  const {
    totalBalance = 0,
    totalCreditDebt = 0,
    netWorth = 0,
    monthlyIncome = 0,
    monthlyExpenses = 0,
    monthlyBalance = 0,
    savingsRate = 0,
    accounts = [],
    transactions = [],
    goals = [],
    budgets = [],
    pendingPayables = [],
    selectedMonth = new Date().toISOString().substring(0, 7),
  } = useFinance();

  // Octalysis system - Real progress tracking
  const octalysisScore = useOctalysisScore({
    transactions,
    budgets,
    accounts,
    goals,
    quizResult,
    modulesCompleted: completedModules,
    trilaCompleted: trilha1Completed,
    currentMonth: selectedMonth,
  });

  const brand = getBrand(platformMode);
  const isQuizDone = Boolean(quizResult);
  const nextModuleId = pickNextModuleToFocus ? pickNextModuleToFocus() : null;

  const nextMeta =
    nextModuleId !== null ? TRILHA1_MODULES.find((m) => m.id === nextModuleId) : null;

  // Single focus card dynamic information
  let stepCategory = 'Módulo 0 · Diagnóstico de Entrada';
  let title = 'Diagnóstico dos 5 Níveis de Mentalidade';
  let summary =
    'Descubra qual das 5 mentalidades financeiras rege sua vida atual e receba seu plano personalizado de transformação.';
  let ctaLabel = 'Iniciar diagnóstico gratuito';
  let targetTab = 'quiz';
  let isIndicatedByQuiz = false;

  if (!isQuizDone) {
    stepCategory = 'Módulo 0 · Diagnóstico de Entrada';
    title = 'Diagnóstico dos 5 Níveis de Mentalidade';
    summary =
      'Faça o teste de 10 perguntas do livro para descobrir se sua mente está Bloqueada, Estagnada, em Transição, em Construção ou Evoluída.';
    ctaLabel = 'Iniciar diagnóstico gratuito';
    targetTab = 'quiz';
  } else if (!trilha1Completed && nextMeta) {
    stepCategory = nextMeta.stepCategory;
    title = nextMeta.title;
    summary = nextMeta.summary;
    targetTab = nextMeta.tab;
    isIndicatedByQuiz = nextMeta.id === entryModule && nextMeta.id !== 1;
    ctaLabel = `Continuar: Módulo ${nextMeta.id} · ${nextMeta.shortTitle}`;
  } else if (trilha1Completed) {
    stepCategory = 'Trilha 1 Concluída · Rito de Passagem Realizado';
    title = 'Trilha 2 · Empreendedorismo Liberada';
    summary =
      'Parabéns! Sua fundação financeira pessoal está alinhada. Avance para a governança e gestão do seu negócio.';
    ctaLabel = 'Acessar a Trilha 2';
    targetTab = 'business';
  }

  const studentDisplayName = userName.trim() || 'Aluno';

  // Bank accounts vs cards
  const bankAccounts = (accounts || []).filter((a) => a?.type !== 'credit_card');
  const creditCards = (accounts || []).filter((a) => a?.type === 'credit_card');
  const recentTransactions = (transactions || []).slice(0, 5);

  const urgentAnnouncements = (announcements || []).filter((a) => a.isUrgent);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Avisos Urgentes (Fixados pelo Administrador) */}
      {urgentAnnouncements.length > 0 && (
        <div className="space-y-2.5">
          {urgentAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-white rounded-3xl shadow-md border-2 border-amber-300 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-amber-900 font-black text-[10px] uppercase tracking-wider shadow-xs">
                    🚨 Comunicado Urgente
                  </span>
                  <span className="text-xs text-amber-100 font-bold">{ann.author}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('avisos')}
                  className="text-xs text-amber-100 hover:text-white font-bold underline cursor-pointer"
                >
                  Ver no Mural
                </button>
              </div>
              <h3 className="text-sm sm:text-base font-black tracking-tight">{ann.title}</h3>
              <p className="text-xs sm:text-sm text-amber-50 leading-relaxed font-medium">{ann.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Admin Mode Floating Alert Bar */}
      {isAdmin && (
        <div className="p-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5 text-xs font-bold">
            <Shield className="w-5 h-5 text-amber-200 shrink-0" />
            <span>
              <strong>Modo Administrador Ativo:</strong> Todos os módulos, Trilha 2 e controles de usuário estão totalmente desbloqueados.
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAdminModal && (
              <button
                type="button"
                onClick={onOpenAdminModal}
                className="px-3 py-1 bg-white text-slate-900 hover:bg-amber-50 font-black text-xs rounded-xl shadow-xs cursor-pointer transition-all"
              >
                Abrir Painel Admin
              </button>
            )}
            <button
              type="button"
              onClick={toggleAdminMode}
              className="px-3 py-1 bg-slate-900/60 hover:bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer transition-all"
            >
              Voltar para Modo Aluno
            </button>
          </div>
        </div>
      )}

      {/* 90-Day Review Notification */}
      {is90DaysReviewDue && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold block">Revisão de 90 dias disponível!</span>
              <span>
                Completou-se o ciclo de 3 meses desde seu último teste. Refaça o diagnóstico para
                medir a evolução da sua mentalidade.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shrink-0 cursor-pointer self-start sm:self-auto"
          >
            Refazer Teste
          </button>
        </div>
      )}

      {/* Saudação com Nome & Ações Rápidas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Olá, {studentDisplayName}!
            </h1>
            {quizResult?.title && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {quizResult.title}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {brand.name} • {brand.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenTransactionModal && (
            <button
              type="button"
              onClick={onOpenTransactionModal}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nova Transação</span>
            </button>
          )}

          {onOpenTransferModal && (
            <button
              type="button"
              onClick={onOpenTransferModal}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Transferência</span>
            </button>
          )}

          {onOpenAdminModal && (
            <button
              type="button"
              onClick={onOpenAdminModal}
              className={`px-3 py-2 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all border cursor-pointer ${
                isAdmin
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
              }`}
              title="Abrir Painel de Administração"
            >
              <Shield className="w-4 h-4 text-amber-600" />
              <span>{isAdmin ? 'Admin Ativo' : 'Modo Admin'}</span>
            </button>
          )}
        </div>
      </div>

      {/* OCTALYSIS FRAMEWORK - Real Progress Gamification */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
        <OctalysisRadar metrics={octalysisScore} />
      </div>

      {/* Pergunta e Oferta do Diagnóstico (Exibido estritamente se AINDA NÃO FOI FEITO) */}
      {!isQuizDone && (
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-amber-50 via-white to-amber-50/50 border-2 border-amber-300 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
                <Brain className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                  Passo 0 Indispensável
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Você já realizou o Diagnóstico Financeiro dos 5 Níveis?
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl leading-relaxed">
                  Antes de avançar, descubra se sua mente financeira está Bloqueada, Estagnada, em Transição, em Construção ou Evoluída.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('quiz')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <span>Fazer Diagnóstico Gratuito</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* KPIs Financeiros Principais (Restaurados e Enriquecidos) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Saldo Total */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Saldo em Contas
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {formatCurrency(totalBalance)}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Patrimônio líquido: <strong className="text-slate-700">{formatCurrency(netWorth)}</strong>
            </p>
          </div>
        </div>

        {/* Receitas do Mês */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Receitas no Mês
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-600">
              {formatCurrency(monthlyIncome)}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Entradas registradas no período
            </p>
          </div>
        </div>

        {/* Despesas do Mês */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Despesas no Mês
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-rose-600">
              {formatCurrency(monthlyExpenses)}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Faturas cartão: <strong className="text-purple-700">{formatCurrency(totalCreditDebt)}</strong>
            </p>
          </div>
        </div>

        {/* Balanço Líquido & Taxa de Poupança */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Balanço Líquido
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div
              className={`text-2xl font-black ${
                monthlyBalance >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {formatCurrency(monthlyBalance)}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Taxa de poupança: <strong className="text-slate-800">{savingsRate}%</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Cartão de Foco Único da Metodologia "Dinheiro Chama Dinheiro?" */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold text-emerald-300 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {stepCategory}
              {isIndicatedByQuiz && ' · indicado pelo seu diagnóstico'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {summary}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab(targetTab)}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] cursor-pointer"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={adminUnlockAllModules}
                className="px-4 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/30 transition-all cursor-pointer"
              >
                Destravar Toda a Jornada
              </button>
            )}
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10 pointer-events-none">
          <Brain className="w-72 h-72 text-white" />
        </div>
      </div>

      {/* Seção Central em 2 Colunas: Contas/Cartões & Metas/Transações */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1 & 2: Contas Bancárias & Transações Recentes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contas Bancárias */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Suas Contas & Cartões
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('accounts')}
                className="text-xs text-indigo-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Ver todas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(accounts || []).slice(0, 4).map((acc) => {
                const isCard = acc.type === 'credit_card';
                return (
                  <div
                    key={acc.id}
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: acc.color || '#4f46e5' }}
                      >
                        {isCard ? <CreditCard className="w-4 h-4" /> : <Wallet className="w-4 h-4" />}
                      </div>
                      <div>
                        <strong className="block text-xs text-slate-900 truncate max-w-[130px]">
                          {acc.name}
                        </strong>
                        <span className="text-[10px] text-slate-500 capitalize">
                          {isCard ? 'Fatura Cartão' : acc.type}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs font-black ${
                          isCard ? 'text-purple-700' : acc.balance >= 0 ? 'text-slate-900' : 'text-rose-600'
                        }`}
                      >
                        {formatCurrency(acc.balance)}
                      </span>
                    </div>
                  </div>
                );
              })}

              {(accounts || []).length === 0 && (
                <div className="col-span-2 text-center py-6 text-slate-400 text-xs">
                  Nenhuma conta cadastrada ainda.
                </div>
              )}
            </div>
          </div>

          {/* Transações Recentes */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Últimas Movimentações
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('transactions')}
                className="text-xs text-indigo-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Ver extrato completo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {recentTransactions.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <div
                    key={tx.id}
                    className="p-3 rounded-2xl hover:bg-slate-50 border border-slate-100 flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}
                      >
                        {isIncome ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <strong className="block text-xs text-slate-900 leading-tight">
                          {tx.description}
                        </strong>
                        <span className="text-[10px] text-slate-500">
                          {formatDate(tx.date)} • {tx.category}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs font-black block ${
                          isIncome ? 'text-emerald-600' : 'text-slate-900'
                        }`}
                      >
                        {isIncome ? '+' : '-'} {formatCurrency(Math.abs(tx.amount))}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                          tx.status === 'completed' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {tx.status === 'completed' ? 'Pago' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                );
              })}

              {recentTransactions.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Nenhuma transação lançada neste mês.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Coluna 3: Metas Financeiras & Alertas */}
        <div className="space-y-6">
          {/* Metas em Andamento */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-sm">Metas Financeiras</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('budgets_goals')}
                className="text-xs text-indigo-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Ver todas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {(goals || []).slice(0, 3).map((g) => {
                const progress = g.targetAmount > 0 ? Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)) : 0;
                return (
                  <div key={g.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <strong className="text-slate-900 truncate max-w-[150px]">{g.title}</strong>
                      <span className="text-slate-500 font-bold">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{formatCurrency(g.currentAmount)}</span>
                      <span>de {formatCurrency(g.targetAmount)}</span>
                    </div>
                  </div>
                );
              })}

              {(goals || []).length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Nenhuma meta cadastrada ainda.
                </div>
              )}
            </div>
          </div>

          {/* Aviso da Trilha 2 (CNPJ) */}
          {hasCnpjOrIntends && !trilha1Completed && (
            <div className="p-4 bg-indigo-50/80 border border-indigo-200/80 rounded-2xl flex items-start gap-3 text-xs text-indigo-950 font-semibold shadow-xs">
              <Building2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-indigo-900">Trilha 2: {brand.trilha2Name}</strong>
                <p className="text-[11px] text-indigo-800/80 mt-1 leading-relaxed">
                  Não se constrói um CNPJ próspero sobre um CPF desordenado. Conclua os passos pessoais da Trilha 1 para liberar a gestão da sua empresa.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Linha do Tempo Visual dos 7 Módulos + CNPJ */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Linha do Tempo da Jornada Integrada
            </h3>
            <p className="text-xs text-slate-500">
              Interior antes de exterior: conclua cada marco em sequência.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Trilha 1:</span>
            <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all"
                style={{ width: `${trilha1Progress}%` }}
              />
            </div>
            <strong className="text-slate-900">{trilha1Progress}%</strong>
          </div>
        </div>

        {/* 7 Modules + CNPJ Timeline Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {TRILHA1_MODULES.map((mod) => {
            const completed = isModuleCompleted(mod.id);
            const unlocked = isModuleUnlocked(mod.id);
            const isNext = nextModuleId === mod.id;

            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => {
                  if (unlocked) setActiveTab(mod.tab);
                }}
                disabled={!unlocked}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  completed
                    ? 'bg-emerald-50/70 border-emerald-300 text-slate-900 cursor-pointer hover:bg-emerald-50'
                    : isNext
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm cursor-pointer'
                    : unlocked
                    ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer'
                    : 'bg-slate-100/60 border-slate-200 text-slate-400 cursor-not-allowed opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold ${isNext ? 'text-emerald-400' : 'text-slate-400'}`}>
                    M{mod.id}
                  </span>
                  {completed ? (
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">
                      ✓
                    </span>
                  ) : !unlocked ? (
                    <Lock className="w-3.5 h-3.5 text-slate-300" />
                  ) : isNext ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-200" />
                  ) : (
                    <Circle className="w-3 h-3 text-slate-300" />
                  )}
                </div>
                <div className="text-xs font-black leading-tight truncate">{mod.shortTitle}</div>
              </button>
            );
          })}

          {/* 8th Slot: Trilha 2 (CNPJ) */}
          <button
            type="button"
            onClick={() => {
              if (trilha1Completed || isAdmin) setActiveTab('business');
            }}
            disabled={!trilha1Completed && !isAdmin}
            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
              trilha1Completed || isAdmin
                ? 'bg-indigo-50 border-indigo-300 text-slate-900 cursor-pointer hover:bg-indigo-100/50'
                : 'bg-slate-100/60 border-slate-200 text-slate-400 cursor-not-allowed opacity-50'
            }`}
            title={!trilha1Completed && !isAdmin ? 'Bloqueada até a conclusão da Trilha 1' : 'Acessar Trilha 2'}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-400">CNPJ</span>
              {trilha1Completed || isAdmin ? (
                <Unlock className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-slate-300" />
              )}
            </div>
            <div className="text-xs font-black leading-tight truncate">Trilha 2</div>
          </button>
        </div>
      </div>
    </div>
  );
};
