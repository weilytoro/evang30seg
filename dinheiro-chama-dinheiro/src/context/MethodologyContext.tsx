import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  DEFAULT_BELIEFS,
  INITIAL_JESUS_DEBTS,
  INITIAL_MULTIPLICATION_MAP,
  SEVEN_ENEMIES,
} from '../data/methodologyData';
import {
  BeliefItem,
  BusinessDiagnosis,
  EnemyItem,
  JesusDebtItem,
  MentalityMilestone,
  MultiplicationMapItem,
  PlatformMode,
  QuizResult,
} from '../types/methodology';

interface MethodologyContextType {
  // Modes & Navigation
  platformMode: PlatformMode;
  setPlatformMode: (mode: PlatformMode) => void;
  activeTrack: 'trilha_1' | 'trilha_2';
  setActiveTrack: (track: 'trilha_1' | 'trilha_2') => void;
  hasCnpjOrIntends: boolean;
  setHasCnpjOrIntends: (has: boolean) => void;

  // Quiz
  quizResult: QuizResult | null;
  saveQuizResult: (score: number, hasCnpj: boolean, studentName?: string) => void;
  retakeQuiz: () => void;
  mentalityHistory: MentalityMilestone[];
  getCurrentMilestone: () => MentalityMilestone | undefined;

  // Modulo 2: Crenças
  beliefs: BeliefItem[];
  toggleBelief: (id: string) => void;
  updateBelief: (id: string, updated: Partial<BeliefItem>) => void;
  addCustomBelief: (belief: Omit<BeliefItem, 'id'>) => void;

  // Modulo 3: 7 Inimigos
  enemies: EnemyItem[];
  toggleEnemyActive: (id: number) => void;
  toggleEnemyAction: (id: number) => void;
  updateEnemyCustomValue: (id: number, value: string) => void;

  // Modulo 4: Método JESUS & Dívidas
  jesusDebts: JesusDebtItem[];
  debtStrategy: 'combinada' | 'avalanche' | 'bola_de_neve';
  setDebtStrategy: (strategy: 'combinada' | 'avalanche' | 'bola_de_neve') => void;
  addJesusDebt: (debt: Omit<JesusDebtItem, 'id'>) => void;
  updateJesusDebt: (id: string, updated: Partial<JesusDebtItem>) => void;
  deleteJesusDebt: (id: string) => void;
  toggleDebtPaid: (id: string) => void;
  monthlyLiquidIncome: number;
  setMonthlyLiquidIncome: (val: number) => void;
  monthlyEssentialExpenses: number;
  setMonthlyEssentialExpenses: (val: number) => void;

  // Modulo 5: Mapa de Multiplicação de Renda
  multiplicationMap: MultiplicationMapItem[];
  addMultiplicationItem: (item: Omit<MultiplicationMapItem, 'id'>) => void;
  updateMultiplicationItem: (id: string, updated: Partial<MultiplicationMapItem>) => void;
  deleteMultiplicationItem: (id: string) => void;

  // Trilha 2: Empreendedorismo Cristão (CNPJ)
  businessDiagnosis: BusinessDiagnosis | null;
  setBusinessDiagnosis: (diag: BusinessDiagnosis | null) => void;
  resetMethodologyData: () => void;
}

const STORAGE_KEYS = {
  QUIZ: 'dcd_quiz_result_v3',
  BELIEFS: 'dcd_beliefs_v3',
  ENEMIES: 'dcd_enemies_v3',
  JESUS_DEBTS: 'dcd_jesus_debts_v3',
  MULTIPLICATION: 'dcd_multiplication_v3',
  PLATFORM_MODE: 'dcd_platform_mode_v3',
  INCOME: 'dcd_income_v3',
  EXPENSES: 'dcd_expenses_v3',
  BIZ_DIAG: 'dcd_biz_diag_v3',
  STRATEGY: 'dcd_debt_strategy_v3',
  MENTALITY_HISTORY: 'dcd_mentality_history_v3',
};

const MethodologyContext = createContext<MethodologyContextType | undefined>(undefined);

