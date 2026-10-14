import { useState } from 'react';
import { Save, DollarSign, Target } from 'lucide-react';
import { getFixedValues, saveFixedValue } from '../store';
import { FixedValue } from '../types';

export default function FixedValuesConfig() {
  const [fixedValues, setFixedValues] = useState<FixedValue[]>(getFixedValues());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    fixedValues.forEach(fv => saveFixedValue(fv));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateValue = (id: string, valor: number) => {
    setFixedValues(fixedValues.map(fv => 
      fv.id === id ? { ...fv, valor } : fv
    ));
  };

  const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const missoes = fixedValues.find(fv => fv.id === 'missoes');
  const jubilados = fixedValues.find(fv => fv.id === 'jubilados');

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <DollarSign size={28} />
          Valores Fixos Mensais
        </h1>
        <p className="text-indigo-200 mt-1">Configure os valores que aparecem automaticamente na remessa mensal</p>
      </div>

      {/* Missões */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Target size={24} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800 text-lg">Missões</h3>
            <p className="text-sm text-slate-500 mt-1 mb-4">
              Valor informativo que aparece na remessa mensal. <strong>Não compõe</strong> o cálculo de receitas ou despesas.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-blue-800">
                <strong>ℹ️ Nota:</strong> Este valor aparece apenas como informação na planilha de remessa, sem impacto nos cálculos de saldo.
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Valor Mensal</label>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-slate-600">R$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={missoes?.valor || 0}
                  onChange={e => updateValue('missoes', parseFloat(e.target.value) || 0)}
                  className="flex-1 px-4 py-3 text-2xl font-bold border-2 border-slate-200 rounded-xl focus:border-blue-400 outline-none"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Valor atual: <strong className="text-blue-600">{formatCurrency(missoes?.valor || 0)}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Jubilados */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <DollarSign size={24} className="text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800 text-lg">Jubilados</h3>
            <p className="text-sm text-slate-500 mt-1 mb-4">
              Valor que aparece como despesa na remessa mensal. <strong>Consta automaticamente</strong> no campo específico da tabela de despesas.
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-800">
                <strong>ℹ️ Nota:</strong> Este valor aparece automaticamente como despesa de jubilados na remessa, independente de haver lançamento no fluxo de caixa.
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Valor Mensal</label>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-slate-600">R$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={jubilados?.valor || 0}
                  onChange={e => updateValue('jubilados', parseFloat(e.target.value) || 0)}
                  className="flex-1 px-4 py-3 text-2xl font-bold border-2 border-slate-200 rounded-xl focus:border-purple-400 outline-none"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Valor atual: <strong className="text-purple-600">{formatCurrency(jubilados?.valor || 0)}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Resumo dos Valores Fixos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Missões</span>
              <Target size={16} className="text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(missoes?.valor || 0)}</p>
            <p className="text-xs text-slate-500 mt-1">Apenas informativo</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Jubilados</span>
              <DollarSign size={16} className="text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(jubilados?.valor || 0)}</p>
            <p className="text-xs text-slate-500 mt-1">Despesa automática</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Save size={16} /> Salvar Valores
        </button>
        {saved && (
          <span className="text-sm text-emerald-600 font-medium animate-pulse">
            ✓ Valores salvos com sucesso!
          </span>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>💡 Como funciona:</strong> Os valores fixos configurados aqui aparecem automaticamente na planilha de remessa mensal. 
          Missões é apenas informativo, enquanto Jubilados compõe as despesas do relatório.
        </p>
      </div>
    </div>
  );
}
