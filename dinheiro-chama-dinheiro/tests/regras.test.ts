import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deriveAccounts, normalizeAccounts } from '../src/utils/financeBalances';
import type { Account, Transaction } from '../src/types/finance';

const account = (over: Partial<Account>): Account =>
  ({ id: 'a1', name: 'Conta', type: 'checking', balance: 0, ...over } as Account);

const tx = (over: Partial<Transaction>): Transaction =>
  ({ id: 't', amount: 0, type: 'expense', status: 'completed', accountId: 'a1', ...over } as Transaction);

test('deriveAccounts: saldo = abertura + receitas - despesas concluídas', () => {
  const [acc] = deriveAccounts(
    [account({ initialBalance: 1000 })],
    [tx({ type: 'income', amount: 500 }), tx({ type: 'expense', amount: 200 })],
  );
  assert.equal(acc.balance, 1300);
});

test('deriveAccounts: ignora transações não concluídas', () => {
  const [acc] = deriveAccounts(
    [account({ initialBalance: 1000 })],
    [tx({ type: 'expense', amount: 300, status: 'pending' as Transaction['status'] })],
  );
  assert.equal(acc.balance, 1000);
});

test('deriveAccounts: transferência debita origem e credita destino', () => {
  const [origem, destino] = deriveAccounts(
    [account({ id: 'a1', initialBalance: 100 }), account({ id: 'a2', initialBalance: 0 })],
    [tx({ type: 'transfer', amount: 40, accountId: 'a1', targetAccountId: 'a2' })],
  );
  assert.equal(origem.balance, 60);
  assert.equal(destino.balance, 40);
});

test('deriveAccounts: fatura do cartão é o saldo devedor (nunca negativa)', () => {
  const [cartao] = deriveAccounts(
    [account({ type: 'credit_card', initialBalance: 0 })],
    [tx({ type: 'expense', amount: 250 })],
  );
  assert.equal(cartao.balance, -250);
  assert.equal(cartao.currentInvoice, 250);

  const [quitado] = deriveAccounts(
    [account({ type: 'credit_card', initialBalance: 0 })],
    [tx({ type: 'income', amount: 100 })],
  );
  assert.equal(quitado.currentInvoice, 0);
});

test('normalizeAccounts: migração não conta o movimento duas vezes', () => {
  // Saldo legado 700 já inclui a despesa concluída de 300 => abertura deve ser 1000.
  const txs = [tx({ type: 'expense', amount: 300 })];
  const [migrada] = normalizeAccounts([account({ balance: 700 })], txs);
  assert.equal(migrada.initialBalance, 1000);

  const [final] = deriveAccounts([migrada], txs);
  assert.equal(final.balance, 700);
});

test('normalizeAccounts: conta já migrada (initialBalance definido) é preservada', () => {
  const [acc] = normalizeAccounts([account({ initialBalance: 500, balance: 999 })], []);
  assert.equal(acc.initialBalance, 500);
  assert.equal(acc.balance, 0);
});

test('normalizeAccounts: entrada inválida vira lista vazia', () => {
  assert.deepEqual(normalizeAccounts(undefined as unknown as Account[]), []);
});
