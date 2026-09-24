import { useState } from 'react';
import { Save, Plus, X, Trash2 } from 'lucide-react';
import { getConfig, saveConfig } from '../store';
import { AppConfig, CategoryConfig } from '../types';

export default function SettingsPage() {
  const [config, setConfig] = useState<AppConfig>(getConfig());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addCategory = () => {
    const newCat: CategoryConfig = {
      id: Date.now().toString(),
      nome: 'Nova Categoria',
      tipo: 'ENTRADA',
      cor: '#6366f1',
    };
    setConfig({ ...config, categories: [...config.categories, newCat] });
  };

  const updateCategory = (id: string, updates: Partial<CategoryConfig>) => {
    setConfig({
      ...config,
      categories: config.categories.map(c => c.id === id ? { ...c, ...updates } : c)
    });
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

  const removeMinisterio = (min: string) => {
    setConfig({ ...config, ministerios: config.ministerios.filter(m => m !== min) });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Church info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Dados da Igreja</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Nome da Igreja</label>
            <input type="text" value={config.nomeIgreja} onChange={e => setConfig({...config, nomeIgreja: e.target.value})}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">CNPJ</label>
            <input type="text" value={config.cnpj} onChange={e => setConfig({...config, cnpj: e.target.value})}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" placeholder="00.000.000/0000-00" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-700 mb-1 block">Endereço</label>
            <input type="text" value={config.endereco} onChange={e => setConfig({...config, endereco: e.target.value})}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Pastor Presidente</label>
            <input type="text" value={config.pastorPresidente} onChange={e => setConfig({...config, pastorPresidente: e.target.value})}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Tesoureiro(a)</label>
            <input type="text" value={config.tesoureiro} onChange={e => setConfig({...config, tesoureiro: e.target.value})}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
          </div>
        </div>
      </div>

      {/* Financial rules */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Regras Financeiras</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Taxa Denominacional (%)</label>
            <input type="number" step="0.1" min="0" max="100" value={config.taxaDenominacional}
              onChange={e => setConfig({...config, taxaDenominacional: parseFloat(e.target.value) || 0})}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
            <p className="text-xs text-slate-400 mt-1">Percentual sobre dízimos para repasse à convenção</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Percentual de Repasse Geral (%)</label>
            <input type="number" step="0.1" min="0" max="100" value={config.percentualRepasse}
              onChange={e => setConfig({...config, percentualRepasse: parseFloat(e.target.value) || 0})}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
            <p className="text-xs text-slate-400 mt-1">Percentual padrão para repasses</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Categorias Financeiras</h3>
          <button onClick={addCategory} className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            <Plus size={14} /> Adicionar
          </button>
        </div>
        <div className="space-y-3">
          {config.categories.map(cat => (
            <div key={cat.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <input type="color" value={cat.cor} onChange={e => updateCategory(cat.id, { cor: e.target.value })}
                className="w-8 h-8 rounded-lg border-0 cursor-pointer" />
              <input type="text" value={cat.nome} onChange={e => updateCategory(cat.id, { nome: e.target.value })}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
              <select value={cat.tipo} onChange={e => updateCategory(cat.id, { tipo: e.target.value as 'ENTRADA' | 'SAIDA' })}
                className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-400 outline-none">
                <option value="ENTRADA">Entrada</option>
                <option value="SAIDA">Saída</option>
              </select>
              {cat.tipo === 'ENTRADA' && cat.nome === 'Dízimo' && (
                <input type="number" step="0.1" placeholder="% repasse" value={cat.percentualRepasse || ''}
                  onChange={e => updateCategory(cat.id, { percentualRepasse: parseFloat(e.target.value) || 0 })}
                  className="w-24 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
              )}
              <button onClick={() => deleteCategory(cat.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
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
          {config.ministerios.map(min => (
            <span key={min} className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm">
              {min}
              <button onClick={() => removeMinisterio(min)} className="ml-1 hover:text-red-600">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-4">
        <button onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
          <Save size={16} /> Salvar Configurações
        </button>
        {saved && (
          <span className="text-sm text-emerald-600 font-medium animate-pulse">✓ Configurações salvas com sucesso!</span>
        )}
      </div>
    </div>
  );
}
