export type MentalLevel =
  | 'bloqueada'
  | 'estagnada'
  | 'transicao'
  | 'construcao'
  | 'evoluida';

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    letter: 'A' | 'B' | 'C' | 'D' | 'E';
    text: string;
    points: number;
  }[];
}

export interface QuizResult {
  totalScore: number;
  level: MentalLevel;
  title: string;
  description: string;
  recommendedAction: string;
  keyChapter: number;
  hasCnpjOrIntends: boolean;
  completedAt?: string;
}

export interface BeliefItem {
  id: string;
  belief: string;
  hasBelief: boolean;
  origin: string;
  empoweringBelief: string;
  trigger: string;
  newRoutine: string;
  reward: string;
  supervisor: string;
  custom?: boolean;
}

export interface EnemyItem {
  id: number;
  name: string;
  description: string;
  active: boolean;
  actionTaken: boolean;
  actionText: string;
  customLimitOrValue?: string;
}

export interface JesusDebtItem {
  id: string;
  creditor: string;
  totalAmount: number;
  monthlyInterestRate: number; // e.g. 18%
  installmentAmount: number;
  status: 'em_dia' | 'atrasada';
  type: 'consumo' | 'alavancagem';
  attackOrder?: number;
  paid?: boolean;
  dueDate?: string;
}

export interface MultiplicationMapItem {
  id: string;
  resourceType: 'Renda atual' | 'Habilidade' | 'Hobby' | 'Contato' | 'Recurso material' | 'Outro';
  whatIHave: string;
  incomeIdea: string;
  firstAction7Days: string;
  potentialMonthlyGain: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  status: 'Não comecei' | 'Em andamento' | 'Concluído';
}

export interface BusinessDiagnosis {
  level: 1 | 2 | 3;
  title: string;
  characteristics: string[];
  recommendations: string[];
}

export type PlatformMode = 'casa' | 'institucional';

export interface MentalityMilestone {
  id: string;
  level: MentalLevel;
  title: string;
  score: number;
  reachedAt: string;
  daysAtLevel?: number;
}
