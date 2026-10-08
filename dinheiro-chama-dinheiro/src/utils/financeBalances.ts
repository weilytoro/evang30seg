import { Account, Transaction } from '../types/finance';

/**
 * Migra contas do formato legado (saldo final persistido) para saldo de abertura.
 * O movimento das transações concluídas é removido do saldo legado para evitar dupla contagem.
 */
export const normalizeAccounts = (raw: Account[], transactions: Transaction[] = []): Account[] =>
  (Array.isArray(raw) ? raw : []).map((account) => {
    if (Number.isFinite(account.initialBalance)) {
      return { ...account, initialBalance: account.initialBalance, balance: 0, currentInvoice: undefined };
    }

    let movement = 0;
    for (const tx of transactions) {
      if (tx.status !== 'completed') continue;
      if (tx.accountId === account.id) {
        if (tx.type === 'income') movement += tx.amount;
        if (tx.type === 'expense' || tx.type === 'transfer') movement -= tx.amount;
      }
      if (tx.type === 'transfer' && tx.targetAccountId === account.id) movement += tx.amount;
    }

    const legacyBalance = Number.isFinite(account.balance) ? account.balance : 0;
    return { ...account, initialBalance: legacyBalance - movement, balance: 0, currentInvoice: undefined };
  });

/**
 * Calcula saldos exclusivamente a partir do saldo de abertura + transações concluídas.
 */
export const deriveAccounts = (accounts: Account[], transactions: Transaction[]): Account[] => {
  const deltas = new Map<string, number>();
  const addDelta = (accountId: string | undefined, delta: number) => {
    if (!accountId || !Number.isFinite(delta)) return;
    deltas.set(accountId, (deltas.get(accountId) || 0) + delta);
  };

  for (const tx of transactions) {
    if (tx.status !== 'completed') continue;
    if (tx.type === 'income') addDelta(tx.accountId, tx.amount);
    if (tx.type === 'expense') addDelta(tx.accountId, -tx.amount);
    if (tx.type === 'transfer') {
      addDelta(tx.accountId, -tx.amount);
      addDelta(tx.targetAccountId, tx.amount);
    }
  }

  return accounts.map((account) => {
    const initialBalance = Number.isFinite(account.initialBalance) ? account.initialBalance : 0;
    const balance = initialBalance + (deltas.get(account.id) || 0);
    const currentInvoice = account.type === 'credit_card' ? Math.max(0, -balance) : undefined;
    return { ...account, initialBalance, balance, currentInvoice };
  });
};
