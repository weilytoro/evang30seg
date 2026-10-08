import React from 'react';
import {
  Split,
  CheckCircle2,
  Lock,
  Unlock,
  ArrowRight,
  ShieldCheck,
  Calendar,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';

interface PfPjStepProps {
  onAdvanceToStep3: () => void;
}

export const PfPjStep: React.FC<PfPjStepProps> = ({ onAdvanceToStep3 }) => {
  const {
    bizPlanMode,
    pfPjCommitments,
    togglePfPjCommitment,
    proLaboreMonthly,
    setProLaboreMonthly,
    proLaborePaymentDay,
    setProLaborePaymentDay,
    pfPjStepCompleted,
  } = useJourney();

  const isAbertura = bizPlanMode === 'abertura';

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6 animate-in fade-in duration-200">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Etapa 2 · Separação Inegociável PF/PJ
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
          A Muralha entre as Finanças da Casa e da Empresa
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          &ldquo;Não existe empresa rica com dono pobre, nem empresa saudável quando a geladeira da
          casa é abastecida direto do caixa do negócio.&rdquo; Para liberar as ferramentas técnicas da
          Etapa 3, assuma os 3 compromissos inegociáveis abaixo.
        </p>
      </div>

      {/* 3 Compromissos Checkboxes */}
      <div className="space-y-3">
        {/* Compromisso 1: Conta Bancária */}
        <label className="p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer select-none bg-slate-50/70 hover:bg-slate-50 border-slate-200">
          <input
            type="checkbox"
            checked={pfPjCommitments.exclusiveAccount}
            onChange={() => togglePfPjCommitment('exclusiveAccount')}
            className="mt-0.5 w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
          />
          <div>
            <span className="text-xs sm:text-sm font-bold text-slate-900 block">
              {isAbertura
                ? 'Compromisso: Vou abrir uma conta bancária PJ exclusiva antes da primeira venda'
                : 'Compromisso: Conta bancária 100% exclusiva para o negócio (nenhum dinheiro pessoal se mistura)'}
            </span>
            <span className="text-xs text-slate-500 mt-0.5 block">
              Recebimentos de clientes caem exclusivamente nesta conta; boletos de casa não são pagos aqui.
            </span>
          </div>
        </label>

        {/* Compromisso 2: Pró-labore Fixo */}
        <label className="p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer select-none bg-slate-50/70 hover:bg-slate-50 border-slate-200">
          <input
            type="checkbox"
            checked={pfPjCommitments.fixedProLabore}
            onChange={() => togglePfPjCommitment('fixedProLabore')}
            className="mt-0.5 w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
          />
          <div>
            <span className="text-xs sm:text-sm font-bold text-slate-900 block">
              Compromisso: Pró-labore fixo pago religiosamente no mesmo dia do mês
            </span>
            <span className="text-xs text-slate-500 mt-0.5 block">
              O empresário é o colaborador mais importante da empresa e deve ter seu salário definido e honrado.
            </span>
          </div>
        </label>

        {/* Compromisso 3: Nenhuma despesa pessoal sem registro */}
        <label className="p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer select-none bg-slate-50/70 hover:bg-slate-50 border-slate-200">
          <input
            type="checkbox"
            checked={pfPjCommitments.noPersonalExpenses}
            onChange={() => togglePfPjCommitment('noPersonalExpenses')}
            className="mt-0.5 w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
          />
          <div>
            <span className="text-xs sm:text-sm font-bold text-slate-900 block">
              Compromisso: Nenhuma despesa pessoal sai da conta da empresa sem registro
            </span>
            <span className="text-xs text-slate-500 mt-0.5 block">
              Se houver uma emergência extrema, o valor é lançado formalmente como antecipação de pró-labore.
            </span>
          </div>
        </label>
      </div>

      {/* Definição de Pró-labore e Dia */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <span>Definição do Pró-labore Mensal</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Valor Mensal do Pró-labore (R$) *
            </label>
            <input
              type="number"
              value={proLaboreMonthly || ''}
              onChange={(e) => setProLaboreMonthly(parseFloat(e.target.value) || 0)}
              placeholder="Ex.: 3500,00"
              className="w-full text-sm font-bold p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Deve cobrir o básico da sua casa e ser coerente com a capacidade da empresa.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Dia do Pagamento (1 a 28) *
            </label>
            <input
              type="number"
              min={1}
              max={28}
              value={proLaborePaymentDay || ''}
              onChange={(e) => {
                const day = parseInt(e.target.value, 10) || 5;
                setProLaborePaymentDay(Math.min(28, Math.max(1, day)));
              }}
              placeholder="Ex.: 5 ou 10"
              className="w-full text-sm font-bold p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Dia fixo em que a transferência da conta PJ para a sua conta PF será realizada.
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Status & Next Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
        <div>
          {pfPjStepCompleted ? (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Etapa 2 concluída com sucesso! A Etapa 3 está liberada.
            </span>
          ) : (
            <span className="text-xs text-amber-700 flex items-center gap-1.5 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              Marque os 3 compromissos e informe um pró-labore maior que zero para liberar a Etapa 3.
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={!pfPjStepCompleted}
          onClick={onAdvanceToStep3}
          className={`px-6 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs ${
            pfPjStepCompleted
              ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
          }`}
        >
          {pfPjStepCompleted ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          <span>Avançar para Etapa 3: Ferramentas Técnicas</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
