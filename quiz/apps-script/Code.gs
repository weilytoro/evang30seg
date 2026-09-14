/**
 * Web App do Google Apps Script que recebe a resposta do quiz (POST em
 * JSON) e grava imediatamente como uma nova linha na planilha ativa.
 *
 * Setup: ver quiz/README.md.
 */

const SHEET_NAME = 'Respostas';
const HEADER = ['Data/Hora', 'Nome', 'E-mail', 'Telefone', 'Perfil', 'Descrição do Resultado', 'Respostas'];

function doPost(e) {
  let lock;
  try {
    lock = LockService.getScriptLock();
    lock.waitLock(10000);

    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('Requisição sem corpo (e.postData ausente)');
    }

    const body = JSON.parse(e.postData.contents);

    const nome = String(body.nome || '').trim().slice(0, 150);
    const email = String(body.email || '').trim().slice(0, 150);
    const telefone = String(body.telefone || '').trim().slice(0, 50);
    const perfilTitulo = String(body.perfilTitulo || '').trim().slice(0, 150);
    const perfilDescricao = String(body.perfilDescricao || '').trim().slice(0, 2000);
    const respostas = Array.isArray(body.respostas) ? body.respostas : [];

    if (!nome || !email || !telefone || !perfilTitulo) {
      return jsonResponse({ ok: false, erro: 'Dados inválidos' });
    }

    const respostasTexto = respostas
      .map(r => `${r.pergunta || ''}: ${r.resposta || ''}`)
      .join(' | ');

    const sheet = getSheet();
    sheet.appendRow([new Date(), nome, email, telefone, perfilTitulo, perfilDescricao, respostasTexto]);

    return jsonResponse({ ok: true });
  } catch (err) {
    console.error('doPost falhou: ' + err + (err && err.stack ? '\n' + err.stack : ''));
    return jsonResponse({ ok: false, erro: String(err) });
  } finally {
    if (lock) lock.releaseLock();
  }
}

// GET /exec devolve a contagem de respostas por nível (sem nome, e-mail,
// telefone ou respostas individuais) — usado pelo dashboard.html.
function doGet(e) {
  return jsonResponse({ ok: true, counts: getNivelCounts() });
}

function getNivelCounts() {
  const counts = { nivel1: 0, nivel2: 0, nivel3: 0, nivel4: 0, nivel5: 0 };
  const TITULO_PARA_NIVEL = {
    'Mentalidade Financeira Bloqueada': 'nivel1',
    'Mentalidade Financeira Estagnada': 'nivel2',
    'Mentalidade Financeira em Transição': 'nivel3',
    'Mentalidade Financeira em Construção': 'nivel4',
    'Mentalidade Financeira Evoluída': 'nivel5',
  };

  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return counts;

  const perfilColuna = HEADER.indexOf('Perfil') + 1;
  const perfis = sheet.getRange(2, perfilColuna, lastRow - 1, 1).getValues();
  perfis.forEach(function (row) {
    const nivel = TITULO_PARA_NIVEL[String(row[0] || '').trim()];
    if (nivel) counts[nivel]++;
  });
  return counts;
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADER);
    sheet.getRange(1, 1, 1, HEADER.length).setFontWeight('bold');
  } else {
    const headerRange = sheet.getRange(1, 1, 1, HEADER.length);
    const atual = headerRange.getValues()[0];
    const bate = HEADER.every(function (col, i) { return atual[i] === col; });
    if (!bate) {
      headerRange.setValues([HEADER]);
      headerRange.setFontWeight('bold');
    }
  }
  return sheet;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
