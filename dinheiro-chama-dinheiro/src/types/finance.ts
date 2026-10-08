export type TransactionType = 'income' | 'expense' | 'transfer';

export type PaymentMethod = 'credit_card' | 'debit' | 'pix' | 'cash' | 'boleto' | 'transfer';

export type TransactionStatus = 'completed' | 'pending';

export type AccountType = 'checking' | 'savings' | 'investment' | 'credit_card' | 'cash';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // YYYY-MM-DD
  accountId: string;
  targetAccountId?: string; // used for transfer
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  isRecurring?: boolean;
  installments?: {
    current: number;
    total: number;
  };
  notes?: string;
  tags?: string[];
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  /** Saldo de abertura; o saldo atual é sempre derivado das transações. */
  initialBalance: number;
  /** Campo calculado para consumo da UI; não é fonte de verdade. */
  balance: number;
  color: string;
  institution: string;
  iconName?: string;
  creditLimit?: number;
  currentInvoice?: number;
  closingDay?: number;
  dueDay?: number;
}

export interface Budget {
  id: string;
  category: string;
  monthlyLimit: number;
  spent?: number;
  suggestedLimit?: number; // IA recommendation
  averageSpending?: number; // historical average
  trend?: 'increasing' | 'decreasing' | 'stable';
}

export interface BudgetInsight {
  category: string;
  message: string;
  type: 'warning' | 'success' | 'info' | 'suggestion';
  severity: 'low' | 'medium' | 'high';
  actionable: boolean;
  suggestedAction?: string;
  savings?: number;
}

export interface SavingsBadge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: 'saver' | 'debt-free' | 'disciplined' | 'multiplier' | 'milestone';
  unlockedAt?: string;
  progress?: number; // 0-100 for badges in progress
  threshold: number; // what needs to be achieved
  currentValue?: number; // current progress towards threshold
  unit?: string; // e.g., "%", "R$", "days"
}

export interface OctalysisBadge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  drive: 'epic' | 'achievement' | 'empowerment' | 'ownership' | 'social' | 'scarcity' | 'unpredictability' | 'loss';
  driveName: string;
  unlockedAt?: string;
  progress?: number; // 0-100
  threshold: number;
  currentValue?: number;
  unit?: string;
  realMetric: string; // e.g., "modulesCompleted", "debtsPaid", "actualSavings"
  color: string; // Tailwind color for drive
}

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // YYYY-MM-DD
  category: string;
  color: string;
  icon?: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  bgLight: string;
}

export interface ParsedRawTransaction {
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  suggestedCategory: string;
  originalLine?: string;
  selected?: boolean;
}
