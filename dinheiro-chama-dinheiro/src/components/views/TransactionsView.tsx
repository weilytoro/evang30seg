import React, { useState } from 'react';
import {
  Search,
  Filter,
  PlusCircle,
  Download,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRightLeft,
  Calendar,
  Layers,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { Transaction } from '../../types/finance';
import { exportToCSV, exportToPDF } from '../../utils/fileParser';
import {
  formatCurrency,
  formatDate,
  getCategoryMeta,
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
} from '../../utils/formatters';

interface TransactionsViewProps {
  onOpenTransactionModal: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onOpenImportModal: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  onOpenTransactionModal,
  onEditTransaction,
  onOpenImportModal,
}) => {
  const {
    filteredTransactions,
    deleteTransaction,
    toggleTransactionStatus,
    accounts,
    selectedType,
    setSelectedType,
    selectedCategory,
    setSelectedCategory,
    selectedAccount,
    setSelectedAccount,
    searchQuery,
    setSearchQuery,
    selectedMonth,
  } = useFinance();

  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showPdfExportMenu, setShowPdfExportMenu] = useState(false);

  // Filter with status as well
  const displayedTransactions = (filteredTransactions || [])?.filter((tx) => {
    if (selectedStatus === 'all') return true;
    return tx?.status === selectedStatus;
  });

  // Totals for filtered transactions
  const totalIncome = (displayedTransactions || [])
    ?.filter((t) => t?.type === 'income')
    ?.reduce((sum, t) => sum + (t?.amount || 0), 0);

  const totalExpense = (displayedTransactions || [])
    ?.filter((t) => t?.type === 'expense')
    ?.reduce((sum, t) => sum + (t?.amount || 0), 0);

  const netBalance = totalIncome - totalExpense;

  const handleExportFiltered = () => {
    try {
      exportToCSV(displayedTransactions || [], `extrato_filtrado_${selectedMonth}.csv`);
    } catch (e) {
      console.error(e);
    }
  };

  const getAccountName = (accId: string) => {
    const acc = (accounts || [])?.find((a) => a?.id === accId);
    return acc ? acc.name : 'Conta Padrão';
  };

  const allCategories = [
    ...new Set([
      ...((DEFAULT_INCOME_CATEGORIES || [])?.map((c) => c?.name)),
      ...((DEFAULT_EXPENSE_CATEGORIES || [])?.map((c) => c?.name)),
      ...((filteredTransactions || [])?.map((t) => t?.category)),
    ]),
  ]?.filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Top Filter & Action Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por descrição, categoria ou valor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Quick Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* PDF Export Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPdfExportMenu(!showPdfExportMenu)}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl transition-colors cursor-pointer shadow-xs"
                title="Gerar Relatório em PDF dos Lançamentos"
              >
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Exportar PDF</span>
              </button>

              {showPdfExportMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowPdfExportMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-amber-200 py-2 z-50 text-xs animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1 text-[10px] font-black uppercase text-amber-800 tracking-wider">
                      Escolha o tipo para o PDF:
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        exportToPDF(filteredTransactions, 'income', 'Relatório de Receitas — Método GERAR');
                        setShowPdfExportMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-emerald-700 hover:bg-emerald-50 font-bold flex items-center justify-between"
                    >
                      <span>Somente Receitas</span>
                      <span className="text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded">Entradas</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        exportToPDF(filteredTransactions, 'expense', 'Relatório de Despesas — Método GERAR');
                        setShowPdfExportMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-rose-700 hover:bg-rose-50 font-bold flex items-center justify-between"
                    >
                      <span>Somente Despesas</span>
                      <span className="text-[10px] bg-rose-100 px-1.5 py-0.5 rounded">Saídas</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        exportToPDF(filteredTransactions, 'transfer', 'Relatório de Transferências — Método GERAR');
                        setShowPdfExportMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-slate-800 hover:bg-slate-50 font-bold flex items-center justify-between"
                    >
                      <span>Somente Transferências</span>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">Contas</span>
                    </button>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      type="button"
                      onClick={() => {
                        exportToPDF(filteredTransactions, 'all', 'Relatório Geral de Lançamentos — Método GERAR');
                        setShowPdfExportMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-slate-900 hover:bg-amber-50 font-black flex items-center justify-between"
                    >
                      <span>Todos os Lançamentos</span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">Completo</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleExportFiltered}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
              title="Exportar para Excel / CSV"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>CSV</span>
            </button>

            <button
              onClick={onOpenImportModal}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-amber-50 hover:text-amber-900 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-600" />
              <span>Importar Arquivo</span>
            </button>

            <button
              onClick={onOpenTransactionModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white text-xs sm:text-sm font-black rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Novo Lançamento</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs sm:text-sm">
          {/* Filter Type */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Tipo
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 font-medium text-slate-700 focus:outline-none"
            >
              <option value="all">Todos os Tipos</option>
              <option value="income">Receitas (+)</option>
              <option value="expense">Despesas (-)</option>
              <option value="transfer">Transferências</option>
            </select>
          </div>

          {/* Filter Category */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Categoria
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 font-medium text-slate-700 focus:outline-none"
            >
              <option value="all">Todas as Categorias</option>
              {(allCategories || [])?.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Account */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Conta / Cartão
            </label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 font-medium text-slate-700 focus:outline-none"
            >
              <option value="all">Todas as Contas</option>
              {(accounts || [])?.map((a) => (
                <option key={a?.id} value={a?.id}>
                  {a?.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Status */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 font-medium text-slate-700 focus:outline-none"
            >
              <option value="all">Todos os Status</option>
              <option value="completed">Concluídos</option>
              <option value="pending">Pendentes</option>
            </select>
          </div>
        </div>

        {/* Filter Summary Strip */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50/70 p-3 rounded-xl border border-slate-100">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-600">
              Total Filtrado: <strong className="text-slate-900">{displayedTransactions.length}</strong> itens
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-600">
              Receitas:{' '}
              <strong className="text-emerald-600 font-bold">+{formatCurrency(totalIncome)}</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">
              Despesas:{' '}
              <strong className="text-rose-600 font-bold">-{formatCurrency(totalExpense)}</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">
              Saldo:{' '}
              <strong
                className={`font-bold ${
                  netBalance >= 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {formatCurrency(netBalance)}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Transactions Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {displayedTransactions.length === 0 ? (
          <div className="py-16 text-center px-4">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">
              Nenhuma transação encontrada
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Tente alterar os filtros acima ou cadastre um novo lançamento financeiro.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={onOpenTransactionModal}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Criar Primeiro Lançamento
              </button>
              <button
                onClick={onOpenImportModal}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors"
              >
                Importar Arquivo
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">Status</th>
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-4">Descrição</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Conta / Origem</th>
                  <th className="py-3 px-4 text-right">Valor</th>
                  <th className="py-3 px-4 text-center w-24">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(displayedTransactions || [])?.map((tx) => {
                  const meta = getCategoryMeta(tx?.category || '', tx?.type || 'expense');
                  const isIncome = tx.type === 'income';
                  const isTransfer = tx.type === 'transfer';
                  const isCompleted = tx.status === 'completed';

                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Status Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => toggleTransactionStatus(tx.id)}
                          title={
                            isCompleted ? 'Concluído (Clique para alterar)' : 'Pendente (Clique para concluir)'
                          }
                          className={`p-1.5 rounded-lg transition-colors ${
                            isCompleted
                              ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                              : 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-medium">
                        {formatDate(tx.date)}
                      </td>

                      {/* Description & Installments */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{tx.description}</span>
                          {tx.installments && (
                            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold">
                              {tx.installments.current}/{tx.installments.total}x
                            </span>
                          )}
                          {tx.isRecurring && (
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                              Recorrente
                            </span>
                          )}
                        </div>
                        {tx.notes && (
                          <p className="text-[11px] text-slate-400 truncate max-w-xs">
                            {tx.notes}
                          </p>
                        )}
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                          style={{
                            backgroundColor: `${meta.color}15`,
                            color: meta.color,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: meta.color }}
                          />
                          {tx.category}
                        </span>
                      </td>

                      {/* Account */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 text-xs">
                        <span className="font-medium text-slate-700">
                          {getAccountName(tx.accountId)}
                        </span>
                        {isTransfer && tx.targetAccountId && (
                          <div className="text-[11px] text-indigo-600 flex items-center gap-1">
                            <ArrowRightLeft className="w-3 h-3" />
                            <span>Para: {getAccountName(tx.targetAccountId)}</span>
                          </div>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <span
                          className={`font-black tracking-tight ${
                            isIncome
                              ? 'text-emerald-700'
                              : isTransfer
                              ? 'text-indigo-700'
                              : 'text-slate-900'
                          }`}
                        >
                          {isIncome ? '+' : isTransfer ? '' : '-'}
                          {formatCurrency(tx.amount)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEditTransaction(tx)}
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Editar lançamento"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Deseja excluir "${tx.description}"?`)) {
                                deleteTransaction(tx.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Excluir lançamento"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