export const MethodologyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Platform Mode
  const [platformMode, setPlatformMode] = useState<PlatformMode>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEYS.PLATFORM_MODE) as PlatformMode) || 'casa';
    } catch {
      return 'casa';
    }
  });

  const [activeTrack, setActiveTrack] = useState<'trilha_1' | 'trilha_2'>('trilha_1');

  // Quiz State - starts NULL (clean zero-slate)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.QUIZ);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [hasCnpjOrIntends, setHasCnpjOrIntends] = useState<boolean>(() => {
    return quizResult?.hasCnpjOrIntends ?? false;
  });

  // Beliefs - all starts unchecked
  const [beliefs, setBeliefs] = useState<BeliefItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BELIEFS);
      return stored ? JSON.parse(stored) : DEFAULT_BELIEFS;
    } catch {
      return DEFAULT_BELIEFS;
    }
  });

  // 7 Enemies - all starts unchecked
  const [enemies, setEnemies] = useState<EnemyItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ENEMIES);
      return stored ? JSON.parse(stored) : SEVEN_ENEMIES;
    } catch {
      return SEVEN_ENEMIES;
    }
  });

  // Método JESUS Debts - starts empty
  const [jesusDebts, setJesusDebts] = useState<JesusDebtItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.JESUS_DEBTS);
      return stored ? JSON.parse(stored) : INITIAL_JESUS_DEBTS;
    } catch {
      return INITIAL_JESUS_DEBTS;
    }
  });

  const [debtStrategy, setDebtStrategy] = useState<'combinada' | 'avalanche' | 'bola_de_neve'>(() => {
    try {
      return (
        (localStorage.getItem(STORAGE_KEYS.STRATEGY) as
          | 'combinada'
          | 'avalanche'
          | 'bola_de_neve') || 'combinada'
      );
    } catch {
      return 'combinada';
    }
  });

  // Renda e despesas começam em 0
  const [monthlyLiquidIncome, setMonthlyLiquidIncome] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INCOME);
      return stored ? parseFloat(stored) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [monthlyEssentialExpenses, setMonthlyEssentialExpenses] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return stored ? parseFloat(stored) || 0 : 0;
    } catch {
      return 0;
    }
  });

  // Multiplication Map - starts empty
  const [multiplicationMap, setMultiplicationMap] = useState<MultiplicationMapItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MULTIPLICATION);
      return stored ? JSON.parse(stored) : INITIAL_MULTIPLICATION_MAP;
    } catch {
      return INITIAL_MULTIPLICATION_MAP;
    }
  });

  // Business Diagnosis
  const [businessDiagnosis, setBusinessDiagnosis] = useState<BusinessDiagnosis | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BIZ_DIAG);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Mentality History
  const [mentalityHistory, setMentalityHistory] = useState<MentalityMilestone[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MENTALITY_HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persistence
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLATFORM_MODE, platformMode);
    } catch {}
  }, [platformMode]);

  useEffect(() => {
    try {
      if (quizResult) {
        localStorage.setItem(STORAGE_KEYS.QUIZ, JSON.stringify(quizResult));
      } else {
        localStorage.removeItem(STORAGE_KEYS.QUIZ);
      }
    } catch {}
  }, [quizResult]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BELIEFS, JSON.stringify(beliefs));
    } catch {}
  }, [beliefs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ENEMIES, JSON.stringify(enemies));
    } catch {}
  }, [enemies]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.JESUS_DEBTS, JSON.stringify(jesusDebts));
    } catch {}
  }, [jesusDebts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STRATEGY, debtStrategy);
    } catch {}
  }, [debtStrategy]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INCOME, monthlyLiquidIncome.toString());
    } catch {}
  }, [monthlyLiquidIncome]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, monthlyEssentialExpenses.toString());
    } catch {}
  }, [monthlyEssentialExpenses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MULTIPLICATION, JSON.stringify(multiplicationMap));
    } catch {}
  }, [multiplicationMap]);

  useEffect(() => {
    try {
      if (businessDiagnosis) {
        localStorage.setItem(STORAGE_KEYS.BIZ_DIAG, JSON.stringify(businessDiagnosis));
      }
    } catch {}
  }, [businessDiagnosis]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MENTALITY_HISTORY, JSON.stringify(mentalityHistory));
    } catch {}
  }, [mentalityHistory]);

  // Auto-register milestone when quiz changes
  useEffect(() => {
    if (quizResult) {
      const lastMilestone = mentalityHistory[mentalityHistory.length - 1];
      // Only add if level changed or first time
      if (!lastMilestone || lastMilestone.level !== quizResult.level) {
        const newMilestone: MentalityMilestone = {
          id: `mm-${Date.now()}`,
          level: quizResult.level,
          title: quizResult.title,
          score: quizResult.totalScore,
          reachedAt: quizResult.completedAt || new Date().toISOString().split('T')[0],
          daysAtLevel: undefined,
        };

        // Calculate days at level for previous milestone
        if (lastMilestone && lastMilestone.reachedAt) {
          const lastDate = new Date(lastMilestone.reachedAt);
          const currentDate = new Date(newMilestone.reachedAt);
          const daysDiff = Math.floor(
            (currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          if (daysDiff > 0) {
            setMentalityHistory((prev) => [
              ...prev.slice(0, -1),
              { ...lastMilestone, daysAtLevel: daysDiff },
            ]);
          }
        }

        setMentalityHistory((prev) => [...prev, newMilestone]);
      }
    }
  }, [quizResult?.level, quizResult?.totalScore]);

  // Quiz logic
  const saveQuizResult = (score: number, hasCnpj: boolean, _studentName?: string) => {
    let level: 'bloqueada' | 'estagnada' | 'transicao' | 'construcao' | 'evoluida' = 'transicao';
    let title = 'Mentalidade Financeira em Transição';
    let description = '';
    let recommendedAction = '';
    let keyChapter = 4;

    if (score >= 10 && score <= 19) {
      level = 'bloqueada';
      title = 'Mentalidade Financeira Bloqueada';
      description =
        'O dinheiro é sentido como um peso, estresse e medo constante. Há uma sensação de prisão ou vergonha que impede você de olhar para os extratos com serenidade.';
      recommendedAction =
        'Seu capítulo-chave é o 2 (Crenças & Quebra de Correntes): identifique as raízes emocionais herdadas e renove sua mente com a verdade.';
      keyChapter = 2;
    } else if (score >= 20 && score <= 27) {
      level = 'estagnada';
      title = 'Mentalidade Financeira Estagnada';
      description =
        'Você vive no "quase": tenta se organizar, faz planos e até economiza um pouco, mas logo volta ao ponto de partida por falta de consistência nos hábitos.';
      recommendedAction =
        'Seu capítulo-chave é o 3 (A Força dos Hábitos): neutralize os 7 Inimigos Financeiros Ocultos que drenam seu dinheiro no dia a dia.';
      keyChapter = 3;
    } else if (score >= 28 && score <= 35) {
      level = 'transicao';
      title = 'Mentalidade Financeira em Transição';
      description =
        'Você já iniciou a mudança de alguns padrões, porém ainda convive com oscilações. Está na ponte entre a escassez do passado e a segurança do futuro.';
      recommendedAction =
        'Seu capítulo-chave é o 4 (Libertação: Método JESUS): estruture a ordem de ataque às dívidas e estanque as sangrias financeiras.';
      keyChapter = 4;
    } else if (score >= 36 && score <= 43) {
      level = 'construcao';
      title = 'Mentalidade Financeira em Construção';
      description =
        'Você tem clareza dos seus números e planeja antes do mês começar. Já superou a fase do sufoco e agora constrói alicerces sólidos de crescimento.';
      recommendedAction =
        'Seu capítulo-chave é o 5 (Multiplicação de Renda): multiplique talentos e ative novas fontes legítimas de renda familiar.';
      keyChapter = 5;
    } else {
      level = 'evoluida';
      title = 'Mentalidade Financeira Evoluída';
      description =
        'O dinheiro ocupa o lugar correto: ferramenta neutra a serviço do seu propósito, da sua família e da bênção a outras pessoas.';
      recommendedAction =
        'Seu capítulo-chave é o 6 (Dor com Propósito): consolide seu legado e prepare o rito de passagem para o empreendedorismo do Reino.';
      keyChapter = 6;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const newResult: QuizResult = {
      totalScore: score,
      level,
      title,
      description,
      recommendedAction,
      keyChapter,
      hasCnpjOrIntends: hasCnpj,
      completedAt: todayStr,
    };

    setQuizResult(newResult);
    setHasCnpjOrIntends(hasCnpj);
  };

  const retakeQuiz = () => {
    // Retake quiz uses local state in QuizView without deleting modules progress
    setQuizResult(null);
  };

  // Beliefs
  const toggleBelief = (id: string) => {
    setBeliefs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, hasBelief: !b.hasBelief } : b))
    );
  };

  const updateBelief = (id: string, updated: Partial<BeliefItem>) => {
    setBeliefs((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
  };

  const addCustomBelief = (newBelief: Omit<BeliefItem, 'id'>) => {
    const item: BeliefItem = {
      ...newBelief,
      id: `b-custom-${Date.now()}`,
    };
    setBeliefs((prev) => [item, ...prev]);
  };

  // Enemies
  const toggleEnemyActive = (id: number) => {
    setEnemies((prev) =>
      prev.map((e) => (e.id === id ? { ...e, active: !e.active } : e))
    );
  };

  const toggleEnemyAction = (id: number) => {
    setEnemies((prev) =>
      prev.map((e) => (e.id === id ? { ...e, actionTaken: !e.actionTaken } : e))
    );
  };

  const updateEnemyCustomValue = (id: number, value: string) => {
    setEnemies((prev) =>
      prev.map((e) => (e.id === id ? { ...e, customLimitOrValue: value } : e))
    );
  };

  // Método JESUS
  const addJesusDebt = (debt: Omit<JesusDebtItem, 'id'>) => {
    const item: JesusDebtItem = {
      ...debt,
      id: `jd-${Date.now()}`,
    };
    setJesusDebts((prev) => [...prev, item]);
  };

  const updateJesusDebt = (id: string, updated: Partial<JesusDebtItem>) => {
    setJesusDebts((prev) => prev.map((d) => (d.id === id ? { ...d, ...updated } : d)));
  };

  const deleteJesusDebt = (id: string) => {
    setJesusDebts((prev) => prev.filter((d) => d.id !== id));
  };

  const toggleDebtPaid = (id: string) => {
    setJesusDebts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, paid: !d.paid } : d))
    );
  };

  // Multiplication
  const addMultiplicationItem = (item: Omit<MultiplicationMapItem, 'id'>) => {
    const newItem: MultiplicationMapItem = {
      ...item,
      id: `mm-${Date.now()}`,
    };
    setMultiplicationMap((prev) => [newItem, ...prev]);
  };

  const updateMultiplicationItem = (id: string, updated: Partial<MultiplicationMapItem>) => {
    setMultiplicationMap((prev) => prev.map((m) => (m.id === id ? { ...m, ...updated } : m)));
  };

  const deleteMultiplicationItem = (id: string) => {
    setMultiplicationMap((prev) => prev.filter((m) => m.id !== id));
  };

  const resetMethodologyData = () => {
    setQuizResult(null);
    setBeliefs(DEFAULT_BELIEFS);
    setEnemies(SEVEN_ENEMIES);
    setJesusDebts([]);
    setMultiplicationMap([]);
    setMonthlyLiquidIncome(0);
    setMonthlyEssentialExpenses(0);
    setBusinessDiagnosis(null);
    setMentalityHistory([]);
    try {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    } catch {}
  };

  const getCurrentMilestone = (): MentalityMilestone | undefined => {
    return mentalityHistory[mentalityHistory.length - 1];
  };

  return (
    <MethodologyContext.Provider
      value={{
        platformMode,
        setPlatformMode,
        activeTrack,
        setActiveTrack,
        hasCnpjOrIntends,
        setHasCnpjOrIntends,

        quizResult,
        saveQuizResult,
        retakeQuiz,
        mentalityHistory,
        getCurrentMilestone,

        beliefs,
        toggleBelief,
        updateBelief,
        addCustomBelief,

        enemies,
        toggleEnemyActive,
        toggleEnemyAction,
        updateEnemyCustomValue,

        jesusDebts,
        debtStrategy,
        setDebtStrategy,
        addJesusDebt,
        updateJesusDebt,
        deleteJesusDebt,
        toggleDebtPaid,
        monthlyLiquidIncome,
        setMonthlyLiquidIncome,
        monthlyEssentialExpenses,
        setMonthlyEssentialExpenses,

        multiplicationMap,
        addMultiplicationItem,
        updateMultiplicationItem,
        deleteMultiplicationItem,

        businessDiagnosis,
        setBusinessDiagnosis,
        resetMethodologyData,
      }}
    >
      {children}
    </MethodologyContext.Provider>
  );
};

export const useMethodology = () => {
  const context = useContext(MethodologyContext);
  if (!context) {
    throw new Error('useMethodology must be used within a MethodologyProvider');
  }
  return context;
};
