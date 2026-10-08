import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  computeBizLevel,
  BizDiagnosisAnswers,
  CashflowEntry,
} from '../utils/bizCalc';
import {
  Announcement,
  DREClosedMonth,
  GargaloFrontId,
  MovementEvaluation,
  QuizHistoryEntry,
  SavedPriceItem,
  WeeklyEnemyProgress,
} from '../types/journey';
import { useMethodology } from './MethodologyContext';
import { getEntryModuleFromKeyChapter, pickNextModule } from '../utils/journeyNav';

export interface ModuleCriterionState {
  id: string;
  label: string;
  isSatisfied: boolean;
  isInteractiveCheck?: boolean;
}

interface JourneyContextType {
  // Trilha 1 Progression
  completedModules: number[];
  isModuleUnlocked: (moduleId: number) => boolean;
  isModuleCompleted: (moduleId: number) => boolean;
  canCompleteModule: (moduleId: number) => boolean;
  getModuleCriteria: (moduleId: number) => ModuleCriterionState[];
  completeModule: (moduleId: number) => void;
  reopenModule: (moduleId: number) => void;
  pickNextModuleToFocus: () => number | null;
  trilha1Progress: number; // 0 to 100%
  trilha1Completed: boolean;
  trilha1CompletedAt: string | null;
  entryModule: number;

  // Student Profile & History
  userName: string;
  setUserName: (name: string) => void;
  quizHistory: QuizHistoryEntry[];
  recordQuizCompleted: (score: number, level: string, levelTitle: string, hasCnpj: boolean) => void;
  nextQuizAvailableDate: string | null;
  is90DaysReviewDue: boolean;
  scoreDifferenceFromLast: number | null;

  // Módulo 1 (Mentalidade)
  selectedNextLevelPhrase: string;
  setSelectedNextLevelPhrase: (phrase: string) => void;
  firstAction7Days: string;
  setFirstAction7Days: (act: string) => void;
  reflectionChildhood: string;
  setReflectionChildhood: (val: string) => void;
  reflectionFeelings: string;
  setReflectionFeelings: (val: string) => void;
  reflectionBeliefsStillFit: string;
  setReflectionBeliefsStillFit: (val: string) => void;

  // Módulo 3 (Hábitos)
  enemiesChecklistConfirmed: boolean;
  setEnemiesChecklistConfirmed: (confirmed: boolean) => void;
  weeklyProgress: WeeklyEnemyProgress[];
  updateWeeklyProgress: (week: number, field: 'enemy' | 'saved' | 'notes', value: string) => void;

  // Módulo 4 (Dívidas)
  noDebtsConfirmed: boolean;
  setNoDebtsConfirmed: (confirmed: boolean) => void;

  // Módulo 5 (Multiplicação)
  talentsUnmonetized: string;
  setTalentsUnmonetized: (val: string) => void;
  movementEvaluation: MovementEvaluation;
  setMovementEvaluation: React.Dispatch<React.SetStateAction<MovementEvaluation>>;

  // Módulo 6 (Propósito)
  purposeChallengingMoment: string;
  setPurposeChallengingMoment: (val: string) => void;
  purposeLessonsLearned: string;
  setPurposeLessonsLearned: (val: string) => void;
  purposeStatement: string;
  setPurposeStatement: (val: string) => void;
  purposeLegacyLetter: string;
  setPurposeLegacyLetter: (val: string) => void;
  purposeRereadDate: string;
  setPurposeRereadDate: (val: string) => void;

  // Trilha 2 (CNPJ)
  bizPlanMode: 'cnpj' | 'abertura' | null;
  setBizPlanMode: (mode: 'cnpj' | 'abertura' | null) => void;
  bizDiagnosisAnswers: BizDiagnosisAnswers;
  setBizDiagnosisAnswers: (answers: BizDiagnosisAnswers) => void;
  bizDiagnosisDone: boolean;
  setBizDiagnosisDone: (done: boolean) => void;
  bizLevel: 1 | 2 | 3 | 'abertura' | null;

  pfPjCommitments: { exclusiveAccount: boolean; fixedProLabore: boolean; noPersonalExpenses: boolean };
  togglePfPjCommitment: (key: 'exclusiveAccount' | 'fixedProLabore' | 'noPersonalExpenses') => void;
  proLaboreMonthly: number;
  setProLaboreMonthly: (val: number) => void;
  proLaborePaymentDay: number;
  setProLaborePaymentDay: (day: number) => void;
  pfPjStepCompleted: boolean;

  // Ferramentas Técnicas (Etapa 3)
  dreFaturamento: number;
  setDreFaturamento: (val: number) => void;
  dreImpostosPerc: number;
  setDreImpostosPerc: (val: number) => void;
  dreCustosDiretos: number;
  setDreCustosDiretos: (val: number) => void;
  dreDespesasFixas: number;
  setDreDespesasFixas: (val: number) => void;
  dreMesReferencia: string;
  setDreMesReferencia: (val: string) => void;
  dreClosedMonths: DREClosedMonth[];
  closeDREMonth: (mes: string, lucroLiquido: number, faturamento: number, proLabore: number) => void;

