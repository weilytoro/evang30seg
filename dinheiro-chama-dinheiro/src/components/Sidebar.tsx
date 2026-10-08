import React, { useState } from 'react';
import {
  Compass,
  User,
  Building2,
  Award,
  Settings,
  Lock,
  Unlock,
  Sparkles,
  X,
  ChevronDown,
  Layers,
  Receipt,
  CreditCard,
  Target as GoalIcon,
  FileSpreadsheet,
  Check,
  Circle,
  HelpCircle,
  Shield,
  Bell,
  TrendingUp,
  Sword,
} from 'lucide-react';
import { useJourney } from '../context/JourneyContext';
import { useMethodology } from '../context/MethodologyContext';
import { TRILHA1_MODULES } from '../data/journeyData';
import { getBrand } from '../utils/brand';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenAdminModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab = 'dashboard',
  setActiveTab,
  isOpenMobile = false,
  onCloseMobile,
  onOpenAdminModal,
}) => {
  const {
    completedModules,
    isModuleUnlocked,
    isModuleCompleted,
    pickNextModuleToFocus,
    trilha1Progress,
    trilha1Completed,
    userName,
    isAdmin,
    announcements = [],
  } = useJourney();

  const { platformMode } = useMethodology();
  const brand = getBrand(platformMode);

  const [isToolsExpanded, setIsToolsExpanded] = useState<boolean>(false);
  const [showLockedModal, setShowLockedModal] = useState<boolean>(false);

  const urgentCount = (announcements || []).filter((a) => a.isUrgent).length;

  const nextModuleId = pickNextModuleToFocus();

  const handleTabClick = (tabId: string) => {
    try {
      if (typeof setActiveTab === 'function') {
        setActiveTab(tabId || 'dashboard');
      }
    } catch (e) {
      console.error('Error switching tab:', e);
      setActiveTab('dashboard');
    }
    if (typeof onCloseMobile === 'function') {
      onCloseMobile();
    }
  };

  const handleModuleClick = (moduleId: number, tab: string) => {
    if (!isAdmin && !isModuleUnlocked(moduleId)) {
      setShowLockedModal(true);
      return;
    }
    handleTabClick(tab);
  };

  const handleTrilha2Click = () => {
    if (!isAdmin && !trilha1Completed) {
      setShowLockedModal(true);
    } else {
      handleTabClick('business');
    }
  };

  // Student Initials
  const getInitials = (nameStr: string) => {
    if (!nameStr || !nameStr.trim()) return 'AL';
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const studentDisplayName = userName.trim() || 'Aluno';
  const studentInitials = getInitials(userName);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Brand */}
        <div className="flex flex-col flex-1 min-h-0">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div
              onClick={() => handleTabClick('dashboard')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm tracking-wider shadow-sm group-hover:bg-emerald-600 transition-colors">
                DCD
              </div>
              <div className="leading-tight">
                <span className="font-black text-slate-900 text-sm block tracking-tight">
                  {brand.name}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 block">
                  {brand.subtitle}
                </span>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Visão Geral (Home / Single focus) */}
            <div>
              <button
                type="button"
                onClick={() => handleTabClick('dashboard')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Compass className="w-4 h-4 shrink-0" />
                <span>Início · Visão Geral</span>
              </button>
            </div>

            {/* SEÇÃO: Trilha 1 · CPF (Com progresso e Módulos 0 a 6) */}
            <div className="space-y-2">
              <div className="px-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-slate-900">Trilha 1 · CPF</span>
                  <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {trilha1Progress}%
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-400 block -mt-0.5">
                  {brand.trilha1Name}
                </span>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                    style={{ width: `${trilha1Progress}%` }}
                  />
                </div>
              </div>

              {/* Modules List (0 to 6) */}
              <div className="space-y-0.5 pt-1">
                {TRILHA1_MODULES.map((mod) => {
                  const isCurrentTab = activeTab === mod.tab;
                  const completed = isModuleCompleted(mod.id);
                  const unlocked = isModuleUnlocked(mod.id);
                  const isNext = nextModuleId === mod.id;

                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => handleModuleClick(mod.id, mod.tab)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isCurrentTab
                          ? 'bg-slate-100 text-slate-900 font-bold'
                          : unlocked
                          ? 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          : 'text-slate-400 hover:bg-slate-50/60 opacity-60'
                      }`}
                      title={!unlocked ? 'Bloqueado: Comece pelo diagnóstico (Módulo 0)' : ''}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {/* Status Icon */}
                        {completed ? (
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        ) : !unlocked ? (
                          <Lock className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        ) : isNext ? (
                          <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 ring-2 ring-emerald-200">
                            <Circle className="w-2 h-2 fill-white stroke-none" />
                          </span>
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        )}

                        <span className="truncate">
                          M{mod.id} · {mod.shortTitle}
                        </span>
                      </div>

                      {isNext && !completed && (
                        <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Foco
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Histórico de Mentalidade & Jornada Épica */}
              <div className="pt-2 space-y-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleTabClick('mentality_history')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'mentality_history'
                      ? 'bg-emerald-100 text-emerald-900 font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  title="Acompanhe sua evolução"
                >
                  <TrendingUp className="w-4 h-4 shrink-0" />
                  <span className="truncate">Histórico de Mentalidade</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabClick('epic_journey')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'epic_journey'
                      ? 'bg-purple-100 text-purple-900 font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  title="Sua jornada épica de libertação financeira"
                >
                  <Sword className="w-4 h-4 shrink-0" />
                  <span className="truncate">Jornada Épica</span>
                </button>
              </div>
            </div>

            {/* SEÇÃO: Trilha 2 · CNPJ */}
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={handleTrilha2Click}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  activeTab === 'business'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate text-left">
                  <Building2 className="w-4 h-4 shrink-0" />
                  <div>
                    <span className="block leading-tight font-black">Trilha 2 · CNPJ</span>
                    <span className="text-[10px] font-normal text-slate-400 block">
                      {brand.trilha2Name}
                    </span>
                  </div>
                </div>

                {!trilha1Completed ? (
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                ) : (
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Liberada
                  </span>
                )}
              </button>

              {/* Subitem Hub GERAR (aparece apenas quando Trilha 2 está liberada) */}
              {trilha1Completed && (
                <button
                  type="button"
                  onClick={() => handleTabClick('gerar')}
                  className={`w-full flex items-center gap-2 pl-9 pr-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'gerar'
                      ? 'bg-indigo-50 text-indigo-900 font-bold'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Hub GERAR · Radar 8D</span>
                </button>
              )}
            </div>

            {/* Ferramentas Operacionais Financeiras (Colapsável) */}
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsToolsExpanded(!isToolsExpanded)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-slate-700 transition-colors cursor-pointer"
              >
                <span>Ferramentas de Gestão</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isToolsExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isToolsExpanded && (
                <div className="space-y-0.5 pl-2">
                  <button
                    type="button"
                    onClick={() => handleTabClick('transactions')}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      activeTab === 'transactions'
                        ? 'bg-slate-100 text-slate-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Receipt className="w-3.5 h-3.5 text-slate-400" />
                    <span>Lançamentos & Extrato</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabClick('accounts')}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      activeTab === 'accounts'
                        ? 'bg-slate-100 text-slate-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    <span>Contas & Cartões</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabClick('budgets')}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      activeTab === 'budgets'
                        ? 'bg-slate-100 text-slate-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <GoalIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Orçamentos & Metas</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabClick('reports')}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      activeTab === 'reports'
                        ? 'bg-slate-100 text-slate-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
                    <span>Relatórios Mensais</span>
                  </button>
                </div>
              )}
            </div>

            {/* Selos & Configurações */}
            <div className="space-y-0.5 pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleTabClick('avisos')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'avisos'
                    ? 'bg-amber-500 text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:bg-amber-50/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-amber-600" />
                  <span>Avisos & Mural</span>
                </div>
                {urgentCount > 0 && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-600 text-white shadow-xs">
                    {urgentCount} urgente
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleTabClick('achievements')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'achievements'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>16 Conquistas & Selos</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabClick('settings')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Configurações & Reset</span>
              </button>

              {onOpenAdminModal && (
                <button
                  type="button"
                  onClick={onOpenAdminModal}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isAdmin
                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-600" />
                    <span>Modo Administrador</span>
                  </div>
                  <span
                    className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                      isAdmin ? 'bg-amber-600 text-white' : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    {isAdmin ? 'Ativo' : 'OFF'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Rodapé da Sidebar: Nome e Iniciais do Aluno */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-black text-xs shrink-0">
              {studentInitials}
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <span className="font-bold text-xs text-slate-900 truncate block">
                {studentDisplayName}
              </span>
              <span className="text-[10px] text-slate-400 block truncate">
                {brand.footerCredits}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Modal Aviso Trilha 2 Bloqueada */}
      {showLockedModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 border border-slate-100 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200/60 shadow-xs">
              <Lock className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-black text-slate-900">
                Interior Antes de Exterior
              </h3>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                &ldquo;Não se constrói um CNPJ próspero sobre um CPF desordenado.&rdquo;
              </p>
              <p className="text-xs text-slate-500">
                A Trilha 2 (Empreendedorismo) só é liberada após a conclusão integral dos 7 módulos
                da Trilha 1. Seu progresso atual é de <strong>{trilha1Progress}%</strong>.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowLockedModal(false);
                handleTabClick('quiz');
              }}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Continuar Trilha 1
            </button>
          </div>
        </div>
      )}
    </>
  );
};
