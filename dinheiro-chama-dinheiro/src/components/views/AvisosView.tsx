import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  PlusCircle,
  Trash2,
  CheckCircle2,
  Calendar,
  Shield,
  Sparkles,
  Flame,
} from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';

export const AvisosView: React.FC = () => {
  const {
    announcements = [],
    addAnnouncement,
    deleteAnnouncement,
    toggleAnnouncementUrgent,
    isAdmin = false,
  } = useJourney();

  const { success, error } = useToast();

  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      error('Preencha o título e a mensagem do aviso.');
      return;
    }

    try {
      addAnnouncement(title, content, isUrgent, 'Administração');
      success(isUrgent ? 'Aviso urgente publicado e fixado na página inicial!' : 'Aviso publicado no mural!');
      setTitle('');
      setContent('');
      setIsUrgent(false);
      setShowAddForm(false);
    } catch {
      error('Erro ao publicar aviso.');
    }
  };

  const urgentCount = announcements.filter((a) => a.isUrgent).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner — Design em Branco e Dourado */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-amber-200/90 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
              <Bell className="w-3.5 h-3.5 text-amber-600" />
              <span>Mural de Comunicados</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Avisos & Comunicados
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Orientações pedagógicas, prazos e direcionamentos prioritários da metodologia.
            </p>
          </div>

          {isAdmin ? (
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{showAddForm ? 'Cancelar' : 'Novo Aviso'}</span>
            </button>
          ) : (
            <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-bold self-start sm:self-auto">
              {urgentCount > 0 ? `${urgentCount} aviso(s) urgente(s)` : 'Sem pendências urgentes'}
            </div>
          )}
        </div>
      </div>

      {/* Formulário de Novo Aviso (Exclusivo para Administrador) */}
      {isAdmin && showAddForm && (
        <div className="bg-white p-6 rounded-3xl border-2 border-amber-300 shadow-md space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 pb-3 border-b border-amber-100">
            <Shield className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-black text-slate-900">
              Publicar Novo Comunicado Oficial (Apenas Administrador)
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                Título do Aviso *
              </label>
              <input
                type="text"
                placeholder="Ex.: Prazo final para preenchimento do Módulo 0"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                Mensagem do Aviso *
              </label>
              <textarea
                rows={3}
                placeholder="Descreva de forma sucinta a orientação ou instrução aos alunos..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            {/* Checkbox Opção Urgente */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 border-amber-300 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-black text-amber-950 block">
                    Classificar como Urgente
                  </span>
                  <span className="text-[11px] text-amber-800 font-medium">
                    Avisos urgentes ganham destaque imediato e aparecem na Página Inicial do sistema.
                  </span>
                </div>
              </label>
              {isUrgent && (
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-500 text-white shadow-xs">
                  Na Página Inicial
                </span>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-xs transition-all cursor-pointer"
              >
                Publicar Comunicado
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Avisos Cadastrados */}
      <div className="space-y-3">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`p-5 sm:p-6 rounded-3xl bg-white border transition-all ${
              ann.isUrgent
                ? 'border-2 border-amber-400 shadow-sm ring-1 ring-amber-400/20'
                : 'border-slate-200/90 shadow-xs'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {ann.isUrgent ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-xs">
                      <Flame className="w-3 h-3 fill-current" />
                      <span>Urgente · Página Inicial</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] uppercase">
                      Informativo
                    </span>
                  )}
                  <span className="text-xs text-slate-500 font-medium">
                    Por {ann.author}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  {ann.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(ann.createdAt)}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium mt-3">
              {ann.content}
            </p>

            {/* Ações Administrativas */}
            {isAdmin && (
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => toggleAnnouncementUrgent(ann.id)}
                  className={`px-3 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                    ann.isUrgent
                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {ann.isUrgent ? 'Remover da Página Inicial' : 'Tornar Urgente'}
                </button>

                <button
                  type="button"
                  onClick={() => deleteAnnouncement(ann.id)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Excluir Aviso"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}

        {announcements.length === 0 && (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
            Nenhum aviso publicado no momento.
          </div>
        )}
      </div>
    </div>
  );
};
