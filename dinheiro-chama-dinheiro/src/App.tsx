import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { FinanceProvider } from './context/FinanceContext';
import { MethodologyProvider } from './context/MethodologyContext';
import { JourneyProvider, useJourney } from './context/JourneyContext';
import { GerarProvider } from './context/GerarContext';
import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';

// Financial Engine Views
import { DashboardView } from './components/views/DashboardView';
import { AchievementsView } from './components/views/AchievementsView';
import { SettingsView } from './components/views/SettingsView';
import { TransactionsView } from './components/views/TransactionsView';
import { AccountsView } from './components/views/AccountsView';
import { BudgetsGoalsView } from './components/views/BudgetsGoalsView';
import { ReportsView } from './components/views/ReportsView';
import { ImportExportView } from './components/views/ImportExportView';
import { AvisosView } from './components/views/AvisosView';

// Methodology & Book Views
import { QuizView } from './components/methodology/QuizView';
import { LevelsView } from './components/methodology/LevelsView';
import { BeliefsView } from './components/methodology/BeliefsView';
import { EnemiesView } from './components/methodology/EnemiesView';
import { JesusMethodView } from './components/methodology/JesusMethodView';
import { MultiplicationView } from './components/methodology/MultiplicationView';
import { PurposeView } from './components/methodology/PurposeView';
import { BusinessTrackView } from './components/methodology/BusinessTrackView';
import { GerarHubView } from './components/gerar/GerarHubView';
import { MentalityHistoryView } from './components/views/MentalityHistoryView';
import { EpicJourneyView } from './components/views/EpicJourneyView';

// Modals
import { QuizModal } from './components/methodology/QuizModal';
import { JesusMethodModal } from './components/modals/JesusMethodModal';
import { TransactionModal } from './components/modals/TransactionModal';
import { TransferModal } from './components/modals/TransferModal';
import { AccountModal } from './components/modals/AccountModal';
import { GoalModal } from './components/modals/GoalModal';
import { ContributionModal } from './components/modals/ContributionModal';
import { BudgetModal } from './components/modals/BudgetModal';
import { AdminPanelModal } from './components/modals/AdminPanelModal';

