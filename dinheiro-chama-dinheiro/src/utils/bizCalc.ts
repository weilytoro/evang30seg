export interface BizDiagnosisAnswers {
  faturamento: number;
  separacao: number;
  lucro: number;
  preco: number;
  caixa: number;
  reserva: number;
}

export function computeBizLevel(answers: BizDiagnosisAnswers): 1 | 2 | 3 {
  const { separacao, faturamento, lucro, preco } = answers;

  // Nível 1: Caos total - mistura contas ou não sabe faturamento
  if (separacao === 1 || faturamento === 1) {
    return 1;
  }

  // Nível 3: Base organizada - contas totalmente separadas, calcula DRE mensal e precifica tecnicamente
  if (separacao === 3 && lucro === 3 && preco === 3) {
    return 3;
  }

  // Nível 2: Controle parcial
  return 2;
}

export interface DREResult {
  faturamentoBruto: number;
  impostosPerc: number;
  valorImpostos: number;
  receitaLiquida: number;
  custosDiretos: number;
  lucroBruto: number;
  despesasFixas: number;
  lucroOperacional: number;
  proLabore: number;
  lucroLiquido: number;
  isNegative: boolean;
  margemLiquidaPerc: number;
}

export function calculateDRE(
  faturamentoBruto: number,
  impostosPerc: number,
  custosDiretos: number,
  despesasFixas: number,
  proLabore: number
): DREResult {
  const faturamento = Math.max(0, faturamentoBruto || 0);
  const impostosPct = Math.max(0, impostosPerc || 0);
  const custos = Math.max(0, custosDiretos || 0);
  const despesas = Math.max(0, despesasFixas || 0);
  const pl = Math.max(0, proLabore || 0);

  const valorImpostos = (faturamento * impostosPct) / 100;
  const receitaLiquida = faturamento - valorImpostos;
  const lucroBruto = receitaLiquida - custos;
  const lucroOperacional = lucroBruto - despesas;
  const lucroLiquido = lucroOperacional - pl;

  const margemLiquidaPerc = faturamento > 0 ? (lucroLiquido / faturamento) * 100 : 0;

  return {
    faturamentoBruto: faturamento,
    impostosPerc: impostosPct,
    valorImpostos,
    receitaLiquida,
    custosDiretos: custos,
    lucroBruto,
    despesasFixas: despesas,
    lucroOperacional,
    proLabore: pl,
    lucroLiquido,
    isNegative: lucroLiquido < 0,
    margemLiquidaPerc,
  };
}

export interface PriceResult {
  custoDireto: number;
  rateioFixoPerc: number;
  margemLucroPerc: number;
  impostosPerc: number;
  somaPercentuais: number;
  precoFinal: number;
  valorRateio: number;
  valorMargem: number;
  valorImpostos: number;
  isValid: boolean;
  errorMessage?: string;
}

export function calculatePrice(
  custoDireto: number,
  rateioFixoPerc: number,
  margemLucroPerc: number,
  impostosPerc: number
): PriceResult {
  const custo = Math.max(0, custoDireto || 0);
  const rateio = Math.max(0, rateioFixoPerc || 0);
  const margem = Math.max(0, margemLucroPerc || 0);
  const impostos = Math.max(0, impostosPerc || 0);

  const somaPercentuais = rateio + margem + impostos;

  if (somaPercentuais >= 100) {
    return {
      custoDireto: custo,
      rateioFixoPerc: rateio,
      margemLucroPerc: margem,
      impostosPerc: impostos,
      somaPercentuais,
      precoFinal: 0,
      valorRateio: 0,
      valorMargem: 0,
      valorImpostos: 0,
      isValid: false,
      errorMessage: 'A soma do rateio, margem e impostos não pode ser 100% ou mais.',
    };
  }

  // Preço = custo / (1 - (rateio + margem + impostos) / 100)
  const divisor = 1 - somaPercentuais / 100;
  const precoCalculado = divisor > 0 ? custo / divisor : 0;
  const precoFinal = Math.round(precoCalculado * 100) / 100;

  const valorRateio = Math.round(((precoFinal * rateio) / 100) * 100) / 100;
  const valorMargem = Math.round(((precoFinal * margem) / 100) * 100) / 100;
  const valorImpostos = Math.round(((precoFinal * impostos) / 100) * 100) / 100;

  return {
    custoDireto: custo,
    rateioFixoPerc: rateio,
    margemLucroPerc: margem,
    impostosPerc: impostos,
    somaPercentuais,
    precoFinal,
    valorRateio,
    valorMargem,
    valorImpostos,
    isValid: true,
  };
}

export interface CashflowEntry {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'entrada' | 'saida';
  description: string;
  amount: number;
}

export interface CashflowItemCalculated extends CashflowEntry {
  balanceAfter: number;
}

export interface CashflowResult {
  initialBalance: number;
  totalEntradas: number;
  totalSaidas: number;
  finalBalance: number;
  items: CashflowItemCalculated[];
  outOfWindowCount: number;
  firstNegativeDate: string | null;
  minBalance: number;
}

export function calculateCashflow(
  initialBalance: number,
  entries: CashflowEntry[],
  referenceDateStr?: string
): CashflowResult {
  const refDate = referenceDateStr ? new Date(`${referenceDateStr}T00:00:00`) : new Date();
  refDate.setHours(0, 0, 0, 0);

  const windowEnd = new Date(refDate);
  windowEnd.setDate(windowEnd.getDate() + 30);
  windowEnd.setHours(23, 59, 59, 999);

  let outOfWindowCount = 0;
  const inWindow: CashflowEntry[] = [];

  for (const entry of entries || []) {
    const entryDate = new Date(`${entry.date}T00:00:00`);
    if (isNaN(entryDate.getTime())) continue;

    if (entryDate >= refDate && entryDate <= windowEnd) {
      inWindow.push(entry);
    } else {
      outOfWindowCount++;
    }
  }

  // Ordenar: por data crescente; em caso de mesma data, 'entrada' antes de 'saida'
  inWindow.sort((a, b) => {
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }
    if (a.type !== b.type) {
      return a.type === 'entrada' ? -1 : 1;
    }
    return 0;
  });

  let runningBalance = initialBalance || 0;
  let totalEntradas = 0;
  let totalSaidas = 0;
  let firstNegativeDate: string | null = null;
  let minBalance = runningBalance;

  const items: CashflowItemCalculated[] = inWindow.map((item) => {
    const amount = Math.abs(item.amount || 0);
    if (item.type === 'entrada') {
      runningBalance += amount;
      totalEntradas += amount;
    } else {
      runningBalance -= amount;
      totalSaidas += amount;
    }

    if (runningBalance < minBalance) {
      minBalance = runningBalance;
    }

    if (runningBalance < 0 && !firstNegativeDate) {
      firstNegativeDate = item.date;
    }

    return {
      ...item,
      amount,
      balanceAfter: Math.round(runningBalance * 100) / 100,
    };
  });

  return {
    initialBalance: initialBalance || 0,
    totalEntradas: Math.round(totalEntradas * 100) / 100,
    totalSaidas: Math.round(totalSaidas * 100) / 100,
    finalBalance: Math.round(runningBalance * 100) / 100,
    items,
    outOfWindowCount,
    firstNegativeDate,
    minBalance: Math.round(minBalance * 100) / 100,
  };
}
