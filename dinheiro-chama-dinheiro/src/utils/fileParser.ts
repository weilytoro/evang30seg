import { ParsedRawTransaction, Transaction, TransactionType } from '../types/finance';

// Auto-categorization keywords
const CATEGORY_RULES: { keywords: string[]; category: string; type: TransactionType }[] = [
  // Expense - Alimentação & Mercado
  {
    keywords: [
      'mercado', 'supermercado', 'carrefour', 'pao de acucar', 'atacadao', 'assai', 'extra',
      'hortifruti', 'swift', 'acougue', 'quitanda', 'hipermercado', 'dia brasil', 'st marche',
      'nagumo', 'sam\'s club', 'sams club'
    ],
    category: 'Alimentação & Mercado',
    type: 'expense',
  },
  // Expense - Lazer & Restaurantes
  {
    keywords: [
      'ifood', 'rappi', 'mcdonald', 'burger king', 'bk', 'restaurante', 'bar', 'pizzaria',
      'padaria', 'cafe', 'starbucks', 'sorveteria', 'choperia', 'outback', 'subway',
      'cinema', 'cinemark', 'ingresso', 'teatro', 'show', 'cervejaria', 'hamburgueria',
      'sushi', 'cantina', 'bistro'
    ],
    category: 'Lazer & Restaurantes',
    type: 'expense',
  },
  // Expense - Transporte & Combustível
  {
    keywords: [
      'uber', '99app', '99 pop', 'taxi', 'posto', 'combustivel', 'gasolina', 'etanol',
      'shell', 'ipiranga', 'petrobras', 'sem parar', 'veloe', 'pedagio', 'estacionamento',
      'auto posto', 'troca de oleo', 'ipva', 'mecanico', 'oficina', 'detran', 'estapar'
    ],
    category: 'Transporte & Combustível',
    type: 'expense',
  },
  // Expense - Moradia & Contas
  {
    keywords: [
      'aluguel', 'condominio', 'iptu', 'enel', 'sabesp', 'cpfl', 'cemig', 'copel',
      'luz', 'energia', 'agua', 'gas', 'comgas', 'claro', 'vivo', 'tim', 'oi fibra',
      'internet', 'eletricidade', 'imobiliaria', 'quintoandar', 'loft'
    ],
    category: 'Moradia & Contas',
    type: 'expense',
  },
  // Expense - Saúde & Cuidados
  {
    keywords: [
      'farmacia', 'drogaria', 'drogasil', 'droga raia', 'pague menos', 'sao paulo',
      'panvel', 'unimed', 'bradesco saude', 'sulamerica', 'amil', 'notredame',
      'consulta', 'exame', 'laboratorio', 'fleury', 'lavoisier', 'dentista', 'odonto',
      'hospital', 'clinica', 'medico', 'psicologo', 'fisioterapia'
    ],
    category: 'Saúde & Cuidados',
    type: 'expense',
  },
  // Expense - Serviços & Assinaturas
  {
    keywords: [
      'netflix', 'spotify', 'amazon prime', 'disney', 'hbo', 'max', 'youtube', 'apple',
      'google', 'chatgpt', 'openai', 'github', 'globo play', 'deezer', 'icloud', 'canva'
    ],
    category: 'Serviços & Assinaturas',
    type: 'expense',
  },
  // Expense - Compras & Vestuário
  {
    keywords: [
      'zara', 'renner', 'c&a', 'riachuelo', 'mercado livre', 'mercadolivre', 'amazon',
      'shopee', 'shein', 'aliexpress', 'magalu', 'magazine luiza', 'americanas',
      'centauro', 'nike', 'adidas', 'calcados', 'roupas', 'moda', 'shopping'
    ],
    category: 'Compras & Vestuário',
    type: 'expense',
  },
  // Expense - Educação
  {
    keywords: [
      'udemy', 'coursera', 'alura', 'faculdade', 'universidade', 'colegio', 'escola',
      'curso', 'livraria', 'livro', 'idiomas', 'ingles', 'pos graduacao'
    ],
    category: 'Educação & Cursos',
    type: 'expense',
  },
  // Income - Salário
  {
    keywords: [
      'salario', 'pagamento de salario', 'folha', 'pro-labore', 'pro labore', 'ted recebida',
      'remuneracao', 'holerite', 'proventos', 'ordenado', 'adiantamento'
    ],
    category: 'Salário & Pró-labore',
    type: 'income',
  },
  // Income - Freelance & Serviços
  {
    keywords: [
      'freelance', 'servico prestado', 'consultoria', 'honorarios', 'pj', 'nota fiscal',
      'workana', 'upwork', 'fiverr', 'recebimento cliente'
    ],
    category: 'Freelance & Serviços',
    type: 'income',
  },
  // Income - Rendimentos
  {
    keywords: [
      'rendimento', 'dividendo', 'jcp', 'juros sobre capital', 'cdb', 'tesouro direto',
      'fii', 'provento', 'resgate investimento', 'rendimentos cdb'
    ],
    category: 'Rendimentos & Dividendos',
    type: 'income',
  },
];

