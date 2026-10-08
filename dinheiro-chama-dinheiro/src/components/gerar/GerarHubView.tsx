import React, { useState } from 'react';
import {
  Compass,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  ShieldCheck,
  Building2,
  Heart,
  Brain,
  Crown,
  Zap,
  HelpCircle,
  Eye,
  Scissors,
  Network,
  Calendar,
  RotateCcw,
  Target,
  RefreshCw,
  UserCheck,
  Loader2,
} from 'lucide-react';
import { useGerar } from '../../context/GerarContext';
import { useJourney } from '../../context/JourneyContext';
import { FIVE_AGENTS_CRITERIA } from '../../data/gerarData';

export const GerarHubView: React.FC = () => {
  const { trilha1Completed, trilha1Progress } = useJourney();
  const {
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
    skillsList,
  } = useGerar();

  const [activeSubTab, setActiveSubTab] = useState<
    'fluxo' | 'radar' | 'causa_raiz' | 'conselho' | 'skills' | 'ciclos'
  >('fluxo');

  const [tempOneThing, setTempOneThing] = useState(threeDaysCommitment.oneThing);
  const [tempObstacle, setTempObstacle] = useState(threeDaysCommitment.obstacleToday);
  const [savedCommitmentMsg, setSavedCommitmentMsg] = useState(false);

  // Gemini AI Bottleneck Analysis States
  const [isAnalyzingBottleneck, setIsAnalyzingBottleneck] = useState(false);
  const [bottleneckError, setBottleneckError] = useState<string | null>(null);

  const handleAnalyzeBottleneck = async () => {
    if (!triagem.dorPrincipal.trim()) {
      setBottleneckError('Por favor, descreva a dor principal para o Radar GERAR 8D analisar.');
      return;
    }

    setIsAnalyzingBottleneck(true);
    setBottleneckError(null);

    try {
      const response = await fetch('/api/gerar/analyze-bottleneck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dorPrincipal: triagem.dorPrincipal,
          tempoDor: triagem.tempoDor,
          tentativasAnteriores: triagem.tentativasAnteriores,
          focoDor: triagem.focoDor,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Falha ao analisar gargalo com a IA.');
      }

      updateTriagem({
        analiseIA: {
          areaPrincipal: data.analysis.areaPrincipal,
          justificativa: data.analysis.justificativa,
          acaoRecomendada: data.analysis.acaoRecomendada,
          dimensaoLider: data.analysis.dimensaoLider,
          analyzedAt: new Date().toLocaleDateString('pt-BR'),
        },
      });
    } catch (err: any) {
      console.error('Erro na análise de gargalo:', err);
      setBottleneckError(err.message || 'Erro ao processar análise do Radar GERAR 8D.');
    } finally {
      setIsAnalyzingBottleneck(false);
    }
  };

  const handleSaveCommitment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempOneThing.trim()) return;
    saveThreeDaysCommitment(tempOneThing, tempObstacle);
    setSavedCommitmentMsg(true);
    setTimeout(() => setSavedCommitmentMsg(false), 3000);
  };

  if (!trilha1Completed) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm text-center max-w-lg mx-auto my-8 space-y-6 animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200/60 shadow-xs">
          <Layers className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2.5 py-1 rounded-full">
            Interior antes de exterior
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Hub GERAR Bloqueado
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic max-w-sm mx-auto">
            &ldquo;Não se constrói um CNPJ próspero sobre um CPF desordenado.&rdquo;
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            O Radar GERAR 8D e as ferramentas estratégicas são liberadas após a conclusão de todos os 7 módulos da Trilha 1 (CPF).
          </p>
        </div>
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1.5">
          <div className="flex items-center justify-between font-bold">
            <span>Progresso da Trilha 1 (CPF):</span>
            <span className="text-slate-900">{trilha1Progress}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all"
              style={{ width: `${trilha1Progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner - Método GERAR */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-black text-xs uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Modelo de Gestão Integrado • Método GERAR</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
              Gestão Estratégica Real Ao Reino
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
              "O empresário não gerencia apenas um negócio. Ele governa o que Deus lhe confiou." Um sistema completo que integra as 3 dimensões do líder e o mapa de 12 skills de gestão.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold text-slate-400 bg-white/10 px-3 py-1 rounded-full border border-white/10">
              Gargalo Primário: <strong className="text-rose-400">{gargaloPrimario.dimensao} ({gargaloPrimario.score}/10)</strong>
            </span>
          </div>
        </div>

        {/* As 3 Dimensões do Empresário (Página 3) */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">
                1
              </span>
              <span className="font-black text-sm uppercase tracking-wide text-amber-300">
                Espírito
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-1 font-semibold">
              Identidade, propósito e chamado.
            </p>
            <div className="mt-2 text-[11px] text-amber-200/90 italic">
              "Por que essa empresa existe?"
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-400 text-slate-950 font-black text-xs flex items-center justify-center">
                2
              </span>
              <span className="font-black text-sm uppercase tracking-wide text-indigo-300">
                Alma
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-1 font-semibold">
              Emoções, decisões e cultura.
            </p>
            <div className="mt-2 text-[11px] text-indigo-200/90 italic">
              "Como o dono decide sob pressão?"
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center">
                3
              </span>
              <span className="font-black text-sm uppercase tracking-wide text-emerald-300">
                Material
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-1 font-semibold">
              Resultados, finanças e operações.
            </p>
            <div className="mt-2 text-[11px] text-emerald-200/90 italic">
              "O negócio gera resultado sustentável?"
            </div>
          </div>
        </div>
      </div>

      {/* Internal Subtabs Navigation */}
      <div className="flex flex-nowrap items-center space-x-1 sm:space-x-2 border-b border-slate-200/80 pb-2 overflow-x-auto whitespace-nowrap no-scrollbar scroll-smooth">
        <button
          onClick={() => setActiveSubTab('fluxo')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'fluxo'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          0 e 1. Acolhimento & Triagem
        </button>
        <button
          onClick={() => setActiveSubTab('radar')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'radar'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          2. Radar GERAR 8D
        </button>
        <button
          onClick={() => setActiveSubTab('causa_raiz')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'causa_raiz'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          3. Causa-Raiz (5 Porquês)
        </button>
        <button
          onClick={() => setActiveSubTab('skills')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'skills'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Mapa das 12 Skills
        </button>
        <button
          onClick={() => setActiveSubTab('ciclos')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'ciclos'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Fluxo Cíclico & Decisão
        </button>
      </div>

      {/* SUBTAB 1: FLUXO EM 7 ETAPAS & TRIAGEM */}
      {activeSubTab === 'fluxo' && (
        <div className="space-y-6">
          {/* As 7 Etapas do Fluxo */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900">
              O Fluxo Completo em 7 Etapas
            </h3>
            <p className="text-xs text-slate-600">
              "Etapa 4 se ramifica conforme o gargalo identificado — nunca mais de duas dimensões ao mesmo tempo."
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-center text-xs pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-lg font-black text-slate-800 block">0</span>
                <strong className="text-slate-900 block text-[11px]">Acolhimento</strong>
                <span className="text-[10px] text-slate-500">Escutar antes de diagnosticar</span>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
                <span className="text-lg font-black text-indigo-700 block">1</span>
                <strong className="text-indigo-950 block text-[11px]">Triagem</strong>
                <span className="text-[10px] text-indigo-700">4 perguntas rápidas</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-lg font-black text-blue-700 block">2</span>
                <strong className="text-blue-950 block text-[11px]">Diagnóstico</strong>
                <span className="text-[10px] text-blue-700">Radar GERAR 8D</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-lg font-black text-amber-700 block">3</span>
                <strong className="text-amber-950 block text-[11px]">Prioridade</strong>
                <span className="text-[10px] text-amber-700">Qual gargalo atacar primeiro</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-lg font-black text-emerald-700 block">4</span>
                <strong className="text-emerald-950 block text-[11px]">Execução</strong>
                <span className="text-[10px] text-emerald-700">Skill do gargalo (máx 2)</span>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <span className="text-lg font-black text-purple-700 block">5</span>
                <strong className="text-purple-950 block text-[11px]">Fundamento</strong>
                <span className="text-[10px] text-purple-700">Bíblia como âncora</span>
              </div>
              <div className="p-3 bg-teal-50 rounded-xl border border-teal-200">
                <span className="text-lg font-black text-teal-700 block">6</span>
                <strong className="text-teal-950 block text-[11px]">Engajamento</strong>
                <span className="text-[10px] text-teal-700">Gamificação contínua</span>
              </div>
            </div>
          </div>

          {/* Triagem Rápida em 4 Perguntas (Página 6) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Etapa 1 • Triagem Rápida (As 4 Perguntas)
                </h3>
                <p className="text-xs text-slate-500">
                  Ponto de entrada obrigatório — antes de qualquer planilha técnica
                </p>
              </div>
              <span className="text-xs font-bold bg-indigo-50 text-indigo-800 px-3 py-1 rounded-full">
                Bifurcação Inteligente
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. Qual é a dor principal do momento?
                </label>
                <textarea
                  rows={2}
                  value={triagem.dorPrincipal}
                  onChange={(e) => updateTriagem({ dorPrincipal: e.target.value })}
                  placeholder="Ex: O caixa nunca fecha, equipe desmotivada, falta de clientes..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. Há quanto tempo essa dor persiste?
                </label>
                <select
                  value={triagem.tempoDor}
                  onChange={(e) => updateTriagem({ tempoDor: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="">Selecione…</option>
                  <option value="Menos de 3 meses (recente)">Menos de 3 meses (recente)</option>
                  <option value="3 a 6 meses (recorrente)">3 a 6 meses (recorrente)</option>
                  <option value="> 6 meses (sistêmico)">Mais de 6 meses (sistêmico / crônico)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  3. O que você já tentou fazer para resolver?
                </label>
                <textarea
                  rows={2}
                  value={triagem.tentativasAnteriores}
                  onChange={(e) => updateTriagem({ tentativasAnteriores: e.target.value })}
                  placeholder="Ex: Anotei em caderno, fiz promoções, conversei com a equipe..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  4. A causa está no empresário (interior) ou no negócio (exterior)?
                </label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => updateTriagem({ focoDor: 'empresario' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition-all ${
                      triagem.focoDor === 'empresario'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    No Empresário (Interior)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateTriagem({ focoDor: 'negocio' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition-all ${
                      triagem.focoDor === 'negocio'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    No Negócio (Exterior)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateTriagem({ focoDor: 'ambos' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition-all ${
                      triagem.focoDor === 'ambos'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Em Ambos (Paralelo)
                  </button>
                </div>
              </div>
            </div>

            {/* Botão de Análise de Gargalo com Gemini IA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleAnalyzeBottleneck}
                disabled={isAnalyzingBottleneck || !triagem.dorPrincipal.trim()}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  isAnalyzingBottleneck || !triagem.dorPrincipal.trim()
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-700 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-indigo-600/20 active:scale-[0.99] cursor-pointer'
                }`}
              >
                {isAnalyzingBottleneck ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Radar GERAR 8D Analisando Dor com IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Analisar Gargalo com o Radar GERAR 8D (IA Gemini)</span>
                  </>
                )}
              </button>
            </div>

            {bottleneckError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{bottleneckError}</span>
              </div>
            )}

            {/* Resultado da Análise de Gargalo com IA Gemini */}
            {triagem.analiseIA && (
              <div className="p-5 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white rounded-2xl border border-indigo-800/60 shadow-lg space-y-3.5 animate-in fade-in duration-200">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                      Diagnóstico do Radar GERAR 8D (IA)
                    </span>
                  </div>
                  {triagem.analiseIA.analyzedAt && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      Analisado em: {triagem.analiseIA.analyzedAt}
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/10 p-3.5 rounded-xl border border-white/10">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-300 block">
                      Gargalo Primário Identificado:
                    </span>
                    <h4 className="text-lg font-black text-amber-300">
                      {triagem.analiseIA.areaPrincipal}
                    </h4>
                  </div>
                  {triagem.analiseIA.dimensaoLider && (
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-300 block">
                        Dimensão Mais Impactada:
                      </span>
                      <span className="text-xs font-bold text-emerald-400">
                        {triagem.analiseIA.dimensaoLider}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
                    Justificativa do Prof. Weily Toro:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {triagem.analiseIA.justificativa}
                  </p>
                </div>

                {triagem.analiseIA.acaoRecomendada && (
                  <div className="p-3 bg-indigo-500/20 border border-indigo-400/30 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-amber-200 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" /> Ação Imediata (Compromisso dos 3 Dias):
                    </span>
                    <p className="text-slate-200">{triagem.analiseIA.acaoRecomendada}</p>
                  </div>
                )}
              </div>
            )}

            {/* Resultado da Bifurcação */}
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl text-xs sm:text-sm text-indigo-950 flex items-start gap-3">
              <Compass className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong>Direcionamento da Bifurcação GERAR: </strong>
                {triagem.focoDor === 'empresario' ? (
                  <span>
                    Sua resposta indica foco inicial em <strong>metodo-gerar-mentalidade</strong> (Crenças, 20 Bloqueios e Camadas da Identidade). O interior sempre é tratado antes do exterior!
                  </span>
                ) : triagem.focoDor === 'negocio' ? (
                  <span>
                    Sua resposta indica foco em <strong>Diagnóstico Técnico 8D</strong> e ferramentas de execução (Finanças, Processos ou Vendas).
                  </span>
                ) : (
                  <span>
                    Direcionamento para <strong>duas frentes em paralelo</strong>: Mentalidade do líder + Radar GERAR 8D do negócio.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: RADAR GERAR 8D (Página 6) */}
      {activeSubTab === 'radar' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Radar GERAR 8D • Diagnóstico das 8 Dimensões
                </h3>
                <p className="text-xs text-slate-500">
                  Pontue cada dimensão de 1 a 10. O sistema identifica seu gargalo crítico primário automaticamente.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-xl">
                  Gargalo Primário: {gargaloPrimario.dimensao} ({gargaloPrimario.score}/10)
                </span>
              </div>
            </div>

            {/* Sliders das 8 Dimensões */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {(radarScores || [])?.map((dim) => {
                const isPrimary = dim.key === gargaloPrimario.key;
                const isSecondary = dim.key === gargaloSecundario.key;

                return (
                  <div
                    key={dim.key}
                    className={`p-4 rounded-2xl border transition-all ${
                      isPrimary
                        ? 'bg-rose-50/60 border-rose-300 ring-2 ring-rose-500/20'
                        : isSecondary
                        ? 'bg-amber-50/50 border-amber-300'
                        : 'bg-slate-50/80 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-black text-slate-900">
                          {dim.dimensao}
                        </strong>
                        {isPrimary && (
                          <span className="text-[10px] font-black uppercase bg-rose-600 text-white px-1.5 py-0.5 rounded">
                            Gargalo 1
                          </span>
                        )}
                        {isSecondary && (
                          <span className="text-[10px] font-bold uppercase bg-amber-600 text-white px-1.5 py-0.5 rounded">
                            Gargalo 2
                          </span>
                        )}
                      </div>
                      <span className="text-base font-black text-slate-900 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                        {dim.score} / 10
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-1 italic">
                      "{dim.perguntaChave}"
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={dim.score}
                        onChange={(e) => updateRadarScore(dim.key, parseInt(e.target.value, 10))}
                        className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Regra de Ouro Aplicada */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 font-medium flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                <strong>Regra de Ouro do Método GERAR:</strong> Concentre toda sua energia apenas nos 2 gargalos mais críticos (<strong>{gargaloPrimario.dimensao}</strong> e <strong>{gargaloSecundario.dimensao}</strong>). Nunca ataque mais de duas dimensões ao mesmo tempo!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: CAUSA-RAIZ (5 PORQUÊS & MATRIZ EISENHOWER) */}
      {activeSubTab === 'causa_raiz' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Os 5 Porquês • Identificando a Causa-Raiz do Gargalo Primário
              </h3>
              <p className="text-xs text-slate-500">
                Vá a fundo até encontrar a raiz invisível por trás do sintoma financeiro ou operacional
              </p>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-[11px] font-bold text-indigo-700 uppercase">
                  1º Por quê? (O sintoma evidente)
                </label>
                <input
                  type="text"
                  value={fiveWhys.why1}
                  onChange={(e) => updateFiveWhys({ why1: e.target.value })}
                  className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-[11px] font-bold text-indigo-700 uppercase">
                  2º Por quê? (Causa direta)
                </label>
                <input
                  type="text"
                  value={fiveWhys.why2}
                  onChange={(e) => updateFiveWhys({ why2: e.target.value })}
                  className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-[11px] font-bold text-indigo-700 uppercase">
                  3º Por quê? (Hábito / Falta de processo)
                </label>
                <input
                  type="text"
                  value={fiveWhys.why3}
                  onChange={(e) => updateFiveWhys({ why3: e.target.value })}
                  className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-[11px] font-bold text-indigo-700 uppercase">
                  4º Por quê? (Comportamento ou crença)
                </label>
                <input
                  type="text"
                  value={fiveWhys.why4}
                  onChange={(e) => updateFiveWhys({ why4: e.target.value })}
                  className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-[11px] font-bold text-indigo-700 uppercase">
                  5º Por quê? (A raiz profunda)
                </label>
                <input
                  type="text"
                  value={fiveWhys.why5}
                  onChange={(e) => updateFiveWhys({ why5: e.target.value })}
                  className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <label className="block text-xs font-black text-emerald-900 uppercase tracking-wider">
                  Causa-Raiz Diagnosticada
                </label>
                <textarea
                  rows={2}
                  value={fiveWhys.rootCause}
                  onChange={(e) => updateFiveWhys({ rootCause: e.target.value })}
                  className="w-full mt-1.5 p-3 bg-white border border-emerald-300 rounded-xl font-bold text-emerald-950"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: MAPA DAS 12 SKILLS DA FAMÍLIA GERAR (Página 4, 8, 9, 10, 11) */}
      {activeSubTab === 'skills' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Mapa das 12 Skills da Família GERAR
              </h3>
              <p className="text-xs text-slate-500">
                Visão completa do ecossistema de capacitação e ferramentas de consultoria
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {(skillsList || [])?.map((skill) => {
                const isBase = skill.category === 'BASE';
                const isInterior = skill.category === 'INTERIOR';
                const isExec = skill.category === 'EXECUÇÃO';
                const isTransv = skill.category === 'TRANSVERSAL';
                const isMeta = skill.category === 'META';

                return (
                  <div
                    key={skill.slug}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between bg-white"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            isBase
                              ? 'bg-amber-100 text-amber-800'
                              : isInterior
                              ? 'bg-purple-100 text-purple-800'
                              : isExec
                              ? 'bg-indigo-100 text-indigo-800'
                              : isTransv
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {skill.category}
                        </span>
                      </div>

                      <h4 className="text-base font-black text-slate-900 mt-2">
                        {skill.name}
                      </h4>

                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {skill.description}
                      </p>

                      <div className="mt-3 p-2 bg-slate-50 rounded-xl text-[11px] text-slate-700">
                        <strong className="text-slate-900 block">Quando ativar:</strong>
                        <span>{skill.actionWhen}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1">
                      {(skill.tools || [])?.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: CONSELHO DOS 5 AGENTES (Página 11) */}
      {activeSubTab === 'conselho' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  O Conselho dos 5 Agentes (Decisões Irreversíveis)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Antes de decisões estratégicas de grande impacto (sociedade, contratação, empréstimo, expansão), passe a decisão pelas 5 óticas:
              </p>
            </div>

            {/* Input da Decisão em Análise */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Decisão Estratégica em Análise:
              </label>
              <input
                type="text"
                value={councilDecision}
                onChange={(e) => setCouncilDecision(e.target.value)}
                placeholder="Ex: Vou abrir uma segunda filial ou contratar um novo gerente comercial?"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-xs sm:text-sm"
              />
            </div>

            {/* As 5 Óticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {(FIVE_AGENTS_CRITERIA || [])?.map((agent) => {
                return (
                  <div
                    key={agent.name}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                          {agent.name}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">
                          {agent.role}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 font-semibold mt-2.5 leading-snug">
                        "{agent.question}"
                      </p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Parecer do Agente {agent.name}:
                      </label>
                      <textarea
                        rows={3}
                        value={councilNotes[agent.name] || ''}
                        onChange={(e) => updateCouncilNote(agent.name, e.target.value)}
                        placeholder="Anote as conclusões sob essa ótica..."
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 6: FLUXO CÍCLICO & AS 3 PERGUNTAS (Páginas 8, 16 e 17) */}
      {activeSubTab === 'ciclos' && (
        <div className="space-y-6">
          {/* As 3 Perguntas Antes de Movimentar Dinheiro (Página 8) */}
          <div className="bg-gradient-to-r from-emerald-900 to-teal-950 p-6 rounded-3xl text-white shadow-lg space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Multiplicação GERAR • Regra de Ouro</span>
            </div>
            <h3 className="text-xl font-black">
              As 3 Perguntas Antes de Qualquer Movimentação Financeira
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                <span className="text-lg font-black text-emerald-300 block">1. Vai voltar?</span>
                <p className="text-xs text-slate-200 mt-1">
                  Esse dinheiro é um gasto sem retorno ou uma semente com probabilidade real de colheita?
                </p>
              </div>

              <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                <span className="text-lg font-black text-teal-300 block">2. Quando?</span>
                <p className="text-xs text-slate-200 mt-1">
                  Qual é o prazo exato de retorno? Seu fluxo de caixa aguenta esse tempo sem entrar no vermelho?
                </p>
              </div>

              <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                <span className="text-lg font-black text-cyan-300 block">3. Com quantos filhotes?</span>
                <p className="text-xs text-slate-200 mt-1">
                  Qual é a margem multiplicadora e o impacto real gerado para as 3 famílias?
                </p>
              </div>
            </div>
          </div>

          {/* Fluxo Cíclico de 30, 90 e 180 Dias (Página 16) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              O Fluxo é Cíclico, Não Linear
            </h3>
            <p className="text-xs text-slate-500">
              "O empresário que chegou com gargalo financeiro hoje pode ter gargalo de pessoas em 90 dias. O Radar é o instrumento de navegação."
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div
                onClick={() => setActiveCycle('30_dias')}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  activeCycle === '30_dias'
                    ? 'border-indigo-600 bg-indigo-50/80 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <span className="text-xl font-black text-indigo-700 block">30 dias</span>
                <strong className="text-slate-900 block text-sm mt-1">Reaplicar o Radar 8D</strong>
                <p className="text-xs text-slate-600 mt-1">
                  Medir evolução por dimensão e conferir se o gargalo primário começou a se mover.
                </p>
              </div>

              <div
                onClick={() => setActiveCycle('90_dias')}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  activeCycle === '90_dias'
                    ? 'border-indigo-600 bg-indigo-50/80 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <span className="text-xl font-black text-indigo-700 block">90 dias</span>
                <strong className="text-slate-900 block text-sm mt-1">Revisar Prioridade Estratégica</strong>
                <p className="text-xs text-slate-600 mt-1">
                  O gargalo pode ter mudado de Finanças para Vendas ou Processos.
                </p>
              </div>

              <div
                onClick={() => setActiveCycle('6_meses')}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  activeCycle === '6_meses'
                    ? 'border-indigo-600 bg-indigo-50/80 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <span className="text-xl font-black text-indigo-700 block">6 meses</span>
                <strong className="text-slate-900 block text-sm mt-1">Revisão de Identidade & Propósito</strong>
                <p className="text-xs text-slate-600 mt-1">
                  Revisão completa: o negócio ainda serve fielmente às 3 famílias?
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* A PERGUNTA DE ENCERRAMENTO DE QUALQUER SESSÃO (Página 17) */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl space-y-6">
        <div className="border-b border-white/10 pb-4">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
            A Pergunta de Encerramento do Método GERAR
          </span>
          <h2 className="text-xl sm:text-2xl font-black mt-1 text-white">
            "Se você saísse daqui agora e fizesse UMA coisa nos próximos 3 dias — qual seria? E o que impede você de fazer isso hoje?"
          </h2>
        </div>

        {savedCommitmentMsg && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-400 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Compromisso de 3 dias registrado no seu plano de ação!</span>
          </div>
        )}

        <form onSubmit={handleSaveCommitment} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                A UMA coisa que farei nos próximos 3 dias: *
              </label>
              <textarea
                rows={3}
                value={tempOneThing}
                onChange={(e) => setTempOneThing(e.target.value)}
                placeholder="Ex: Abrir a conta jurídica e ligar para renegociar o cartão com o gerente..."
                className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                E o que impede você de fazer isso hoje?
              </label>
              <textarea
                rows={3}
                value={tempObstacle}
                onChange={(e) => setTempObstacle(e.target.value)}
                placeholder="Ex: O medo do confronto ou a procrastinação..."
                className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleThreeDaysCompleted}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  threeDaysCommitment.completed
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {threeDaysCommitment.completed
                    ? 'Compromisso Cumprido! (Selo Desbloqueado)'
                    : 'Marcar como Cumprido'}
                </span>
              </button>

              <span className="text-[11px] text-slate-400">
                Prazo: <strong className="text-white">{threeDaysCommitment.dueDate}</strong>
              </span>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all"
            >
              Salvar Meu Compromisso de 3 Dias
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
