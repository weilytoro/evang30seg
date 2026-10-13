// Fluxos de QA: edição/exclusão de conta, validações de formulário e diagnóstico M0 completo.
// Mesmos requisitos de ui.test.ts: app rodando em BASE_URL (padrão http://localhost:3000).
import { after, before, beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright-core';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';
const uniqueTag = () => `QA${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;

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
  // Contexto novo por teste: localStorage limpo, sem estado vazando entre cenários.
  context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  page = await context.newPage();
  pageErrors.length = 0;
  page.on('pageerror', (e) => pageErrors.push(e.message));
  // Exclusão de conta usa window.confirm nativo; aceita para seguir o fluxo.
  page.on('dialog', (d) => d.accept());
  await page.goto(BASE_URL, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(500);
});

const closeContext = async () => {
  await context?.close();
};

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
  await page.getByRole('button', { name: 'Nova Conta', exact: false }).first().click();
  await page.waitForTimeout(400);
  await page.getByPlaceholder('Ex: Nubank Principal').fill(name);
  await page.getByPlaceholder('0,00').first().fill(openingBalance);
  await page.locator('form button[type=submit]').first().click();
  await page.waitForTimeout(500);
};

describe('edição e exclusão de conta', () => {
  test('edita o nome da conta e a alteração aparece na lista', async () => {
    const tag = uniqueTag();
    await openTool('Contas & Cartões');
    await createAccount(`Conta ${tag}`, '500');

    await page.locator('[title="Editar conta"]').first().click();
    await page.waitForTimeout(400);
    assert.equal(await page.getByPlaceholder('Ex: Nubank Principal').inputValue(), `Conta ${tag}`, 'edição deve abrir com o nome atual');

    await page.getByPlaceholder('Ex: Nubank Principal').fill(`Renomeada ${tag}`);
    await page.locator('form button[type=submit]').first().click();
    await page.waitForTimeout(500);

    const text = await mainText();
    assert.ok(text.includes(`Renomeada ${tag}`), 'nome novo deve aparecer');
    assert.ok(!text.includes(`Conta ${tag}`), 'nome antigo não deve mais aparecer');
    assert.equal(pageErrors.length, 0, pageErrors.join('\n'));
    await closeContext();
  });

  test('exclui a conta após confirmação e ela some da lista', async () => {
    const tag = uniqueTag();
    await openTool('Contas & Cartões');
    await createAccount(`Conta ${tag}`, '500');
    assert.ok((await mainText()).includes(`Conta ${tag}`), 'pré-condição: conta criada');

    await page.locator('[title="Excluir conta"]').first().click();
    await page.waitForTimeout(500);

    assert.ok(!(await mainText()).includes(`Conta ${tag}`), 'conta deve sumir após confirmar');
    assert.equal(pageErrors.length, 0, pageErrors.join('\n'));
    await closeContext();
  });
});

describe('validações de formulário', () => {
  test('conta sem nome não é salva (validação nativa bloqueia o submit)', async () => {
    await openTool('Contas & Cartões');
    await page.getByRole('button', { name: 'Nova Conta', exact: false }).first().click();
    await page.waitForTimeout(400);
    await page.locator('form button[type=submit]').first().click();
    await page.waitForTimeout(300);

    const nameInput = page.getByPlaceholder('Ex: Nubank Principal');
    assert.equal(await nameInput.isVisible(), true, 'modal deve continuar aberto');
    assert.notEqual(await nameInput.evaluate((e: HTMLInputElement) => e.validationMessage), '', 'campo deve mostrar mensagem de validação');
    await closeContext();
  });

  test('lançamento com valor zero não é salvo', async () => {
    const tag = uniqueTag();
    await openTool('Contas & Cartões');
    await createAccount(`Conta ${tag}`, '500');

    await page.getByRole('button', { name: 'Novo Lançamento', exact: false }).first().click();
    await page.waitForTimeout(400);
    await page.locator('input[type=text][placeholder*="Supermercado"]').fill(`Zero ${tag}`);
    await page.locator('input[type=number]').first().fill('0');
    await page.locator('select').nth(2).selectOption({ index: 0 });
    await page.getByRole('button', { name: 'Cadastrar Lançamento', exact: false }).first().click();
    await page.waitForTimeout(400);

    assert.equal(await page.locator('input[type=number]').first().isVisible(), true, 'modal deve continuar aberto com valor zero');
    await closeContext();
  });

  test('lançamento com valor negativo não é salvo', async () => {
    const tag = uniqueTag();
    await openTool('Contas & Cartões');
    await createAccount(`Conta ${tag}`, '500');

    await page.getByRole('button', { name: 'Novo Lançamento', exact: false }).first().click();
    await page.waitForTimeout(400);
    await page.locator('input[type=text][placeholder*="Supermercado"]').fill(`Negativo ${tag}`);
    await page.locator('input[type=number]').first().fill('-50');
    await page.locator('select').nth(2).selectOption({ index: 0 });
    await page.getByRole('button', { name: 'Cadastrar Lançamento', exact: false }).first().click();
    await page.waitForTimeout(400);

    assert.equal(await page.locator('input[type=number]').first().isVisible(), true, 'modal deve continuar aberto com valor negativo');
    await closeContext();
  });
});

describe('diagnóstico M0 completo', () => {
  test('responde as 10 perguntas, conclui o diagnóstico e libera o M1', async () => {
    await page.getByRole('button', { name: 'Fazer Diagnóstico', exact: false }).first().click();
    await page.waitForTimeout(600);

    const options = () => page.getByRole('button', { name: /^[A-E] /, exact: false });
    const next = page.locator('main button').filter({ hasText: 'Próxima' }).first();

    // "Próxima" não pode avançar sem resposta.
    assert.equal(await options().count(), 5, 'primeira pergunta deve ter 5 alternativas');
    assert.equal(await next.isDisabled(), true, '"Próxima" deve estar desabilitada sem resposta');

    // Antes de concluir, o M1 continua bloqueado: o cabeçalho não muda e um aviso de bloqueio aparece.
    const headerBefore = await page.locator('header').first().innerText();
    await page.getByRole('button', { name: 'M1 · Mentalidade', exact: false }).first().click({ timeout: 3000 });
    await page.waitForTimeout(400);
    assert.equal(await page.locator('header').first().innerText(), headerBefore, 'M1 não deve abrir antes do diagnóstico');
    const lockedNotice = page.getByRole('button', { name: 'Ir para o Diagnóstico', exact: false });
    assert.equal(await lockedNotice.isVisible(), true, 'aviso de bloqueio deve aparecer ao clicar em módulo bloqueado');
    assert.equal(await page.getByRole('heading', { name: 'Módulo bloqueado' }).isVisible(), true, 'aviso de módulo deve ter o título de módulo');
    await lockedNotice.click();
    await page.waitForTimeout(400);

    let answered = 0;
    while (answered < 20 && (await options().count()) > 0) {
      await options().nth(0).click();
      await page.waitForTimeout(150);
      await next.click({ timeout: 4000 });
      await page.waitForTimeout(350);
      answered++;
    }
    assert.equal(answered, 10, 'o quiz deve ter 10 perguntas');

    // Etapa final: escolhe CPF (sem CNPJ) e vê o resultado.
    await page.getByRole('button', { name: 'Apenas Pessoa Física', exact: false }).first().click();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Ver Meu Diagnóstico', exact: false }).first().click();
    await page.waitForTimeout(800);

    const result = await mainText();
    assert.ok(result.includes('SEU DIAGNÓSTICO FINANCEIRO'), 'resultado do diagnóstico deve aparecer');
    const header = await page.locator('header').first().innerText();
    assert.match(header, /MÓDULO 0/);
    assert.match(header, /\b[1-9]\d*%/, 'progresso deve sair de 0% após concluir');

    // M1 agora abre.
    await page.getByRole('button', { name: 'M1 · Mentalidade', exact: false }).first().click();
    await page.waitForTimeout(500);
    assert.match(await page.locator('header').first().innerText(), /MÓDULO 1/, 'M1 deve abrir após concluir o M0');

    assert.equal(pageErrors.length, 0, pageErrors.join('\n'));
    await closeContext();
  });
});

describe('regressões de UI corrigidas no QA', () => {
  test('Escape fecha o modal Nova Conta', async () => {
    await openTool('Contas & Cartões');
    await page.getByRole('button', { name: 'Nova Conta', exact: false }).first().click();
    await page.waitForTimeout(400);
    const nameInput = page.getByPlaceholder('Ex: Nubank Principal');
    assert.equal(await nameInput.isVisible(), true, 'pré-condição: modal aberto');

    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    assert.equal(await nameInput.isVisible(), false, 'Escape deve fechar o modal');
    await closeContext();
  });

  test('telas financeiras não têm rolagem horizontal em 1280px', async () => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.getByText('FERRAMENTAS DE GESTÃO', { exact: false }).first().click();
    for (const name of ['Lançamentos & Extrato', 'Contas & Cartões', 'Orçamentos & Metas', 'Relatórios Mensais']) {
      await page.getByRole('button', { name, exact: false }).first().click();
      await page.waitForTimeout(400);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert.equal(overflow, 0, `${name}: página rola ${overflow}px para o lado`);
    }
    await closeContext();
  });
});