  cashflowInitialBalance: number;
  setCashflowInitialBalance: (val: number) => void;
  cashflowEntries: CashflowEntry[];
  addCashflowEntry: (entry: Omit<CashflowEntry, 'id'>) => void;
  deleteCashflowEntry: (id: string) => void;
  cashflowConfirmed: boolean;
  setCashflowConfirmed: (confirmed: boolean) => void;

  savedPrices: SavedPriceItem[];
  savePriceItem: (item: Omit<SavedPriceItem, 'id'>) => void;
  deletePriceItem: (id: string) => void;

  reserveSavedAmount: number;
  setReserveSavedAmount: (val: number) => void;
  reserveGoalAccepted: boolean;
  setReserveGoalAccepted: (accepted: boolean) => void;

  // Etapa 4 (Gargalos)
  activeGargalos: GargaloFrontId[];
  activateGargalo: (id: GargaloFrontId) => boolean;
  resolveGargalo: (id: GargaloFrontId) => void;
  resolvedGargalos: GargaloFrontId[];

  // Global resets
  resetAllJourneyData: () => void;

  // Avisos (Mural & Avisos Urgentes)
  announcements: Announcement[];
  addAnnouncement: (title: string, content: string, isUrgent?: boolean, author?: string) => void;
  deleteAnnouncement: (id: string) => void;
  toggleAnnouncementUrgent: (id: string) => void;

  // Modo Administrador
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  toggleAdminMode: () => void;
  adminUnlockAllModules: () => void;
  adminLockAllModules: () => void;
  adminCompleteAllModules: () => void;
  adminSetCompletedModules: (modules: number[]) => void;
  adminSetTrilha1Completed: (completed: boolean) => void;
}

const STORAGE_KEYS = {
  IS_ADMIN: 'dcd_is_admin_v1',
  COMPLETED_MODULES: 'dcd_journey_completed_modules_v3',
  TRILHA1_COMPLETED_AT: 'dcd_journey_trilha1_completed_at_v3',
  USER_NAME: 'dcd_journey_user_name_v3',
  QUIZ_HISTORY: 'dcd_journey_quiz_history_v3',
  M1_PHRASE: 'dcd_journey_m1_phrase_v3',
  M1_ACTION: 'dcd_journey_m1_action_v3',
  M1_REFLECTIONS: 'dcd_journey_m1_reflections_v3',
  M3_CONFIRM: 'dcd_journey_m3_confirm_v3',
  M3_WEEKLY: 'dcd_journey_m3_weekly_v3',
  M4_NO_DEBTS: 'dcd_journey_m4_no_debts_v3',
  M5_TALENTS: 'dcd_journey_m5_talents_v3',
  M5_EVAL: 'dcd_journey_m5_eval_v3',
  M6_PURPOSE: 'dcd_journey_m6_purpose_v3',

  // Trilha 2 Keys
  T2_MODE: 'dcd_t2_plan_mode_v3',
  T2_ANSWERS: 'dcd_t2_answers_v3',
  T2_DIAG_DONE: 'dcd_t2_diag_done_v3',
  T2_PFPJ: 'dcd_t2_pfpj_v3',
  T2_PROLABORE: 'dcd_t2_prolabore_v3',
  T2_PAYMENT_DAY: 'dcd_t2_payment_day_v3',
  T2_DRE_DATA: 'dcd_t2_dre_data_v3',
  T2_DRE_MONTHS: 'dcd_t2_dre_months_v3',
  T2_CASHFLOW: 'dcd_t2_cashflow_v3',
  T2_PRICING: 'dcd_t2_pricing_v3',
  T2_RESERVE: 'dcd_t2_reserve_v3',
  T2_GARGALOS: 'dcd_t2_gargalos_v3',
  ANNOUNCEMENTS: 'dcd_announcements_v1',
};

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: '🚨 Fechamento de Diagnóstico e Ordem de Ataque às Dívidas',
    content: 'Atenção aos alunos: conclua o Diagnóstico dos 5 Níveis no Módulo 0. Para dívidas ativas, utilize a detecção inteligente (Bola de Neve ou Avalanche) no Módulo 4.',
    createdAt: new Date().toISOString(),
    isUrgent: true,
    author: 'Coordenação Pedagógica',
  },
  {
    id: 'ann-2',
    title: '📘 Alinhamento Metodológico: Fundação Pessoal Primeiro (CPF)',
    content: 'Lembre-se da regra de ouro do Prof. Weily Toro: nunca construa um CNPJ sobre um CPF desordenado. A Trilha 2 e o Hub GERAR são liberados após o alinhamento da Trilha 1.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isUrgent: false,
    author: 'Prof. Weily Toro',
  },
];

