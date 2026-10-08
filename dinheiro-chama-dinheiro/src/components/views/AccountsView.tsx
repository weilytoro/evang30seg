import React from 'react';
import {
  CreditCard,
  Landmark,
  Wallet,
  TrendingUp,
  PlusCircle,
  ArrowRightLeft,
  Calendar,
  AlertCircle,
  Building2,
  Trash2,
  Edit2,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { Account } from '../../types/finance';
import { formatCurrency } from '../../utils/formatters';

interface AccountsViewProps {
  onOpenAccountModal: () => void;
  onEditAccount: (acc: Account) => void;
  onOpenTransferModal: () => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({
  onOpenAccountModal,
  onEditAccount,
  onOpenTransferModal,
}) => {
  const { accounts, totalBalance, totalCreditDebt, netWorth, deleteAccount } = useFinance();

  const bankAccounts = (accounts || [])?.filter((a) => a?.type !== 'credit_card');
  const creditCards = (accounts || [])?.filter((a) => a?.type === 'credit_card');

  return (
    <div className="space-y-6">
      {/* Top Header & Balances */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Total Disponível em Contas
          </span>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {formatCurrency(totalBalance)}
          </div>
          <p className="text-xs text-slate-700 mt-1">
            Contas correntes, poupanças e investimentos
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Total Faturas de Cartão
          </span>
          <div className="text-2xl font-black text-purple-700 mt-2">
            {formatCurrency(totalCreditDebt)}
          </div>
          <p className="text-xs text-slate-700 mt-1">
            Gastos acumulados a vencer nos cartões
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Patrimônio Consolidado
            </span>
            <div className="text-2xl font-black text-emerald-700 mt-2">
              {formatCurrency(netWorth)}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={onOpenTransferModal}
              className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-600" />
              <span>Transferir</span>
            </button>
            <button
              onClick={onOpenAccountModal}
              className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Nova Conta</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 1: Contas Correntes & Investimentos */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Contas & Investimentos
            </h2>
            <p className="text-xs text-slate-700">
              Gerencie suas contas ativas e saldos em dinheiro
            </p>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
            {bankAccounts.length} conta(s)
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(bankAccounts || [])?.map((acc) => {
            return (
              <div
                key={acc.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between bg-gradient-to-br from-white to-slate-50/50"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                        style={{ backgroundColor: acc.color }}
                      >
                        {acc.type === 'investment' ? (
                          <TrendingUp className="w-5 h-5" />
                        ) : acc.type === 'cash' ? (
                          <Wallet className="w-5 h-5" />
                        ) : (
                          <Landmark className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">
                          {acc.name}
                        </h4>
                        <span className="text-xs text-slate-700">
                          {acc.institution}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditAccount(acc)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Editar conta"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Deseja remover a conta "${acc.name}"?`)) {
                            deleteAccount(acc.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Excluir conta"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-6">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                      Saldo em Conta
                    </span>
                    <div className="text-2xl font-black text-slate-900 mt-0.5">
                      {formatCurrency(acc.balance)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700">
                  <span className="capitalize font-semibold text-slate-700">
                    Tipo: {acc.type === 'investment' ? 'Investimento' : acc.type === 'cash' ? 'Dinheiro' : 'Conta Corrente'}
                  </span>
                  <span className="text-emerald-700 font-bold">Ativa</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Cartões de Crédito */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Cartões de Crédito
            </h2>
            <p className="text-xs text-slate-700">
              Controle de faturas, limites e dias de vencimento
            </p>
          </div>
          <button
            onClick={onOpenAccountModal}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Adicionar Cartão</span>
          </button>
        </div>

        {creditCards.length === 0 ? (
          <p className="py-8 text-center text-xs text-slate-400">
            Nenhum cartão cadastrado. Clique acima para adicionar.
          </p>
        ) : (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            {(creditCards || [])?.map((card) => {
              const invoice = card.currentInvoice || Math.abs(card.balance);
              const limit = card.creditLimit || 5000;
              const available = Math.max(0, limit - invoice);
              const usedPercent = Math.min(100, (invoice / limit) * 100);

              return (
                <div
                  key={card.id}
                  className="p-5 rounded-2xl border border-slate-200 hover:shadow-lg transition-all bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden"
                >
                  {/* Decorative background shape */}
                  <div
                    className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full opacity-20 pointer-events-none"
                    style={{ backgroundColor: card.color || '#820AD1' }}
                  />

                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-black tracking-tight">{card.name}</h4>
                        <span className="text-xs text-slate-300 font-medium">
                          {card.institution}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditAccount(card)}
                        className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 relative z-10">
                    <span className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold">
                      Fatura Atual (Aberta)
                    </span>
                    <div className="text-3xl font-black tracking-tight text-white mt-0.5">
                      {formatCurrency(invoice)}
                    </div>
                  </div>

                  {/* Limit usage bar */}
                  <div className="mt-5 space-y-1.5 relative z-10">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span>Limite Utilizado ({usedPercent.toFixed(0)}%)</span>
                      <span className="font-semibold text-white">
                        Disponível: {formatCurrency(available)}
                      </span>
                    </div>
                    <div className="w-full bg-white/15 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-emerald-400 to-purple-400"
                        style={{ width: `${usedPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Dates footer */}
                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 relative z-10">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Fecha dia: <strong className="text-white">{card.closingDay || 20}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Vence dia: <strong className="text-white">{card.dueDay || 27}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
