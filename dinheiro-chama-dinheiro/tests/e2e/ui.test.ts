// Testes de UI em navegador real. Requerem o app rodando (npm run build && npm start, em NODE_ENV=production).
// BASE_URL: endereço do app (padrão http://localhost:3000).
// CHROMIUM_PATH: executável do Chromium (opcional; se omitido, usa o navegador do Playwright).
import { after, before, beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright-core';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';
const uniqueTag = () => `E2E${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;

let browser: Browser;
let context: BrowserContext;
let page: Page;
const pageErrors: string[] = [];

before(async () => {
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--no-sandbox'],
  });
});

after(async () => {
  await browser?.close();
});

beforeEach(async () => {
  // Contexto novo a cada teste: localStorage limpo, sem vazamento de estado entre cenários.
  context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  page = await context.newPage();
  pageErrors.length = 0;
  page.on('pageerror', (e) => pageErrors.push(e.message));
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
});

const closeContext = async () => {
  await context?.close();
};

// Abre uma tela pela sidebar. A seção "Ferramentas de gestão" é recolhível, então só clica nela se o item não estiver visível.
const openTool = async (name: string) => {
  const item = page.getByRole('button', { name, exact: false }).first();
  if (!(await item.isVisible().catch(() => false))) {
    await page.getByText('FERRAMENTAS DE GESTÃO', { exact: false }).first().click();
  }
  await item.click();
  await page.waitForTimeout(500);
};

const mainText = async () => page.locator('main').first().innerText();

const createAccount = async (name: string, openingBalance: string) => {
  await openTool('Contas & Cartões');
  await page.getByRole('button', { name: 'Nova Conta', exact: false }).first().click();
  await page.getByPlaceholder('Ex: Nubank Principal').fill(name);
  await page.getByPlaceholder('0,00').first().fill(openingBalance);
  await page.locator('form button[type=submit]').first().click();
  await page.waitForTimeout(500);
};

const createExpense = async (description: string, amount: string) => {
  await page.getByRole('button', { name: 'Novo Lançamento', exact: false }).first().click();
  await page.waitForTimeout(400);
  await page.locator('input[type=text][placeholder*="Supermercado"]').fill(description);
  await page.locator('input[type=number]').first().fill(amount);
  // Terceiro select do modal é a conta; a primeira opção é a conta recém-criada.
  await page.locator('select').nth(2).selectOption({ index: 0 });
  await page.getByRole('button', { name: 'Cadastrar Lançamento', exact: false }).first().click();
  await page.waitForTimeout(500);
};

describe('cabeçalho e navegação', () => {
  test('carrega a home sem erros de página', async () => {
    assert.equal(pageErrors.length, 0, pageErrors.join('\n'));
    await closeContext();
  });

  test('"Fazer Diagnóstico" abre o M0', async () => {
    await page.getByRole('button', { name: 'Fazer Diagnóstico', exact: false }).first().click();
    await page.waitForTimeout(500);
    const header = await page.locator('header').first().innerText();
    assert.match(header, /Diagnóstico de Entrada/);
    assert.equal(pageErrors.length, 0, pageErrors.join('\n'));
    await closeContext();
  });

  test('"Método JESUS" abre o M4', async () => {
    await page.getByRole('button', { name: 'Método JESUS', exact: false }).first().click();
    await page.waitForTimeout(500);
    const header = await page.locator('header').first().innerText();
    assert.match(header, /Libertação: Método JESUS/);
    assert.equal(pageErrors.length, 0, pageErrors.join('\n'));
    await closeContext();
  });

  test('"Novo Lançamento" abre o modal', async () => {
    await page.getByRole('button', { name: 'Novo Lançamento', exact: false }).first().click();
    await page.waitForTimeout(400);
    assert.equal(await page.getByRole('button', { name: 'Cadastrar Lançamento', exact: false }).count() > 0, true);
    await closeContext();
  });
});

describe('fluxos de escrita', () => {
  test('conta criada aparece na lista', async () => {
    const tag = uniqueTag();
    await createAccount(`Conta ${tag}`, '1000');
    assert.ok((await mainText()).includes(`Conta ${tag}`));
    assert.equal(pageErrors.length, 0, pageErrors.join('\n'));
    await closeContext();
  });

  test('despesa reduz o saldo da conta e aparece no extrato', async () => {
    const tag = uniqueTag();
    await createAccount(`Conta ${tag}`, '1000');
    await createExpense(`Mercado ${tag}`, '123.45');

    await openTool('Contas & Cartões');
    assert.ok((await mainText()).includes('876,55'), 'saldo esperado R$ 876,55 não aparece');

    await openTool('Lançamentos & Extrato');
    assert.ok((await mainText()).includes(`Mercado ${tag}`), 'lançamento não aparece no extrato');
    assert.equal(pageErrors.length, 0, pageErrors.join('\n'));
    await closeContext();
  });

  test('conta e lançamento persistem após reload', async () => {
    const tag = uniqueTag();
    await createAccount(`Conta ${tag}`, '1000');
    await createExpense(`Mercado ${tag}`, '50');

    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await openTool('Lançamentos & Extrato');
    assert.ok((await mainText()).includes(`Mercado ${tag}`), 'lançamento some após reload');
    await closeContext();
  });

  test('meta criada aparece na lista', async () => {
    const tag = uniqueTag();
    await openTool('Orçamentos & Metas');
    await page.getByRole('button', { name: 'Criar Nova Meta', exact: false }).first().click();
    await page.getByPlaceholder('Ex: Reserva de Emergência 6 Meses').fill(`Meta ${tag}`);
    await page.getByPlaceholder('Ex: 30000,00').fill('5000');
    await page.locator('form button[type=submit]').first().click();
    await page.waitForTimeout(500);
    assert.ok((await mainText()).includes(`Meta ${tag}`));
    await closeContext();
  });

  test('teto de orçamento criado aparece na lista', async () => {
    await openTool('Orçamentos & Metas');
    await page.getByRole('button', { name: 'Definir Novo Teto', exact: false }).first().click();
    await page.waitForTimeout(400);
    await page.locator('form select').first().selectOption('Lazer & Restaurantes');
    await page.locator('form input[type=number]').first().fill('800');
    await page.locator('form button[type=submit]').first().click();
    await page.waitForTimeout(500);
    assert.ok((await mainText()).includes('Lazer & Restaurantes'));
    await closeContext();
  });
});
