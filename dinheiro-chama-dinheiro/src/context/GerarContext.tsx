import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { GERAR_SKILLS, INITIAL_RADAR_8D } from '../data/gerarData';
import {
  FiveWhysItem,
  GerarSkillItem,
  Radar8DScore,
  ThreeDaysCommitment,
  TriagemGerar,
} from '../types/gerarMethod';

interface GerarContextType {
  radarScores: Radar8DScore[];
  updateRadarScore: (key: string, score: number) => void;
  gargaloPrimario: Radar8DScore;
  gargaloSecundario: Radar8DScore;

  triagem: TriagemGerar;
  updateTriagem: (data: Partial<TriagemGerar>) => void;

  fiveWhys: FiveWhysItem;
  updateFiveWhys: (data: Partial<FiveWhysItem>) => void;

  threeDaysCommitment: ThreeDaysCommitment;
  saveThreeDaysCommitment: (oneThing: string, obstacleToday: string) => void;
  toggleThreeDaysCompleted: () => void;

  councilDecision: string;
  setCouncilDecision: (dec: string) => void;
  councilNotes: { [agentName: string]: string };
  updateCouncilNote: (agentName: string, text: string) => void;

  activeCycle: '30_dias' | '90_dias' | '6_meses';
  setActiveCycle: (c: '30_dias' | '90_dias' | '6_meses') => void;

  skillsList: GerarSkillItem[];
  hasCustomRadarScores: boolean;
}

const STORAGE_KEYS = {
  RADAR: 'gerar_radar_8d_v2',
  TRIAGEM: 'gerar_triagem_v2',
  FIVE_WHYS: 'gerar_five_whys_v2',
  COMMITMENT: 'gerar_commitment_v2',
  COUNCIL_DECISION: 'gerar_council_decision_v2',
  COUNCIL_NOTES: 'gerar_council_notes_v2',
  CYCLE: 'gerar_cycle_v2',
};

const GerarContext = createContext<GerarContextType | undefined>(undefined);

export const GerarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [radarScores, setRadarScores] = useState<Radar8DScore[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RADAR);
      return stored ? JSON.parse(stored) : INITIAL_RADAR_8D;
    } catch {
      return INITIAL_RADAR_8D;
    }
  });

  const [hasCustomRadarScores, setHasCustomRadarScores] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`${STORAGE_KEYS.RADAR}_modified`) === 'true';
    } catch {
      return false;
    }
  });

  // Empty initial triagem
  const [triagem, setTriagem] = useState<TriagemGerar>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRIAGEM);
      return stored
        ? JSON.parse(stored)
        : {
            dorPrincipal: '',
            tempoDor: '',
            tentativasAnteriores: '',
            focoDor: 'ambos',
          };
    } catch {
      return {
        dorPrincipal: '',
        tempoDor: '',
        tentativasAnteriores: '',
        focoDor: 'ambos',
      };
    }
  });

  // Empty initial 5 Whys
  const [fiveWhys, setFiveWhys] = useState<FiveWhysItem>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FIVE_WHYS);
      return stored
        ? JSON.parse(stored)
        : {
            why1: '',
            why2: '',
            why3: '',
            why4: '',
            why5: '',
            rootCause: '',
          };
    } catch {
      return {
        why1: '',
        why2: '',
        why3: '',
        why4: '',
        why5: '',
        rootCause: '',
      };
    }
  });

  // Empty initial 3 days commitment
  const [threeDaysCommitment, setThreeDaysCommitment] = useState<ThreeDaysCommitment>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COMMITMENT);
      return stored
        ? JSON.parse(stored)
        : {
            oneThing: '',
            obstacleToday: '',
            dueDate: '',
            completed: false,
          };
    } catch {
      return {
        oneThing: '',
        obstacleToday: '',
        dueDate: '',
        completed: false,
      };
    }
  });

  const [councilDecision, setCouncilDecision] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.COUNCIL_DECISION) || '';
    } catch {
      return '';
    }
  });

  const [councilNotes, setCouncilNotes] = useState<{ [agentName: string]: string }>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COUNCIL_NOTES);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [activeCycle, setActiveCycle] = useState<'30_dias' | '90_dias' | '6_meses'>('90_dias');

  // Persistence
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RADAR, JSON.stringify(radarScores));
    } catch (e) {
      console.error(e);
    }
  }, [radarScores]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRIAGEM, JSON.stringify(triagem));
    } catch (e) {
      console.error(e);
    }
  }, [triagem]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FIVE_WHYS, JSON.stringify(fiveWhys));
    } catch (e) {
      console.error(e);
    }
  }, [fiveWhys]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMMITMENT, JSON.stringify(threeDaysCommitment));
    } catch (e) {
      console.error(e);
    }
  }, [threeDaysCommitment]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COUNCIL_DECISION, councilDecision);
    } catch (e) {
      console.error(e);
    }
  }, [councilDecision]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COUNCIL_NOTES, JSON.stringify(councilNotes));
    } catch (e) {
      console.error(e);
    }
  }, [councilNotes]);

  const updateRadarScore = (key: string, score: number) => {
    setRadarScores((prev) =>
      prev.map((item) => (item.key === key ? { ...item, score: Math.max(1, Math.min(10, score)) } : item))
    );
    setHasCustomRadarScores(true);
    try {
      localStorage.setItem(`${STORAGE_KEYS.RADAR}_modified`, 'true');
    } catch {}
  };

  const updateTriagem = (data: Partial<TriagemGerar>) => {
    setTriagem((prev) => ({ ...prev, ...data }));
  };

  const updateFiveWhys = (data: Partial<FiveWhysItem>) => {
    setFiveWhys((prev) => ({ ...prev, ...data }));
  };

  const saveThreeDaysCommitment = (oneThing: string, obstacleToday: string) => {
    const today = new Date();
    const target = new Date(today);
    target.setDate(target.getDate() + 3);
    const dateFormatted = target.toLocaleDateString('pt-BR');

    setThreeDaysCommitment((prev) => ({
      ...prev,
      oneThing,
      obstacleToday,
      dueDate: dateFormatted,
      completed: false,
    }));
  };

  const toggleThreeDaysCompleted = () => {
    setThreeDaysCommitment((prev) => ({
      ...prev,
      completed: !prev.completed,
    }));
  };

  const updateCouncilNote = (agentName: string, text: string) => {
    setCouncilNotes((prev) => ({
      ...prev,
      [agentName]: text,
    }));
  };

  // Find 2 lowest dimensions as bottlenecks
  const sortedScores = useMemo(() => {
    return [...radarScores].sort((a, b) => a.score - b.score);
  }, [radarScores]);

  const gargaloPrimario = sortedScores[0] || radarScores[0];
  const gargaloSecundario = sortedScores[1] || radarScores[1];

  return (
    <GerarContext.Provider
      value={{
        radarScores,
        updateRadarScore,
        gargaloPrimario,
        gargaloSecundario,
        triagem,
        updateTriagem,
        fiveWhys,
        updateFiveWhys,
        threeDaysCommitment,
        saveThreeDaysCommitment,
        toggleThreeDaysCompleted,
        councilDecision,
        setCouncilDecision,
        councilNotes,
        updateCouncilNote,
        activeCycle,
        setActiveCycle,
        skillsList: GERAR_SKILLS,
        hasCustomRadarScores,
      }}
    >
      {children}
    </GerarContext.Provider>
  );
};

export const useGerar = () => {
  const context = useContext(GerarContext);
  if (!context) {
    throw new Error('useGerar must be used within a GerarProvider');
  }
  return context;
};
