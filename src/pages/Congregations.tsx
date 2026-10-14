import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, MapPin, User, Calendar } from 'lucide-react';
import { getCongregations, saveCongregation, deleteCongregation } from '../store';
import { Congregation } from '../types';
import { format, parseISO } from 'date-fns';

export default function Congregations() {
  const [congregations, setCongregations] = useState(getCongregations());
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Congregation | null>(null);

  const emptyCongregation: Omit<Congregation, 'id'> = {
    nome: '',
    cidade: '',
    setor: '',
    pastor: '',
    ativo: true,
    dataInicio: format(new Date(), 'yyyy-MM-dd'),
    dataFim: '',
    endereco: '',
    telefone: '',
    observacoes: '',
  };

  const [form, setForm] = useState(emptyCongregation);

  const handleSave = () => {
    if (!form.nome.trim()) {
      alert('Nome da congregação é obrigatório');
      return;
    }

    const congregation: Congregation = {
      ...form,
      id: editing?.id || uuidv4(),
    };

    saveCongregation(congregation);
    setCongregations(getCongregations());
    setShowForm(false);
    setEditing(null);
    setForm(emptyCongregation);
  };

  const handleEdit = (cong: Congregation) => {
    setEditing(cong);
    setForm(cong);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir esta congregação?')) {
      deleteCongregation(id);
      setCongregations(getCongregations());
    }
  };

  const handleToggleActive = (cong: Congregation) => {
    if (cong.ativo) {
      // Desativando
      const dataFim = prompt('Data de desativação:', format(new Date(), 'yyyy-MM-dd'));
      if (dataFim === null) return;
      
      saveCongregation({
        ...cong,
        ativo: false,
        dataFim: dataFim || format(new Date(), 'yyyy-MM-dd'),
      });
    } else {
      // Reativando
      const dataInicio = prompt('Data de reativação:', format(new Date(), 'yyyy-MM-dd'));
      if (dataInicio === null) return;

      saveCongregation({
        ...cong,
        ativo: true,
        dataInicio: dataInicio || format(new Date(), 'yyyy-MM-dd'),
        dataFim: '',
      });
    }
    setCongregations(getCongregations());
  };

  const activeCount = congregations.filter(c => c.ativo).length;
  const inactiveCount = congregations.filter(c => !c.ativo).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestão de Congregações</h2>
          <p className="text-sm text-slate-500 mt-1">
            {activeCount} ativa(s) • {inactiveCount} inativa(s)
          </p>
        </div>
        <button
          onClick={() => { setForm(emptyCongregation); setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={16} /> Nova Congregação
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total</p>
              <p className="text-2xl font-bold text-slate-800">{congregations.length}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
              <MapPin size={20} className="text-indigo-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Ativas</p>
              <p className="text-2xl font-bold text-emerald-600">{activeCount}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <CheckCircle size={20} className="text-emerald-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Inativas</p>
              <p className="text-2xl font-bold text-red-600">{inactiveCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <XCircle size={20} className="text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Congregations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {congregations.map(cong => (
          <div key={cong.id} className={`bg-white rounded-xl border-2 p-5 transition-all hover:shadow-md ${
            cong.ativo ? 'border-emerald-200' : 'border-red-200 opacity-75'
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-lg">{cong.nome}</h3>
                <p className="text-xs text-slate-500 mt-1">{cong.cidade} • {cong.setor}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                cong.ativo ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>
                {cong.ativo ? 'Ativa' : 'Inativa'}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {cong.pastor && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <User size={14} className="text-slate-400" />
                  <span>{cong.pastor}</span>
                </div>
              )}
              {cong.endereco && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin size={14} className="text-slate-400" />
                  <span className="truncate">{cong.endereco}</span>
                </div>
              )}
              {cong.telefone && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="text-slate-400">📞</span>
                  <span>{cong.telefone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <Calendar size={12} />
                <span>
                  {cong.dataInicio && `Ativa desde ${format(parseISO(cong.dataInicio), 'dd/MM/yyyy')}`}
                  {cong.dataFim && ` • Inativa em ${format(parseISO(cong.dataFim), 'dd/MM/yyyy')}`}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => handleToggleActive(cong)}
                className={`flex-1 flex items-center justify-center gap-1 text-xs py-2 rounded-lg transition-colors ${
                  cong.ativo 
                    ? 'text-red-600 hover:bg-red-50' 
                    : 'text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                {cong.ativo ? <XCircle size={12} /> : <CheckCircle size={12} />}
                {cong.ativo ? 'Desativar' : 'Reativar'}
              </button>
              <button
                onClick={() => handleEdit(cong)}
                className="flex-1 flex items-center justify-center gap-1 text-xs py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <Edit2 size={12} /> Editar
              </button>
              <button
                onClick={() => handleDelete(cong.id)}
                className="flex-1 flex items-center justify-center gap-1 text-xs py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={12} /> Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {congregations.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <MapPin size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Nenhuma congregação cadastrada</p>
          <p className="text-xs text-slate-400 mt-2">Clique em "Nova Congregação" para começar</p>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">
                {editing ? 'Editar Congregação' : 'Nova Congregação'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <XCircle size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Nome da Congregação *</label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={e => setForm({...form, nome: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                  placeholder="Ex: Congregação Central"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Cidade</label>
                  <input
                    type="text"
                    value={form.cidade}
                    onChange={e => setForm({...form, cidade: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                    placeholder="Ex: Jacuí-MG"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Setor</label>
                  <input
                    type="text"
                    value={form.setor}
                    onChange={e => setForm({...form, setor: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                    placeholder="Ex: Setor 1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Pastor Responsável</label>
                <input
                  type="text"
                  value={form.pastor}
                  onChange={e => setForm({...form, pastor: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                  placeholder="Ex: Pr. João Silva"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Endereço</label>
                <input
                  type="text"
                  value={form.endereco}
                  onChange={e => setForm({...form, endereco: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                  placeholder="Ex: Rua Principal, 123"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Telefone</label>
                <input
                  type="text"
                  value={form.telefone}
                  onChange={e => setForm({...form, telefone: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                  placeholder="Ex: (35) 3333-0000"
                />
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
                  <p className="text-xs text-slate-400 mt-1">Deixe vazio se ainda ativa</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Status</label>
                <select
                  value={form.ativo ? 'ativo' : 'inativo'}
                  onChange={e => setForm({...form, ativo: e.target.value === 'ativo'})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                >
                  <option value="ativo">Ativa</option>
                  <option value="inativo">Inativa</option>
                </select>
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
                {editing ? 'Salvar Alterações' : 'Criar Congregação'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
