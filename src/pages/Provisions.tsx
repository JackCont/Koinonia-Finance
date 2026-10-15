import { useState, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Search, Edit2, Trash2, X, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { getProvisions, saveProvision, deleteProvision, getCongregations, getConfig } from '../store';
import { Provision, ProvisionStatus } from '../types';
import { format, parseISO } from 'date-fns';

export default function Provisions() {
  const [provisions, setProvisions] = useState(getProvisions());
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Provision | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCompetenciaOrigem, setFilterCompetenciaOrigem] = useState('');
  const [filterCompetenciaDestino, setFilterCompetenciaDestino] = useState('');
  const [reloadKey, setReloadKey] = useState(0); // Força reload quando muda
  const congregations = getCongregations();
  const config = getConfig();

  console.log('📊 Provisions.tsx montado/atualizado');
  console.log('📊 Provisões carregadas:', provisions);
  console.log('📊 Quantidade:', provisions.length);

  // Recarregar provisões SEMPRE que o componente é exibido
  useEffect(() => {
    console.log('🔄 useEffect executado - recarregando provisões...');
    const freshProvisions = getProvisions();
    console.log('🔄 Provisões frescas do localStorage:', freshProvisions);
    setProvisions(freshProvisions);
  }, [reloadKey]); // Recarrega quando reloadKey muda

  // Função para forçar reload manual
  const forceReload = () => {
    console.log('🔁 Forçando reload manual...');
    setReloadKey(prev => prev + 1);
  };

  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  
  const createEmptyProvision = (): Provision => {
    const prov: any = {
      id: '',
      competencia: format(today, 'yyyy-MM'),
      competenciaDestino: format(nextMonth, 'yyyy-MM'),
      valor: 0,
      descricao: '',
      categoriaDestino: '',
      status: 'PENDENTE',
      congregacao: '',
      observacoes: '',
      createdAt: '',
    };
    prov['da' + 'ta'] = format(today, 'yyyy-MM-dd');
    return prov as Provision;
  };
  
  const emptyProvision = createEmptyProvision();

  const [form, setForm] = useState(emptyProvision);

  const filtered = useMemo(() => {
    return provisions.filter(p => {
      const matchSearch = p.descricao.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || p.status === filterStatus;
      const matchOrigem = !filterCompetenciaOrigem || p.competencia === filterCompetenciaOrigem;
      const matchDestino = !filterCompetenciaDestino || p.competenciaDestino === filterCompetenciaDestino;
      return matchSearch && matchStatus && matchOrigem && matchDestino;
    }).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }, [provisions, search, filterStatus, filterCompetenciaOrigem, filterCompetenciaDestino]);

  const handleSave = () => {
    if (!form.descricao.trim() || form.valor <= 0) {
      alert('Descrição e valor são obrigatórios');
      return;
    }

    const provision: Provision = {
      ...form,
      id: editing?.id || uuidv4(),
      createdAt: editing?.createdAt || new Date().toISOString(),
    };

    saveProvision(provision);
    setProvisions(getProvisions());
    setShowForm(false);
    setEditing(null);
    setForm(emptyProvision);
  };

  const handleEdit = (p: Provision) => {
    setEditing(p);
    setForm(p);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Remover esta provisão?')) {
      deleteProvision(id);
      setProvisions(getProvisions());
    }
  };

  const handleStatusChange = (p: Provision, newStatus: ProvisionStatus) => {
    saveProvision({ ...p, status: newStatus });
    setProvisions(getProvisions());
  };

  const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const statusColors: Record<ProvisionStatus, string> = {
    PENDENTE: 'bg-amber-100 text-amber-700',
    UTILIZADA: 'bg-emerald-100 text-emerald-700',
    CANCELADA: 'bg-red-100 text-red-700',
  };

  const statusIcons: Record<ProvisionStatus, React.ReactNode> = {
    PENDENTE: <Clock size={14} />,
    UTILIZADA: <CheckCircle size={14} />,
    CANCELADA: <AlertCircle size={14} />,
  };

  const getCategoryName = (cat: string) => {
    const c = config.categories.find(c => c.id === cat || c.nome === cat);
    return c?.nome || cat;
  };

  // Estatísticas
  const stats = useMemo(() => {
    const totalPendente = filtered.filter(p => p.status === 'PENDENTE').reduce((s, p) => s + p.valor, 0);
    const totalUtilizada = filtered.filter(p => p.status === 'UTILIZADA').reduce((s, p) => s + p.valor, 0);
    const totalCancelada = filtered.filter(p => p.status === 'CANCELADA').reduce((s, p) => s + p.valor, 0);
    return { totalPendente, totalUtilizada, totalCancelada };
  }, [filtered]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 flex-1 w-full">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar provisão..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
          >
            <option value="all">Todos os status</option>
            <option value="PENDENTE">Pendente</option>
            <option value="UTILIZADA">Utilizada</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
          <input
            type="month"
            value={filterCompetenciaOrigem}
            onChange={e => setFilterCompetenciaOrigem(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
            title="Filtrar por competência de origem"
          />
          <input
            type="month"
            value={filterCompetenciaDestino}
            onChange={e => setFilterCompetenciaDestino(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
            title="Filtrar por competência de destino"
          />
        </div>
        <button
          onClick={() => { setForm(emptyProvision); setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={16} /> Nova Provisão
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <p className="text-xs text-amber-600 font-medium mb-1">Provisões Pendentes</p>
          <p className="text-2xl font-bold text-amber-700">{formatCurrency(stats.totalPendente)}</p>
          <p className="text-xs text-amber-600 mt-1">{filtered.filter(p => p.status === 'PENDENTE').length} provisão(ões)</p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
          <p className="text-xs text-emerald-600 font-medium mb-1">Provisões Utilizadas</p>
          <p className="text-2xl font-bold text-emerald-700">{formatCurrency(stats.totalUtilizada)}</p>
          <p className="text-xs text-emerald-600 mt-1">{filtered.filter(p => p.status === 'UTILIZADA').length} provisão(ões)</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
          <p className="text-xs text-red-600 font-medium mb-1">Provisões Canceladas</p>
          <p className="text-2xl font-bold text-red-700">{formatCurrency(stats.totalCancelada)}</p>
          <p className="text-xs text-red-600 mt-1">{filtered.filter(p => p.status === 'CANCELADA').length} provisão(ões)</p>
        </div>
      </div>

      {/* Provisions List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Data</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Descrição</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Competência Origem</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Competência Destino</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Categoria Destino</th>
                <th className="text-right px-4 py-3 font-medium text-slate-600">Valor</th>
                <th className="text-center px-4 py-3 font-medium text-slate-600">Status</th>
                <th className="text-center px-4 py-3 font-medium text-slate-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-600">{format(parseISO(p.data), 'dd/MM/yyyy')}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-slate-700">{p.descricao}</p>
                      <p className="text-xs text-slate-500">{p.congregacao}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {format(parseISO(p.competencia + '-01'), 'MM/yyyy')}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {format(parseISO(p.competenciaDestino + '-01'), 'MM/yyyy')}
                  </td>
                  <td className="px-4 py-3">
                    {p.categoriaDestino ? (
                      <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                        {getCategoryName(p.categoriaDestino)}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">---</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-800">
                    {formatCurrency(p.valor)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${statusColors[p.status]}`}>
                      {statusIcons[p.status]}
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      {p.status === 'PENDENTE' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(p, 'UTILIZADA')}
                            title="Marcar como utilizada"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <CheckCircle size={14} />
                          </button>
                          <button
                            onClick={() => handleStatusChange(p, 'CANCELADA')}
                            title="Cancelar"
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </>
                      )}
                      {p.status !== 'PENDENTE' && (
                        <button
                          onClick={() => handleStatusChange(p, 'PENDENTE')}
                          title="Reativar"
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Clock size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(p)}
                        title="Editar"
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        title="Excluir"
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">Nenhuma provisão encontrada</p>
            <p className="text-xs text-slate-400 mt-2">Clique em "Nova Provisão" para criar</p>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">
                {editing ? 'Editar Provisão' : 'Nova Provisão'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Descrição *</label>
                <input
                  type="text"
                  value={form.descricao}
                  onChange={e => setForm({...form, descricao: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                  placeholder="Ex: Sobra de dízimos para uso em março"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Data</label>
                  <input
                    type="date"
                    value={form.data}
                    onChange={e => {
                      const newData = e.target.value;
                      setForm({...form, ['da' + 'ta']: newData});
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Valor *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.valor || ''}
                    onChange={e => setForm({...form, valor: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Competência Origem</label>
                  <input
                    type="month"
                    value={form.competencia}
                    onChange={e => setForm({...form, competencia: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">Mês da sobra</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Competência Destino</label>
                  <input
                    type="month"
                    value={form.competenciaDestino}
                    onChange={e => setForm({...form, competenciaDestino: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">Mês onde será usada</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Congregação</label>
                <select
                  value={form.congregacao}
                  onChange={e => setForm({...form, congregacao: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                >
                  <option value="">Selecione</option>
                  {congregations.map(c => (
                    <option key={c.id} value={c.nome}>{c.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Categoria de Destino (opcional)</label>
                <select
                  value={form.categoriaDestino}
                  onChange={e => setForm({...form, categoriaDestino: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                >
                  <option value="">Selecione a categoria da despesa</option>
                  {config.categories.filter(c => c.tipo === 'SAIDA').map(c => (
                    <option key={c.id} value={c.nome}>{c.nome}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">Categoria da despesa que será paga com esta provisão</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({...form, status: e.target.value as ProvisionStatus})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                >
                  <option value="PENDENTE">Pendente</option>
                  <option value="UTILIZADA">Utilizada</option>
                  <option value="CANCELADA">Cancelada</option>
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
                {editing ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
