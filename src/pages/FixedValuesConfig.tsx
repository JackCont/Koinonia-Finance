import { useState } from 'react';
import { Save, DollarSign, Target, Calendar } from 'lucide-react';
import { getFixedValues, saveFixedValue } from '../store';
import { FixedValue } from '../types';
import { format } from 'date-fns';

export default function FixedValuesConfig() {
  const [fixedValues, setFixedValues] = useState<FixedValue[]>(getFixedValues());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    fixedValues.forEach(fv => saveFixedValue(fv));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateValue = (id: string, updates: Partial<FixedValue>) => {
    setFixedValues(fixedValues.map(fv => 
      fv.id === id ? { ...fv, ...updates } : fv
    ));
  };

  const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const missoes = fixedValues.find(fv => fv.id === 'missoes');
  const jubilados = fixedValues.find(fv => fv.id === 'jubilados');

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <DollarSign size={28} />
          Valores Fixos Mensais
        </h1>
        <p className="text-indigo-100 mt-1">Configure os valores que aparecem automaticamente na remessa mensal</p>
      </div>

      {/* Missões */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <Target size={28} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-800 text-xl mb-2">Missões</h3>
            <p className="text-sm text-slate-600 mb-4">
              Valor <strong>informativo</strong> que aparece na remessa mensal. Não compõe o cálculo de receitas ou despesas.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-5">
              <p className="text-xs text-blue-800 flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">ℹ️</span>
                <span>Este valor aparece apenas como informação na planilha de remessa, sem impacto nos cálculos de saldo.</span>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Valor Mensal</label>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-slate-500">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={missoes?.valor || 0}
                    onChange={e => updateValue('missoes', { valor: parseFloat(e.target.value) || 0 })}
                    className="flex-1 px-4 py-3 text-xl font-bold border-2 border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} className="text-blue-500" />
                    Data de Início da Vigência
                  </label>
                  <input
                    type="date"
                    value={missoes?.dataInicio || ''}
                    onChange={e => updateValue('missoes', { dataInicio: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-1">Quando este valor começou a vigorar</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} className="text-blue-500" />
                    Data de Fim da Vigência
                  </label>
                  <input
                    type="date"
                    value={missoes?.dataFim || ''}
                    onChange={e => updateValue('missoes', { dataFim: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-1">Deixe vazio se ainda vigente</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Jubilados */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <DollarSign size={28} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-800 text-xl mb-2">Jubilados</h3>
            <p className="text-sm text-slate-600 mb-4">
              Valor que aparece como <strong>despesa obrigatória</strong> na remessa mensal. Interfere no saldo líquido.
            </p>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-5">
              <p className="text-xs text-purple-800 flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">ℹ️</span>
                <span>Este valor aparece automaticamente como despesa de jubilados na remessa e no cálculo do saldo líquido, independente de haver lançamento no fluxo de caixa.</span>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Valor Mensal</label>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-slate-500">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={jubilados?.valor || 0}
                    onChange={e => updateValue('jubilados', { valor: parseFloat(e.target.value) || 0 })}
                    className="flex-1 px-4 py-3 text-xl font-bold border-2 border-slate-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} className="text-purple-500" />
                    Data de Início da Vigência
                  </label>
                  <input
                    type="date"
                    value={jubilados?.dataInicio || ''}
                    onChange={e => updateValue('jubilados', { dataInicio: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-1">Quando este valor começou a vigorar</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} className="text-purple-500" />
                    Data de Fim da Vigência
                  </label>
                  <input
                    type="date"
                    value={jubilados?.dataFim || ''}
                    onChange={e => updateValue('jubilados', { dataFim: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-1">Deixe vazio se ainda vigente</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">📊</span>
          Resumo dos Valores Fixos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Target size={18} className="text-blue-500" />
                Missões
              </span>
              {missoes?.dataFim && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                  Inativo
                </span>
              )}
              {!missoes?.dataFim && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  Vigente
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-2">{formatCurrency(missoes?.valor || 0)}</p>
            <p className="text-xs text-slate-500">Apenas informativo na remessa</p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <DollarSign size={18} className="text-purple-500" />
                Jubilados
              </span>
              {jubilados?.dataFim && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                  Inativo
                </span>
              )}
              {!jubilados?.dataFim && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  Vigente
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-purple-600 mb-2">{formatCurrency(jubilados?.valor || 0)}</p>
            <p className="text-xs text-slate-500">Compõe despesas e saldo líquido</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-4 pt-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
        >
          <Save size={18} />
          Salvar Valores
        </button>
        {saved && (
          <span className="text-sm text-emerald-600 font-semibold flex items-center gap-2 animate-pulse">
            <span className="text-lg">✓</span>
            Valores salvos com sucesso!
          </span>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800 flex items-start gap-2">
          <span className="text-blue-500 mt-0.5">💡</span>
          <span>
            <strong>Como funciona:</strong> Os valores fixos configurados aqui aparecem automaticamente na planilha de remessa mensal. 
            Missões é apenas informativo, enquanto Jubilados compõe as despesas e interfere no saldo líquido. 
            Você pode definir períodos de vigência para cada valor.
          </span>
        </p>
      </div>
    </div>
  );
}
