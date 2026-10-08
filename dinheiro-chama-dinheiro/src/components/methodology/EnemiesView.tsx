import React from 'react';
import {
  Skull,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  Flame,
  Swords,
} from 'lucide-react';
import { useMethodology } from '../../context/MethodologyContext';
import { useJourney } from '../../context/JourneyContext';
import { getBrand } from '../../utils/brand';

export const EnemiesView: React.FC = () => {
  const { enemies, toggleEnemyActive, toggleEnemyAction, updateEnemyCustomValue, platformMode } =
    useMethodology();
  const { weeklyProgress, updateWeeklyProgress, enemiesChecklistConfirmed, setEnemiesChecklistConfirmed } =
    useJourney();

  const brand = getBrand(platformMode);

  const activeEnemiesCount = (enemies || [])?.filter((e) => e?.active).length;
  const inCombatCount = (enemies || [])?.filter((e) => e?.active && e?.actionTaken).length;

  // Evaluation based on page 66 of book
  let statusBadge = {
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    title: 'Hábitos Saudáveis (0 Inimigos Marcados)',
    text: 'Nenhum inimigo marcado presente na sua rotina atual. Mantenha a vigilância semanal.',
  };

  if (activeEnemiesCount === 1) {
    statusBadge = {
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      title: '1 Inimigo Declarado',
      text: 'Você tem um único inimigo declarado. Concentre toda a sua energia nele pelos próximos 30 dias.',
    };
  } else if (activeEnemiesCount >= 2 && activeEnemiesCount <= 4) {
    statusBadge = {
      color: 'bg-amber-100 text-amber-800 border-amber-300',
      title: 'Atenção! (2 a 4 Inimigos Ativos)',
      text: 'Seus hábitos estão comprometendo sua estabilidade financeira. Ative as soluções práticas abaixo.',
    };
  } else if (activeEnemiesCount >= 5) {
    statusBadge = {
      color: 'bg-rose-100 text-rose-800 border-rose-300',
      title: 'Hora de Reconstruir (5 a 7 Inimigos)',
      text: 'Alerta vermelho! É hora de reconstruir sua fundação. Siga as soluções práticas uma de cada vez.',
    };
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-600 text-white flex items-center justify-center shadow-md shadow-rose-600/20">
              <Skull className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-rose-800 tracking-wider">
                Módulo 3 · A Força dos Hábitos
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                Os 7 Inimigos Financeiros Ocultos
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
              Presentes: <strong>{activeEnemiesCount}</strong>
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
              Em combate: <strong>{inCombatCount}</strong>
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 mt-4 leading-relaxed">
          Pequenos vazamentos afundam grandes navios. Identifique honestamente os padrões que
          roubam sua paz financeira e aplique as ações práticas recomendadas para neutralizá-los.
        </p>

        {brand.isBiblical && (
          <div className="mt-4 p-3 bg-slate-50 border-l-4 border-rose-500 rounded-r-xl text-xs text-slate-700 italic">
            &ldquo;As raposinhas é que destroem as vinhas, as nossas vinhas que estão em flor.&rdquo;
            <span className="block mt-0.5 font-bold not-italic text-slate-900">— Cânticos 2,15</span>
          </div>
        )}
      </div>

      {/* Checklist Confirmation Card for Module Completion */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between gap-4">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={enemiesChecklistConfirmed}
            onChange={(e) => setEnemiesChecklistConfirmed(e.target.checked)}
            className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
          />
          <div>
            <span className="text-xs font-bold text-slate-900 block">
              Revisei o checklist dos 7 inimigos e marquei os que estão presentes
            </span>
            <span className="text-[11px] text-slate-500">
              Marque esta confirmação para validar o primeiro critério de conclusão do Módulo 3.
            </span>
          </div>
        </label>
      </div>

      {/* Diagnóstico dos Hábitos (Termômetro) */}
      <div className={`p-5 rounded-2xl border ${statusBadge.color} shadow-xs`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">{statusBadge.title}</h4>
            <p className="text-xs mt-0.5 leading-relaxed">{statusBadge.text}</p>
          </div>
        </div>
      </div>

      {/* Lista Interativa dos 7 Inimigos */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Checklist dos 7 Inimigos</h3>
            <p className="text-xs text-slate-500">
              Marque os inimigos presentes na sua rotina e ative o botão &ldquo;Implementei a Solução&rdquo;.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {(enemies || [])?.map((enemy) => {
            const isEmCombate = enemy.active && enemy.actionTaken;
            const isPresente = enemy.active && !enemy.actionTaken;

            return (
              <div
                key={enemy.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isEmCombate
                    ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                    : isPresente
                    ? 'bg-rose-50/70 border-rose-300 shadow-xs'
                    : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Button to toggle presence + Info */}
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      type="button"
                      onClick={() => toggleEnemyActive(enemy.id)}
                      className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs shrink-0 transition-colors cursor-pointer ${
                        enemy.active
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                      }`}
                      title={
                        enemy.active
                          ? 'Inimigo marcado como Presente (clique para desmarcar)'
                          : 'Clique para marcar este inimigo como Presente'
                      }
                    >
                      {enemy.active ? '✕' : '○'}
                    </button>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-400">#{enemy.id}</span>
                        <h4 className="text-sm font-black text-slate-900">{enemy.name}</h4>

                        {/* Status Neutro, Presente ou Em Combate */}
                        {isEmCombate ? (
                          <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Swords className="w-3 h-3" />
                            Em combate
                          </span>
                        ) : isPresente ? (
                          <span className="text-[10px] font-black bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                            Presente
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                            Não marcado
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{enemy.description}</p>
                    </div>
                  </div>

                  {/* Right: Action checklist box */}
                  <div className="sm:text-right shrink-0 bg-white p-3 rounded-xl border border-slate-200 shadow-xs max-w-sm">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-emerald-800">
                      <input
                        type="checkbox"
                        checked={enemy.actionTaken}
                        onChange={() => toggleEnemyAction(enemy.id)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <span>Implementei a Solução</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-1">{enemy.actionText}</p>
                    {enemy.customLimitOrValue !== undefined && (
                      <input
                        type="text"
                        value={enemy.customLimitOrValue}
                        onChange={(e) => updateEnemyCustomValue(enemy.id, e.target.value)}
                        placeholder="Definir meta / limite..."
                        className="mt-1.5 w-full text-xs px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Acompanhamento Semanal Editável (4 Semanas) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                Acompanhamento Semanal de Vitórias (4 Semanas)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Anote semanalmente qual inimigo você enfrentou, a economia gerada e o aprendizado obtido.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3 rounded-l-lg w-20">Semana</th>
                <th className="py-2.5 px-3 w-1/3">Inimigo Combatido</th>
                <th className="py-2.5 px-3 w-28">Economia (R$)</th>
                <th className="py-2.5 px-3 rounded-r-lg">Observação / Vitória</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {weeklyProgress.map((wp) => (
                <tr key={wp.week} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-black text-slate-700">Semana {wp.week}</td>
                  <td className="py-2.5 px-3">
                    <input
                      type="text"
                      value={wp.enemy}
                      onChange={(e) => updateWeeklyProgress(wp.week, 'enemy', e.target.value)}
                      placeholder="Ex.: Compras por impulso"
                      className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="text"
                      value={wp.saved}
                      onChange={(e) => updateWeeklyProgress(wp.week, 'saved', e.target.value)}
                      placeholder="Ex.: R$ 150,00"
                      className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="text"
                      value={wp.notes}
                      onChange={(e) => updateWeeklyProgress(wp.week, 'notes', e.target.value)}
                      placeholder="Ex.: Esperei 48h e percebi que não precisava..."
                      className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
