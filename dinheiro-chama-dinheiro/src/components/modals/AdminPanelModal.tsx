import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  X,
  User,
  CheckCircle2,
  Lock,
  Unlock,
  RotateCcw,
  Sparkles,
  Building2,
  Database,
  Sliders,
  Check,
  Brain,
  Layers,
} from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';
import { useMethodology } from '../../context/MethodologyContext';
import { useFinance } from '../../context/FinanceContext';
import { TRILHA1_MODULES } from '../../data/journeyData';
import { PlatformMode } from '../../types/methodology';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ isOpen, onClose }) => {
  const {
    isAdmin,
    setIsAdmin,
    toggleAdminMode,
    completedModules,
    adminUnlockAllModules,
    adminLockAllModules,
    adminCompleteAllModules,
    adminSetCompletedModules,
    adminSetTrilha1Completed,
    trilha1Completed,
    userName,
    setUserName,
    recordQuizCompleted,
    resetAllJourneyData,
  } = useJourney();

  const {
    platformMode,
    setPlatformMode,
    hasCnpjOrIntends,
    setHasCnpjOrIntends,
    quizResult,
    saveQuizResult,
    retakeQuiz,
  } = useMethodology();

  const { resetToDemoData, clearAllData } = useFinance();

  const [tempUserName, setTempUserName] = useState(userName);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerNotice = (msg: string) => {
    setSuccessNotice(msg);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    setUserName(tempUserName);
    triggerNotice(`Nome do aluno atualizado para "${tempUserName}"`);
  };

  const handleSetLevel = (score: number, levelId: string, levelTitle: string) => {
    saveQuizResult(score, hasCnpjOrIntends, userName);
    recordQuizCompleted(score, levelId, levelTitle, hasCnpjOrIntends);
    triggerNotice(`Diagnóstico configurado para: ${levelTitle} (${score} pts)`);
  };

  const toggleModuleCompletion = (modId: number) => {
    if (completedModules.includes(modId)) {
      adminSetCompletedModules(completedModules.filter((m) => m !== modId));
      triggerNotice(`Módulo ${modId} desmarcado.`);
    } else {
      adminSetCompletedModules([...completedModules, modId]);
      triggerNotice(`Módulo ${modId} marcado como concluído.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                Painel do Administrador
                <span className="text-[10px] font-bold uppercase bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                  Admin Master
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Controle total sobre permissões, módulos, usuário e regras de negócio.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback message banner */}
        {successNotice && (
          <div className="bg-emerald-500 text-white px-6 py-2.5 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top duration-150">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Modal Body (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm">
          {/* 1. Toggle Modo Administrador / Modo Aluno */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <strong className="text-sm font-black text-amber-950">
                  Status do Modo Administrador
                </strong>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                {isAdmin
                  ? 'ATIVO: Todos os módulos (0 a 6, CNPJ e Hub GERAR) estão destravados sem restrições.'
                  : 'DESATIVADO (Modo Aluno): Segue estritamente as regras de bloqueio e divulgação progressiva do livro.'}
              </p>
            </div>

            <button
              type="button"
              onClick={toggleAdminMode}
              className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all shadow-xs cursor-pointer flex items-center gap-2 self-start sm:self-auto shrink-0 ${
                isAdmin
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {isAdmin ? (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Desativar Admin</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Ativar Modo Admin</span>
                </>
              )}
            </button>
          </div>

          {/* 2. Gerenciamento de Aluno / Usuário */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <User className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Perfil do Aluno & Parâmetros
              </h3>
            </div>

            <form onSubmit={handleSaveName} className="flex gap-2">
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Nome do Aluno no Sistema:
                </label>
                <input
                  type="text"
                  value={tempUserName}
                  onChange={(e) => setTempUserName(e.target.value)}
                  placeholder="Ex: Áureo Lopes"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="self-end px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Salvar Nome
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Modo de Plataforma:
                </label>
                <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setPlatformMode('casa');
                      triggerNotice('Modo Bíblico "Dinheiro Chama Dinheiro" ativado.');
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      platformMode === 'casa'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Bíblico (Livro)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPlatformMode('institucional');
                      triggerNotice('Modo Profissional "Mentalidade Financeira" ativado.');
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      platformMode === 'institucional'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Secular / Negócios
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Tem ou Pretende Abrir CNPJ:
                </label>
                <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setHasCnpjOrIntends(true);
                      triggerNotice('CNPJ ativado para o perfil do aluno.');
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      hasCnpjOrIntends
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Sim (Trilha 2 Ativa)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHasCnpjOrIntends(false);
                      triggerNotice('Perfil apenas CPF selecionado.');
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      !hasCnpjOrIntends
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Apenas CPF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Atribuição Rápida de Diagnóstico */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Diagnóstico Rápido dos 5 Níveis
                </h3>
              </div>
              {quizResult && (
                <button
                  type="button"
                  onClick={() => {
                    retakeQuiz();
                    triggerNotice('Diagnóstico resetado para estado inicial limpo.');
                  }}
                  className="text-xs text-rose-600 hover:underline font-bold"
                >
                  Limpar Diagnóstico
                </button>
              )}
            </div>

            <p className="text-xs text-slate-500">
              Clique em um nível para aplicar instantaneamente o resultado diagnóstico sem precisar responder as 10 perguntas:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() => handleSetLevel(10, 'bloqueada', 'Nível 1 · Bloqueada')}
                className="p-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-900 text-left transition-all"
              >
                <div className="text-[10px] font-bold text-rose-600">Nível 1</div>
                <div className="font-black text-xs">Bloqueada</div>
                <div className="text-[10px] text-rose-500">10 pts</div>
              </button>

              <button
                type="button"
                onClick={() => handleSetLevel(20, 'estagnada', 'Nível 2 · Estagnada')}
                className="p-2.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 text-left transition-all"
              >
                <div className="text-[10px] font-bold text-amber-600">Nível 2</div>
                <div className="font-black text-xs">Estagnada</div>
                <div className="text-[10px] text-amber-600">20 pts</div>
              </button>

              <button
                type="button"
                onClick={() => handleSetLevel(30, 'transicao', 'Nível 3 · Em Transição')}
                className="p-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-900 text-left transition-all"
              >
                <div className="text-[10px] font-bold text-blue-600">Nível 3</div>
                <div className="font-black text-xs">Transição</div>
                <div className="text-[10px] text-blue-600">30 pts</div>
              </button>

              <button
                type="button"
                onClick={() => handleSetLevel(40, 'construcao', 'Nível 4 · Em Construção')}
                className="p-2.5 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-900 text-left transition-all"
              >
                <div className="text-[10px] font-bold text-teal-600">Nível 4</div>
                <div className="font-black text-xs">Construção</div>
                <div className="text-[10px] text-teal-600">40 pts</div>
              </button>

              <button
                type="button"
                onClick={() => handleSetLevel(50, 'evoluida', 'Nível 5 · Evoluída')}
                className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-left transition-all"
              >
                <div className="text-[10px] font-bold text-emerald-600">Nível 5</div>
                <div className="font-black text-xs">Evoluída</div>
                <div className="text-[10px] text-emerald-600">50 pts</div>
              </button>
            </div>
          </div>

          {/* 4. Controle de Módulos & Jornada */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Controle de Desbloqueio dos Módulos
                </h3>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  adminUnlockAllModules();
                  triggerNotice('Todos os módulos foram desbloqueados e marcados como concluídos.');
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Destravar & Concluir Todos (100%)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  adminSetTrilha1Completed(!trilha1Completed);
                  triggerNotice(
                    trilha1Completed
                      ? 'Trilha 2 bloqueada novamente.'
                      : 'Trilha 2 destravada com sucesso!'
                  );
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{trilha1Completed ? 'Bloquear Trilha 2' : 'Destravar Trilha 2 (CNPJ)'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  adminLockAllModules();
                  triggerNotice('Módulos redefinidos para o estado inicial bloqueado.');
                }}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Bloquear Módulos 1 a 6</span>
              </button>
            </div>

            {/* Individual Modules Toggles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {TRILHA1_MODULES.map((m) => {
                const isDone = completedModules.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleModuleCompletion(m.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isDone
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="truncate text-xs">
                      M{m.id}: {m.shortTitle}
                    </span>
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                        isDone ? 'bg-emerald-600 text-white font-black' : 'border border-slate-300'
                      }`}
                    >
                      {isDone && '✓'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Ferramentas e Dados Financeiros */}
          <div className="space-y-3 pt-1 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-slate-700" />
              <h3 className="font-bold text-slate-900 text-sm">
                Gerenciamento de Dados Financeiros
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  resetToDemoData();
                  triggerNotice('Dados financeiros reiniciados do zero com sucesso.');
                }}
                className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Reiniciar Dados Financeiros
              </button>

              <button
                type="button"
                onClick={() => {
                  clearAllData();
                  triggerNotice('Todos os dados de transações e contas foram limpos.');
                }}
                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Limpar Todos os Dados Financeiros
              </button>

              <button
                type="button"
                onClick={() => {
                  resetAllJourneyData();
                  triggerNotice('Dados da jornada do livro foram redefinidos.');
                }}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Resetar Dados da Metodologia
              </button>

              <a
                href="/dinheiro-chama-dinheiro.zip"
                download="dinheiro-chama-dinheiro.zip"
                className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold rounded-xl text-xs transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>📦 Baixar Código Completo do Site (ZIP)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Alterações no Modo Administrador são salvas imediatamente.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer transition-all"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
