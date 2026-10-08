import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { INITIAL_ACCOUNTS, INITIAL_BUDGETS, INITIAL_GOALS, INITIAL_TRANSACTIONS } from '../data/initialData';
import { Account, Budget, FinancialGoal, ParsedRawTransaction, Transaction } from '../types/finance';
import { deriveAccounts, normalizeAccounts } from '../utils/financeBalances';

interface FinanceContextType {
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: FinancialGoal[];

  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedAccount: string;
  setSelectedAccount: (accId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  toggleTransactionStatus: (id: string) => void;
  importTransactions: (rawList: ParsedRawTransaction[], targetAccountId: string) => number;

  addAccount: (acc: Omit<Account, 'id'>) => void;
  updateAccount: (id: string, acc: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  transferFunds: (fromAccountId: string, toAccountId: string, amount: number, description: string, date: string) => void;

  addBudget: (b: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, b: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;

  addGoal: (g: Omit<FinancialGoal, 'id'>) => void;
  updateGoal: (id: string, g: Partial<FinancialGoal>) => void;
  deleteGoal: (id: string) => void;
  addContributionToGoal: (goalId: string, amount: number, accountId: string) => void;

  resetToDemoData: () => void;
  clearAllData: () => void;

  totalBalance: number;
  totalCreditDebt: number;
  netWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyBalance: number;
  savingsRate: number;
  filteredTransactions: Transaction[];
  categorySpendings: { [category: string]: number };
  availableMonths: string[];
  pendingPayables: Transaction[];
  pendingReceivables: Transaction[];
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// v3 invalida deliberadamente o snapshot fictício das versões anteriores.
const STORAGE_KEYS = {
  TRANSACTIONS: 'finansmart_transactions_v3',
  ACCOUNTS: 'finansmart_accounts_v3',
  BUDGETS: 'finansmart_budgets_v3',
  GOALS: 'finansmart_goals_v3',
};

const today = () => new Date().toISOString().split('T')[0];
const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const readStorage = <T,>(key: string, fallback: T): T => {
  try {
    if (typeof window === 'undefined') return fallback;
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    readStorage(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS)
  );
  const [storedAccounts, setStoredAccounts] = useState<Account[]>(() => {
    const savedTransactions = readStorage<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    return normalizeAccounts(readStorage(STORAGE_KEYS.ACCOUNTS, INITIAL_ACCOUNTS), savedTransactions);
  });
  const [budgets, setBudgets] = useState<Budget[]>(() =>
    readStorage(STORAGE_KEYS.BUDGETS, INITIAL_BUDGETS)
  );
  const [goals, setGoals] = useState<FinancialGoal[]>(() =>
    readStorage(STORAGE_KEYS.GOALS, INITIAL_GOALS)
  );

  const [selectedMonth, setSelectedMonth] = useState<string>(() => today().slice(0, 7));
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const accounts = useMemo(() => deriveAccounts(storedAccounts, transactions), [storedAccounts, transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to persist transactions to localStorage:', e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(storedAccounts));
    } catch (e) {
      console.error('Failed to persist accounts to localStorage:', e);
    }
  }, [storedAccounts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    } catch (e) {
      console.error('Failed to persist budgets to localStorage:', e);
    }
  }, [budgets]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    } catch (e) {
      console.error('Failed to persist goals to localStorage:', e);
    }
  }, [goals]);

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    if (!Number.isFinite(tx.amount) || tx.amount <= 0) return;
    setTransactions((prev) => [{ ...tx, id: createId('tx') }, ...prev]);
  };

  const updateTransaction = (id: string, updatedFields: Partial<Transaction>) => {
    setTransactions((prev) => prev.map((tx) => (tx.id === id ? { ...tx, ...updatedFields } : tx)));
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  const toggleTransactionStatus = (id: string) => {
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === id
          ? { ...tx, status: tx.status === 'completed' ? 'pending' : 'completed' }
          : tx
      )
    );
  };

  const importTransactions = (rawList: ParsedRawTransaction[], targetAccountId: string): number => {
    const selected = rawList.filter((raw) => raw.selected !== false && raw.amount > 0);
    if (!selected.length || !storedAccounts.some((account) => account.id === targetAccountId)) return 0;

    const account = storedAccounts.find((item) => item.id === targetAccountId);
    const isCreditCard = account?.type === 'credit_card';
    const imported = selected.map((raw) => ({
      id: createId('imp'),
      description: raw.description,
      amount: raw.amount,
      type: raw.type,
      category: raw.suggestedCategory,
      date: raw.date,
      accountId: targetAccountId,
      paymentMethod: isCreditCard ? 'credit_card' as const : 'transfer' as const,
      status: 'completed' as const,
    }));

    setTransactions((prev) => [...imported, ...prev]);
    return imported.length;
  };

  const addAccount = (acc: Omit<Account, 'id'>) => {
    setStoredAccounts((prev) => [
      ...prev,
      {
        ...acc,
        id: createId('acc'),
        initialBalance: Number.isFinite(acc.initialBalance) ? acc.initialBalance : 0,
        balance: 0,
        currentInvoice: undefined,
      },
    ]);
  };

  const updateAccount = (id: string, updatedFields: Partial<Account>) => {
    setStoredAccounts((prev) =>
      prev.map((account) => {
        if (account.id !== id) return account;
        const { balance: _balance, currentInvoice: _invoice, initialBalance: _ib, ...safeFields } = updatedFields;
        const nextInitialBalance: number = Number.isFinite(_ib) ? (_ib as number) : account.initialBalance;
        const filteredFields = Object.fromEntries(
          Object.entries(safeFields).filter(([, value]) => value !== undefined)
        ) as Partial<Account>;
        return { ...account, ...filteredFields, initialBalance: nextInitialBalance };
      })
    );
  };

  const deleteAccount = (id: string) => {
    if (transactions.some((tx) => tx.accountId === id || tx.targetAccountId === id)) return;
    setStoredAccounts((prev) => prev.filter((account) => account.id !== id));
  };

  const transferFunds = (
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    description: string,
    date: string
  ) => {
    if (fromAccountId === toAccountId || amount <= 0) return;
    if (!storedAccounts.some((account) => account.id === fromAccountId) || !storedAccounts.some((account) => account.id === toAccountId)) return;

    addTransaction({
      description: description || 'Transferência entre Contas',
      amount,
      type: 'transfer',
      category: 'Transferência',
      date: date || today(),
      accountId: fromAccountId,
      targetAccountId: toAccountId,
      paymentMethod: 'transfer',
      status: 'completed',
    });
  };

  const addBudget = (budget: Omit<Budget, 'id'>) => setBudgets((prev) => [...prev, { ...budget, id: createId('budget') }]);
  const updateBudget = (id: string, fields: Partial<Budget>) => setBudgets((prev) => prev.map((budget) => budget.id === id ? { ...budget, ...fields } : budget));
  const deleteBudget = (id: string) => setBudgets((prev) => prev.filter((budget) => budget.id !== id));

  const addGoal = (goal: Omit<FinancialGoal, 'id'>) => setGoals((prev) => [...prev, { ...goal, id: createId('goal') }]);
  const updateGoal = (id: string, fields: Partial<FinancialGoal>) => setGoals((prev) => prev.map((goal) => goal.id === id ? { ...goal, ...fields } : goal));
  const deleteGoal = (id: string) => setGoals((prev) => prev.filter((goal) => goal.id !== id));

  const addContributionToGoal = (goalId: string, amount: number, accountId: string) => {
    const goal = goals.find((item) => item.id === goalId);
    if (!goal || amount <= 0 || !storedAccounts.some((account) => account.id === accountId)) return;

    setGoals((prev) => prev.map((item) => item.id === goalId ? { ...item, currentAmount: item.currentAmount + amount } : item));
    addTransaction({
      description: `Aporte na Meta: ${goal.title}`,
      amount,
      type: 'expense',
      category: 'Investimentos',
      date: today(),
      accountId,
      paymentMethod: 'transfer',
      status: 'completed',
    });
  };

  // Não há mais dados demonstrativos: reiniciar significa voltar ao estado vazio.
  const resetToDemoData = () => {
    setTransactions([]);
    setStoredAccounts([]);
    setBudgets([]);
    setGoals([]);
    setSelectedMonth(today().slice(0, 7));
  };

  const clearAllData = resetToDemoData;

  const availableMonths = useMemo(() => {
    const months = new Set<string>([today().slice(0, 7)]);
    transactions.forEach((tx) => {
      if (tx.date?.length >= 7) months.add(tx.date.slice(0, 7));
    });
    return Array.from(months).sort().reverse();
  }, [transactions]);

  const filteredTransactions = useMemo(() => transactions.filter((tx) => {
    if (selectedMonth !== 'all' && !tx.date?.startsWith(selectedMonth)) return false;
    if (selectedType !== 'all' && tx.type !== selectedType) return false;
    if (selectedCategory !== 'all' && tx.category !== selectedCategory) return false;
    if (selectedAccount !== 'all' && tx.accountId !== selectedAccount) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      if (![tx.description, tx.category, String(tx.amount)].some((value) => value?.toLowerCase().includes(query))) return false;
    }
    return true;
  }), [transactions, selectedMonth, selectedType, selectedCategory, selectedAccount, searchQuery]);

  const monthlyTransactions = useMemo(
    () => transactions.filter((tx) => selectedMonth === 'all' || tx.date?.startsWith(selectedMonth)),
    [transactions, selectedMonth]
  );
  const monthlyIncome = monthlyTransactions.filter((tx) => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
  const monthlyExpenses = monthlyTransactions.filter((tx) => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);
  const monthlyBalance = monthlyIncome - monthlyExpenses;
  const savingsRate = monthlyIncome > 0 ? Math.max(0, (monthlyBalance / monthlyIncome) * 100) : 0;

  const categorySpendings = useMemo(() => {
    const result: Record<string, number> = {};
    monthlyTransactions.filter((tx) => tx.type === 'expense').forEach((tx) => {
      result[tx.category || 'Outros'] = (result[tx.category || 'Outros'] || 0) + tx.amount;
    });
    return result;
  }, [monthlyTransactions]);

  const totalBalance = accounts.filter((account) => account.type !== 'credit_card').reduce((sum, account) => sum + account.balance, 0);
  const totalCreditDebt = accounts.filter((account) => account.type === 'credit_card').reduce((sum, account) => sum + Math.max(0, -(account.balance)), 0);
  const netWorth = totalBalance - totalCreditDebt;
  const pendingPayables = transactions.filter((tx) => tx.type === 'expense' && tx.status === 'pending');
  const pendingReceivables = transactions.filter((tx) => tx.type === 'income' && tx.status === 'pending');

  return (
    <FinanceContext.Provider value={{
      accounts,
      transactions,
      budgets,
      goals,
      selectedMonth,
      setSelectedMonth,
      selectedType,
      setSelectedType,
      selectedCategory,
      setSelectedCategory,
      selectedAccount,
      setSelectedAccount,
      searchQuery,
      setSearchQuery,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      toggleTransactionStatus,
      importTransactions,
      addAccount,
      updateAccount,
      deleteAccount,
      transferFunds,
      addBudget,
      updateBudget,
      deleteBudget,
      addGoal,
      updateGoal,
      deleteGoal,
      addContributionToGoal,
      resetToDemoData,
      clearAllData,
      totalBalance,
      totalCreditDebt,
      netWorth,
      monthlyIncome,
      monthlyExpenses,
      monthlyBalance,
      savingsRate,
      filteredTransactions,
      categorySpendings,
      availableMonths,
      pendingPayables,
      pendingReceivables,
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within a FinanceProvider');
  return context;
};
