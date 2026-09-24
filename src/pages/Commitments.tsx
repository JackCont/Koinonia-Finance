import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, X, Check, AlertCircle, Calendar } from 'lucide-react';
import { getCommitments, saveCommitment, deleteCommitment, getConfig } from '../store';
import { Commitment, CommitmentStatus, TransactionCategory } from '../types';
import { format, parseISO, isPast } from 'date-fns';

export default function Commitments() {
  const [commitments, setCommitments] = useState(getCommitments());
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Commitment | null>(null);
  const config = getConfig();

  const emptyCommitment: Omit<Commitment, 'id'> = {
    descricao: '', valorTotal: 0, valorParcela: 0,
    dataVencimento: format(new Date(), 'yyyy-MM-dd'),
    frequencia: 'MENSAL', status: 'PENDENTE',
    categoria: 'DESPESA_OPERACIONAL', observacoes: '',
  };

  const [form, setForm] = useState(emptyCommitment);

  const handleSave = () => {
    if (!form.descricao.trim() || form.valorTotal <= 0) {
      alert('Descrição e valor são obrigatórios');
      return;
    }
    const commitment: Commitment = {
      ...form,
      id: editing?.id || uuidv4(),
    };
    saveCommitment(commitment);
    setCommitments(getCommitments());
    setShowForm(false);
    setEditing(null);
    setForm(emptyCommitment);
  };

  const handleEdit = (c: Commitment) => {
    setEditing(c);
    setForm(c);
    setShowForm(true);
  };

  const handleToggleStatus = (c: Commitment) => {
    const newStatus: CommitmentStatus = c.status === 'PENDENTE' ? 'PAGO' : 'PENDENTE';
    saveCommitment({ ...c, status: newStatus });
    setCommitments(getCommitments());
  };

  const handleDelete = (id: string) => {
    if (confirm('Remover este compromisso?')) {
      deleteCommitment(id);
      setCommitments(getCommitments());
    }
  };

  const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const statusColors: Record<CommitmentStatus, string> = {
    PENDENTE: 'bg-amber-100 text-amber-700',
    PAGO: 'bg-emerald-100 text-emerald-700',
    CANCELADO: 'bg-red-100 text-red-700',
  };

  const pending = commitments.filter(c => c.status === 'PENDENTE');
  const overdue = pending.filter(c => isPast(parseISO(c.dataVencimento)));
  const paid = commitments.filter(c => c.status === 'PAGO');

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-600" />
            <p className="text-xs text-amber-600 font-medium">Pendentes</p>
          </div>
          <p className="text-lg font-bold text-amber-700 mt-1">{pending.length}</p>
          <p className="text-xs text-amber-600">{formatCurrency(pending.reduce((s, c) => s + c.valorParcela, 0))}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-600" />
            <p className="text-xs text-red-600 font-medium">Vencidos</p>
          </div>
          <p className="text-lg font-bold text-red-700 mt-1">{overdue.length}</p>
          <p className="text-xs text-red-600">{formatCurrency(overdue.reduce((s, c) => s + c.valorParcela, 0))}</p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
          <div className="flex items-center gap-2">
            <Check size={16} className="text-emerald-600" />
            <p className="text-xs text-emerald-600 font-medium">Pagos</p>
          </div>
          <p className="text-lg font-bold text-emerald-700 mt-1">{paid.length}</p>
          <p className="text-xs text-emerald-600">{formatCurrency(paid.reduce((s, c) => s + c.valorParcela, 0))}</p>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Compromissos Financeiros</h3>
        <button onClick={() => { setForm(emptyCommitment); setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
          <Plus size={16} /> Novo Compromisso
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {commitments.sort((a, b) => new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime()).map(c => (
          <div key={c.id} className={`bg-white rounded-xl border p-5 transition-all hover:shadow-md ${
            c.status === 'PAGO' ? 'border-emerald-200 bg-emerald-50/30' : 
            isPast(parseISO(c.dataVencimento)) && c.status === 'PENDENTE' ? 'border-red-200' : 'border-slate-200'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-slate-800">{c.descricao}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[c.status]}`}>
                    {c.status}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {format(parseISO(c.dataVencimento), 'dd/MM/yyyy')}
                  </span>
                  <span>Frequência: {c.frequencia}</span>
                  <span>Parcela: <strong className="text-slate-700">{formatCurrency(c.valorParcela)}</strong></span>
                  <span>Total: {formatCurrency(c.valorTotal)}</span>
                </div>
                {c.observacoes && <p className="mt-1 text-xs text-slate-400">{c.observacoes}</p>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleToggleStatus(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    c.status === 'PAGO' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  }`}>
                  {c.status === 'PAGO' ? 'Desfazer' : 'Marcar Pago'}
                </button>
                <button onClick={() => handleEdit(c)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-600 hover:bg-indigo-50">
                  Editar
                </button>
                <button onClick={() => handleDelete(c.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50">
                  Remover
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {commitments.length === 0 && (
        <div className="text-center py-12">
          <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Nenhum compromisso cadastrado</p>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">{editing ? 'Editar' : 'Novo'} Compromisso</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Descrição *</label>
                <input type="text" value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" placeholder="Ex: Aluguel do templo" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Valor Total</label>
                  <input type="number" step="0.01" value={form.valorTotal || ''} onChange={e => setForm({...form, valorTotal: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Valor Parcela</label>
                  <input type="number" step="0.01" value={form.valorParcela || ''} onChange={e => setForm({...form, valorParcela: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Vencimento</label>
                  <input type="date" value={form.dataVencimento} onChange={e => setForm({...form, dataVencimento: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Frequência</label>
                  <select value={form.frequencia} onChange={e => setForm({...form, frequencia: e.target.value as Commitment['frequencia']})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none">
                    <option value="MENSAL">Mensal</option>
                    <option value="TRIMESTRAL">Trimestral</option>
                    <option value="SEMESTRAL">Semestral</option>
                    <option value="ANUAL">Anual</option>
                    <option value="UNICO">Único</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Categoria</label>
                <select value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value as TransactionCategory})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none">
                  {config.categories.filter(c => c.tipo === 'SAIDA').map(c => (
                    <option key={c.id} value={c.nome}>{c.nome}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Observações</label>
                <textarea value={form.observacoes} onChange={e => setForm({...form, observacoes: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" rows={2} />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">Cancelar</button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