import { Account, Budget, FinancialGoal, Transaction } from './types/finance';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const { trilha1Completed = false, trilha1Progress = 0, isAdmin = false } = useJourney();

  // Modals state (safely initialized)
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isJesusModalOpen, setIsJesusModalOpen] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txToEdit, setTxToEdit] = useState<Transaction | null>(null);

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<Account | null>(null);

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<FinancialGoal | null>(null);

  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [goalForContribution, setGoalForContribution] = useState<FinancialGoal | null>(null);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState<Budget | null>(null);

  const handleNavigateToChapter = (chapter: number) => {
    try {
      switch (chapter) {
        case 0:
          setActiveTab('quiz');
          break;
        case 1:
          setActiveTab('levels');
          break;
        case 2:
          setActiveTab('beliefs');
          break;
        case 3:
          setActiveTab('enemies');
          break;
        case 4:
          setActiveTab('jesus_method');
          break;
        case 5:
          setActiveTab('multiplication');
          break;
        case 6:
          setActiveTab('purpose');
          break;
        default:
          setActiveTab('dashboard');
      }
    } catch {
      setActiveTab('dashboard');
    }
  };

  // 2. Gestão de Estado da Navegação Segura:
  // Renderiza com fallback obrigatório para a Visão Geral se o módulo não for reconhecido
  const renderActiveModuleView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            setActiveTab={setActiveTab}
            onOpenTransactionModal={() => {
              setTxToEdit(null);
              setIsTxModalOpen(true);
            }}
            onOpenTransferModal={() => setIsTransferModalOpen(true)}
            onOpenAdminModal={() => setIsAdminModalOpen(true)}
          />
        );

      case 'quiz':
        return <QuizView onNavigateToChapter={handleNavigateToChapter} />;

      case 'levels':
        return <LevelsView />;

      case 'mentality_history':
        return <MentalityHistoryView />;

      case 'epic_journey':
        return <EpicJourneyView />;

      case 'beliefs':
        return <BeliefsView />;

      case 'enemies':
        return <EnemiesView />;

      case 'jesus_method':
        return <JesusMethodView />;

      case 'multiplication':
        return <MultiplicationView />;

      case 'purpose':
        return <PurposeView onUnlockTrilha2={() => setActiveTab('business')} />;

      case 'business':
        if (!trilha1Completed && !isAdmin) {
          return (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs text-center max-w-lg mx-auto my-8 space-y-5 animate-in fade-in duration-200">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200/60">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-xl font-bold text-slate-900">
                  Trilha 2: CNPJ Protegida
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Conclua os 6 passos fundamentais da Trilha 1 (CPF) para liberar a gestão empresarial.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center justify-between">
                <span>Progresso Trilha 1:</span>
                <span className="font-bold text-slate-900">{trilha1Progress}%</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-all shadow-xs"
              >
                Voltar à Jornada Pessoal
              </button>
            </div>
          );
        }
        return <BusinessTrackView onNavigateToGerar={() => setActiveTab('gerar')} />;

      case 'gerar':
        if (!trilha1Completed) {
          return <DashboardView setActiveTab={setActiveTab} />;
        }
        return <GerarHubView />;

      case 'achievements':
        return <AchievementsView />;

      case 'settings':
        return <SettingsView />;

      case 'transactions':
        return (
          <TransactionsView
            onOpenTransactionModal={() => {
              setTxToEdit(null);
              setIsTxModalOpen(true);
            }}
            onEditTransaction={(tx) => {
              setTxToEdit(tx);
              setIsTxModalOpen(true);
            }}
            onOpenImportModal={() => setActiveTab('import')}
          />
        );

      case 'accounts':
        return (
          <AccountsView
            onOpenAccountModal={() => {
              setAccountToEdit(null);
              setIsAccountModalOpen(true);
            }}
            onEditAccount={(acc) => {
              setAccountToEdit(acc);
              setIsAccountModalOpen(true);
            }}
            onOpenTransferModal={() => setIsTransferModalOpen(true)}
          />
        );

      case 'budgets':
        return (
          <BudgetsGoalsView
            onOpenBudgetModal={() => {
              setBudgetToEdit(null);
              setIsBudgetModalOpen(true);
            }}
            onEditBudget={(b) => {
              setBudgetToEdit(b);
              setIsBudgetModalOpen(true);
            }}
            onOpenGoalModal={() => {
              setGoalToEdit(null);
              setIsGoalModalOpen(true);
            }}
            onEditGoal={(g) => {
              setGoalToEdit(g);
              setIsGoalModalOpen(true);
            }}
            onOpenContributionModal={(g) => {
              setGoalForContribution(g);
              setIsContributionModalOpen(true);
            }}
          />
        );

      case 'reports':
        return <ReportsView />;

      case 'import':
        return <ImportExportView />;

      case 'avisos':
        return <AvisosView />;

      // Fallback seguro: renderiza a Visão Geral
      default:
        return (
          <DashboardView
            setActiveTab={setActiveTab}
            onOpenTransactionModal={() => {
              setTxToEdit(null);
              setIsTxModalOpen(true);
            }}
            onOpenTransferModal={() => setIsTransferModalOpen(true)}
            onOpenAdminModal={() => setIsAdminModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      {/* Sidebar with simplified macro groupings */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Header */}
        <Header
          onOpenTransactionModal={() => {
            setTxToEdit(null);
            setIsTxModalOpen(true);
          }}
          onOpenTransferModal={() => setIsTransferModalOpen(true)}
          onOpenQuizModal={() => setIsQuizModalOpen(true)}
          onOpenJesusModal={() => setIsJesusModalOpen(true)}
          onOpenAdminModal={() => setIsAdminModalOpen(true)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Main Content Body guarded by ErrorBoundary */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <ErrorBoundary onReset={() => setActiveTab('dashboard')}>
            {renderActiveModuleView()}
          </ErrorBoundary>
        </main>

        {/* Discreet Minimalist Footer */}
        <footer className="border-t border-slate-200/60 bg-transparent py-6 text-center text-xs text-slate-400">
          <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <span className="font-medium text-slate-600">Dinheiro Chama Dinheiro</span>
              <span className="mx-1.5 text-slate-300">·</span>
              <span>Educação Financeira & Empreendedorismo</span>
            </div>
            <span>Metodologia Prof. Weily Toro</span>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <QuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        onNavigateToChapter={handleNavigateToChapter}
      />

      <JesusMethodModal
        isOpen={isJesusModalOpen}
        onClose={() => setIsJesusModalOpen(false)}
      />

      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => {
          setIsTxModalOpen(false);
          setTxToEdit(null);
        }}
        transactionToEdit={txToEdit}
      />

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
      />

      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => {
          setIsAccountModalOpen(false);
          setAccountToEdit(null);
        }}
        accountToEdit={accountToEdit}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => {
          setIsGoalModalOpen(false);
          setGoalToEdit(null);
        }}
        goalToEdit={goalToEdit}
      />

      <ContributionModal
        isOpen={isContributionModalOpen}
        onClose={() => {
          setIsContributionModalOpen(false);
          setGoalForContribution(null);
        }}
        goal={goalForContribution}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => {
          setIsBudgetModalOpen(false);
          setBudgetToEdit(null);
        }}
        budgetToEdit={budgetToEdit}
      />

      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <FinanceProvider>
          <MethodologyProvider>
            <JourneyProvider>
              <GerarProvider>
                <MainAppContent />
              </GerarProvider>
            </JourneyProvider>
          </MethodologyProvider>
        </FinanceProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
