export interface Radar8DScore {
  dimensao: string;
  key: 'financas' | 'estrategia' | 'vendas' | 'operacoes' | 'pessoas' | 'mentalidade' | 'familia' | 'inovacao';
  score: number; // 1 a 10
  descricao: string;
  perguntaChave: string;
}

export interface AnaliseGargaloIA {
  areaPrincipal: 'Finanças' | 'Estratégia' | 'Marketing' | 'Operações' | 'Pessoas' | 'Inovação' | string;
  justificativa: string;
  acaoRecomendada: string;
  dimensaoLider?: string;
  analyzedAt?: string;
}

export interface TriagemGerar {
  dorPrincipal: string;
  tempoDor: string; // ex: "< 3 meses", "3 a 6 meses", "> 6 meses (sistêmico)"
  tentativasAnteriores: string;
  focoDor: 'empresario' | 'negocio' | 'ambos';
  analiseIA?: AnaliseGargaloIA | null;
}

export interface FiveWhysItem {
  why1: string;
  why2: string;
  why3: string;
  why4: string;
  why5: string;
  rootCause: string;
}

export interface GerarSkillItem {
  id: number | string;
  slug: string;
  name: string;
  category: 'BASE' | 'ENTRADA' | 'INTERIOR' | 'EXECUÇÃO' | 'EXPANSÃO' | 'TRANSVERSAL' | 'META';
  actionWhen: string;
  description: string;
  tools: string[];
}

export interface ThreeDaysCommitment {
  oneThing: string;
  obstacleToday: string;
  dueDate: string;
  completed: boolean;
}
