import React, { useState } from 'react';
import {
  ShieldAlert,
  Sparkles,
  PlusCircle,
  CheckCircle2,
  Lock,
  Unlock,
  Users,
  Smile,
  Zap,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useMethodology } from '../../context/MethodologyContext';
import { useToast } from '../../context/ToastContext';
import { BeliefItem } from '../../types/methodology';

export const BeliefsView: React.FC = () => {
  const { beliefs = [], toggleBelief, updateBelief, addCustomBelief, platformMode } = useMethodology();
  const { success, error } = useToast();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newBelief, setNewBelief] = useState('');
  const [newOrigin, setNewOrigin] = useState('');
  const [newEmpowering, setNewEmpowering] = useState('');
  const [newTrigger, setNewTrigger] = useState('');
  const [newRoutine, setNewRoutine] = useState('');
  const [newReward, setNewReward] = useState('');
  const [newSupervisor, setNewSupervisor] = useState('');

  const activeCount = (beliefs || [])?.filter((b) => b?.hasBelief).length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newBelief.trim() || !newEmpowering.trim()) {
        error('Preencha ao menos a crença e a nova crença fortalecedora.');
        return;
      }

      addCustomBelief({
        belief: newBelief.trim(),
        hasBelief: true,
        origin: newOrigin.trim() || 'Experiências passadas',
        empoweringBelief: newEmpowering.trim(),
        trigger: newTrigger.trim() || 'Momentos de ansiedade com dinheiro',
        newRoutine: newRoutine.trim() || 'Afirmação consciente e planejamento',
        reward: newReward.trim() || 'Paz e clareza',
        supervisor: newSupervisor.trim() || 'Mentor / Cônjuge',
      });

      success('Nova crença cadastrada e ressignificada.');
      setNewBelief('');
      setNewOrigin('');
      setNewEmpowering('');
      setNewTrigger('');
      setNewRoutine('');
      setNewReward('');
      setNewSupervisor('');
      setShowAddModal(false);
    } catch (err) {
      error('Falha ao adicionar crença personalizada.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>Capítulo 2 • Quebra de Correntes</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Transformação de Crenças Limitantes
            </h2>
            <p className="text-xs text-slate-700 mt-1 max-w-2xl leading-relaxed">
              {platformMode === 'casa'
                ? '"Pois o Espírito que Deus deu a vocês não faz com que vivam como escravos, mas como filhos." (Romanos 8,15). Identifique as prisões invisíveis e reescreva sua mentalidade.'
                : 'Identifique os bloqueios mentais subconscientes e substitua pensamentos de escassez por padrões de resiliência e clareza financeira.'}
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Adicionar Minha Crença</span>
          </button>
        </div>

        {/* 7 Passos de Mateus Cards */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
            O Método de 7 Passos Aplicado por Mateus:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-extrabold text-indigo-700 block">1. Revisitar</span>
              <span className="text-[10px] text-slate-700">As frases antigas</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-extrabold text-indigo-700 block">2. Origem</span>
              <span className="text-[10px] text-slate-700">De onde vieram?</span>
            </div>
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="font-extrabold text-emerald-800 block">3. Nova Crença</span>
              <span className="text-[10px] text-emerald-800">Verdade nova</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-extrabold text-indigo-700 block">4. Gatilho</span>
              <span className="text-[10px] text-slate-700">O que dispara?</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-extrabold text-indigo-700 block">5. Nova Ação</span>
              <span className="text-[10px] text-slate-700">Rotina positiva</span>
            </div>
            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
              <span className="font-extrabold text-amber-800 block">6. Recompensa</span>
              <span className="text-[10px] text-amber-800">Sensação boa</span>
            </div>
            <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200">
              <span className="font-extrabold text-purple-800 block">7. Supervisor</span>
              <span className="text-[10px] text-purple-800">Apoio semanal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Status Strip */}
      <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-200 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2 font-bold text-indigo-900">
          <Lock className="w-4 h-4 text-indigo-600" />
          <span>
            Você identificou <strong>{activeCount}</strong> crença(s) limitante(s) ativas no seu diagnóstico.
          </span>
        </div>
        <span className="text-xs text-indigo-700 font-medium">
          Marque as crenças que você sente ou já ouviu na vida para ativar a nova rotina fortalecedora!
        </span>
      </div>

      {/* Interactive Beliefs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(beliefs || [])?.map((item) => {
          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all ${
                item.hasBelief
                  ? 'bg-white border-indigo-300 shadow-md ring-1 ring-indigo-500/20'
                  : 'bg-slate-50/70 border-slate-200 opacity-90'
              }`}
            >
              {/* Header with toggle */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => toggleBelief(item.id)}
                    className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                      item.hasBelief
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                    }`}
                    title={item.hasBelief ? 'Identificada como ativa (Clique para desmarcar)' : 'Marcar como presente na sua mente'}
                  >
                    {item.hasBelief ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
                      Crença Limitante
                    </span>
                    <h4 className="text-sm font-black text-slate-900 mt-0.5">
                      "{item.belief}"
                    </h4>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                    item.hasBelief
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.hasBelief ? 'Em Combate' : 'Superada / Neutra'}
                </span>
              </div>

              {/* Origin */}
              <div className="mt-3 text-xs text-slate-700 bg-slate-100/70 p-2.5 rounded-xl border border-slate-200/60">
                <strong className="text-slate-800">Origem: </strong>
                <span>{item.origin}</span>
              </div>

              {/* Empowering belief */}
              <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Nova Crença Fortalecedora
                </span>
                <p className="font-black text-emerald-950 mt-1 text-xs sm:text-sm">
                  "{item.empoweringBelief}"
                </p>
              </div>

              {/* Trigger & Routine & Reward & Supervisor */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" />
                    Gatilho / Deixa:
                  </span>
                  <span className="text-slate-600 text-[10px] block mt-0.5">{item.trigger}</span>
                </div>

                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <Smile className="w-3 h-3 text-emerald-500" />
                    Recompensa:
                  </span>
                  <span className="text-slate-600 text-[10px] block mt-0.5">{item.reward}</span>
                </div>
              </div>

              <div className="mt-2 p-2 bg-slate-50 rounded-lg border border-slate-200 text-[11px]">
                <span className="font-bold text-indigo-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Nova Rotina (Ação Prática):
                </span>
                <span className="text-slate-700 font-medium block mt-0.5">{item.newRoutine}</span>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-purple-600" />
                  <span>Supervisor: <strong className="text-slate-700">{item.supervisor}</strong></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for adding custom belief */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Cadastrar Crença Personalizada
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Crença Limitante (Frase antiga) *
                </label>
                <input
                  type="text"
                  placeholder='Ex: "Não dou conta de guardar", "Quem tem dinheiro é ganancioso"'
                  value={newBelief}
                  onChange={(e) => setNewBelief(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Origem (De onde veio essa ideia?)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Frases de infância, pais, decepção passada..."
                  value={newOrigin}
                  onChange={(e) => setNewOrigin(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nova Crença Fortalecedora *
                </label>
                <input
                  type="text"
                  placeholder='Ex: "O dinheiro é ferramenta para abençoar minha família e viver com honra"'
                  value={newEmpowering}
                  onChange={(e) => setNewEmpowering(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl font-bold text-emerald-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gatilho Mental
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Chegar a fatura"
                    value={newTrigger}
                    onChange={(e) => setNewTrigger(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Recompensa
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Paz e alívio"
                    value={newReward}
                    onChange={(e) => setNewReward(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nova Rotina (Ação prática positiva)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Sentar para revisar o orçamento e agradecer pelo pão de cada dia"
                  value={newRoutine}
                  onChange={(e) => setNewRoutine(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Supervisor (Alguém de confiança para acompanhar)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Esposa, amigo, mentor..."
                  value={newSupervisor}
                  onChange={(e) => setNewSupervisor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Salvar Crença
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