const DEFAULT_WEEKLY_PROGRESS: WeeklyEnemyProgress[] = [
  { week: 1, enemy: '', saved: '', notes: '' },
  { week: 2, enemy: '', saved: '', notes: '' },
  { week: 3, enemy: '', saved: '', notes: '' },
  { week: 4, enemy: '', saved: '', notes: '' },
];

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export const JourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    quizResult,
    beliefs,
    enemies,
    jesusDebts,
    monthlyLiquidIncome,
    multiplicationMap,
    resetMethodologyData,
  } = useMethodology();

  // Completed Modules
  const [completedModules, setCompletedModules] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COMPLETED_MODULES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [trilha1CompletedAt, setTrilha1CompletedAt] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.TRILHA1_COMPLETED_AT) || null;
    } catch {
      return null;
    }
  });

  // Admin Mode state
  const [isAdmin, setIsAdminState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.IS_ADMIN) === 'true';
    } catch {
      return false;
    }
  });

  const setIsAdmin = (val: boolean) => {
    setIsAdminState(val);
    try {
      localStorage.setItem(STORAGE_KEYS.IS_ADMIN, val ? 'true' : 'false');
    } catch {}
  };

  const toggleAdminMode = () => {
    setIsAdmin(!isAdmin);
  };

  const adminUnlockAllModules = () => {
    setCompletedModules([0, 1, 2, 3, 4, 5, 6]);
    setTrilha1CompletedAt(new Date().toISOString());
  };

  const adminLockAllModules = () => {
    setCompletedModules(quizResult ? [0] : []);
    setTrilha1CompletedAt(null);
  };

  const adminCompleteAllModules = () => {
    setCompletedModules([0, 1, 2, 3, 4, 5, 6]);
    setTrilha1CompletedAt(new Date().toISOString());
  };

  const adminSetCompletedModules = (modules: number[]) => {
    setCompletedModules(modules);
  };

  const adminSetTrilha1Completed = (completed: boolean) => {
    if (completed) {
      setTrilha1CompletedAt(new Date().toISOString());
      if (!completedModules.includes(6)) {
        setCompletedModules((prev) => (prev.includes(6) ? prev : [...prev, 6]));
      }
    } else {
      setTrilha1CompletedAt(null);
      setCompletedModules((prev) => prev.filter((m) => m !== 6));
    }
  };

  // Student name
  const [userName, setUserName] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.USER_NAME) || '';
    } catch {
      return '';
    }
  });

  // Quiz History
  const [quizHistory, setQuizHistory] = useState<QuizHistoryEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Módulo 1 (Mentalidade)
  const [selectedNextLevelPhrase, setSelectedNextLevelPhrase] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.M1_PHRASE) || '';
    } catch {
      return '';
    }
  });

  const [firstAction7Days, setFirstAction7Days] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.M1_ACTION) || '';
    } catch {
      return '';
    }
  });

  const [reflectionChildhood, setReflectionChildhood] = useState<string>('');
  const [reflectionFeelings, setReflectionFeelings] = useState<string>('');
  const [reflectionBeliefsStillFit, setReflectionBeliefsStillFit] = useState<string>('');

  // Load reflections
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.M1_REFLECTIONS);
      if (stored) {
        const parsed = JSON.parse(stored);
        setReflectionChildhood(parsed.childhood || '');
        setReflectionFeelings(parsed.feelings || '');
        setReflectionBeliefsStillFit(parsed.stillFit || '');
      }
    } catch {}
  }, []);

  // Módulo 3 (Hábitos)
  const [enemiesChecklistConfirmed, setEnemiesChecklistConfirmed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.M3_CONFIRM) === 'true';
    } catch {
      return false;
    }
  });

  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyEnemyProgress[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.M3_WEEKLY);
      return stored ? JSON.parse(stored) : DEFAULT_WEEKLY_PROGRESS;
    } catch {
      return DEFAULT_WEEKLY_PROGRESS;
    }
  });

  // Módulo 4 (Dívidas)
  const [noDebtsConfirmed, setNoDebtsConfirmed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.M4_NO_DEBTS) === 'true';
    } catch {
      return false;
    }
  });

  // Módulo 5 (Multiplicação)
  const [talentsUnmonetized, setTalentsUnmonetized] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.M5_TALENTS) || '';
    } catch {
      return '';
    }
  });

  const [movementEvaluation, setMovementEvaluation] = useState<MovementEvaluation>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.M5_EVAL);
      return stored
        ? JSON.parse(stored)
        : { movement: '', liquidity: '', deadline: '', returnWithPups: '' };
    } catch {
      return { movement: '', liquidity: '', deadline: '', returnWithPups: '' };
    }
  });

  // Módulo 6 (Propósito)
  const [purposeChallengingMoment, setPurposeChallengingMoment] = useState<string>('');
  const [purposeLessonsLearned, setPurposeLessonsLearned] = useState<string>('');
  const [purposeStatement, setPurposeStatement] = useState<string>('');
  const [purposeLegacyLetter, setPurposeLegacyLetter] = useState<string>('');
  const [purposeRereadDate, setPurposeRereadDate] = useState<string>('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.M6_PURPOSE);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPurposeChallengingMoment(parsed.moment || '');
        setPurposeLessonsLearned(parsed.lessons || '');
        setPurposeStatement(parsed.statement || '');
        setPurposeLegacyLetter(parsed.letter || '');
        setPurposeRereadDate(parsed.rereadDate || '');
      }
    } catch {}
  }, []);

  // Trilha 2 State
  const [bizPlanMode, setBizPlanMode] = useState<'cnpj' | 'abertura' | null>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEYS.T2_MODE) as 'cnpj' | 'abertura' | null) || null;
    } catch {
      return null;
    }
  });

  const [bizDiagnosisAnswers, setBizDiagnosisAnswers] = useState<BizDiagnosisAnswers>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.T2_ANSWERS);
      return stored
        ? JSON.parse(stored)
        : { faturamento: 2, separacao: 2, lucro: 2, preco: 2, caixa: 2, reserva: 2 };
    } catch {
      return { faturamento: 2, separacao: 2, lucro: 2, preco: 2, caixa: 2, reserva: 2 };
    }
  });

  const [bizDiagnosisDone, setBizDiagnosisDone] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.T2_DIAG_DONE) === 'true';
    } catch {
      return false;
    }
  });

  const [pfPjCommitments, setPfPjCommitments] = useState({
    exclusiveAccount: false,
    fixedProLabore: false,
    noPersonalExpenses: false,
  });

  const [proLaboreMonthly, setProLaboreMonthly] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.T2_PROLABORE);
      return stored ? parseFloat(stored) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [proLaborePaymentDay, setProLaborePaymentDay] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.T2_PAYMENT_DAY);
      return stored ? parseInt(stored, 10) || 5 : 5;
    } catch {
      return 5;
    }
  });

  // DRE state
  const [dreFaturamento, setDreFaturamento] = useState<number>(0);
  const [dreImpostosPerc, setDreImpostosPerc] = useState<number>(6);
  const [dreCustosDiretos, setDreCustosDiretos] = useState<number>(0);
  const [dreDespesasFixas, setDreDespesasFixas] = useState<number>(0);
  const [dreMesReferencia, setDreMesReferencia] = useState<string>('09/2026');

  const [dreClosedMonths, setDreClosedMonths] = useState<DREClosedMonth[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.T2_DRE_MONTHS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Cashflow
  const [cashflowInitialBalance, setCashflowInitialBalance] = useState<number>(0);
  const [cashflowEntries, setCashflowEntries] = useState<CashflowEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.T2_CASHFLOW);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [cashflowConfirmed, setCashflowConfirmed] = useState<boolean>(false);

  // Pricing
  const [savedPrices, setSavedPrices] = useState<SavedPriceItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.T2_PRICING);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Reserve
  const [reserveSavedAmount, setReserveSavedAmount] = useState<number>(0);
  const [reserveGoalAccepted, setReserveGoalAccepted] = useState<boolean>(false);

  // Gargalos
  const [activeGargalos, setActiveGargalos] = useState<GargaloFrontId[]>([]);
  const [resolvedGargalos, setResolvedGargalos] = useState<GargaloFrontId[]>([]);

  // Avisos (Mural Oficial & Avisos Urgentes)
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
      return stored ? JSON.parse(stored) : DEFAULT_ANNOUNCEMENTS;
    } catch {
      return DEFAULT_ANNOUNCEMENTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
    } catch {}
  }, [announcements]);

  const addAnnouncement = (title: string, content: string, isUrgent = false, author = 'Administrador') => {
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      isUrgent,
      author: author || (isAdmin ? 'Administrador' : 'Equipe'),
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleAnnouncementUrgent = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isUrgent: !a.isUrgent } : a))
    );
  };

  // Load remaining Trilha 2 state on mount
  useEffect(() => {
    try {
      const storedPfpj = localStorage.getItem(STORAGE_KEYS.T2_PFPJ);
      if (storedPfpj) setPfPjCommitments(JSON.parse(storedPfpj));

      const storedDre = localStorage.getItem(STORAGE_KEYS.T2_DRE_DATA);
      if (storedDre) {
        const parsed = JSON.parse(storedDre);
        setDreFaturamento(parsed.faturamento || 0);
        setDreImpostosPerc(parsed.impostos || 6);
        setDreCustosDiretos(parsed.custos || 0);
        setDreDespesasFixas(parsed.despesas || 0);
        setDreMesReferencia(parsed.mes || '09/2026');
      }

      const storedReserve = localStorage.getItem(STORAGE_KEYS.T2_RESERVE);
      if (storedReserve) {
        const parsed = JSON.parse(storedReserve);
        setReserveSavedAmount(parsed.saved || 0);
        setReserveGoalAccepted(parsed.accepted || false);
      }

      const storedGargalos = localStorage.getItem(STORAGE_KEYS.T2_GARGALOS);
      if (storedGargalos) {
        const parsed = JSON.parse(storedGargalos);
        setActiveGargalos(parsed.active || []);
        setResolvedGargalos(parsed.resolved || []);
      }
    } catch {}
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPLETED_MODULES, JSON.stringify(completedModules));
    } catch {}
  }, [completedModules]);

  useEffect(() => {
    try {
      if (trilha1CompletedAt) {
        localStorage.setItem(STORAGE_KEYS.TRILHA1_COMPLETED_AT, trilha1CompletedAt);
      } else {
        localStorage.removeItem(STORAGE_KEYS.TRILHA1_COMPLETED_AT);
      }
    } catch {}
  }, [trilha1CompletedAt]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_NAME, userName);
    } catch {}
  }, [userName]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(quizHistory));
    } catch {}
  }, [quizHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.M1_PHRASE, selectedNextLevelPhrase);
    } catch {}
  }, [selectedNextLevelPhrase]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.M1_ACTION, firstAction7Days);
    } catch {}
  }, [firstAction7Days]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.M1_REFLECTIONS,
        JSON.stringify({
          childhood: reflectionChildhood,
          feelings: reflectionFeelings,
          stillFit: reflectionBeliefsStillFit,
        })
      );
    } catch {}
  }, [reflectionChildhood, reflectionFeelings, reflectionBeliefsStillFit]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.M3_CONFIRM, enemiesChecklistConfirmed ? 'true' : 'false');
    } catch {}
  }, [enemiesChecklistConfirmed]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.M3_WEEKLY, JSON.stringify(weeklyProgress));
    } catch {}
  }, [weeklyProgress]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.M4_NO_DEBTS, noDebtsConfirmed ? 'true' : 'false');
    } catch {}
  }, [noDebtsConfirmed]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.M5_TALENTS, talentsUnmonetized);
    } catch {}
  }, [talentsUnmonetized]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.M5_EVAL, JSON.stringify(movementEvaluation));
    } catch {}
  }, [movementEvaluation]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.M6_PURPOSE,
        JSON.stringify({
          moment: purposeChallengingMoment,
          lessons: purposeLessonsLearned,
          statement: purposeStatement,
          letter: purposeLegacyLetter,
          rereadDate: purposeRereadDate,
        })
      );
    } catch {}
  }, [
    purposeChallengingMoment,
    purposeLessonsLearned,
    purposeStatement,
    purposeLegacyLetter,
    purposeRereadDate,
  ]);

  // Trilha 2 Persistence
  useEffect(() => {
    try {
      if (bizPlanMode) localStorage.setItem(STORAGE_KEYS.T2_MODE, bizPlanMode);
    } catch {}
  }, [bizPlanMode]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.T2_ANSWERS, JSON.stringify(bizDiagnosisAnswers));
    } catch {}
  }, [bizDiagnosisAnswers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.T2_DIAG_DONE, bizDiagnosisDone ? 'true' : 'false');
    } catch {}
  }, [bizDiagnosisDone]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.T2_PFPJ, JSON.stringify(pfPjCommitments));
    } catch {}
  }, [pfPjCommitments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.T2_PROLABORE, proLaboreMonthly.toString());
    } catch {}
  }, [proLaboreMonthly]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.T2_PAYMENT_DAY, proLaborePaymentDay.toString());
    } catch {}
  }, [proLaborePaymentDay]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.T2_DRE_DATA,
        JSON.stringify({
          faturamento: dreFaturamento,
          impostos: dreImpostosPerc,
          custos: dreCustosDiretos,
          despesas: dreDespesasFixas,
          mes: dreMesReferencia,
        })
      );
    } catch {}
  }, [dreFaturamento, dreImpostosPerc, dreCustosDiretos, dreDespesasFixas, dreMesReferencia]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.T2_DRE_MONTHS, JSON.stringify(dreClosedMonths));
    } catch {}
  }, [dreClosedMonths]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.T2_CASHFLOW, JSON.stringify(cashflowEntries));
    } catch {}
  }, [cashflowEntries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.T2_PRICING, JSON.stringify(savedPrices));
    } catch {}
  }, [savedPrices]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.T2_RESERVE,
        JSON.stringify({
          saved: reserveSavedAmount,
          accepted: reserveGoalAccepted,
        })
      );
    } catch {}
  }, [reserveSavedAmount, reserveGoalAccepted]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.T2_GARGALOS,
        JSON.stringify({
          active: activeGargalos,
          resolved: resolvedGargalos,
        })
      );
    } catch {}
  }, [activeGargalos, resolvedGargalos]);

  // Quiz auto-completion: when quizResult is present, Module 0 is automatically completed!
  useEffect(() => {
    if (quizResult && !completedModules.includes(0)) {
      setCompletedModules((prev) => (prev.includes(0) ? prev : [0, ...prev]));
    }
  }, [quizResult]);

  // Record quiz result into history
  const recordQuizCompleted = (
    score: number,
    level: string,
    levelTitle: string,
    hasCnpj: boolean
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const entry: QuizHistoryEntry = {
      score,
      level,
      levelTitle,
      completedAt: today,
      hasCnpjOrIntends: hasCnpj,
    };

    setQuizHistory((prev) => [entry, ...prev].slice(0, 12));
    setCompletedModules((prev) => (prev.includes(0) ? prev : [0, ...prev]));
  };

  // 90-day review date & diff
  const { nextQuizAvailableDate, is90DaysReviewDue, scoreDifferenceFromLast } = useMemo(() => {
    if (!quizHistory || quizHistory.length === 0) {
      return { nextQuizAvailableDate: null, is90DaysReviewDue: false, scoreDifferenceFromLast: null };
    }

    const latest = quizHistory[0];
    const previous = quizHistory[1];

    let diff: number | null = null;
    if (latest && previous) {
      diff = latest.score - previous.score;
    }

    const completedDate = new Date(`${latest.completedAt}T00:00:00`);
    if (isNaN(completedDate.getTime())) {
      return { nextQuizAvailableDate: null, is90DaysReviewDue: false, scoreDifferenceFromLast: diff };
    }

    const targetDate = new Date(completedDate);
    targetDate.setDate(targetDate.getDate() + 90);
    const dateFormatted = targetDate.toLocaleDateString('pt-BR');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isDue = today >= targetDate;

    return {
      nextQuizAvailableDate: dateFormatted,
      is90DaysReviewDue: isDue,
      scoreDifferenceFromLast: diff,
    };
  }, [quizHistory]);

  // Entry module based on keyChapter
  const entryModule = useMemo(() => {
    return getEntryModuleFromKeyChapter(quizResult?.keyChapter);
  }, [quizResult?.keyChapter]);

  // Unlocked modules rule: In Admin mode, everything is unlocked. Otherwise Module 0 always unlocked; Modules 1..6 unlocked iff 0 is completed
  const isModuleUnlocked = (moduleId: number): boolean => {
    if (isAdmin) return true;
    if (moduleId === 0) return true;
    return completedModules.includes(0);
  };

  const isModuleCompleted = (moduleId: number): boolean => {
    return completedModules.includes(moduleId);
  };

  // Criteria for each module
  const getModuleCriteria = (moduleId: number): ModuleCriterionState[] => {
    switch (moduleId) {
      case 0:
        return [
          {
            id: 'm0-quiz',
            label: 'Responder ao Diagnóstico dos 5 Níveis de Mentalidade Financeira',
            isSatisfied: Boolean(quizResult),
          },
        ];

      case 1:
        return [
          {
            id: 'm1-phrase',
            label: 'Frase do próximo nível escolhida (mínimo de 3 caracteres)',
            isSatisfied: selectedNextLevelPhrase.trim().length >= 3,
          },
          {
            id: 'm1-action',
            label: 'Primeira ação prática para os próximos 7 dias preenchida',
            isSatisfied: firstAction7Days.trim().length >= 3,
          },
        ];

      case 2:
        return [
          {
            id: 'm2-beliefs',
            label: 'Pelo menos uma crença limitante identificada e marcada como presente',
            isSatisfied: (beliefs || []).some((b) => b?.hasBelief),
          },
        ];

      case 3: {
        const activeCount = (enemies || []).filter((e) => e?.active).length;
        const hasCombated = (enemies || []).some((e) => e?.active && e?.actionTaken);
        const habitsConditionMet = activeCount === 0 || hasCombated;

        return [
          {
            id: 'm3-confirm',
            label: 'Revisei o checklist dos 7 inimigos e marquei os que estão presentes',
            isSatisfied: enemiesChecklistConfirmed,
            isInteractiveCheck: true,
          },
          {
            id: 'm3-habits',
            label: 'Nenhum inimigo presente OU pelo menos um inimigo presente com solução implementada',
            isSatisfied: habitsConditionMet,
          },
        ];
      }

      case 4: {
        const hasDebtsListed = (jesusDebts || []).length > 0;
        const hasLiquidIncome = (monthlyLiquidIncome || 0) > 0;

        return [
          {
            id: 'm4-j',
            label: '(J) Ao menos uma dívida cadastrada para traçar a estratégia de ataque',
            isSatisfied: hasDebtsListed,
          },
          {
            id: 'm4-e',
            label: '(E) Renda líquida mensal informada maior que zero',
            isSatisfied: hasLiquidIncome,
          },
        ];
      }

      case 5:
        return [
          {
            id: 'm5-map',
            label: 'Pelo menos uma linha cadastrada no Mapa de Multiplicação de Talentos',
            isSatisfied: (multiplicationMap || []).length > 0,
          },
          {
            id: 'm5-unmonetized',
            label: 'Resposta preenchida para "O que eu sei fazer bem que ainda não monetizei?"',
            isSatisfied: talentsUnmonetized.trim().length >= 3,
          },
        ];

      case 6: {
        const previousModulesCompleted = [0, 1, 2, 3, 4, 5].every((m) =>
          completedModules.includes(m)
        );

        return [
          {
            id: 'm6-lessons',
            label: 'Lições aprendidas através dos momentos desafiadores preenchidas',
            isSatisfied: purposeLessonsLearned.trim().length >= 3,
          },
          {
            id: 'm6-statement',
            label: 'Frase de propósito e identidade assumida',
            isSatisfied: purposeStatement.trim().length >= 3,
          },
          {
            id: 'm6-prev-all',
            label: 'Módulos 0 a 5 concluídos com sucesso',
            isSatisfied: previousModulesCompleted,
          },
        ];
      }

      default:
        return [];
    }
  };

  const canCompleteModule = (moduleId: number): boolean => {
    const criteria = getModuleCriteria(moduleId);
    return criteria.length > 0 && criteria.every((c) => c.isSatisfied);
  };

  const completeModule = (moduleId: number) => {
    if (!canCompleteModule(moduleId)) return;

    setCompletedModules((prev) => (prev.includes(moduleId) ? prev : [...prev, moduleId]));

    if (moduleId === 6) {
      const today = new Date().toISOString();
      setTrilha1CompletedAt(today);
    }
  };

  const reopenModule = (moduleId: number) => {
    // Reopening does NOT lock Trilha 2 if it was already completed (trilha1CompletedAt exists)
    setCompletedModules((prev) => prev.filter((m) => m !== moduleId));
  };

  const pickNextModuleToFocus = (): number | null => {
    return pickNextModule(completedModules, entryModule);
  };

  // Trilha 1 progress percentage
  const trilha1Progress = Math.min(100, Math.round((completedModules.length / 7) * 100));

  // Trilha 1 completed status (In Admin mode, Trilha 2 is unlocked so admin can inspect/edit everything)
  const trilha1Completed = isAdmin || completedModules.includes(6) || Boolean(trilha1CompletedAt);

  // Weekly Progress handler
  const updateWeeklyProgress = (
    week: number,
    field: 'enemy' | 'saved' | 'notes',
    value: string
  ) => {
    setWeeklyProgress((prev) =>
      prev.map((w) => (w.week === week ? { ...w, [field]: value } : w))
    );
  };

  // Trilha 2 Biz Level
  const bizLevel: 1 | 2 | 3 | 'abertura' | null = useMemo(() => {
    if (bizPlanMode === 'abertura') return 'abertura';
    if (!bizDiagnosisDone) return null;
    return computeBizLevel(bizDiagnosisAnswers);
  }, [bizPlanMode, bizDiagnosisDone, bizDiagnosisAnswers]);

  // PF/PJ Step Completion
  const pfPjStepCompleted = useMemo(() => {
    const { exclusiveAccount, fixedProLabore, noPersonalExpenses } = pfPjCommitments;
    return exclusiveAccount && fixedProLabore && noPersonalExpenses && proLaboreMonthly > 0;
  }, [pfPjCommitments, proLaboreMonthly]);

  const togglePfPjCommitment = (key: 'exclusiveAccount' | 'fixedProLabore' | 'noPersonalExpenses') => {
    setPfPjCommitments((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // DRE Month Close
  const closeDREMonth = (
    mes: string,
    lucroLiquido: number,
    faturamento: number,
    proLabore: number
  ) => {
    const today = new Date().toISOString();
    const entry: DREClosedMonth = {
      mesReferencia: mes,
      faturamentoBruto: faturamento,
      lucroLiquido,
      proLabore,
      closedAt: today,
    };

    setDreClosedMonths((prev) => {
      const filtered = prev.filter((item) => item.mesReferencia !== mes);
      return [entry, ...filtered];
    });
  };

  // Cashflow management
  const addCashflowEntry = (entry: Omit<CashflowEntry, 'id'>) => {
    const newItem: CashflowEntry = {
      ...entry,
      id: `cf-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setCashflowEntries((prev) => [...prev, newItem]);
  };

  const deleteCashflowEntry = (id: string) => {
    setCashflowEntries((prev) => prev.filter((item) => item.id !== id));
  };

  // Pricing management
  const savePriceItem = (item: Omit<SavedPriceItem, 'id'>) => {
    const newItem: SavedPriceItem = {
      ...item,
      id: `pr-${Date.now()}`,
    };
    setSavedPrices((prev) => [newItem, ...prev]);
  };

  const deletePriceItem = (id: string) => {
    setSavedPrices((prev) => prev.filter((item) => item.id !== id));
  };

  // Gargalos front activation (max 2 active!)
  const activateGargalo = (id: GargaloFrontId): boolean => {
    if (activeGargalos.includes(id)) return true;
    if (activeGargalos.length >= 2) return false;

    setActiveGargalos((prev) => [...prev, id]);
    setResolvedGargalos((prev) => prev.filter((g) => g !== id));
    return true;
  };

  const resolveGargalo = (id: GargaloFrontId) => {
    setActiveGargalos((prev) => prev.filter((g) => g !== id));
    setResolvedGargalos((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  // Reset all data
  const resetAllJourneyData = () => {
    setCompletedModules([]);
    setTrilha1CompletedAt(null);
    setUserName('');
    setQuizHistory([]);
    setSelectedNextLevelPhrase('');
    setFirstAction7Days('');
    setReflectionChildhood('');
    setReflectionFeelings('');
    setReflectionBeliefsStillFit('');
    setEnemiesChecklistConfirmed(false);
    setWeeklyProgress(DEFAULT_WEEKLY_PROGRESS);
    setNoDebtsConfirmed(false);
    setTalentsUnmonetized('');
    setMovementEvaluation({ movement: '', liquidity: '', deadline: '', returnWithPups: '' });
    setPurposeChallengingMoment('');
    setPurposeLessonsLearned('');
    setPurposeStatement('');
    setPurposeLegacyLetter('');
    setPurposeRereadDate('');

    setBizPlanMode(null);
    setBizDiagnosisDone(false);
    setPfPjCommitments({ exclusiveAccount: false, fixedProLabore: false, noPersonalExpenses: false });
    setProLaboreMonthly(0);
    setProLaborePaymentDay(5);
    setDreFaturamento(0);
    setDreImpostosPerc(6);
    setDreCustosDiretos(0);
    setDreDespesasFixas(0);
    setDreClosedMonths([]);
    setCashflowEntries([]);
    setCashflowConfirmed(false);
    setSavedPrices([]);
    setReserveSavedAmount(0);
    setReserveGoalAccepted(false);
    setActiveGargalos([]);
    setResolvedGargalos([]);

    try {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    } catch {}

    resetMethodologyData();
  };

  return (
    <JourneyContext.Provider
      value={{
        completedModules,
        isModuleUnlocked,
        isModuleCompleted,
        canCompleteModule,
        getModuleCriteria,
        completeModule,
        reopenModule,
        pickNextModuleToFocus,
        trilha1Progress,
        trilha1Completed,
        trilha1CompletedAt,
        entryModule,

        userName,
        setUserName,
        quizHistory,
        recordQuizCompleted,
        nextQuizAvailableDate,
        is90DaysReviewDue,
        scoreDifferenceFromLast,

        selectedNextLevelPhrase,
        setSelectedNextLevelPhrase,
        firstAction7Days,
        setFirstAction7Days,
        reflectionChildhood,
        setReflectionChildhood,
        reflectionFeelings,
        setReflectionFeelings,
        reflectionBeliefsStillFit,
        setReflectionBeliefsStillFit,

        enemiesChecklistConfirmed,
        setEnemiesChecklistConfirmed,
        weeklyProgress,
        updateWeeklyProgress,

        noDebtsConfirmed,
        setNoDebtsConfirmed,

        talentsUnmonetized,
        setTalentsUnmonetized,
        movementEvaluation,
        setMovementEvaluation,

        purposeChallengingMoment,
        setPurposeChallengingMoment,
        purposeLessonsLearned,
        setPurposeLessonsLearned,
        purposeStatement,
        setPurposeStatement,
        purposeLegacyLetter,
        setPurposeLegacyLetter,
        purposeRereadDate,
        setPurposeRereadDate,

        bizPlanMode,
        setBizPlanMode,
        bizDiagnosisAnswers,
        setBizDiagnosisAnswers,
        bizDiagnosisDone,
        setBizDiagnosisDone,
        bizLevel,

        pfPjCommitments,
        togglePfPjCommitment,
        proLaboreMonthly,
        setProLaboreMonthly,
        proLaborePaymentDay,
        setProLaborePaymentDay,
        pfPjStepCompleted,

        dreFaturamento,
        setDreFaturamento,
        dreImpostosPerc,
        setDreImpostosPerc,
        dreCustosDiretos,
        setDreCustosDiretos,
        dreDespesasFixas,
        setDreDespesasFixas,
        dreMesReferencia,
        setDreMesReferencia,
        dreClosedMonths,
        closeDREMonth,

        cashflowInitialBalance,
        setCashflowInitialBalance,
        cashflowEntries,
        addCashflowEntry,
        deleteCashflowEntry,
        cashflowConfirmed,
        setCashflowConfirmed,

        savedPrices,
        savePriceItem,
        deletePriceItem,

        reserveSavedAmount,
        setReserveSavedAmount,
        reserveGoalAccepted,
        setReserveGoalAccepted,

        activeGargalos,
        activateGargalo,
        resolveGargalo,
        resolvedGargalos,

        resetAllJourneyData,

        // Avisos (Mural & Urgentes)
        announcements,
        addAnnouncement,
        deleteAnnouncement,
        toggleAnnouncementUrgent,

        // Modo Administrador
        isAdmin,
        setIsAdmin,
        toggleAdminMode,
        adminUnlockAllModules,
        adminLockAllModules,
        adminCompleteAllModules,
        adminSetCompletedModules,
        adminSetTrilha1Completed,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
};

export const useJourney = () => {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
};
