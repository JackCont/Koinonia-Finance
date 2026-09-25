import { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Search, X, ArrowUpRight, ArrowDownRight, RotateCcw, Filter, Edit2 } from 'lucide-react';
import { getTransactions, saveTransaction, deleteTransaction, estornarTransaction, getMembers, getConfig, getCongregations, getCurrentUser, normalizeCategoryName } from '../store';
import { Transaction, TransactionType, TransactionCategory } from '../types';
import { format, parseISO } from 'date-fns';

export default function Transactions() {
  const [transactions, setTransactions] = useState(getTransactions());
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState('');
  const config = getConfig();
  const members = getMembers();
  const currentUser = getCurrentUser();
  const canEdit = currentUser?.role === 'MASTER' || currentUser?.role === 'ADMIN';

  const emptyTransaction: Omit<Transaction, 'id' | 'createdAt'> = {
    data: format(new Date(), 'yyyy-MM-dd'),
    tipo: 'ENTRADA',
    categoria: 'DIZIMO',
    valor: 0,
    descricao: '',
    congregacao: '',
    memberId: '',
    estornada: false,
    competencia: format(new Date(), 'yyyy-MM'),
  };

  const [form, setForm] = useState(emptyTransaction);

  // Resetar filtro de categoria quando mudar o tipo
  const handleTypeChange = (newType: string) => {
    setFilterType(newType);
    setFilterCategory('all'); // Resetar categoria ao mudar tipo
  };

  // Filtrar categorias baseado no tipo selecionado
  const filteredCategories = useMemo(() => {
    if (filterType === 'all') {
      return config.categories;
    }
    return config.categories.filter(c => c.tipo === filterType);
  }, [config.categories, filterType]);

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = t.descricao.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === 'all' || t.tipo === filterType;
      
      // Comparar categoria normalizada
      const transactionCategoryNormalized = normalizeCategoryName(t.categoria);
      const matchCategory = filterCategory === 'all' || transactionCategoryNormalized === filterCategory;
      
      const matchMonth = !filterMonth || t.data.startsWith(filterMonth);
      return matchSearch && matchType && matchCategory && matchMonth;
    }).sort((a, b) => {
      const dateDiff = new Date(b.data).getTime() - new Date(a.data).getTime();
      if (dateDiff !== 0) return dateDiff;
      return a.descricao.localeCompare(b.descricao, 'pt-BR');
    });
  }, [transactions, search, filterType, filterCategory, filterMonth]);

  const handleSave = () => {
    if (!form.descricao.trim() || form.valor <= 0) {
      alert('Descrição e valor são obrigatórios (valor > 0)');
      return;
    }
    
    // Normalizar categoria antes de salvar
    const normalizedCategoria = normalizeCategoryName(form.categoria);
    
    if (editingId) {
      const existing = transactions.find(t => t.id === editingId);
      if (existing) {
        const updated: Transaction = {
          ...existing,
          ...form,
          categoria: normalizedCategoria as TransactionCategory,
        };
        saveTransaction(updated);
      }
    } else {
      const transaction: Transaction = {
        ...form,
        id: uuidv4(),
        categoria: normalizedCategoria as TransactionCategory,
        createdAt: new Date().toISOString(),
      };
      saveTransaction(transaction);
    }
    
    setTransactions(getTransactions());
    setShowForm(false);
    setEditingId(null);
    setForm(emptyTransaction);
  };

  const handleEdit = (t: Transaction) => {
    if (!canEdit) {
      alert('Apenas usuários MASTER ou ADMIN podem editar lançamentos');
      return;
    }
    setForm({
      data: t.data,
      tipo: t.tipo,
      categoria: t.categoria,
      valor: t.valor,
      descricao: t.descricao,
      congregacao: t.congregacao,
      memberId: t.memberId || '',
      estornada: t.estornada,
      competencia: t.competencia || t.data.substring(0, 7),
    });
    setEditingId(t.id);
    setShowForm(true);
  };

  const handleEstorno = (id: string) => {
    const motivo = prompt('Motivo do estorno:');
    if (motivo) {
      estornarTransaction(id, motivo);
      setTransactions(getTransactions());
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Remover este lançamento?')) {
      deleteTransaction(id);
      setTransactions(getTransactions());
    }
  };

  const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const getCategoryName = (cat: string) => {
    const normalized = normalizeCategoryName(cat);
    const c = config.categories.find(c => 
      c.id === normalized || 
      normalizeCategoryName(c.nome) === normalized
    );
    return c?.nome || cat;
  };

  const getMemberName = (id?: string) => {
    if (!id) return '';
    return members.find(m => m.id === id)?.nome || '';
  };

  const getCategoryColor = (cat: string) => {
    const normalized = normalizeCategoryName(cat);
    const c = config.categories.find(c => 
      c.id === normalized || 
      normalizeCategoryName(c.nome) === normalized
    );
    return c?.cor || '#64748b';
  };

  const periodBalance = useMemo(() => {
    const periodTransactions = transactions.filter(t => {
      const matchMonth = !filterMonth || t.data.startsWith(filterMonth);
      return matchMonth && !t.estornada;
    });

    const entradas = periodTransactions
      .filter(t => t.tipo === 'ENTRADA')
      .reduce((sum, t) => sum + t.valor, 0);
    
    const saidas = periodTransactions
      .filter(t => t.tipo === 'SAIDA')
      .reduce((sum, t) => sum + t.valor, 0);

    return {
      entradas,
      saidas,
      saldo: entradas - saidas,
      totalTransacoes: periodTransactions.length
    };
  }, [transactions, filterMonth]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Buscar descrição..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none" />
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={filterType} onChange={e => handleTypeChange(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none">
            <option value="all">Todos os tipos</option>
            <option value="ENTRADA">Entradas</option>
            <option value="SAIDA">Saídas</option>
          </select>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none">
            <option value="all">Todas categorias</option>
            {filteredCategories
              .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
              .map(c => {
                const normalizedCategory = normalizeCategoryName(c.nome);
                return (
                  <option key={c.id} value={normalizedCategory}>{c.nome}</option>
                );
              })}
          </select>
          <input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
        </div>
        <button onClick={() => { setForm(emptyTransaction); setEditingId(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
          <Plus size={16} /> Novo Lançamento
        </button>
      </div>

      {/* Saldo do Período */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-700 font-medium mb-1">Entradas do Período</p>
              <p className="text-xl font-bold text-emerald-800">
                {periodBalance.entradas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
            <ArrowUpRight size={24} className="text-emerald-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-red-700 font-medium mb-1">Saídas do Período</p>
              <p className="text-xl font-bold text-red-800">
                {periodBalance.saidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
            <ArrowDownRight size={24} className="text-red-500" />
          </div>
        </div>
        
        <div className={`bg-gradient-to-br rounded-xl p-4 border ${
          periodBalance.saldo >= 0 
            ? 'from-blue-50 to-blue-100 border-blue-200' 
            : 'from-orange-50 to-orange-100 border-orange-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs font-medium mb-1 ${
                periodBalance.saldo >= 0 ? 'text-blue-700' : 'text-orange-700'
              }`}>Saldo do Período</p>
              <p className={`text-xl font-bold ${
                periodBalance.saldo >= 0 ? 'text-blue-800' : 'text-orange-800'
              }`}>
                {periodBalance.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
            {periodBalance.saldo >= 0 ? (
              <ArrowUpRight size={24} className="text-blue-500" />
            ) : (
              <ArrowDownRight size={24} className="text-orange-500" />
            )}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-700 font-medium mb-1">Total de Lançamentos</p>
              <p className="text-xl font-bold text-slate-800">{periodBalance.totalTransacoes}</p>
            </div>
            <Filter size={24} className="text-slate-500" />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Data</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Descrição</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Categoria</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Membro</th>
                <th className="text-right px-4 py-3 font-medium text-slate-600">Valor</th>
                <th className="text-center px-4 py-3 font-medium text-slate-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(t => (
                <tr key={t.id} className={`hover:bg-slate-50 transition-colors ${t.estornada ? 'opacity-50 line-through' : ''}`}>
                  <td className="px-4 py-3 text-slate-600">{format(parseISO(t.data), 'dd/MM/yyyy')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {t.tipo === 'ENTRADA' ? 
                        <ArrowUpRight size={14} className="text-emerald-500" /> : 
                        <ArrowDownRight size={14} className="text-red-500" />
                      }
                      <span className="text-slate-700">{t.descricao}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full"
                      style={{ backgroundColor: getCategoryColor(t.categoria) + '20', color: getCategoryColor(t.categoria) }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getCategoryColor(t.categoria) }} />
                      {getCategoryName(t.categoria)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{getMemberName(t.memberId) || '---'}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${t.tipo === 'ENTRADA' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {t.tipo === 'ENTRADA' ? '+' : '-'}{formatCurrency(t.valor)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      {canEdit && !t.estornada && (
                        <button onClick={() => handleEdit(t)} title="Editar"
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 size={14} />
                        </button>
                      )}
                      {!t.estornada && (
                        <button onClick={() => handleEstorno(t.id)} title="Estornar"
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                          <RotateCcw size={14} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(t.id)} title="Remover"
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <X size={14} />
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
            <Filter size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">Nenhum lançamento encontrado</p>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">{editingId ? 'Editar Lançamento' : 'Novo Lançamento'}</h3>
              <button onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyTransaction); }} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Tipo</label>
                  <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value as TransactionType})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none">
                    <option value="ENTRADA">Entrada</option>
                    <option value="SAIDA">Saída</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Data</label>
                  <input type="date" value={form.data} onChange={e => setForm({...form, data: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Competência</label>
                  <input type="month" value={form.competencia} onChange={e => setForm({...form, competencia: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Categoria</label>
                <select value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value as TransactionCategory})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none">
                  {config.categories
                    .filter(c => c.tipo === form.tipo)
                    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
                    .map(c => (
                      <option key={c.id} value={c.nome}>{c.nome}</option>
                    ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Descrição *</label>
                <input type="text" value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none" placeholder="Ex: Dízimo João Silva" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Congregação</label>
                <select value={form.congregacao} onChange={e => setForm({...form, congregacao: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none">
                  <option value="">-- Selecione --</option>
                  {getCongregations().sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')).map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Valor (R$) *</label>
                  <input type="number" step="0.01" min="0" value={form.valor || ''} onChange={e => setForm({...form, valor: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Membro (opcional)</label>
                  <select value={form.memberId} onChange={e => setForm({...form, memberId: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none">
                    <option value="">-- Nenhum --</option>
                    {members.filter(m => m.status === 'ATIVO').sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')).map(m => (
                      <option key={m.id} value={m.id}>{m.nome}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
                Cancelar
              </button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
