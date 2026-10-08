import { PlatformMode } from '../types/methodology';

export interface BrandConfig {
  name: string;
  subtitle: string;
  trilha1Name: string;
  trilha2Name: string;
  footerCredits: string;
  isBiblical: boolean;
}

export function getBrand(mode: PlatformMode = 'casa'): BrandConfig {
  if (mode === 'institucional') {
    return {
      name: 'Programa Mentalidade Financeira',
      subtitle: 'Educação financeira e empreendedorismo',
      trilha1Name: 'Educação Financeira Pessoal',
      trilha2Name: 'Empreendedorismo',
      footerCredits: 'Metodologia 5 Níveis · Método JESUS',
      isBiblical: false,
    };
  }

  return {
    name: 'Dinheiro Chama Dinheiro',
    subtitle: 'Método Weily Toro',
    trilha1Name: 'Educação Financeira Cristã',
    trilha2Name: 'Empreendedorismo Cristão',
    footerCredits: 'Metodologia Prof. Weily Toro',
    isBiblical: true,
  };
}
