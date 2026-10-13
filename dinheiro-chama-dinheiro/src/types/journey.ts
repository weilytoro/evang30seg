import { BizDiagnosisAnswers, CashflowEntry } from '../utils/bizCalc';

export type JourneyModuleId = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type JourneyModuleTab =
  | 'quiz'
  | 'levels'
  | 'beliefs'
  | 'enemies'
  | 'jesus_method'
  | 'multiplication'
  | 'purpose';

export interface JourneyModuleMeta {
  id: JourneyModuleId;
  tab: JourneyModuleTab;
  title: string;
  shortTitle: string;
  stepCategory: string;
  summary: string;
}

export interface ModuleCriterion {
  id: string;
  label: string;
  isSatisfied: boolean;
  isInteractiveCheck?: boolean;
}

export interface QuizHistoryEntry {
  score: number;
  level: string;
  levelTitle: string;
  completedAt: string;
  hasCnpjOrIntends: boolean;
}

export interface WeeklyEnemyProgress {
  week: number;
  enemy: string;
  saved: string;
  notes: string;
}

export interface MovementEvaluation {
  movement: string;
  liquidity: 'Sim' | 'Incerto' | 'Não' | '';
  deadline: string;
  returnWithPups: string;
}

export interface DREClosedMonth {
  mesReferencia: string;
  faturamentoBruto: number;
  lucroLiquido: number;
  proLabore: number;
  closedAt: string;
}

export interface SavedPriceItem {
  id: string;
  productName: string;
  directCost: number;
  fixedOverheadPerc: number;
  marginPerc: number;
  taxPerc: number;
  finalPrice: number;
}

export type GargaloFrontId = 'vendas' | 'direcao' | 'operacao' | 'pessoas';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isUrgent: boolean;
  author: string;
}

export interface GargaloFrontMeta {
  id: GargaloFrontId;
  title: string;
  subtitle: string;
  whenToAttack: string;
  tools: string[];
  firstStep: string;
}

export interface EpicAchievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlockedAt?: string; // ISO date or null if not unlocked yet
  moduleId?: number;
  type: 'milestone' | 'quest' | 'discovery';
}

export interface EpicJourneyMeta {
  questName: string;
  questDescription: string;
  startedAt?: string;
  targetDebtToEliminate?: number; // for epic debt-crushing goal
  debtEliminatedSoFar?: number;
  achievements: EpicAchievement[];
}
