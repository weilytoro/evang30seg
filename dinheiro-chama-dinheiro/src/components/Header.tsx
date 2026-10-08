import React, { useState } from 'react';
import {
  TrendingUp,
  PlusCircle,
  Upload,
  RotateCcw,
  Download,
  Calendar,
  Sparkles,
  ChevronDown,
  Check,
  MoreVertical,
  Layers,
  ArrowRight,
  Menu,
  HeartHandshake,
  Brain,
  Shield,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { useMethodology } from '../context/MethodologyContext';
import { useJourney } from '../context/JourneyContext';
import { exportToCSV, exportToJSON } from '../utils/fileParser';
import { formatCurrency, getMonthName } from '../utils/formatters';

interface HeaderProps {
  onOpenTransactionModal: () => void;
  onOpenTransferModal: () => void;
  onOpenQuizModal?: () => void;
  onOpenJesusModal?: () => void;
  onOpenAdminModal?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTransactionModal,
  onOpenTransferModal,
  onOpenJesusModal,
  onOpenAdminModal,
  activeTab,
  setActiveTab,
  onToggleMobileSidebar,
}) => {
  const {
    selectedMonth,
    setSelectedMonth,
    availableMonths,
    transactions,
    accounts,
    budgets,
    goals,
    netWorth,
  } = useFinance();

  const {
    platformMode,
    setPlatformMode,
    quizResult,
  } = useMethodology();

  const isQuizDone = Boolean(quizResult);

  const {
    trilha1Progress,
    userName,
    isAdmin,
  } = useJourney();

  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const handleExportAll = () => {
    exportToCSV(transactions, `finansmart_extrato_${selectedMonth}.csv`);
  };

  const handleExportBackup = () => {
    exportToJSON(
      { transactions, accounts, budgets, goals, exportedAt: new Date().toISOString() },
      'backup_finansmart.json'
    );
  };

  // Get current active month display name
  const getSelectedMonthLabel = () => {
    if (selectedMonth === 'all') return 'Todo o Período';
    const [year, month] = selectedMonth.split('-');
    const monthName = getMonthName(parseInt(month, 10) - 1);
    return `${monthName} / ${year}`;
  };

  // Active Tab Title and Breadcrumb with correct module numbering
  const currentTabInfo = (() => {
    switch (activeTab) {
      case 'dashboard':
        return { track: 'Jornada Integrada', title: 'Visão Geral da Jornada' };
      case 'quiz':
        return { track: 'Trilha 1: CPF • Módulo 0', title: 'Diagnóstico de Entrada' };
      case 'levels':
        return { track: 'Trilha 1: CPF • Módulo 1', title: 'Mentalidade Financeira' };
      case 'beliefs':
        return { track: 'Trilha 1: CPF • Módulo 2', title: 'Quebra de Correntes' };
      case 'enemies':
        return { track: 'Trilha 1: CPF • Módulo 3', title: 'A Força dos Hábitos' };
      case 'jesus_method':
        return { track: 'Trilha 1: CPF • Módulo 4', title: 'Libertação: Método JESUS' };
      case 'multiplication':
        return { track: 'Trilha 1: CPF • Módulo 5', title: 'Multiplique seus Talentos' };
      case 'purpose':
        return { track: 'Trilha 1: CPF • Módulo 6', title: 'Dor com Propósito' };
      case 'business':
        return { track: 'Trilha 2: CNPJ', title: 'Governança & Gestão' };
      case 'gerar':
        return { track: 'Trilha 2: CNPJ', title: 'Hub GERAR · Radar 8D' };
      case 'achievements':
        return { track: 'Gamificação Real', title: '16 Conquistas & Selos' };
      case 'settings':
        return { track: 'Configurações', title: 'Preferências da Conta' };
      case 'transactions':
        return { track: 'Operações Financeiras', title: 'Extrato de Lançamentos' };
      case 'accounts':
        return { track: 'Contas & Cartões', title: 'Patrimônio Líquido' };
      case 'budgets':
        return { track: 'Planejamento', title: 'Tetos de Gastos & Metas' };
      case 'reports':
        return { track: 'Inteligência de Caixa', title: 'Relatórios Financeiros' };
      case 'import':
        return { track: 'Integrações', title: 'Importação & Backup' };
      default:
        return { track: 'Plataforma', title: 'Visão Geral' };
    }
  })();

  const isFinancialTab = ['transactions', 'accounts', 'budgets', 'reports'].includes(activeTab);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* 1. Left: Mobile Menu Toggle + Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            {onToggleMobileSidebar && (
              <button
                type="button"
                onClick={onToggleMobileSidebar}
                className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                aria-label="Abrir menu lateral"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider">
                <span className="truncate">{currentTabInfo.track}</span>
                {currentTabInfo.track.startsWith('Trilha 1') && (
                  <span className="inline-flex items-center text-[10px] font-black px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                    {trilha1Progress}%
                  </span>
                )}
              </div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 truncate tracking-tight">
                {currentTabInfo.title}
              </h1>
            </div>
          </div>

          {/* 2. Center: Month Picker (Visible on financial tools) */}
          {isFinancialTab && (
            <div className="hidden md:flex items-center gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowContextMenu(!showContextMenu)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{getSelectedMonthLabel()}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showContextMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowContextMenu(false)}
                    />
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-1.5 z-50 text-xs max-h-60 overflow-y-auto">
                      <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Filtrar por Mês
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMonth('all');
                          setShowContextMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 ${
                          selectedMonth === 'all' ? 'font-bold text-emerald-600 bg-emerald-50/50' : 'text-slate-700'
                        }`}
                      >
                        <span>Todo o Período</span>
                        {selectedMonth === 'all' && <Check className="w-3.5 h-3.5" />}
                      </button>

                      {availableMonths.map((m) => {
                        const [year, month] = m.split('-');
                        const label = `${getMonthName(parseInt(month, 10) - 1)} ${year}`;
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => {
                              setSelectedMonth(m);
                              setShowContextMenu(false);
                            }}
                            className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 ${
                              selectedMonth === m ? 'font-bold text-emerald-600 bg-emerald-50/50' : 'text-slate-700'
                            }`}
                          >
                            <span>{label}</span>
                            {selectedMonth === m && <Check className="w-3.5 h-3.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Patrimônio Líquido */}
              <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
                <span className="text-slate-500">Patrimônio:</span>
                <span className="font-bold text-slate-900">{formatCurrency(netWorth)}</span>
              </div>
            </div>
          )}

          {/* 3. Right: Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Direct Diagnóstico Button — Somente se AINDA NÃO FOI FEITO */}
            {!isQuizDone && (
              <button
                type="button"
                onClick={() => setActiveTab('quiz')}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                title="Acessar o Diagnóstico dos 5 Níveis"
              >
                <Brain className="w-4 h-4 text-amber-600" />
                <span className="hidden sm:inline">Fazer Diagnóstico</span>
              </button>
            )}

            {/* Red Button: Método JESUS */}
            <button
              type="button"
              onClick={() => setActiveTab('jesus_method')}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              title="Acessar Método JESUS & Dívidas"
            >
              <HeartHandshake className="w-4 h-4 stroke-[2.2]" />
              <span className="hidden sm:inline">Método JESUS</span>
              <span className="sm:hidden">JESUS</span>
            </button>

            {/* Admin Panel Button */}
            {onOpenAdminModal && (
              <button
                type="button"
                onClick={onOpenAdminModal}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  isAdmin
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90'
                }`}
                title="Painel de Controle do Administrador"
              >
                <Shield className="w-4 h-4 text-amber-600" />
                <span className="hidden md:inline">{isAdmin ? 'Admin Ativo' : 'Admin'}</span>
              </button>
            )}

            {/* Primary Action Button: No celular mostra só o ícone */}
            <button
              type="button"
              onClick={onOpenTransactionModal}
              className="inline-flex items-center justify-center gap-1.5 p-2 sm:px-3.5 sm:py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
              title="Novo Lançamento Financeiro"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.2]" />
              <span className="hidden sm:inline">Novo Lançamento</span>
            </button>

            {/* More Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu(!showMoreMenu);
                  setShowContextMenu(false);
                }}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200/70 cursor-pointer"
                title="Mais opções e dados"
                aria-expanded={showMoreMenu}
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMoreMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMoreMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Jornada & Metodologia
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('quiz');
                        setShowMoreMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Diagnóstico dos 5 Níveis</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('levels');
                        setShowMoreMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <Brain className="w-4 h-4 text-emerald-600" />
                      <span>Módulo 1 · Mentalidade</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('business');
                        setShowMoreMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <Layers className="w-4 h-4 text-indigo-600" />
                      <span>Trilha 2 · Empreendedorismo</span>
                    </button>

                    {onOpenAdminModal && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenAdminModal();
                          setShowMoreMenu(false);
                        }}
                        className="w-full text-left px-3.5 py-2 text-amber-900 bg-amber-50/60 hover:bg-amber-100 flex items-center gap-2 font-bold cursor-pointer"
                      >
                        <Shield className="w-4 h-4 text-amber-600" />
                        <span>Painel do Administrador</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <div className="px-3.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Modo da Plataforma
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPlatformMode(platformMode === 'casa' ? 'institucional' : 'casa');
                        setShowMoreMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center justify-between font-medium cursor-pointer"
                    >
                      <span>Modo: {platformMode === 'casa' ? 'Casa (Bíblico)' : 'Institucional'}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        Trocar
                      </span>
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    <div className="px-3.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Exportações & Dados
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleExportAll();
                        setShowMoreMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-slate-400" />
                      <span>Exportar Extrato (CSV)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleExportBackup();
                        setShowMoreMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-slate-400" />
                      <span>Backup Completo (JSON)</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
