import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Edit2, Trash2, X, Building2, User, Calendar, Users } from 'lucide-react';
import { getChurches, saveChurch, deleteChurch } from '../store';
import { Church, LocalPastor } from '../types';
import { format, parseISO } from 'date-fns';

export default function Churches() {
  const [churches, setChurches] = useState(getChurches());
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Church | null>(null);
  const [showPastorForm, setShowPastorForm] = useState(false);
  const [editingPastor, setEditingPastor] = useState<LocalPastor | null>(null);
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);

  const emptyChurch: Omit<Church, 'id' | 'createdAt'> = {
    nome: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    email: '',
    pastorPresidente: '',
    tesoureiro: '',
    regiao: '',
    cidade: '',
    setor: '',
    ativo: true,
    localPastors: [],
  };

  const [form, setForm] = useState(emptyChurch);

  const emptyPastor: Omit<LocalPastor, 'id'> = {
    nome: '',
    dataInicio: format(new Date(), 'yyyy-MM-dd'),
    dataFim: '',
    ativo: true,
    observacoes: '',
  };

  const [pastorForm, setPastorForm] = useState(emptyPastor);

  const handleSave = () => {
    if (!form.nome.trim()) {
      alert('Nome da igreja é obrigatório');
      return;
    }

    const church: Church = {
      ...form,
      id: editing?.id || uuidv4(),
      createdAt: editing?.createdAt || new Date().toISOString(),
    };

    saveChurch(church);
    setChurches(getChurches());
    setShowForm(false);
    setEditing(null);
    setForm(emptyChurch);
  };

  const handleEdit = (church: Church) => {
    setEditing(church);
    setForm(church);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir esta igreja?')) {
      deleteChurch(id);
      setChurches(getChurches());
    }
  };

  const handleToggleActive = (church: Church) => {
    saveChurch({ ...church, ativo: !church.ativo });
    setChurches(getChurches());
  };

  const handleAddPastor = (church: Church) => {
    setSelectedChurch(church);
    setPastorForm(emptyPastor);
    setEditingPastor(null);
    setShowPastorForm(true);
  };

  const handleEditPastor = (church: Church, pastor: LocalPastor) => {
    setSelectedChurch(church);
    setEditingPastor(pastor);
    setPastorForm(pastor);
    setShowPastorForm(true);
  };

  const handleSavePastor = () => {
    if (!pastorForm.nome.trim()) {
      alert('Nome do pastor é obrigatório');
      return;
    }

    if (!selectedChurch) return;

    const pastor: LocalPastor = {
      ...pastorForm,
      id: editingPastor?.id || uuidv4(),
    };

    const localPastors = selectedChurch.localPastors || [];
    
    if (editingPastor) {
      // Editando pastor existente
      const idx = localPastors.findIndex(p => p.id === pastor.id);
      if (idx >= 0) {
        localPastors[idx] = pastor;
      }
    } else {
      // Adicionando novo pastor
      localPastors.push(pastor);
    }

    const updatedChurch: Church = {
      ...selectedChurch,
      localPastors,
    };

    saveChurch(updatedChurch);
    setChurches(getChurches());
    setShowPastorForm(false);
    setEditingPastor(null);
    setSelectedChurch(null);
    setPastorForm(emptyPastor);
  };

  const handleDeletePastor = (church: Church, pastorId: string) => {
    if (!confirm('Deseja realmente excluir este pastor?')) return;

    const localPastors = (church.localPastors || []).filter(p => p.id !== pastorId);
    const updatedChurch: Church = { ...church, localPastors };
    
    saveChurch(updatedChurch);
    setChurches(getChurches());
  };

  const handleTogglePastorActive = (church: Church, pastor: LocalPastor) => {
    if (pastor.ativo) {
      // Desativando - pedir data de fim
      const dataFim = prompt('Data de fim da vigência:', format(new Date(), 'yyyy-MM-dd'));
      if (dataFim === null) return;

      const localPastors = (church.localPastors || []).map(p => 
        p.id === pastor.id ? { ...p, ativo: false, dataFim: dataFim || format(new Date(), 'yyyy-MM-dd') } : p
      );
      const updatedChurch: Church = { ...church, localPastors };
      saveChurch(updatedChurch);
    } else {
      // Reativando - pedir data de início
      const dataInicio = prompt('Data de início da vigência:', format(new Date(), 'yyyy-MM-dd'));
      if (dataInicio === null) return;

      const localPastors = (church.localPastors || []).map(p => 
        p.id === pastor.id ? { ...p, ativo: true, dataInicio: dataInicio || format(new Date(), 'yyyy-MM-dd'), dataFim: '' } : p
      );
      const updatedChurch: Church = { ...church, localPastors };
      saveChurch(updatedChurch);
    }
    setChurches(getChurches());
  };

  const getActivePastor = (church: Church): LocalPastor | null => {
    const pastors = church.localPastors || [];
    return pastors.find(p => p.ativo) || null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Perfis de Igrejas</h2>
          <p className="text-sm text-slate-500 mt-1">
            Gerencie os perfis de igrejas e pastores locais
          </p>
        </div>
        <button
          onClick={() => { setForm(emptyChurch); setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={16} /> Nova Igreja
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {churches.map(church => {
          const activePastor = getActivePastor(church);
          
          return (
            <div key={church.id} className={`bg-white rounded-xl border-2 p-5 transition-all hover:shadow-md ${
              church.ativo ? 'border-emerald-200' : 'border-red-200 opacity-75'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-lg">{church.nome}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {church.cidade} {church.setor && `• ${church.setor}`}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  church.ativo ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {church.ativo ? 'Ativa' : 'Inativa'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {church.pastorPresidente && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <User size={14} className="text-slate-400" />
                    <span>{church.pastorPresidente}</span>
                  </div>
                )}
                {activePastor && (
                  <div className="flex items-center gap-2 text-sm text-indigo-600 bg-indigo-50 p-2 rounded-lg">
                    <Users size={14} />
                    <div className="flex-1">
                      <p className="font-medium">{activePastor.nome}</p>
                      <p className="text-xs text-indigo-500">
                        Desde {format(parseISO(activePastor.dataInicio), 'dd/MM/yyyy')}
                        {activePastor.dataFim && ` até ${format(parseISO(activePastor.dataFim), 'dd/MM/yyyy')}`}
                      </p>
                    </div>
                  </div>
                )}
                {church.cnpj && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>CNPJ: {church.cnpj}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleAddPastor(church)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors"
                >
                  <Plus size={14} /> Gerenciar Pastores Locais
                </button>

                <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleToggleActive(church)}
                    className={`flex-1 flex items-center justify-center gap-1 text-xs py-2 rounded-lg transition-colors ${
                      church.ativo 
                        ? 'text-red-600 hover:bg-red-50' 
                        : 'text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    {church.ativo ? 'Desativar' : 'Ativar'}
                  </button>
                  <button
                    onClick={() => handleEdit(church)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={12} /> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(church.id)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={12} /> Excluir
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {churches.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Nenhuma igreja cadastrada</p>
          <p className="text-xs text-slate-400 mt-2">Clique em "Nova Igreja" para começar</p>
        </div>
      )}

      {/* Modal de Igreja */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">
                {editing ? 'Editar Igreja' : 'Nova Igreja'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Nome da Igreja *</label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={e => setForm({...form, nome: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                  placeholder="Ex: IEAD Min Santos"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">CNPJ</label>
                  <input
                    type="text"
                    value={form.cnpj}
                    onChange={e => setForm({...form, cnpj: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                    placeholder="00.000.000/0000-00"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Telefone</label>
                  <input
                    type="text"
                    value={form.telefone}
                    onChange={e => setForm({...form, telefone: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                    placeholder="(00) 0000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Endereço</label>
                <input
                  type="text"
                  value={form.endereco}
                  onChange={e => setForm({...form, endereco: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                  placeholder="Rua, número, bairro"
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
                <label className="text-sm font-medium text-slate-700 mb-1 block">Região</label>
                <input
                  type="text"
                  value={form.regiao}
                  onChange={e => setForm({...form, regiao: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                  placeholder="Ex: SUL DE MINAS GERAIS"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Pastor Presidente</label>
                <input
                  type="text"
                  value={form.pastorPresidente}
                  onChange={e => setForm({...form, pastorPresidente: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                  placeholder="Ex: Pr. João Silva"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Tesoureiro</label>
                <input
                  type="text"
                  value={form.tesoureiro}
                  onChange={e => setForm({...form, tesoureiro: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                  placeholder="Ex: Maria Santos"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                  placeholder="contato@igreja.com"
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

      {/* Modal de Pastor Local */}
      {showPastorForm && selectedChurch && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={() => setShowPastorForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {editingPastor ? 'Editar Pastor' : 'Novo Pastor Local'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Igreja: <span className="font-medium text-indigo-600">{selectedChurch.nome}</span>
                </p>
              </div>
              <button onClick={() => setShowPastorForm(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Nome do Pastor *</label>
                <input
                  type="text"
                  value={pastorForm.nome}
                  onChange={e => setPastorForm({...pastorForm, nome: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                  placeholder="Ex: Pr. João Silva"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Data de Início *</label>
                  <input
                    type="date"
                    value={pastorForm.dataInicio}
                    onChange={e => setPastorForm({...pastorForm, dataInicio: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Data de Fim</label>
                  <input
                    type="date"
                    value={pastorForm.dataFim}
                    onChange={e => setPastorForm({...pastorForm, dataFim: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                  />
                  <p className="text-xs text-slate-400 mt-1">Vazio = ativo</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Observações</label>
                <textarea
                  value={pastorForm.observacoes}
                  onChange={e => setPastorForm({...pastorForm, observacoes: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                  rows={3}
                  placeholder="Informações adicionais..."
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowPastorForm(false)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePastor}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
              >
                {editingPastor ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
