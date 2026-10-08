import React, { useEffect, useState } from 'react';
import { X, Landmark, CreditCard, Wallet, TrendingUp } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useToast } from '../../context/ToastContext';
import { Account, AccountType } from '../../types/finance';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountToEdit?: Account | null;
}

const colorPalette = [
  '#820AD1', // Nubank purple
  '#EC7000', // Itaú orange
  '#CC092F', // Bradesco red
  '#FF7A00', // Inter orange
  '#003882', // Caixa / BB blue
  '#10B981', // Emerald
  '#2563EB', // Blue
  '#000000', // Dark / XP
];

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  accountToEdit,
}) => {
  const { addAccount, updateAccount } = useFinance();
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('checking');
  const [institution, setInstitution] = useState('');
  const [balance, setBalance] = useState('');
  const [color, setColor] = useState('#820AD1');
  const [creditLimit, setCreditLimit] = useState('');
  const [closingDay, setClosingDay] = useState('20');
  const [dueDay, setDueDay] = useState('27');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    try {
      if (accountToEdit) {
        setName(accountToEdit?.name || '');
        setType(accountToEdit?.type || 'checking');
        setInstitution(accountToEdit?.institution || '');
        setBalance(accountToEdit?.initialBalance !== undefined ? accountToEdit.initialBalance.toString() : '0');
        setColor(accountToEdit?.color || '#820AD1');
        setCreditLimit(accountToEdit?.creditLimit?.toString() || '');
        setClosingDay(accountToEdit?.closingDay?.toString() || '20');
        setDueDay(accountToEdit?.dueDay?.toString() || '27');
      } else {
        setName('');
        setType('checking');
        setInstitution('Nubank');
        setBalance('0');
        setColor('#820AD1');
        setCreditLimit('5000');
        setClosingDay('20');
        setDueDay('27');
      }
      setLocalError('');
    } catch (err) {
      console.error(err);
    }
  }, [accountToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!name.trim()) {
        setLocalError('Informe o nome da conta.');
        error('Informe o nome da conta.');
        return;
      }

      const numBalance = parseFloat(balance.replace(',', '.')) || 0;
      const numLimit = parseFloat(creditLimit.replace(',', '.')) || 0;

      const payload: Omit<Account, 'id'> = {
        name: name.trim(),
        type,
        institution: institution.trim() || 'Banco',
        initialBalance: type === 'credit_card' ? -Math.abs(numBalance) : numBalance,
        balance: 0,
        color,
        creditLimit: type === 'credit_card' ? numLimit : undefined,
        closingDay: type === 'credit_card' ? parseInt(closingDay, 10) || 20 : undefined,
        dueDay: type === 'credit_card' ? parseInt(dueDay, 10) || 27 : undefined,
      };

      if (accountToEdit) {
        updateAccount(accountToEdit.id, payload);
        success('Conta bancária atualizada.');
      } else {
        addAccount(payload);
        success('Conta bancária adicionada com sucesso.');
      }

      onClose();
    } catch (err) {
      setLocalError('Falha ao processar conta bancária.');
      error('Falha ao processar conta bancária.');
    }
  };

  const isCredit = type === 'credit_card';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">
            {accountToEdit ? 'Editar Conta / Cartão' : 'Nova Conta Bancária'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {localError && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs sm:text-sm">
          {/* Tipo de Conta */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tipo de Conta
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('checking')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  type === 'checking'
                    ? 'border-slate-900 bg-slate-50 text-slate-900'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Landmark className="w-4 h-4 text-blue-600" />
                <span>Conta Corrente</span>
              </button>

              <button
                type="button"
                onClick={() => setType('credit_card')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  type === 'credit_card'
                    ? 'border-slate-900 bg-slate-50 text-slate-900'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-4 h-4 text-purple-600" />
                <span>Cartão de Crédito</span>
              </button>

              <button
                type="button"
                onClick={() => setType('savings')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  type === 'savings'
                    ? 'border-slate-900 bg-slate-50 text-slate-900'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span>Poupança</span>
              </button>

              <button
                type="button"
                onClick={() => setType('investment')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  type === 'investment'
                    ? 'border-slate-900 bg-slate-50 text-slate-900'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span>Investimentos</span>
              </button>
            </div>
          </div>

          {/* Nome e Instituição */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome da Conta *
              </label>
              <input
                type="text"
                placeholder="Ex: Nubank Principal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Instituição
              </label>
              <input
                type="text"
                placeholder="Ex: Nubank, Itaú"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
          </div>

          {/* Saldo de abertura */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isCredit ? 'Dívida de abertura (R$)' : 'Saldo inicial (R$)'}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-slate-400">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
          </div>

          {/* Campos específicos de Cartão de Crédito */}
          {isCredit && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Limite Total do Cartão
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ex: 5000,00"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Dia Fechamento
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={closingDay}
                    onChange={(e) => setClosingDay(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Dia Vencimento
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={dueDay}
                    onChange={(e) => setDueDay(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Cor Identificadora */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Cor do Banco
            </label>
            <div className="flex items-center gap-2">
              {(colorPalette || [])?.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                    color === c ? 'scale-110 border-slate-900 shadow-xs' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors"
            >
              {accountToEdit ? 'Salvar Conta' : 'Adicionar Conta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
