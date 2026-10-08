import { Account, Budget, FinancialGoal, Transaction } from '../types/finance';

/**
 * O produto inicia sem dados financeiros fictícios.
 * Contas usam initialBalance como saldo de abertura; o saldo atual é derivado
 * exclusivamente das transações concluídas.
 */
export const INITIAL_ACCOUNTS: Account[] = [];
export const INITIAL_TRANSACTIONS: Transaction[] = [];
export const INITIAL_BUDGETS: Budget[] = [];
export const INITIAL_GOALS: FinancialGoal[] = [];
