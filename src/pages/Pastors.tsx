import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Edit2, Trash2, User, Calendar, MapPin } from 'lucide-react';
import { getPastors, savePastor, deletePastor, getCongregations } from '../store';
import { Pastor } from '../types';
import { format, parseISO } from 'date-fns';

export default function Pastors() {
  const [pastors, setPastors] = useState(getPastors());
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Pastor | null>(null);
  const congregations = getCongregations();

  const emptyPastor: Omit<Pastor, 'id'> = {
    nome: '',
    congregacao: '',
    dataInicio: format(new Date(), 'yyyy-MM-dd'),
    dataFim: '',
    ativo: true,
    observacoes: '',
  };

  const [form, setForm] = useState(emptyPastor);

  const handleSave = () => {
    if (!form.nome.trim()) {
      alert('Nome do pastor é obrigatório');
      return;
    }

    const pastor: Pastor = {
      ...form,
      id: editing?.id || uuidv4(),
    };

    savePastor(pastor);
    setPastors(getPastors());
    setShowForm(false);
    setEditing(null);
    setForm(emptyPastor);
  };

  const handleEdit = (pastor: Pastor) => {
    setEditing(pastor);
    setForm(pastor);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este pastor?')) {
      deletePastor(id);
      setPastors(getPastors());
    }
  };

  const handleToggleActive = (pastor: Pastor) => {
    if (pastor.ativo) {
      const dataFim = prompt('Data de transferência/fim:', format(new Date(), 'yyyy-MM-dd'));
      if (dataFim === null) return;
      
      savePastor({
        ...pastor,
        ativo: false,
        dataFim: dataFim || format(new Date(), 'yyyy-MM-dd'),
      });
    } else {
      const dataInicio = prompt('Data de retorno/reativação:', format(new Date(), 'yyyy-MM-dd'));
      if (dataInicio === null) return;

      savePastor({
        ...pastor,
        ativo: true,
        dataInicio: dataInicio || format(new Date(), 'yyyy-MM-dd'),
        dataFim: '',
      });
    }
    setPastors(getPastors());
  };

  const activeCount = pastors.filter(p => p.ativo).length;
  const inactiveCount = pastors.filter(p => !p.ativo).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestão de Pastores</h2>
          <p className="text-sm text-slate-500 mt-1">
            {activeCount} ativo(s) • {inactiveCount} inativo(s)/transferido(s)
          </p>
        </div>
        <button
          onClick={() => { setForm(emptyPastor); setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={16} /> Novo Pastor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pastors.map(pastor => (
          <div key={pastor.id} className={`bg-white rounded-xl border-2 p-5 transition-all hover:shadow-md ${
            pastor.ativo ? 'border-emerald-200' : 'border-red-200 opacity-75'
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-lg">{pastor.nome}</h3>
                <p className="text-xs text-slate-500 mt-1">{pastor.congregacao}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                pastor.ativo ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>
                {pastor.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin size={14} className="text-slate-400" />
                <span>{pastor.congregacao || 'Não designado'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <Calendar size={12} />
                <span>
                  {pastor.dataInicio && `Desde ${format(parseISO(pastor.dataInicio), 'dd/MM/yyyy')}`}
                  {pastor.dataFim && ` • Até ${format(parseISO(pastor.dataFim), 'dd/MM/yyyy')}`}
                </span>
              </div>
              {pastor.observacoes && (
                <p className="text-xs text-slate-400 italic">{pastor.observacoes}</p>
              )}
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => handleToggleActive(pastor)}
                className={`flex-1 flex items-center justify-center gap-1 text-xs py-2 rounded-lg transition-colors ${
                  pastor.ativo 
                    ? 'text-red-600 hover:bg-red-50' 
                    : 'text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                {pastor.ativo ? 'Transferir' : 'Reativar'}
              </button>
              <button
                onClick={() => handleEdit(pastor)}
                className="flex-1 flex items-center justify-center gap-1 text-xs py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <Edit2 size={12} /> Editar
              </button>
              <button
                onClick={() => handleDelete(pastor.id)}
                className="flex-1 flex items-center justify-center gap-1 text-xs py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={12} /> Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {pastors.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <User size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Nenhum pastor cadastrado</p>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-6">
              {editing ? 'Editar Pastor' : 'Novo Pastor'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Nome do Pastor *</label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={e => setForm({...form, nome: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                  placeholder="Ex: Pr. João Silva"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Congregação</label>
                <select
                  value={form.congregacao}
                  onChange={e => setForm({...form, congregacao: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                >
                  <option value="">Selecione uma congregação</option>
                  {congregations.filter(c => c.ativo).map(c => (
                    <option key={c.id} value={c.nome}>{c.nome}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Data de Início</label>
                  <input
                    type="date"
                    value={form.dataInicio}
                    onChange={e => setForm({...form, dataInicio: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Data de Fim</label>
                  <input
                    type="date"
                    value={form.dataFim}
                    onChange={e => setForm({...form, dataFim: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                  />
                  <p className="text-xs text-slate-400 mt-1">Vazio = ativo</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Observações</label>
                <textarea
                  value={form.observacoes}
                  onChange={e => setForm({...form, observacoes: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                  rows={3}
                  placeholder="Informações adicionais..."
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
              >
                {editing ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