export function autoDetectCategory(description: string, rawAmount: number): { category: string; type: TransactionType } {
  const lower = description.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  for (const rule of CATEGORY_RULES) {
    for (const kw of rule.keywords) {
      const normalizedKw = kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (lower.includes(normalizedKw)) {
        return { category: rule.category, type: rule.type };
      }
    }
  }

  // Fallback based on amount sign
  if (rawAmount > 0) {
    return { category: 'Outras Receitas', type: 'income' };
  } else {
    return { category: 'Outras Despesas', type: 'expense' };
  }
}

// Clean and parse currency string (supports "1.234,56", "1234.56", "-R$ 50,00", etc.)
export function parseAmount(val: string): number {
  if (!val) return 0;
  let clean = val.replace(/R\$/g, '').trim();

  // If both . and , exist, determine which is decimal
  if (clean.includes('.') && clean.includes(',')) {
    if (clean.lastIndexOf(',') > clean.lastIndexOf('.')) {
      // Brazilian standard: 1.234,56 -> 1234.56
      clean = clean.replace(/\./g, '').replace(',', '.');
    } else {
      // US standard: 1,234.56 -> 1234.56
      clean = clean.replace(/,/g, '');
    }
  } else if (clean.includes(',')) {
    // Only comma: 123,45 -> 123.45
    clean = clean.replace(',', '.');
  }

  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

// Normalize Date to YYYY-MM-DD
export function parseDate(val: string): string {
  if (!val) {
    return new Date().toISOString().split('T')[0];
  }
  const clean = val.trim();

  // DD/MM/YYYY or DD-MM-YYYY
  const brMatch = clean.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (brMatch) {
    const day = brMatch[1].padStart(2, '0');
    const month = brMatch[2].padStart(2, '0');
    let year = brMatch[3];
    if (year.length === 2) year = '20' + year;
    return `${year}-${month}-${day}`;
  }

  // YYYY-MM-DD
  const isoMatch = clean.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (isoMatch) {
    const year = isoMatch[1];
    const month = isoMatch[2].padStart(2, '0');
    const day = isoMatch[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // OFX format: YYYYMMDD...
  const ofxMatch = clean.match(/^(\d{4})(\d{2})(\d{2})/);
  if (ofxMatch) {
    return `${ofxMatch[1]}-${ofxMatch[2]}-${ofxMatch[3]}`;
  }

  // Fallback to today
  return new Date().toISOString().split('T')[0];
}

/**
 * Parses OFX (Open Financial Exchange) format
 */
export function parseOFX(content: string): ParsedRawTransaction[] {
  const transactions: ParsedRawTransaction[] = [];
  const stmttrnRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/gi;

  let match;
  while ((match = stmttrnRegex.exec(content)) !== null) {
    const block = match[1];

    const trntype = block.match(/<TRNTYPE>([^\r\n<]+)/i)?.[1]?.trim() || '';
    const dtposted = block.match(/<DTPOSTED>([^\r\n<]+)/i)?.[1]?.trim() || '';
    const trnamt = block.match(/<TRNAMT>([^\r\n<]+)/i)?.[1]?.trim() || '0';
    const memo = block.match(/<MEMO>([^\r\n<]+)/i)?.[1]?.trim() || '';
    const name = block.match(/<NAME>([^\r\n<]+)/i)?.[1]?.trim() || '';

    const description = memo || name || 'Lançamento Bancário';
    const rawVal = parseFloat(trnamt);
    const date = parseDate(dtposted);

    const isExpense = rawVal < 0 || trntype.toUpperCase() === 'DEBIT';
    const amount = Math.abs(rawVal);
    const { category, type } = autoDetectCategory(description, rawVal);

    transactions.push({
      date,
      description,
      amount,
      type: isExpense ? 'expense' : type,
      suggestedCategory: category,
      originalLine: block.replace(/\s+/g, ' ').slice(0, 100),
      selected: true,
    });
  }

  return transactions;
}

/**
 * Parses CSV or text table files
 */
export function parseCSV(content: string): ParsedRawTransaction[] {
  const lines = content.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  if (lines.length === 0) return [];

  // Detect delimiter: semicolon or comma or tab
  const sample = lines.slice(0, 5).join('\n');
  const commaCount = (sample.match(/,/g) || []).length;
  const semiCount = (sample.match(/;/g) || []).length;
  const tabCount = (sample.match(/\t/g) || []).length;

  let delimiter = ',';
  if (semiCount > commaCount && semiCount > tabCount) delimiter = ';';
  if (tabCount > commaCount && tabCount > semiCount) delimiter = '\t';

  // Split lines into tokens taking quotes into account
  const tokenize = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const rows = lines.map(tokenize);
  if (rows.length === 0) return [];

  // Check header row
  const header = rows[0].map((h) => h.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));

  let dateIdx = -1;
  let descIdx = -1;
  let amountIdx = -1;
  let categoryIdx = -1;
  let typeIdx = -1;

  for (let i = 0; i < header.length; i++) {
    const col = header[i];
    if (col.includes('data') || col.includes('dt') || col.includes('date')) dateIdx = i;
    else if (col.includes('desc') || col.includes('historico') || col.includes('titulo') || col.includes('memo') || col.includes('lancamento')) descIdx = i;
    else if (col.includes('valor') || col.includes('quantia') || col.includes('amount') || col.includes('total')) amountIdx = i;
    else if (col.includes('categoria') || col.includes('category')) categoryIdx = i;
    else if (col.includes('tipo') || col.includes('type')) typeIdx = i;
  }

  const startRow = dateIdx !== -1 || descIdx !== -1 || amountIdx !== -1 ? 1 : 0;

  // Fallback column positions if not detected by header name
  if (dateIdx === -1) dateIdx = 0;
  if (descIdx === -1) descIdx = rows[0].length > 1 ? 1 : 0;
  if (amountIdx === -1) amountIdx = rows[0].length > 2 ? 2 : rows[0].length - 1;

  const results: ParsedRawTransaction[] = [];

  for (let i = startRow; i < rows.length; i++) {
    const row = rows[i];
    if (row.length <= 1 && !row[0]) continue;

    const rawDate = row[dateIdx] || '';
    const rawDesc = row[descIdx] || 'Lançamento sem título';
    const rawValStr = row[amountIdx] || '0';
    const rawCategory = categoryIdx !== -1 ? row[categoryIdx] : '';

    const numVal = parseAmount(rawValStr);
    if (numVal === 0 && !rawDesc) continue;

    const date = parseDate(rawDate);
    const { category: autoCat, type: autoType } = autoDetectCategory(rawDesc, numVal);

    // If explicit type in column or negative number
    let finalType: TransactionType = autoType;
    if (typeIdx !== -1 && row[typeIdx]) {
      const t = row[typeIdx].toLowerCase();
      if (t.includes('rec') || t.includes('cred') || t.includes('inc') || t.includes('entrada')) {
        finalType = 'income';
      } else if (t.includes('desp') || t.includes('deb') || t.includes('exp') || t.includes('saida')) {
        finalType = 'expense';
      }
    } else if (rawValStr.includes('-') || numVal < 0) {
      finalType = 'expense';
    }

    const absAmount = Math.abs(numVal);
    const finalCategory = rawCategory && rawCategory.length > 2 ? rawCategory : autoCat;

    results.push({
      date,
      description: rawDesc.replace(/^["']|["']$/g, ''),
      amount: absAmount,
      type: finalType,
      suggestedCategory: finalCategory,
      originalLine: lines[i],
      selected: true,
    });
  }

  return results;
}

/**
 * Universal file parser: detects OFX, JSON, or CSV/TXT
 */
export function parseBankFile(filename: string, content: string): ParsedRawTransaction[] {
  const lowerName = filename.toLowerCase();

  if (lowerName.endsWith('.ofx') || content.includes('<OFX>') || content.includes('<STMTTRN>')) {
    return parseOFX(content);
  }

  if (lowerName.endsWith('.json')) {
    try {
      const data = JSON.parse(content);
      if (Array.isArray(data)) {
        return data.map((item: any) => ({
          date: parseDate(item.date || item.data || ''),
          description: item.description || item.descricao || item.title || 'Lançamento',
          amount: Math.abs(Number(item.amount || item.valor || 0)),
          type: (item.type || item.tipo || 'expense') as TransactionType,
          suggestedCategory: item.category || item.categoria || 'Outras Despesas',
          selected: true,
        }));
      }
    } catch {
      // Fallback to CSV
    }
  }

  return parseCSV(content);
}

/**
 * Export transactions to CSV (Brazilian format: semicolon, dd/mm/yyyy, comma decimal)
 */
export function exportToCSV(transactions: Transaction[], filename: string = 'extrato_financeiro.csv') {
  const headers = ['Data', 'Descricao', 'Categoria', 'Valor (R$)', 'Tipo', 'Conta', 'Status', 'Metodo de Pagamento'];
  const rows = transactions.map((t) => [
    t.date,
    `"${t.description.replace(/"/g, '""')}"`,
    `"${t.category}"`,
    (t.type === 'expense' ? -t.amount : t.amount).toFixed(2).replace('.', ','),
    t.type === 'income' ? 'Receita' : t.type === 'expense' ? 'Despesa' : 'Transferência',
    t.accountId,
    t.status === 'completed' ? 'Realizado' : 'Pendente',
    t.paymentMethod,
  ]);

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export complete backup to JSON
 */
export function exportToJSON(data: any, filename: string = 'backup_finansmart.json') {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const link = document.createElement('a');
  link.setAttribute('href', jsonString);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Sample statement mock templates for demonstration
export const SAMPLE_NUBANK_CSV = `Data;Titulo;Valor;Categoria
25/09/2026;Supermercado Pao de Acucar;-248.60;Alimentação & Mercado
24/09/2026;Posto Shell Combustivel;-190.00;Transporte & Combustível
23/09/2026;Restaurante Fogao a Lenha;-84.50;Lazer & Restaurantes
22/09/2026;Farmacia Drogasil;-67.90;Saúde & Cuidados
20/09/2026;Uber Viagem Centro;-32.40;Transporte & Combustível
18/09/2026;Netflix Assinatura Mensal;-55.90;Serviços & Assinaturas
15/09/2026;TED Recebida - Consultoria PJ;3850.00;Freelance & Serviços
12/09/2026;Amazon Marketplace Eletronicos;-319.90;Compras & Vestuário
10/09/2026;iFood Refeicao Almoco;-58.00;Lazer & Restaurantes
05/09/2026;Folha de Pagamento Salario;6400.00;Salário & Pró-labore
03/09/2026;Sabesp Conta de Agua;-89.20;Moradia & Contas
02/09/2026;Enel Conta de Energia;-164.50;Moradia & Contas
`;

export const SAMPLE_ITAU_CSV = `Data;Lançamento;Valor
26/09/2026;PIX RECEBIDO JOAO DA SILVA;1500,00
24/09/2026;PAGTO ELETRON COBRANCA CONDOMINIO;-680,00
21/09/2026;COMPRA CARTAO PADARIA BELLA VISTA;-42,30
19/09/2026;PIX ENVIADO ALUGUEL IMOVEL;-2200,00
16/09/2026;RENDIMENTO APLICACAO CDB ITAU;145,80
14/09/2026;AUTO POSTO IPIRANGA ABASTECIMENTO;-210,00
11/09/2026;DROGA RAIA MEDICAMENTOS;-94,20
08/09/2026;CURSO UDEMY DESENVOLVIMENTO WEB;-39,90
05/09/2026;PRO-LABORE MENSAL EMPRESA;7500,00
`;

/**
 * Identifica dados essenciais (Data, Valor, Descrição) a partir do texto de um documento/PDF
 * e aplica estritamente a escolha do usuário entre 'income' (receita), 'expense' (despesa) ou 'transfer' (transferência).
 */
export function extractFromDocumentText(
  text: string,
  chosenType: 'income' | 'expense' | 'transfer'
): { date: string; amount: number; description: string; type: 'income' | 'expense' | 'transfer'; category: string } {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  // 1. Identificar Data (procura formatos comuns DD/MM/AAAA, DD-MM-AAAA ou AAAA-MM-DD)
  let identifiedDate = new Date().toISOString().split('T')[0];
  const dateMatch = text.match(/\b(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})\b/);
  if (dateMatch) {
    const day = dateMatch[1].padStart(2, '0');
    const month = dateMatch[2].padStart(2, '0');
    let year = dateMatch[3];
    if (year.length === 2) year = '20' + year;
    identifiedDate = `${year}-${month}-${day}`;
  } else {
    const isoMatch = text.match(/\b(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})\b/);
    if (isoMatch) {
      identifiedDate = `${isoMatch[1]}-${isoMatch[2].padStart(2, '0')}-${isoMatch[3].padStart(2, '0')}`;
    }
  }

  // 2. Identificar Valor Monetário
  let identifiedAmount = 0;
  const moneyMatch = text.match(/(?:R\$\s*|valor[:\s]*R?\$?\s*|total[:\s]*R?\$?\s*)([\d\.,]+)/i);
  if (moneyMatch && moneyMatch[1]) {
    identifiedAmount = parseAmount(moneyMatch[1]);
  } else {
    // Procura qualquer número com formato de moeda na string
    const fallbackMatch = text.match(/\b\d{1,3}(?:\.\d{3})*,\d{2}\b/);
    if (fallbackMatch) {
      identifiedAmount = parseAmount(fallbackMatch[0]);
    }
  }

  // 3. Identificar Descrição / Beneficiário / Pagador
  let identifiedDescription = '';
  const descMatch = text.match(/(?:benefici[aá]rio|favorecido|pagador|estabelecimento|nome|para|destinat[aá]rio)[:\s]+([^\r\n,;]+)/i);
  if (descMatch && descMatch[1]) {
    identifiedDescription = descMatch[1].trim();
  } else if (lines.length > 0) {
    // Pega a primeira linha com texto relevante
    identifiedDescription = lines.find((l) => l.length > 3 && !l.match(/^[\d\s\/\-\.,:]+$/)) || 'Lançamento via Documento';
  } else {
    identifiedDescription = chosenType === 'income' ? 'Receita Identificada' : chosenType === 'expense' ? 'Despesa Identificada' : 'Transferência Identificada';
  }

  // 4. Categorização sugerida
  const { category } = autoDetectCategory(identifiedDescription, chosenType === 'income' ? identifiedAmount : -identifiedAmount);

  return {
    date: identifiedDate,
    amount: Math.abs(identifiedAmount),
    description: identifiedDescription.slice(0, 80),
    type: chosenType,
    category: chosenType === 'transfer' ? 'Transferência' : category,
  };
}

/**
 * Gera e abre o Relatório PDF para impressão/download dos lançamentos
 * com layout elegante em Branco e Dourado, permitindo filtrar por:
 * 'all' (Todos), 'income' (Receita), 'expense' (Despesa) ou 'transfer' (Transferência).
 */
export function exportToPDF(
  transactions: Transaction[],
  typeFilter: 'all' | 'income' | 'expense' | 'transfer' = 'all',
  title: string = 'Relatório de Lançamentos Financeiros'
) {
  const filtered = transactions.filter((t) => {
    if (typeFilter === 'all') return true;
    return t.type === typeFilter;
  });

  const totalIncome = filtered
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalExpense = filtered
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const netBalance = totalIncome - totalExpense;

  const typeFilterLabel =
    typeFilter === 'income'
      ? 'Somente Receitas'
      : typeFilter === 'expense'
      ? 'Somente Despesas'
      : typeFilter === 'transfer'
      ? 'Somente Transferências'
      : 'Todos os Lançamentos';

  const rowsHtml = filtered
    .map(
      (t) => `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 12px; font-size: 12px; color: #475569;">${t.date.split('-').reverse().join('/')}</td>
        <td style="padding: 10px 12px; font-size: 12px; font-weight: 600; color: #0f172a;">${t.description}</td>
        <td style="padding: 10px 12px; font-size: 12px; color: #64748b;">${t.category}</td>
        <td style="padding: 10px 12px; font-size: 11px;">
          <span style="display: inline-block; padding: 2px 8px; border-radius: 999px; font-weight: 700; ${
            t.type === 'income'
              ? 'background: #ecfdf5; color: #047857;'
              : t.type === 'expense'
              ? 'background: #fff1f2; color: #be123c;'
              : 'background: #f8fafc; color: #475569;'
          }">
            ${t.type === 'income' ? 'Receita' : t.type === 'expense' ? 'Despesa' : 'Transferência'}
          </span>
        </td>
        <td style="padding: 10px 12px; font-size: 12px; font-weight: 700; text-align: right; ${
          t.type === 'income' ? 'color: #047857;' : t.type === 'expense' ? 'color: #be123c;' : 'color: #0f172a;'
        }">
          ${t.type === 'expense' ? '-' : ''}R$ ${t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </td>
      </tr>
    `
    )
    .join('');

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8">
      <title>${title} — Dinheiro Chama Dinheiro?</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background: #ffffff;
          color: #0f172a;
          margin: 0;
          padding: 36px 40px;
        }
        @media print {
          body { padding: 15px; }
          .no-print { display: none !important; }
        }
        .header {
          border-bottom: 3px solid #d97706;
          padding-bottom: 16px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .title {
          font-size: 22px;
          font-weight: 900;
          color: #78350f;
          letter-spacing: -0.5px;
          margin: 0 0 4px 0;
        }
        .subtitle {
          font-size: 13px;
          color: #b45309;
          font-weight: 600;
          margin: 0;
        }
        .badge {
          background: #fef3c7;
          border: 1px solid #fde68a;
          color: #92400e;
          font-size: 11px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 9999px;
          text-transform: uppercase;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        .summary-card {
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 12px;
          padding: 14px 16px;
        }
        .summary-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #92400e;
          margin-bottom: 4px;
        }
        .summary-value {
          font-size: 20px;
          font-weight: 900;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th {
          background: #f8fafc;
          border-bottom: 2px solid #e2e8f0;
          padding: 10px 12px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          color: #64748b;
          text-align: left;
        }
        th:last-child {
          text-align: right;
        }
        .footer {
          margin-top: 36px;
          border-top: 1px solid #f1f5f9;
          padding-top: 16px;
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #94a3b8;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1 class="title">Dinheiro Chama Dinheiro?</h1>
          <p class="subtitle">Extrato & Relatório Oficial de Lançamentos — Método GERAR</p>
          <div style="margin-top: 6px; font-size: 12px; color: #475569;">
            Emissão: <strong>${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</strong> • Filtro: <strong>${typeFilterLabel}</strong>
          </div>
        </div>
        <div style="text-align: right;">
          <span class="badge">Relatório em PDF</span>
          <div class="no-print" style="margin-top: 12px;">
            <button onclick="window.print()" style="background: #d97706; color: #ffffff; border: none; font-weight: 800; font-size: 12px; padding: 8px 16px; border-radius: 8px; cursor: pointer;">
              Imprimir / Salvar PDF
            </button>
          </div>
        </div>
      </div>

      <div class="summary-grid">
        <div class="summary-card">
          <div class="summary-label">Total Receitas</div>
          <div class="summary-value" style="color: #047857;">R$ ${totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Total Despesas</div>
          <div class="summary-value" style="color: #be123c;">R$ ${totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        </div>
        <div class="summary-card" style="border-color: #f59e0b;">
          <div class="summary-label">Resultado Líquido</div>
          <div class="summary-value" style="color: ${netBalance >= 0 ? '#047857' : '#be123c'};">
            R$ ${netBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Tipo</th>
            <th style="text-align: right;">Valor</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml || '<tr><td colspan="5" style="text-align: center; padding: 24px; color: #94a3b8;">Nenhum lançamento encontrado para este filtro.</td></tr>'}
        </tbody>
      </table>

      <div class="footer">
        <span>Metodologia Prof. Weily Toro • "O dinheiro é apenas um espelho do seu interior."</span>
        <span>Página 1 de 1 • Registro Seguro</span>
      </div>

      <script>
        window.onload = function() {
          // Pequeno delay para garantir carregamento dos estilos
          setTimeout(function() {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
