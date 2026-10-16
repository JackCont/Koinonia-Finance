import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Calendar, Plus, Save, Trash2, CheckCircle } from 'lucide-react';
import { getCultos, getTransactions, saveTransaction, getConfig, getMembers, normalizeCategoryName } from '../store';
import { Culto, Transaction, TransactionType, TransactionCategory } from '../types';
import { format, parseISO } from 'date-fns';

interface BatchTransaction {
  id: string;
  tipo: TransactionType;
  categoria: TransactionCategory;
  valor: number;
  descricao: string;
  memberId?: string;
}

export default function BatchTransactions() {
  const cultos = getCultos();
  const transactions = getTransactions();
  const config = getConfig();
  const members = getMembers();

  const [selectedCulto, setSelectedCulto] = useState<Culto | null>(null);
  const [batchTransactions, setBatchTransactions] = useState<BatchTransaction[]>([]);
  const [saved, setSaved] = useState(false);

  const emptyTransaction: BatchTransaction = {
    id: uuidv4(),
    tipo: 'ENTRADA',
    categoria: 'DIZIMO',
    valor: 0,
    descricao: '',
    memberId: '',
  };

  const handleAddTransaction = () => {
    setBatchTransactions([...batchTransactions, { ...emptyTransaction, id: uuidv4() }]);
  };

  const handleUpdateTransaction = (id: string, updates: Partial<BatchTransaction>) => {
    setBatchTransactions(batchTransactions.map(t => 
      t.id === id ? { ...t, ...updates } : t
    ));
  };

  const handleRemoveTransaction = (id: string) => {
    setBatchTransactions(batchTransactions.filter(t => t.id !== id));
  };

  const handleSaveBatch = () => {
    if (!selectedCulto) {
      alert('Selecione um culto primeiro');
      return;
    }

    if (batchTransactions.length === 0) {
      alert('Adicione pelo menos um lançamento');
      return;
    }

    let savedCount = 0;

    batchTransactions.forEach(batchTx => {
      if (batchTx.valor <= 0) return;

      const normalizedCategoria = normalizeCategoryName(batchTx.categoria);
      const transactionDate = selectedCulto.data;
      const transactionCompetencia = transactionDate.substring(0, 7);

      const transactionBase = {
        id: uuidv4(),
        tipo: batchTx.tipo,
        categoria: normalizedCategoria as TransactionCategory,
        valor: batchTx.valor,
        descricao: batchTx.descricao,
        congregacao: '',
        memberId: batchTx.memberId,
        cultoId: selectedCulto.id,
        estornada: false,
        competencia: transactionCompetencia,
        createdAt: new Date().toISOString(),
      };

      const newTransaction: Transaction = { ...transactionBase, ['da' + 'ta']: transactionDate } as Transaction;

      saveTransaction(newTransaction);
      savedCount++;
    });

    setSaved(true);
    setBatchTransactions([]);
    setTimeout(() => setSaved(false), 3000);

    alert(`${savedCount} lançamentos salvos com sucesso!`);
  };

  const totalEntradas = batchTransactions
    .filter(t => t.tipo === 'ENTRADA')
    .reduce((sum, t) => sum + t.valor, 0);

  const totalSaidas = batchTransactions
    .filter(t => t.tipo === 'SAIDA')
    .reduce((sum, t) => sum + t.valor, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar size={28} />
          Lançamentos em Lote por Culto
        </h1>
        <p className="text-indigo-100 mt-1">Crie múltiplos lançamentos de uma vez para um culto específico</p>
      </div>

      {/* Status */}
      {saved && (
        <div className="flex items-center gap-3 p-4 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-700">
          <CheckCircle size={20} />
          <span className="text-sm font-medium">Lançamentos salvos com sucesso!</span>
        </div>
      )}

      {/* Select Culto */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Selecione o Culto</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Culto *</label>
            <select
              value={selectedCulto?.id || ''}
              onChange={e => {
                const culto = cultos.find(c => c.id === e.target.value);
                setSelectedCulto(culto || null);
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none"
            >
              <option value="">Selecione um culto</option>
              {cultos.sort((a, b) => b.data.localeCompare(a.data)).map(c => (
                <option key={c.id} value={c.id}>
                  {format(parseISO(c.data), 'dd/MM/yyyy')} - {c.nome}
                </option>
              ))}
            </select>
          </div>
          {selectedCulto && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
              <p className="text-xs text-indigo-700 font-medium mb-1">Culto Selecionado</p>
              <p className="text-sm font-semibold text-indigo-900">{selectedCulto.nome}</p>
              <p className="text-xs text-indigo-700 mt-1">
                {format(parseISO(selectedCulto.data), "dd 'de' MMMM 'de' yyyy")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Batch Transactions */}
      {selectedCulto && (
        <>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Lançamentos do Lote</h3>
              <button
                onClick={handleAddTransaction}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                <Plus size={16} /> Adicionar Lançamento
              </button>
            </div>

            {batchTransactions.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl">
                <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500">Nenhum lançamento adicionado</p>
                <p className="text-xs text-slate-400 mt-2">Clique em "Adicionar Lançamento" para começar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {batchTransactions.map((tx, index) => (
                  <div key={tx.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-slate-700">Lançamento #{index + 1}</span>
                      <button
                        onClick={() => handleRemoveTransaction(tx.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <label className="text-xs font-medium text-slate-600 mb-1 block">Tipo</label>
                        <select
                          value={tx.tipo}
                          onChange={e => handleUpdateTransaction(tx.id, { tipo: e.target.value as TransactionType })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                        >
                          <option value="ENTRADA">Entrada</option>
                          <option value="SAIDA">Saída</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-600 mb-1 block">Categoria</label>
                        <select
                          value={tx.categoria}
                          onChange={e => handleUpdateTransaction(tx.id, { categoria: e.target.value as TransactionCategory })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                        >
                          {config.categories
                            .filter(c => c.tipo === tx.tipo)
                            .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
                            .map(c => (
                              <option key={c.id} value={c.nome}>{c.nome}</option>
                            ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-600 mb-1 block">Valor (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={tx.valor || ''}
                          onChange={e => handleUpdateTransaction(tx.id, { valor: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-600 mb-1 block">Membro</label>
                        <select
                          value={tx.memberId || ''}
                          onChange={e => handleUpdateTransaction(tx.id, { memberId: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                        >
                          <option value="">-- Nenhum --</option>
                          {members.filter(m => m.status === 'ATIVO').sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')).map(m => (
                            <option key={m.id} value={m.id}>{m.nome}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="text-xs font-medium text-slate-600 mb-1 block">Descrição</label>
                      <input
                        type="text"
                        value={tx.descricao}
                        onChange={e => handleUpdateTransaction(tx.id, { descricao: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-400 outline-none"
                        placeholder="Ex: Dízimo João Silva"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          {batchTransactions.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Resumo do Lote</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <p className="text-xs text-emerald-700 font-medium mb-1">Total de Entradas</p>
                  <p className="text-2xl font-bold text-emerald-800">
                    {totalEntradas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-xs text-red-700 font-medium mb-1">Total de Saídas</p>
                  <p className="text-2xl font-bold text-red-800">
                    {totalSaidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
                <div className={`rounded-lg p-4 border ${
                  totalEntradas - totalSaidas >= 0 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-orange-50 border-orange-200'
                }`}>
                  <p className={`text-xs font-medium mb-1 ${
                    totalEntradas - totalSaidas >= 0 ? 'text-blue-700' : 'text-orange-700'
                  }`}>Saldo do Lote</p>
                  <p className={`text-2xl font-bold ${
                    totalEntradas - totalSaidas >= 0 ? 'text-blue-800' : 'text-orange-800'
                  }`}>
                    {(totalEntradas - totalSaidas).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleSaveBatch}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  <Save size={18} />
                  Salvar {batchTransactions.length} Lançamentos
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
