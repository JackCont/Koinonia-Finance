import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, X, Edit2, Trash2, Shield, UserCheck, UserX, Key } from 'lucide-react';
import { getUsers, saveUser, deleteUser, hashPassword, getCongregations } from '../store';
import { User, UserRole } from '../types';

export default function AdminUsers() {
  const [users, setUsers] = useState(getUsers());
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const congregations = getCongregations();

  const emptyUser = {
    username: '', password: '', nome: '', role: 'TESOURARIA' as UserRole,
    ativo: true, congregacao: '',
  };
  const [form, setForm] = useState(emptyUser);

  const handleSave = () => {
    if (!form.username.trim() || !form.nome.trim()) {
      alert('Usuário e nome são obrigatórios');
      return;
    }
    if (!editing && !form.password) {
      alert('Senha é obrigatória para novos usuários');
      return;
    }
    // Check duplicate username
    const existing = users.find(u => u.username === form.username && u.id !== editing?.id);
    if (existing) {
      alert('Já existe um usuário com este nome');
      return;
    }

    const user: User = {
      id: editing?.id || uuidv4(),
      username: form.username,
      passwordHash: form.password ? hashPassword(form.password) : editing!.passwordHash,
      nome: form.nome,
      role: form.role,
      ativo: form.ativo,
      congregacao: form.congregacao,
      createdAt: editing?.createdAt || new Date().toISOString(),
    };
    saveUser(user);
    setUsers(getUsers());
    setShowForm(false);
    setEditing(null);
    setForm(emptyUser);
  };

  const handleEdit = (u: User) => {
    setEditing(u);
    setForm({ username: u.username, password: '', nome: u.nome, role: u.role, ativo: u.ativo, congregacao: u.congregacao });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (id === 'master-001') { alert('Não é possível remover o usuário master.'); return; }
    if (confirm('Remover este usuário?')) {
      deleteUser(id);
      setUsers(getUsers());
    }
  };

  const handleToggleActive = (u: User) => {
    saveUser({ ...u, ativo: !u.ativo });
    setUsers(getUsers());
  };

  const roleColors: Record<UserRole, string> = {
    MASTER: 'bg-red-100 text-red-700 border-red-200',
    ADMIN: 'bg-purple-100 text-purple-700 border-purple-200',
    TESOURARIA: 'bg-blue-100 text-blue-700 border-blue-200',
    CONSELHO: 'bg-amber-100 text-amber-700 border-amber-200',
    CONTADOR: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };

  const roleDescriptions: Record<UserRole, string> = {
    MASTER: 'Acesso total ao sistema, incluindo gestão de usuários',
    ADMIN: 'Acesso amplo, configurações e gestão',
    TESOURARIA: 'Lançamentos, membros, compromissos e relatórios',
    CONSELHO: 'Visualização de relatórios e fluxo de caixa',
    CONTADOR: 'Acesso a relatórios, remessas e fluxo de caixa',
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Gestão de Usuários</h3>
          <p className="text-sm text-slate-500">Cadastre e gerencie os acessos ao sistema</p>
        </div>
        <button onClick={() => { setForm(emptyUser); setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">
          <Plus size={16} /> Novo Usuário
        </button>
      </div>

      {/* Role descriptions */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h4 className="text-sm font-medium text-slate-700 mb-3">Perfis de Acesso</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {Object.entries(roleDescriptions).map(([role, desc]) => (
            <div key={role} className={`px-3 py-2 rounded-lg border text-xs ${roleColors[role as UserRole]}`}>
              <span className="font-semibold">{role}</span>: {desc}
            </div>
          ))}
        </div>
      </div>

      {/* Users list */}
      <div className="space-y-3">
        {users.map(u => (
          <div key={u.id} className={`bg-white rounded-xl border p-5 transition-all hover:shadow-md ${!u.ativo ? 'opacity-60' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${u.ativo ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                  {u.ativo ? <UserCheck size={18} className="text-indigo-600" /> : <UserX size={18} className="text-slate-400" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-800">{u.nome}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${roleColors[u.role]}`}>{u.role}</span>
                    {!u.ativo && <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">Inativo</span>}
                  </div>
                  <p className="text-xs text-slate-500">@{u.username} {u.congregacao && `• ${u.congregacao}`}</p>
                  {u.lastLogin && <p className="text-xs text-slate-400">Último acesso: {new Date(u.lastLogin).toLocaleString('pt-BR')}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleToggleActive(u)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${u.ativo ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`}>
                  {u.ativo ? 'Desativar' : 'Ativar'}
                </button>
                <button onClick={() => handleEdit(u)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 size={14} /></button>
                {u.id !== 'master-001' && (
                  <button onClick={() => handleDelete(u.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">{editing ? 'Editar' : 'Novo'} Usuário</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Nome Completo *</label>
                <input type="text" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Usuário (login) *</label>
                <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value.toLowerCase()})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">
                  Senha {editing ? '(deixe vazio para manter)' : '*'}
                </label>
                <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Perfil de Acesso</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value as UserRole})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none">
                  <option value="TESOURARIA">Tesouraria</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="CONSELHO">Conselho Fiscal</option>
                  <option value="CONTADOR">Contador</option>
                  {editing?.role === 'MASTER' && <option value="MASTER">Master</option>}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Congregação (opcional)</label>
                <select value={form.congregacao} onChange={e => setForm({...form, congregacao: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none">
                  <option value="">-- Todas --</option>
                  {congregations.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.ativo} onChange={e => setForm({...form, ativo: e.target.checked})}
                  className="w-4 h-4 text-indigo-600 rounded" />
                <label className="text-sm text-slate-700">Conta ativa</label>
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
