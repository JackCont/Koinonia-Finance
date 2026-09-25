import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Save, Plus, X, Trash2, Calendar, Building2, Percent, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getConfig, saveConfig, saveRemittanceRule, deleteRemittanceRule, saveCongregation, deleteCongregation } from '../store';
import { AppConfig, CategoryConfig, RemittanceRule, Congregation } from '../types';

export default function SettingsPage() {
  const [config, setConfig] = useState<AppConfig>(getConfig());
  const [saved, setSaved] = useState(false);
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [showCongForm, setShowCongForm] = useState(false);

  const handleSave = () => {
    saveConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Remittance rules
  const emptyRule: Omit<RemittanceRule, 'id' | 'createdAt'> = {
    percentual: 20, dataInicio: '', dataFim: '', descricao: '',
  };
  const [ruleForm, setRuleForm] = useState(emptyRule);

  const handleSaveRule = () => {
    if (!ruleForm.dataInicio || ruleForm.percentual < 0) {
      alert('Data de início e percentual são obrigatórios');
      return;
    }
    const rule: RemittanceRule = {
      ...ruleForm,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    saveRemittanceRule(rule);
    setConfig(getConfig());
    setShowRuleForm(false);
    setRuleForm(emptyRule);
  };

  // Congregations
  const emptyCong: Omit<Congregation, 'id'> = {
    nome: '', cidade: '', setor: '', pastor: '', ativo: true,
  };
  const [congForm, setCongForm] = useState(emptyCong);

  const handleSaveCong = () => {
    if (!congForm.nome.trim()) {
      alert('Nome da congregação é obrigatório');
      return;
    }
    const cong: Congregation = { ...congForm, id: uuidv4() };
    saveCongregation(cong);
    setConfig(getConfig());
    setShowCongForm(false);
    setCongForm(emptyCong);
  };

  const addCategory = () => {
    const newCat: CategoryConfig = {
      id: Date.now().toString(), nome: 'Nova Categoria', tipo: 'ENTRADA', cor: '#6366f1',
    };
    setConfig({ ...config, categories: [...config.categories, newCat] });
  };

  const updateCategory = (id: string, updates: Partial<CategoryConfig>) => {
    setConfig({ ...config, categories: config.categories.map(c => c.id === id ? { ...c, ...updates } : c) });
  };

  const deleteCategory = (id: string) => {
    setConfig({ ...config, categories: config.categories.filter(c => c.id !== id) });
  };

  const addMinisterio = () => {
    const nome = prompt('Nome do ministério:');
    if (nome && !config.ministerios.includes(nome)) {
      setConfig({ ...config, ministerios: [...config.ministerios, nome] });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Church info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Dados da Igreja / Região</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Nome da Igreja</label>
            <input type="text" value={config.nomeIgreja} onChange={e => setConfig({...config, nomeIgreja: e.target.value})}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">CNPJ</label>
            <input type="text" value={config.cnpj} onChange={e => setConfig({...config, cnpj: e.target.value})}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Região</label>
            <input type="text" value={config.regiao} onChange={e => setConfig({...config, regiao: e.target.value})}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" placeholder="Ex: SUL DE MINAS GERAIS" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Cidade</label>
            <input type="text" value={config.cidade} onChange={e => setConfig({...config, cidade: e.target.value})}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" placeholder="Ex: JACUÍ-MG" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Setor</label>
            <input type="text" value={config.setor} onChange={e => setConfig({...config, setor: e.target.value})}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Pastor Presidente</label>
            <input type="text" value={config.pastorPresidente} onChange={e => setConfig({...config, pastorPresidente: e.target.value})}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-700 mb-1 block">Endereço</label>
            <input type="text" value={config.endereco} onChange={e => setConfig({...config, endereco: e.target.value})}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Tesoureiro(a)</label>
            <input type="text" value={config.tesoureiro} onChange={e => setConfig({...config, tesoureiro: e.target.value})}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
          </div>
        </div>
      </div>

      {/* Remittance Rules */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Percent size={18} /> Regras de Remessa por Período
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Configure percentuais diferentes para períodos específicos. Se "Data Fim" estiver vazio, a regra permanece vigente até nova alteração.
            </p>
          </div>
          <button onClick={() => { setRuleForm(emptyRule); setShowRuleForm(true); }}
            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium px-3 py-2 bg-indigo-50 rounded-lg">
            <Plus size={14} /> Nova Regra
          </button>
        </div>

        <div className="space-y-2">
          {(config.remittanceRules || []).sort((a, b) => b.dataInicio.localeCompare(a.dataInicio)).map(rule => (
            <div key={rule.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2 text-sm">
                <div>
                  <span className="text-xs text-slate-400">Percentual</span>
                  <p className="font-bold text-indigo-700">{rule.percentual}%</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Início</span>
                  <p className="text-slate-700">{rule.dataInicio ? new Date(rule.dataInicio + 'T12:00:00').toLocaleDateString('pt-BR') : '---'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Fim</span>
                  <p className="text-slate-700">{rule.dataFim ? new Date(rule.dataFim + 'T12:00:00').toLocaleDateString('pt-BR') : 'Vigente ∞'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Descrição</span>
                  <p className="text-slate-700 truncate">{rule.descricao || '---'}</p>
                </div>
              </div>
              <button onClick={() => { deleteRemittanceRule(rule.id); setConfig(getConfig()); }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>

        {showRuleForm && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <h4 className="text-sm font-medium text-indigo-800 mb-3">Nova Regra de Remessa</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Percentual (%)</label>
                <input type="number" step="0.1" min="0" max="100" value={ruleForm.percentual}
                  onChange={e => setRuleForm({...ruleForm, percentual: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Descrição</label>
                <input type="text" value={ruleForm.descricao} onChange={e => setRuleForm({...ruleForm, descricao: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-400 outline-none" placeholder="Ex: Redução temporária" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Data Início *</label>
                <input type="date" value={ruleForm.dataInicio} onChange={e => setRuleForm({...ruleForm, dataInicio: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Data Fim (vazio = vigente)</label>
                <input type="date" value={ruleForm.dataFim} onChange={e => setRuleForm({...ruleForm, dataFim: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => setShowRuleForm(false)} className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">Cancelar</button>
              <button onClick={handleSaveRule} className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Salvar Regra</button>
            </div>
          </div>
        )}
      </div>

      {/* Congregations */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Building2 size={18} /> Congregações
            </h3>
            <p className="text-xs text-slate-500 mt-1">Cadastre as congregações para segmentar lançamentos e relatórios</p>
          </div>
          <button onClick={() => { setCongForm(emptyCong); setShowCongForm(true); }}
            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium px-3 py-2 bg-indigo-50 rounded-lg">
            <Plus size={14} /> Nova Congregação
          </button>
        </div>

        <div className="space-y-2">
          {(config.congregacoes || []).map(cong => (
            <div key={cong.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                <div>
                  <span className="text-xs text-slate-400">Nome</span>
                  <p className="font-medium text-slate-700">{cong.nome}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Cidade</span>
                  <p className="text-slate-700">{cong.cidade || '---'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Pastor</span>
                  <p className="text-slate-700">{cong.pastor || '---'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Setor</span>
                  <p className="text-slate-700">{cong.setor || '---'}</p>
                </div>
              </div>
              <button onClick={() => { deleteCongregation(cong.id); setConfig(getConfig()); }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
            </div>
          ))}
          {(!config.congregacoes || config.congregacoes.length === 0) && (
            <p className="text-sm text-slate-400 text-center py-4">Nenhuma congregação cadastrada</p>
          )}
        </div>

        {showCongForm && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <h4 className="text-sm font-medium text-indigo-800 mb-3">Nova Congregação</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Nome *</label>
                <input type="text" value={congForm.nome} onChange={e => setCongForm({...congForm, nome: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-400 outline-none" placeholder="Ex: JACUÍ-MG" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Cidade</label>
                <input type="text" value={congForm.cidade} onChange={e => setCongForm({...congForm, cidade: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Pastor</label>
                <input type="text" value={congForm.pastor} onChange={e => setCongForm({...congForm, pastor: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Setor</label>
                <input type="text" value={congForm.setor} onChange={e => setCongForm({...congForm, setor: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => setShowCongForm(false)} className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">Cancelar</button>
              <button onClick={handleSaveCong} className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Salvar</button>
            </div>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Categorias Financeiras</h3>
          <button onClick={addCategory} className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            <Plus size={14} /> Adicionar
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Categorias de Entrada */}
          <div>
            <h4 className="text-sm font-semibold text-emerald-700 mb-3 flex items-center gap-2">
              <ArrowUpRight size={16} /> Categorias de Entrada
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {config.categories
                .filter(cat => cat.tipo === 'ENTRADA')
                .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
                .map(cat => (
                  <div key={cat.id} className="flex items-center gap-3 p-2 bg-emerald-50 rounded-lg">
                    <input type="color" value={cat.cor} onChange={e => updateCategory(cat.id, { cor: e.target.value })}
                      className="w-7 h-7 rounded border-0 cursor-pointer" />
                    <input type="text" value={cat.nome} onChange={e => updateCategory(cat.id, { nome: e.target.value })}
                      className="flex-1 px-2 py-1.5 rounded border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
                    <button onClick={() => deleteCategory(cat.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Categorias de Saída */}
          <div>
            <h4 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
              <ArrowDownRight size={16} /> Categorias de Saída
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {config.categories
                .filter(cat => cat.tipo === 'SAIDA')
                .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
                .map(cat => (
                  <div key={cat.id} className="flex items-center gap-3 p-2 bg-red-50 rounded-lg">
                    <input type="color" value={cat.cor} onChange={e => updateCategory(cat.id, { cor: e.target.value })}
                      className="w-7 h-7 rounded border-0 cursor-pointer" />
                    <input type="text" value={cat.nome} onChange={e => updateCategory(cat.id, { nome: e.target.value })}
                      className="flex-1 px-2 py-1.5 rounded border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
                    <button onClick={() => deleteCategory(cat.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ministerios */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Ministérios</h3>
          <button onClick={addMinisterio} className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            <Plus size={14} /> Adicionar
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {config.ministerios
            .sort((a, b) => a.localeCompare(b, 'pt-BR'))
            .map(min => (
              <span key={min} className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                {min}
                <button onClick={() => setConfig({...config, ministerios: config.ministerios.filter(m => m !== min)})} className="ml-1 hover:text-red-600">
                  <X size={12} />
                </button>
              </span>
            ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 shadow-sm">
          <Save size={16} /> Salvar Configurações
        </button>
        {saved && <span className="text-sm text-emerald-600 font-medium">✓ Salvo com sucesso!</span>}
      </div>
    </div>
  );
}
