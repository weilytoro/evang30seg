/**
 * Web App do Google Apps Script que recebe a resposta do quiz (POST em
 * JSON) e grava imediatamente como uma nova linha na planilha ativa.
 *
 * Setup: ver quiz/README.md.
 */

const SHEET_NAME = 'Respostas';
const HEADER = ['Data/Hora', 'Nome', 'E-mail', 'Telefone', 'Perfil', 'Respostas'];

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
    const respostas = Array.isArray(body.respostas) ? body.respostas : [];

    if (!nome || !email || !telefone || !perfilTitulo) {
      return jsonResponse({ ok: false, erro: 'Dados inválidos' });
    }

    const respostasTexto = respostas
      .map(r => `${r.pergunta || ''}: ${r.resposta || ''}`)
      .join(' | ');

    const sheet = getSheet();
    sheet.appendRow([new Date(), nome, email, telefone, perfilTitulo, respostasTexto]);

    return jsonResponse({ ok: true });
  } catch (err) {
    console.error('doPost falhou: ' + err + (err && err.stack ? '\n' + err.stack : ''));
    return jsonResponse({ ok: false, erro: String(err) });
  } finally {
    if (lock) lock.releaseLock();
  }
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
  }
  return sheet;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
