import React, { useState } from 'react';
import {
  Settings,
  Sparkles,
  Download,
  RotateCcw,
  BookOpen,
  Check,
  Shield,
  Trash2,
  HelpCircle,
  User,
  AlertTriangle,
} from 'lucide-react';
import { useMethodology } from '../../context/MethodologyContext';
import { useJourney } from '../../context/JourneyContext';
import { useFinance } from '../../context/FinanceContext';
import { useToast } from '../../context/ToastContext';
import { exportToJSON, exportToCSV } from '../../utils/fileParser';
import { getBrand } from '../../utils/brand';

export const SettingsView: React.FC = () => {
  const { platformMode, setPlatformMode, retakeQuiz } = useMethodology();
  const {
    userName,
    setUserName,
    resetAllJourneyData,
  } = useJourney();

  const {
    transactions = [],
    accounts = [],
    budgets = [],
    goals = [],
    clearAllData,
  } = useFinance();

  const { success, error, info } = useToast();
  const brand = getBrand(platformMode);

  const [tempName, setTempName] = useState(userName);
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [nameSavedSuccess, setNameSavedSuccess] = useState(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    setUserName(tempName.trim());
    setNameSavedSuccess(true);
    success('Nome atualizado com sucesso.');
    setTimeout(() => setNameSavedSuccess(false), 2500);
  };

  const handleExportBackup = () => {
    try {
      exportToJSON(
        { transactions, accounts, budgets, goals, exportedAt: new Date().toISOString() },
        'backup_dinheiro_chama_dinheiro.json'
      );
      success('Backup completo exportado com sucesso.');
    } catch {
      error('Falha ao exportar backup.');
    }
  };

  const handleExportCSV = () => {
    try {
      exportToCSV(transactions || [], 'extrato_financeiro.csv');
      success('Extrato CSV gerado com sucesso.');
    } catch {
      error('Falha ao exportar extrato CSV.');
    }
  };

  const handleRetakeQuiz = () => {
    retakeQuiz();
    info('Teste reiniciado. Seu histórico anterior e o progresso dos módulos foram mantidos.');
  };

  const handleFullReset = () => {
    try {
      clearAllData();
      resetAllJourneyData();
      setConfirmClearAll(false);
      success('Todos os dados foram resetados do zero com sucesso.');
    } catch {
      error('Erro ao reiniciar dados.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Settings className="w-3.5 h-3.5 text-slate-500" />
          <span>Preferências da Plataforma</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Configurações da Jornada
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
          Personalize seu nome de exibição, a linguagem metodológica e gerencie backups e dados.
        </p>
      </div>

      {/* Perfil do Aluno: Nome */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Identificação do Aluno</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Como você deseja ser chamado no diagnóstico, nos relatórios e no cabeçalho.
          </p>
        </div>

        <form onSubmit={handleSaveName} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            placeholder="Digite seu nome completo ou como prefere ser chamado..."
            className="flex-1 text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Salvar Nome
          </button>
        </form>
        {nameSavedSuccess && (
          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Nome salvo com sucesso
          </span>
        )}
      </div>

      {/* Modo de Linguagem: Casa vs Institucional */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Abordagem de Linguagem & Marca</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Alterne entre a versão autoral completa (com versículos bíblicos) e a versão institucional.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => setPlatformMode('casa')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              platformMode === 'casa'
                ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/20'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-black text-sm text-slate-900">Modo Casa (Autoral / Bíblico)</span>
              {platformMode === 'casa' && <Check className="w-4 h-4 text-emerald-600 font-bold" />}
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Marca <strong>Dinheiro Chama Dinheiro</strong>. Apresenta referências bíblicas e versículos dos ensinamentos de Weily Toro Machado.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setPlatformMode('institucional')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              platformMode === 'institucional'
                ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-500/20'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-black text-sm text-slate-900">Modo Institucional / Corporativo</span>
              {platformMode === 'institucional' && <Check className="w-4 h-4 text-indigo-600 font-bold" />}
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Marca <strong>Programa Mentalidade Financeira</strong>. Vocabulário técnico e comportamental, mantendo Método JESUS e os 5 Níveis sem citações confessionais.
            </p>
          </button>
        </div>
      </div>

      {/* Gerenciamento do Teste */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Diagnóstico dos 5 Níveis</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Deseja responder às 10 perguntas novamente sem perder o que já realizou nos módulos?
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            <strong className="block text-slate-900">Reiniciar Teste</strong>
            <span>
              Permite preencher novamente o diagnóstico. Seu histórico dos últimos 12 testes e todos
              os módulos concluídos serão preservados integralmente.
            </span>
          </div>
          <button
            type="button"
            onClick={handleRetakeQuiz}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
          >
            Reiniciar Teste
          </button>
        </div>
      </div>

      {/* Exportações e Backups */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Backup & Exportação</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Exporte seus lançamentos e guarde cópias locais de segurança.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors flex items-center justify-between cursor-pointer"
          >
            <div>
              <span className="font-bold text-xs text-slate-900 block">Exportar Extrato (CSV)</span>
              <span className="text-[11px] text-slate-500">Compatível com Excel e Google Sheets</span>
            </div>
            <Download className="w-4 h-4 text-slate-500" />
          </button>

          <button
            type="button"
            onClick={handleExportBackup}
            className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors flex items-center justify-between cursor-pointer"
          >
            <div>
              <span className="font-bold text-xs text-slate-900 block">Backup Completo (JSON)</span>
              <span className="text-[11px] text-slate-500">Salva todos os módulos e lançamentos</span>
            </div>
            <Download className="w-4 h-4 text-slate-500" />
          </button>

          <a
            href="/dinheiro-chama-dinheiro.zip"
            download="dinheiro-chama-dinheiro.zip"
            className="p-4 rounded-2xl border-2 border-amber-300 bg-amber-50/80 hover:bg-amber-100 text-left transition-all flex items-center justify-between cursor-pointer col-span-1 sm:col-span-2 shadow-xs"
          >
            <div>
              <span className="font-black text-xs text-amber-950 block flex items-center gap-1.5">
                <span>📦 Baixar Código Completo do Site (ZIP)</span>
                <span className="text-[9px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold uppercase">Download Imediato</span>
              </span>
              <span className="text-[11px] text-amber-800 font-medium">
                Projeto React 19 + TypeScript + Tailwind CSS pronto para descompactar e rodar com npm run dev
              </span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Download className="w-4 h-4" />
            </div>
          </a>
        </div>
      </div>

      {/* Zona de Perigo: Limpar Todos os Dados */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold text-rose-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Zona de Perigo: Reiniciar do Zero</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Esta ação apaga todo o progresso da jornada: diagnóstico, módulos 0 a 6, Trilha 2, Hub GERAR e lançamentos financeiros.
          </p>
        </div>

        {!confirmClearAll ? (
          <button
            type="button"
            onClick={() => setConfirmClearAll(true)}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors cursor-pointer"
          >
            Limpar todos os dados e recomeçar do zero
          </button>
        ) : (
          <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl space-y-3">
            <span className="text-xs text-rose-900 font-bold block">
              Tem certeza absoluta? Todos os módulos concluídos, dívidas, reflexões e lançamentos serão apagados.
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleFullReset}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Sim, apagar tudo
              </button>
              <button
                type="button"
                onClick={() => setConfirmClearAll(false)}
                className="px-4 py-2 bg-white text-slate-700 font-bold text-xs rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
