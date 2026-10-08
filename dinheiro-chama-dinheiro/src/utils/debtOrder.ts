import { JesusDebtItem } from '../types/methodology';

export interface OrderedDebtItem extends JesusDebtItem {
  attackPosition: number | null;
  attackReason: string;
}

export type DebtStrategy = 'combinada' | 'avalanche' | 'bola_de_neve';

export function orderDebts(
  debts: JesusDebtItem[] = [],
  strategy: DebtStrategy = 'combinada'
): OrderedDebtItem[] {
  if (!debts || debts.length === 0) {
    return [];
  }

  const unpaidDebts = debts.filter((d) => !d.paid);
  const paidDebts = debts.filter((d) => Boolean(d.paid));

  let sortedUnpaid: Array<{ debt: JesusDebtItem; reason: string }> = [];

  if (strategy === 'bola_de_neve') {
    const list = [...unpaidDebts].sort((a, b) => (a.totalAmount || 0) - (b.totalAmount || 0));
    sortedUnpaid = list.map((d, idx) => ({
      debt: d,
      reason:
        idx === 0
          ? 'Bola de Neve: menor saldo, vitória rápida para desbloqueio psicológico.'
          : `Bola de Neve: alvo #${idx + 1}, ataca pelo menor saldo liberando fluxo de caixa.`,
    }));
  } else if (strategy === 'avalanche') {
    const list = [...unpaidDebts].sort((a, b) => {
      const diffJuros = (b.monthlyInterestRate || 0) - (a.monthlyInterestRate || 0);
      if (diffJuros !== 0) return diffJuros;
      return (a.totalAmount || 0) - (b.totalAmount || 0);
    });
    sortedUnpaid = list.map((d, idx) => ({
      debt: d,
      reason:
        idx === 0
          ? `Avalanche: maior custo financeiro (${d.monthlyInterestRate}% a.m.). Estanca a maior sangria de juros.`
          : `Avalanche: alvo #${idx + 1}, taxa de juros de ${d.monthlyInterestRate}% a.m.`,
    }));
  } else {
    // Combinada (Estratégia de Mateus no livro):
    // 1. Menor dívida de todas para gerar vitória rápida
    // 2. Dívidas atrasadas por maior taxa de juros
    // 3. Demais dívidas em dia por maior taxa de juros
    const remaining = [...unpaidDebts];

    if (remaining.length > 0) {
      // 1. Achar a menor dívida
      let smallestIndex = 0;
      for (let i = 1; i < remaining.length; i++) {
        if ((remaining[i].totalAmount || 0) < (remaining[smallestIndex].totalAmount || 0)) {
          smallestIndex = i;
        }
      }
      const [smallest] = remaining.splice(smallestIndex, 1);
      sortedUnpaid.push({
        debt: smallest,
        reason: 'Bola de Neve: menor saldo, vitória rápida para manter o ânimo',
      });

      // 2. Dívidas atrasadas por maior taxa de juros
      const atrasadas = remaining
        .filter((d) => d.status === 'atrasada')
        .sort((a, b) => {
          const diff = (b.monthlyInterestRate || 0) - (a.monthlyInterestRate || 0);
          if (diff !== 0) return diff;
          return (a.totalAmount || 0) - (b.totalAmount || 0);
        });

      // 3. Demais dívidas (não atrasadas) por maior taxa de juros
      const emDia = remaining
        .filter((d) => d.status !== 'atrasada')
        .sort((a, b) => {
          const diff = (b.monthlyInterestRate || 0) - (a.monthlyInterestRate || 0);
          if (diff !== 0) return diff;
          return (a.totalAmount || 0) - (b.totalAmount || 0);
        });

      for (const d of atrasadas) {
        sortedUnpaid.push({
          debt: d,
          reason: `Avalanche: atrasada, juros de ${d.monthlyInterestRate}% a.m.`,
        });
      }

      for (const d of emDia) {
        sortedUnpaid.push({
          debt: d,
          reason: `Avalanche: juros de ${d.monthlyInterestRate}% a.m.`,
        });
      }
    }
  }

  const resultUnpaid: OrderedDebtItem[] = sortedUnpaid.map((item, index) => ({
    ...item.debt,
    attackPosition: index + 1,
    attackReason: item.reason,
  }));

  const resultPaid: OrderedDebtItem[] = paidDebts.map((d) => ({
    ...d,
    attackPosition: null,
    attackReason: 'Dívida quitada e honrada com sucesso',
  }));

  return [...resultUnpaid, ...resultPaid];
}

export interface DebtMethodDetection {
  recommendedStrategy: 'bola_de_neve' | 'avalanche';
  title: string;
  reason: string;
  maxInterestRate: number;
  smallestAmount: number;
  explanation: string;
}

/**
 * Analisa os lançamentos de dívidas ativas para detectar se o Método Bola de Neve
 * ou o Método Avalanche é mais apropriado para o momento do usuário.
 */
export function detectAppropriateDebtMethod(debts: JesusDebtItem[] = []): DebtMethodDetection {
  const unpaid = (debts || []).filter((d) => !d.paid);
  if (unpaid.length === 0) {
    return {
      recommendedStrategy: 'bola_de_neve',
      title: 'Método Bola de Neve',
      reason: 'Nenhuma pendência ativa.',
      maxInterestRate: 0,
      smallestAmount: 0,
      explanation: 'Cadastre suas contas ou compromissos para análise comparativa contínua.',
    };
  }

  const interestRates = unpaid.map((d) => d.monthlyInterestRate || 0);
  const amounts = unpaid.map((d) => d.totalAmount || 0);
  const maxInterest = Math.max(...interestRates);
  const minInterest = Math.min(...interestRates);
  const smallestAmount = Math.min(...amounts);

  // Se houver juros abusivos (ex: rotativo de cartão ou cheque especial >= 5.0% a.m.)
  // ou disparidade significativa entre os juros das dívidas:
  const hasAbusiveInterest = maxInterest >= 5.0 || (maxInterest - minInterest) >= 4.0;

  if (hasAbusiveInterest) {
    return {
      recommendedStrategy: 'avalanche',
      title: 'Método Avalanche',
      reason: `Taxa máxima elevada de ${maxInterest}% a.m. detectada.`,
      maxInterestRate: maxInterest,
      smallestAmount,
      explanation: `Com juros de até ${maxInterest}% ao mês, o custo do dinheiro sangra o seu caixa. Priorize a maior taxa de juros para estancar os juros compostos imediatamente.`,
    };
  }

  // Caso os juros sejam equilibrados ou moderados:
  return {
    recommendedStrategy: 'bola_de_neve',
    title: 'Método Bola de Neve',
    reason: `Menor pendência em R$ ${smallestAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} com juros moderados.`,
    maxInterestRate: maxInterest,
    smallestAmount,
    explanation: `Suas taxas estão controladas (máx ${maxInterest}% a.m.). Quitar primeiro a dívida de R$ ${smallestAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} trará vitória emocional rápida e desbloqueará fluxo de caixa.`,
  };
}
