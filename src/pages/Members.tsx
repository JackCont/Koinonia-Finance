import { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Search, Edit2, Trash2, X, User, Phone, Mail, MapPin } from 'lucide-react';
import { getMembers, saveMember, deleteMember, getConfig } from '../store';
import { Member, MemberStatus } from '../types';

export default function Members() {
  const [members, setMembers] = useState(getMembers());
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const config = getConfig();

  const filtered = useMemo(() => {
    return members.filter(m => {
      const matchSearch = m.nome.toLowerCase().includes(search.toLowerCase()) ||
        m.cpf.includes(search) || m.telefone.includes(search);
      const matchStatus = filterStatus === 'all' || m.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [members, search, filterStatus]);

  const emptyMember: Member = {
    id: '', nome: '', cpf: '', email: '', telefone: '',
    endereco: '', dataNascimento: '', dataAdmissao: '',
    status: 'ATIVO', ministerios: [], observacoes: '',
  };

  const [form, setForm] = useState<Member>(emptyMember);

  const handleSave = () => {
    if (!form.nome.trim()) { alert('Nome é obrigatório'); return; }
    const member = { ...form, id: form.id || uuidv4() };
    saveMember(member);
    setMembers(getMembers());
    setShowForm(false);
    setEditing(null);
    setForm(emptyMember);
  };

  const handleEdit = (m: Member) => {
    setEditing(m);
    setForm(m);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Remover este membro?')) {
      deleteMember(id);
      setMembers(getMembers());
    }
  };

  const toggleMinisterio = (min: string) => {
    setForm(f => ({
      ...f,
      ministerios: f.ministerios.includes(min)
        ? f.ministerios.filter(m => m !== min)
        : [...f.ministerios, min]
    }));
  };

  const statusColors: Record<MemberStatus, string> = {
    ATIVO: 'bg-emerald-100 text-emerald-700',
    INATIVO: 'bg-slate-100 text-slate-600',
    TRANSFERIDO: 'bg-amber-100 text-amber-700',
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
              placeholder="Buscar por nome, CPF ou telefone..."
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
            <option value="all">Todos</option>
            <option value="ATIVO">Ativos</option>
            <option value="INATIVO">Inativos</option>
            <option value="TRANSFERIDO">Transferidos</option>
          </select>
        </div>
        <button
          onClick={() => { setForm(emptyMember); setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={16} /> Novo Membro
        </button>
      </div>

      {/* Members list */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(m => (
          <div key={m.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User size={18} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{m.nome}</h3>
                  <p className="text-xs text-slate-400">CPF: {m.cpf || '---'}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[m.status]}`}>
                {m.status}
              </span>
            </div>
            
            <div className="mt-3 space-y-1.5">
              {m.telefone && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Phone size={12} /> {m.telefone}
                </div>
              )}
              {m.email && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Mail size={12} /> {m.email}
                </div>
              )}
              {m.endereco && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin size={12} /> {m.endereco}
                </div>
              )}
            </div>

            {m.ministerios.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {m.ministerios.map(min => (
                  <span key={min} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                    {min}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
              <button onClick={() => handleEdit(m)} className="flex-1 flex items-center justify-center gap-1 text-xs py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <Edit2 size={12} /> Editar
              </button>
              <button onClick={() => handleDelete(m.id)} className="flex-1 flex items-center justify-center gap-1 text-xs py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={12} /> Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <User size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Nenhum membro encontrado</p>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">{editing ? 'Editar Membro' : 'Novo Membro'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Nome *</label>
                <input type="text" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">CPF</label>
                  <input type="text" value={form.cpf} onChange={e => setForm({...form, cpf: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none" placeholder="000.000.000-00" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Telefone</label>
                  <input type="text" value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Endereço</label>
                <input type="text" value={form.endereco} onChange={e => setForm({...form, endereco: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Nascimento</label>
                  <input type="date" value={form.dataNascimento} onChange={e => setForm({...form, dataNascimento: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Admissão</label>
                  <input type="date" value={form.dataAdmissao} onChange={e => setForm({...form, dataAdmissao: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value as MemberStatus})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none">
                  <option value="ATIVO">Ativo</option>
                  <option value="INATIVO">Inativo</option>
                  <option value="TRANSFERIDO">Transferido</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Ministérios</label>
                <div className="flex flex-wrap gap-2">
                  {config.ministerios.map(min => (
                    <button key={min} type="button" onClick={() => toggleMinisterio(min)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        form.ministerios.includes(min)
                          ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200'
                      }`}>
                      {min}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Observações</label>
                <textarea value={form.observacoes} onChange={e => setForm({...form, observacoes: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none" rows={2} />
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
