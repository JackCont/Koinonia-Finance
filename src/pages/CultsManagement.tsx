import { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Search, Edit2, Trash2, X, Calendar, Filter, Eye, ArrowUpDown } from 'lucide-react';
import { getCultos, saveCulto, deleteCulto, getTransactions } from '../store';
import { Culto } from '../types';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function CultsManagement() {
  const [cultos, setCultos] = useState(getCultos());
  const [search, setSearch] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingCulto, setEditingCulto] = useState<Culto | null>(null);
  const [viewingCulto, setViewingCulto] = useState<Culto | null>(null);
  const transactions = getTransactions();

  const emptyCulto: Omit<Culto, 'id' | 'createdAt'> = {
    nome: '',
    data: '',
    tipo: 'Culto',
    observacoes: '',
  };

  const [form, setForm] = useState(emptyCulto);

  // Filtrar e ordenar cultos
  const filteredCultos = useMemo(() => {
    return cultos
      .filter(c => {
        const matchSearch = c.nome.toLowerCase().includes(search.toLowerCase());
        const matchMonth = !filterMonth || c.data.startsWith(filterMonth);
        const matchType = filterType === 'all' || c.tipo === filterType;
        return matchSearch && matchMonth && matchType;
      })
      .sort((a, b) => b.data.localeCompare(a.data)); // Mais recente primeiro
  }, [cultos, search, filterMonth, filterType]);

  // Contar lançamentos vinculados a cada culto
  const getTransactionCount = (cultoId: string) => {
    return transactions.filter(t => t.cultoId === cultoId).length;
  };

  // Calcular valor total dos lançamentos vinculados
  const getTransactionTotal = (cultoId: string) => {
    return transactions
      .filter(t => t.cultoId === cultoId)
      .reduce((sum, t) => sum + t.valor, 0);
  };

  const handleSave = () => {
    if (!form.nome.trim() || !form.data) {
      alert('Nome e data são obrigatórios');
      return;
    }

    if (editingCulto) {
      // Editando culto existente
      const updated: Culto = {
        ...editingCulto,
        ...form,
      };
      saveCulto(updated);
    } else {
      // Criando novo culto
      const newCulto: Culto = {
        id: uuidv4(),
        ...form,
        createdAt: new Date().toISOString(),
      };
      saveCulto(newCulto);
    }

    setCultos(getCultos());
    setShowForm(false);
    setEditingCulto(null);
    setForm(emptyCulto);
  };

  const handleEdit = (culto: Culto) => {
    setEditingCulto(culto);
    setForm({
      nome: culto.nome,
      data: culto.data,
      tipo: culto.tipo,
      observacoes: culto.observacoes || '',
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const transactionCount = getTransactionCount(id);
    
    if (transactionCount > 0) {
      if (!confirm(`Este culto possui ${transactionCount} lançamento(s) vinculado(s). Deseja realmente excluí-lo? Os lançamentos NÃO serão excluídos.`)) {
        return;
      }
    } else {
      if (!confirm('Deseja realmente excluir este culto?')) {
        return;
      }
    }

    deleteCulto(id);
    setCultos(getCultos());
  };

  const handleView = (culto: Culto) => {
    setViewingCulto(culto);
  };

  const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const tipoColors: Record<string, string> = {
    'Culto': 'bg-blue-100 text-blue-700',
    'EBD': 'bg-green-100 text-green-700',
    'Reunião': 'bg-purple-100 text-purple-700',
    'Evento': 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 flex-1 w-full">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar culto..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm"
            />
          </div>
          <input
            type="month"
            value={filterMonth}
            onChange={e => setFilterMonth(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
            title="Filtrar por competência"
          />
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
          >
            <option value="all">Todos os tipos</option>
            <option value="Culto">Culto</option>
            <option value="EBD">EBD</option>
            <option value="Reunião">Reunião</option>
            <option value="Evento">Evento</option>
          </select>
        </div>
        <button
          onClick={() => { setForm(emptyCulto); setEditingCulto(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={16} /> Novo Culto
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-xs text-slate-500 mb-1">Total de Cultos</p>
          <p className="text-2xl font-bold text-slate-800">{filteredCultos.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-xs text-slate-500 mb-1">Lançamentos Vinculados</p>
          <p className="text-2xl font-bold text-indigo-600">
            {filteredCultos.reduce((sum, c) => sum + getTransactionCount(c.id), 0)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-xs text-slate-500 mb-1">Valor Total Vinculado</p>
          <p className="text-2xl font-bold text-emerald-600">
            {formatCurrency(filteredCultos.reduce((sum, c) => sum + getTransactionTotal(c.id), 0))}
          </p>
        </div>
      </div>

      {/* Cults List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Data</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Nome</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Tipo</th>
                <th className="text-center px-4 py-3 font-medium text-slate-600">Lançamentos</th>
                <th className="text-right px-4 py-3 font-medium text-slate-600">Valor Total</th>
                <th className="text-center px-4 py-3 font-medium text-slate-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCultos.map(culto => {
                const transactionCount = getTransactionCount(culto.id);
                const transactionTotal = getTransactionTotal(culto.id);
                
                return (
                  <tr key={culto.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-600">
                      {format(parseISO(culto.data), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">{culto.nome}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${tipoColors[culto.tipo] || 'bg-slate-100 text-slate-600'}`}>
                        {culto.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {transactionCount > 0 ? (
                        <span className="text-indigo-600 font-medium">{transactionCount}</span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {transactionTotal > 0 ? (
                        <span className="text-emerald-600 font-medium">{formatCurrency(transactionTotal)}</span>
                      ) : (
                        <span className="text-slate-400">---</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={() => handleView(culto)} 
                          title="Ver detalhes"
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          onClick={() => handleEdit(culto)} 
                          title="Editar"
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(culto.id)} 
                          title="Excluir"
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredCultos.length === 0 && (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">Nenhum culto encontrado</p>
            <p className="text-xs text-slate-400 mt-2">Clique em "Novo Culto" para criar um culto</p>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">
                {editingCulto ? 'Editar Culto' : 'Novo Culto'}
              </h3>
              <button onClick={() => { setShowForm(false); setEditingCulto(null); setForm(emptyCulto); }} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Nome do Culto *</label>
                <input 
                  type="text" 
                  value={form.nome} 
                  onChange={e => setForm({...form, nome: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" 
                  placeholder="Ex: Culto de Domingo Manhã"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Data *</label>
                  <input 
                    type="date" 
                    value={form.data} 
                    onChange={e => setForm({...form, data: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Tipo</label>
                  <select 
                    value={form.tipo} 
                    onChange={e => setForm({...form, tipo: e.target.value as Culto['tipo']})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none">
                    <option value="Culto">Culto</option>
                    <option value="EBD">EBD</option>
                    <option value="Reunião">Reunião</option>
                    <option value="Evento">Evento</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Observações</label>
                <textarea 
                  value={form.observacoes} 
                  onChange={e => setForm({...form, observacoes: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" 
                  rows={3}
                  placeholder="Informações adicionais sobre o culto..."
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => { setShowForm(false); setEditingCulto(null); setForm(emptyCulto); }} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
                Cancelar
              </button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">
                {editingCulto ? 'Salvar Alterações' : 'Criar Culto'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal View Details */}
      {viewingCulto && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewingCulto(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Detalhes do Culto</h3>
              <button onClick={() => setViewingCulto(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Nome</p>
                  <p className="text-sm font-medium text-slate-800">{viewingCulto.nome}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Data</p>
                  <p className="text-sm font-medium text-slate-800">
                    {format(parseISO(viewingCulto.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Tipo</p>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${tipoColors[viewingCulto.tipo] || 'bg-slate-100 text-slate-600'}`}>
                    {viewingCulto.tipo}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Competência</p>
                  <p className="text-sm font-medium text-slate-800">
                    {format(parseISO(viewingCulto.data + '-01'), 'MMMM/yyyy', { locale: ptBR })}
                  </p>
                </div>
              </div>

              {viewingCulto.observacoes && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Observações</p>
                  <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">{viewingCulto.observacoes}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-slate-800 mb-3">Lançamentos Vinculados</h4>
                {(() => {
                  const cultoTransactions = transactions.filter(t => t.cultoId === viewingCulto.id);
                  
                  if (cultoTransactions.length === 0) {
                    return (
                      <div className="text-center py-8 bg-slate-50 rounded-lg">
                        <p className="text-slate-500 text-sm">Nenhum lançamento vinculado a este culto</p>
                        <p className="text-xs text-slate-400 mt-1">Os lançamentos aparecerão aqui quando forem criados</p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-2">
                      {cultoTransactions.map(t => (
                        <div key={t.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className={`w-2 h-2 rounded-full ${t.tipo === 'ENTRADA' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            <div>
                              <p className="text-sm font-medium text-slate-700">{t.descricao || 'Sem descrição'}</p>
                              <p className="text-xs text-slate-500">{t.categoria}</p>
                            </div>
                          </div>
                          <span className={`text-sm font-semibold ${t.tipo === 'ENTRADA' ? 'text-emerald-600' : 'text-red-600'}`}>
                            {t.tipo === 'ENTRADA' ? '+' : '-'}{formatCurrency(t.valor)}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-3 border-t">
                        <span className="text-sm font-medium text-slate-700">Total de Lançamentos:</span>
                        <span className="text-sm font-bold text-indigo-600">{cultoTransactions.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700">Valor Total:</span>
                        <span className="text-sm font-bold text-emerald-600">
                          {formatCurrency(cultoTransactions.reduce((sum, t) => sum + t.valor, 0))}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => setViewingCulto(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
                Fechar
              </button>
              <button onClick={() => { handleEdit(viewingCulto); setViewingCulto(null); }} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">
                Editar Culto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
