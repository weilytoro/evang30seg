import React, { useEffect, useRef, useState } from 'react';
import { X, Plus, Calendar, DollarSign, Tag, Check, CreditCard, ArrowRightLeft, FileText, Upload, Sparkles } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useToast } from '../../context/ToastContext';
import { PaymentMethod, Transaction, TransactionStatus, TransactionType } from '../../types/finance';
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '../../utils/formatters';
import { extractFromDocumentText } from '../../utils/fileParser';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionToEdit?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  transactionToEdit,
}) => {
  const { accounts = [], addTransaction, updateTransaction } = useFinance();
  const { success, error } = useToast();

  const [type, setType] = useState<TransactionType>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [accountId, setAccountId] = useState(accounts?.[0]?.id || '');
  const [targetAccountId, setTargetAccountId] = useState(accounts?.[1]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [status, setStatus] = useState<TransactionStatus>('completed');
  const [isRecurring, setIsRecurring] = useState(false);
  const [isInstallment, setIsInstallment] = useState(false);
  const [currentInstallment, setCurrentInstallment] = useState('1');
  const [totalInstallments, setTotalInstallments] = useState('12');
  const [notes, setNotes] = useState('');
  const [localError, setLocalError] = useState('');

  // Estados para importação via Documento / PDF
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPdfChoice, setShowPdfChoice] = useState(false);
  const [pendingFileContent, setPendingFileContent] = useState('');
  const [pendingFileName, setPendingFileName] = useState('');

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPendingFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = (event.target?.result as string) || '';
      setPendingFileContent(content);
      setShowPdfChoice(true);
    };
    reader.readAsText(file);
    // Limpa o input para permitir selecionar o mesmo arquivo novamente
    e.target.value = '';
  };

  const handleChooseTypeForDocument = (chosen: 'income' | 'expense' | 'transfer') => {
    try {
      const extracted = extractFromDocumentText(pendingFileContent, chosen);
      setType(extracted.type);
      setDescription(extracted.description);
      if (extracted.amount > 0) {
        setAmount(extracted.amount.toString());
      }
      if (extracted.date) {
        setDate(extracted.date);
      }
      if (chosen !== 'transfer' && extracted.category) {
        setCategory(extracted.category);
      }
      setShowPdfChoice(false);
      success(
        `Documento processado como ${
          chosen === 'income' ? 'Receita' : chosen === 'expense' ? 'Despesa' : 'Transferência'
        }! Data (${extracted.date.split('-').reverse().join('/')}) e dados identificados.`
      );
    } catch {
      error('Não foi possível extrair dados automaticamente. Preencha manualmente.');
      setShowPdfChoice(false);
    }
  };

  // Categories based on type
  const availableCategories =
    type === 'income'
      ? (DEFAULT_INCOME_CATEGORIES || [])?.map((c) => c.name)
      : type === 'expense'
      ? (DEFAULT_EXPENSE_CATEGORIES || [])?.map((c) => c.name)
      : ['Transferência'];

  useEffect(() => {
    try {
      if (transactionToEdit) {
        setType(transactionToEdit.type || 'expense');
        setDescription(transactionToEdit.description || '');
        setAmount(transactionToEdit.amount !== undefined ? transactionToEdit.amount.toString() : '');
        setDate(transactionToEdit.date || new Date().toISOString().split('T')[0]);
        setCategory(transactionToEdit.category || '');
        setAccountId(transactionToEdit.accountId || accounts?.[0]?.id || '');
        setTargetAccountId(transactionToEdit.targetAccountId || accounts?.[1]?.id || '');
        setPaymentMethod(transactionToEdit.paymentMethod || 'pix');
        setStatus(transactionToEdit.status || 'completed');
        setIsRecurring(Boolean(transactionToEdit.isRecurring));
        if (transactionToEdit.installments) {
          setIsInstallment(true);
          setCurrentInstallment(transactionToEdit.installments.current?.toString() || '1');
          setTotalInstallments(transactionToEdit.installments.total?.toString() || '1');
        } else {
          setIsInstallment(false);
        }
        setNotes(transactionToEdit.notes || '');
      } else {
        setType('expense');
        setDescription('');
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
        setCategory(DEFAULT_EXPENSE_CATEGORIES?.[0]?.name || 'Outros');
        setAccountId(accounts?.[0]?.id || '');
        setTargetAccountId(accounts?.[1]?.id || accounts?.[0]?.id || '');
        setPaymentMethod('pix');
        setStatus('completed');
        setIsRecurring(false);
        setIsInstallment(false);
        setNotes('');
      }
      setLocalError('');
    } catch (err) {
      console.error(err);
    }
  }, [transactionToEdit, isOpen, accounts]);

  // Keep category in sync with type change
  useEffect(() => {
    try {
      if (!transactionToEdit) {
        if (type === 'income') {
          setCategory(DEFAULT_INCOME_CATEGORIES?.[0]?.name || 'Receita');
          setPaymentMethod('pix');
        } else if (type === 'expense') {
          setCategory(DEFAULT_EXPENSE_CATEGORIES?.[0]?.name || 'Alimentação');
          const acc = (accounts || [])?.find((a) => a?.id === accountId);
          setPaymentMethod(acc?.type === 'credit_card' ? 'credit_card' : 'pix');
        } else {
          setCategory('Transferência');
          setPaymentMethod('transfer');
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [type, accountId, transactionToEdit, accounts]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const numAmount = parseFloat(amount.replace(',', '.'));
      if (!description.trim() || isNaN(numAmount) || numAmount <= 0) {
        setLocalError('Preencha a descrição e um valor válido maior que zero.');
        error('Preencha a descrição e um valor válido.');
        return;
      }

      if (!date || !date.trim()) {
        setLocalError('Informe a data do lançamento (obrigatória para despesas e receitas).');
        error('Informe a data do lançamento.');
        return;
      }

      const payload: Omit<Transaction, 'id'> = {
        description: description.trim(),
        amount: numAmount,
        type,
        category: type === 'transfer' ? 'Transferência' : category,
        date,
        accountId: accountId || accounts?.[0]?.id || 'acc-1',
        targetAccountId: type === 'transfer' ? targetAccountId : undefined,
        paymentMethod,
        status,
        isRecurring,
        installments:
          isInstallment && totalInstallments
            ? {
                current: parseInt(currentInstallment, 10) || 1,
                total: parseInt(totalInstallments, 10) || 1,
              }
            : undefined,
        notes: notes.trim() || undefined,
      };

      if (transactionToEdit) {
        updateTransaction(transactionToEdit.id, payload);
        success('Lançamento atualizado com sucesso.');
      } else {
        addTransaction(payload);
        success('Lançamento cadastrado com sucesso.');
      }

      onClose();
    } catch (err) {
      setLocalError('Falha ao processar lançamento.');
      error('Falha ao processar lançamento.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-amber-200/80 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Hidden File Input for PDF / Comprovante */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.csv,.ofx,.txt"
          className="hidden"
          onChange={handlePdfUpload}
        />

        <div className="flex items-center justify-between pb-3 border-b border-amber-100">
          <h3 className="text-sm font-black text-slate-900">
            {transactionToEdit ? 'Editar Lançamento' : 'Novo Lançamento'}
          </h3>

          <div className="flex items-center gap-2">
            {!transactionToEdit && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                title="Carregar PDF ou Comprovante"
              >
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span>Carregar PDF</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Escolha obrigatória do tipo para PDF carregado */}
        {showPdfChoice && (
          <div className="mt-3 p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 shadow-md space-y-2.5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-black text-amber-950 truncate max-w-[200px]">
                  {pendingFileName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPdfChoice(false)}
                className="text-amber-700 hover:text-amber-950 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-amber-900 font-bold">
              Classifique este documento escolhendo somente uma das 3 opções:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleChooseTypeForDocument('income')}
                className="py-2.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5"
              >
                <span>Receita</span>
                <span className="text-[9px] opacity-80">Entrada</span>
              </button>
              <button
                type="button"
                onClick={() => handleChooseTypeForDocument('expense')}
                className="py-2.5 px-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5"
              >
                <span>Despesa</span>
                <span className="text-[9px] opacity-80">Saída</span>
              </button>
              <button
                type="button"
                onClick={() => handleChooseTypeForDocument('transfer')}
                className="py-2.5 px-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5"
              >
                <span>Transferência</span>
                <span className="text-[9px] opacity-80">Contas</span>
              </button>
            </div>
          </div>
        )}

        {localError && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs sm:text-sm">
          {/* Transaction Type Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                type === 'expense'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Receita
            </button>
            <button
              type="button"
              onClick={() => setType('transfer')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                type === 'transfer'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Transferência
            </button>
          </div>

          {/* Amount input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Valor (R$) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-slate-400">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Descrição *
            </label>
            <input
              type="text"
              placeholder="Ex: Supermercado, Salário, Transferência"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
              required
            />
          </div>

          {/* Date & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Data do Lançamento * (Obrigatória)
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Situação
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TransactionStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                <option value="completed">Concluído / Liquidado</option>
                <option value="pending">Pendente / Agendado</option>
              </select>
            </div>
          </div>

          {/* Category (if not transfer) */}
          {type !== 'transfer' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                {(availableCategories || [])?.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Account origin & destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {type === 'transfer' ? 'Conta de Origem' : 'Conta / Cartão'}
              </label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                {(accounts || [])?.map((a) => (
                  <option key={a?.id} value={a?.id}>
                    {a?.name}
                  </option>
                ))}
              </select>
            </div>

            {type === 'transfer' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Conta de Destino
                </label>
                <select
                  value={targetAccountId}
                  onChange={(e) => setTargetAccountId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                >
                  {(accounts || [])
                    ?.filter((a) => a?.id !== accountId)
                    ?.map((a) => (
                      <option key={a?.id} value={a?.id}>
                        {a?.name}
                      </option>
                    ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Forma de Pagamento
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
                >
                  <option value="pix">PIX</option>
                  <option value="credit_card">Cartão de Crédito</option>
                  <option value="debit">Cartão de Débito</option>
                  <option value="boleto">Boleto Bancário</option>
                  <option value="transfer">Transferência / TED</option>
                  <option value="cash">Dinheiro em Espécie</option>
                </select>
              </div>
            )}
          </div>

          {/* Installments & Recurrence flags */}
          {type === 'expense' && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInstallment}
                  onChange={(e) => setIsInstallment(e.target.checked)}
                  className="rounded text-slate-900 focus:ring-slate-800 w-4 h-4 cursor-pointer"
                />
                <span className="font-semibold text-slate-700 text-xs">
                  Compra Parcelada
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="rounded text-slate-900 focus:ring-slate-800 w-4 h-4 cursor-pointer"
                />
                <span className="font-semibold text-slate-700 text-xs">
                  Conta Recorrente (Mensal)
                </span>
              </label>
            </div>
          )}

          {isInstallment && type === 'expense' && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Parcela Atual
                </label>
                <input
                  type="number"
                  min="1"
                  value={currentInstallment}
                  onChange={(e) => setCurrentInstallment(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Total de Parcelas
                </label>
                <input
                  type="number"
                  min="1"
                  value={totalInstallments}
                  onChange={(e) => setTotalInstallments(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observações (Opcional)
            </label>
            <input
              type="text"
              placeholder="Anotações adicionais..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          {/* Submit buttons */}
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
              {transactionToEdit ? 'Salvar Alterações' : 'Cadastrar Lançamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
