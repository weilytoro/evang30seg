import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  PlusCircle,
  Trash2,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Crown,
  BookOpen,
  DollarSign,
  Share2,
  HelpCircle,
  AlertTriangle,
  Coins,
} from 'lucide-react';
import { EIGHT_KINGDOM_AREAS } from '../../data/methodologyData';
import { useMethodology } from '../../context/MethodologyContext';
import { useJourney } from '../../context/JourneyContext';
import { useToast } from '../../context/ToastContext';
import { MultiplicationMapItem } from '../../types/methodology';
import { getBrand } from '../../utils/brand';

export const MultiplicationView: React.FC = () => {
  const {
    multiplicationMap = [],
    addMultiplicationItem,
    updateMultiplicationItem,
    deleteMultiplicationItem,
    platformMode,
  } = useMethodology();

  const {
    talentsUnmonetized,
    setTalentsUnmonetized,
    movementEvaluation,
    setMovementEvaluation,
  } = useJourney();

  const { success, error } = useToast();
  const brand = getBrand(platformMode);

  const [showAddModal, setShowAddModal] = useState(false);
  const [resourceType, setResourceType] = useState<any>('Habilidade');
  const [whatIHave, setWhatIHave] = useState('');
  const [incomeIdea, setIncomeIdea] = useState('');
  const [firstAction, setFirstAction] = useState('');
  const [potentialGain, setPotentialGain] = useState('');
  const [priority, setPriority] = useState<'Alta' | 'Média' | 'Baixa'>('Alta');

  const [activeAreaTab, setActiveAreaTab] = useState<number>(4);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!whatIHave.trim() || !incomeIdea.trim()) {
        error('Preencha o recurso que já possui e a ideia de renda.');
        return;
      }

      addMultiplicationItem({
        resourceType,
        whatIHave: whatIHave.trim(),
        incomeIdea: incomeIdea.trim(),
        firstAction7Days: firstAction.trim() || 'Iniciar contato com primeiros clientes',
        potentialMonthlyGain: potentialGain.trim() || 'R$ 200 a R$ 500',
        priority,
        status: 'Não comecei',
      });

      success('Nova oportunidade de renda mapeada com sucesso.');
      setWhatIHave('');
      setIncomeIdea('');
      setFirstAction('');
      setPotentialGain('');
      setShowAddModal(false);
    } catch {
      error('Falha ao salvar oportunidade de renda.');
    }
  };

  // Verdict according to liquidity
  const getVerdict = (liquidity: string) => {
    if (liquidity === 'Não') {
      return {
        style: 'bg-rose-50 border-rose-200 text-rose-900',
        text: 'Se o dinheiro não volta, não é investimento: trate como gasto e decida se ele cabe no orçamento.',
      };
    }
    if (liquidity === 'Incerto') {
      return {
        style: 'bg-amber-50 border-amber-200 text-amber-900',
        text: 'Retorno incerto: só avance com um valor que você pode perder sem comprometer reserva e dívidas.',
      };
    }
    if (liquidity === 'Sim') {
      return {
        style: 'bg-emerald-50 border-emerald-200 text-emerald-900',
        text: 'Liquidez, prazo e retorno respondidos. Compare com a sua reserva e com o custo das dívidas antes de decidir.',
      };
    }
    return null;
  };

  const verdict = getVerdict(movementEvaluation.liquidity);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>Módulo 5 · Multiplique seus Talentos</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Multiplicação de Renda & As 8 Áreas do Trabalho
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
              {brand.isBiblical
                ? 'Na parábola dos talentos (Mateus 25,21), o Senhor elogia quem multiplica o que recebeu. Cortar gastos é o chão; multiplicar o que entra é içar as velas rumo à liberdade.'
                : 'Expanda suas fontes de receita mapeando competências, diversificação estratégica e ativando novas frentes produtivas sem depender de uma única fonte.'}
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Novo Item no Mapa</span>
          </button>
        </div>
      </div>

      {/* Cartão 1: "O que eu sei fazer bem e ainda não monetizei?" */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Coins className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900">
            O que eu sei fazer bem e ainda não monetizei?
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          Muitas vezes, a semente da sua próxima renda já está nas suas mãos: um conhecimento,
          habilidade manual, culinária, facilidade com pessoas ou tecnologia que você faz de graça.
        </p>

        <textarea
          rows={3}
          value={talentsUnmonetized}
          onChange={(e) => setTalentsUnmonetized(e.target.value)}
          placeholder="Ex.: Sei fazer bolos caseiros elogiados / Sei formatar computadores e configurar roteadores / Sei organizar planilhas e rotinas..."
          className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:outline-none bg-slate-50 font-medium"
        />

        {talentsUnmonetized.trim().length >= 3 ? (
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Talento registrado para ativação
          </span>
        ) : (
          <span className="text-[11px] text-slate-400">
            Preencha este campo para cumprir o critério do Módulo 5.
          </span>
        )}
      </div>

      {/* Cartão 2: "3 perguntas antes de qualquer movimentação" */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <div>
            <h2 className="text-base font-bold text-slate-900">
              3 Perguntas antes de Qualquer Movimentação Financeira
            </h2>
            <p className="text-xs text-slate-500">
              A regra de ouro de Weily Toro: antes de colocar dinheiro em qualquer projeto, compra ou investimento.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Movimentação Avaliada
            </label>
            <input
              type="text"
              value={movementEvaluation.movement}
              onChange={(e) =>
                setMovementEvaluation((prev) => ({ ...prev, movement: e.target.value }))
              }
              placeholder="Ex.: Comprar um curso novo / Entrar numa sociedade / Trocar de carro..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Liquidez */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                (1) Liquidez — O dinheiro vai voltar?
              </label>
              <div className="flex items-center gap-1.5">
                {(['Sim', 'Incerto', 'Não'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() =>
                      setMovementEvaluation((prev) => ({ ...prev, liquidity: opt }))
                    }
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      movementEvaluation.liquidity === opt
                        ? opt === 'Sim'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : opt === 'Incerto'
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-rose-600 text-white border-rose-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Prazo */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                (2) Prazo — Quando volta?
              </label>
              <input
                type="text"
                value={movementEvaluation.deadline}
                onChange={(e) =>
                  setMovementEvaluation((prev) => ({ ...prev, deadline: e.target.value }))
                }
                placeholder="Ex.: Em 30 dias / 6 meses..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {/* Retorno */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                (3) Retorno — Com quantos filhotes?
              </label>
              <input
                type="text"
                value={movementEvaluation.returnWithPups}
                onChange={(e) =>
                  setMovementEvaluation((prev) => ({ ...prev, returnWithPups: e.target.value }))
                }
                placeholder="Ex.: +15% de lucro / Dobro do valor..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Veredito */}
          {verdict && (
            <div className={`p-4 rounded-2xl border ${verdict.style} text-xs font-semibold flex items-start gap-2.5 shadow-xs`}>
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong className="block mb-0.5 uppercase tracking-wider text-[10px]">
                  Veredito do Método:
                </strong>
                <span>{verdict.text}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mapa de Multiplicação de Renda (Tabela) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Mapa de Multiplicação de Recursos & Talentos
            </h3>
            <p className="text-xs text-slate-500">
              Mapeie habilidades, tempo ocioso e ferramentas que podem virar novas fontes de receita
            </p>
          </div>
        </div>

        {multiplicationMap.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
            <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 text-slate-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900">
                Nenhum talento ou recurso mapeado ainda
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Comece listando uma habilidade simples que você pode colocar a serviço do próximo.
                Adicione pelo menos uma linha para cumprir o critério de conclusão do Módulo 5.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Adicionar Primeira Oportunidade</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                  <th className="py-2.5 px-3">Tipo</th>
                  <th className="py-2.5 px-3">O Que Eu Já Tenho</th>
                  <th className="py-2.5 px-3">Ideia de Nova Renda</th>
                  <th className="py-2.5 px-3">Primeira Ação (7 Dias)</th>
                  <th className="py-2.5 px-3 text-center">Ganho Estimado</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-center w-20">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {multiplicationMap.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {item.resourceType}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{item.whatIHave}</td>
                    <td className="py-3 px-3 text-emerald-800 font-bold">{item.incomeIdea}</td>
                    <td className="py-3 px-3 text-slate-600">{item.firstAction7Days}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900">
                      {item.potentialMonthlyGain}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          updateMultiplicationItem(item.id, {
                            status: e.target.value as any,
                          })
                        }
                        className="text-[11px] font-bold py-1 px-2 rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="Não comecei">Não comecei</option>
                        <option value="Em andamento">Em andamento</option>
                        <option value="Concluído">Concluído</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => deleteMultiplicationItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Remover item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* As 8 Áreas do Trabalho do Reino */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-bold text-slate-900">
            Inspiração: As 8 Áreas de Trabalho do Reino
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Descubra exemplos bíblicos e práticos para destravar ideias nas mais diversas áreas:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          {EIGHT_KINGDOM_AREAS.map((area) => {
            const isSelected = activeAreaTab === area.id;
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => setActiveAreaTab(area.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="text-[10px] font-bold text-emerald-700 uppercase">
                  Área #{area.id}
                </div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">{area.name}</div>
                {brand.isBiblical && (
                  <div className="text-[10px] italic text-slate-500 mt-1">{area.biblicalRoot}</div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected area details */}
        {(() => {
          const selected = EIGHT_KINGDOM_AREAS.find((a) => a.id === activeAreaTab);
          if (!selected) return null;
          return (
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2 mt-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                  {selected.name}
                </h4>
                {brand.isBiblical && (
                  <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded text-emerald-800 border border-emerald-200">
                    {selected.biblicalRoot}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-700">{selected.description}</p>
              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Exemplos práticos para monetizar:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selected.examples.map((ex, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Modal Add Item */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Novo Recurso / Ideia de Renda</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Recurso</label>
                <select
                  value={resourceType}
                  onChange={(e) => setResourceType(e.target.value as any)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Habilidade">Habilidade / Conhecimento</option>
                  <option value="Hobby">Hobby que pode virar renda</option>
                  <option value="Recurso material">Recurso Material / Ferramenta ociosa</option>
                  <option value="Contato">Rede de Contatos / Conexões</option>
                  <option value="Renda atual">Otimização da Renda Atual</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  O que você já possui? *
                </label>
                <input
                  type="text"
                  value={whatIHave}
                  onChange={(e) => setWhatIHave(e.target.value)}
                  placeholder="Ex.: Sei cozinhar muito bem / Tenho carro parado no sábado..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ideia de Nova Renda *
                </label>
                <input
                  type="text"
                  value={incomeIdea}
                  onChange={(e) => setIncomeIdea(e.target.value)}
                  placeholder="Ex.: Vender bolos sob encomenda para colegas de trabalho..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primeira Ação (7 Dias)
                  </label>
                  <input
                    type="text"
                    value={firstAction}
                    onChange={(e) => setFirstAction(e.target.value)}
                    placeholder="Ex.: Oferecer para 5 pessoas"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ganho Estimado (R$)
                  </label>
                  <input
                    type="text"
                    value={potentialGain}
                    onChange={(e) => setPotentialGain(e.target.value)}
                    placeholder="Ex.: R$ 300 / mês"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-xs text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Salvar Oportunidade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
