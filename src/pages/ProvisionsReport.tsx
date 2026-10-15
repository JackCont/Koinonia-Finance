import { useMemo, useState, useEffect } from 'react';
import { getProvisions, getConfig } from '../store';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, Download, Printer } from 'lucide-react';

export default function ProvisionsReport() {
  const [provisions, setProvisions] = useState(getProvisions());
  const config = getConfig();

  // Recarregar provisões sempre que o componente é exibido
  useEffect(() => {
    const loadProvisions = () => {
      setProvisions(getProvisions());
    };
    
    // Carregar imediatamente
    loadProvisions();
    
    // Escutar mudanças no localStorage
    const handleStorageChange = () => {
      loadProvisions();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Também recarregar quando o componente ganha foco
    const handleFocus = () => {
      loadProvisions();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const getCategoryName = (cat: string) => {
    const c = config.categories.find(c => c.id === cat || c.nome === cat);
    return c?.nome || cat;
  };

  // Agrupar por competência de destino
  const groupedByDestino = useMemo(() => {
    const groups: Record<string, { provisions: typeof provisions; total: number }> = {};
    
    provisions.forEach(p => {
      if (!groups[p.competenciaDestino]) {
        groups[p.competenciaDestino] = { provisions: [], total: 0 };
      }
      groups[p.competenciaDestino].provisions.push(p);
      groups[p.competenciaDestino].total += p.valor;
    });
    
    return groups;
  }, [provisions]);

  // Agrupar por categoria de destino
  const groupedByCategoria = useMemo(() => {
    const groups: Record<string, { provisions: typeof provisions; total: number }> = {};
    
    provisions.forEach(p => {
      const cat = p.categoriaDestino || 'Sem categoria';
      if (!groups[cat]) {
        groups[cat] = { provisions: [], total: 0 };
      }
      groups[cat].provisions.push(p);
      groups[cat].total += p.valor;
    });
    
    return groups;
  }, [provisions]);

  const handleExportCSV = () => {
    const rows = provisions.map(p => ({
      'Data': format(parseISO(p.data), 'dd/MM/yyyy'),
      'Descrição': p.descricao,
      'Competência Origem': format(parseISO(p.competencia + '-01'), 'MM/yyyy'),
      'Competência Destino': format(parseISO(p.competenciaDestino + '-01'), 'MM/yyyy'),
      'Categoria Destino': p.categoriaDestino ? getCategoryName(p.categoriaDestino) : '',
      'Valor': p.valor.toFixed(2),
      'Status': p.status,
      'Congregação': p.congregacao,
      'Observações': p.observacoes || '',
    }));

    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(';'),
      ...rows.map(row => headers.map(h => {
        const val = row[h as keyof typeof row];
        if (typeof val === 'string' && val.includes(';')) return `"${val}"`;
        return val ?? '';
      }).join(';'))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_provisoes_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handlePrint = () => {
    window.print();
  };

  const totalGeral = provisions.reduce((s, p) => s + p.valor, 0);
  const totalPendente = provisions.filter(p => p.status === 'PENDENTE').reduce((s, p) => s + p.valor, 0);
  const totalUtilizada = provisions.filter(p => p.status === 'UTILIZADA').reduce((s, p) => s + p.valor, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText size={28} />
          Relatório de Provisões
        </h1>
        <p className="text-indigo-200 mt-1">Controle detalhado de sobras de valores e suas destinações</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <div className="flex-1" />
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          <Download size={16} /> Exportar CSV
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          <Printer size={16} /> Imprimir
        </button>
      </div>

      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">Total Geral</p>
          <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalGeral)}</p>
          <p className="text-xs text-slate-500 mt-1">{provisions.length} provisão(ões)</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
          <p className="text-sm text-amber-600 mb-1">Pendente</p>
          <p className="text-2xl font-bold text-amber-700">{formatCurrency(totalPendente)}</p>
          <p className="text-xs text-amber-600 mt-1">{provisions.filter(p => p.status === 'PENDENTE').length} provisão(ões)</p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
          <p className="text-sm text-emerald-600 mb-1">Utilizada</p>
          <p className="text-2xl font-bold text-emerald-700">{formatCurrency(totalUtilizada)}</p>
          <p className="text-xs text-emerald-600 mt-1">{provisions.filter(p => p.status === 'UTILIZADA').length} provisão(ões)</p>
        </div>
      </div>

      {/* Agrupado por Competência de Destino */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Provisões por Mês de Destino</h2>
        <div className="space-y-6">
          {Object.entries(groupedByDestino)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([competencia, { provisions: provs, total }]) => (
              <div key={competencia} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-700">
                    {format(parseISO(competencia + '-01'), "MMMM 'de' yyyy", { locale: ptBR })}
                  </h3>
                  <span className="text-lg font-bold text-indigo-600">{formatCurrency(total)}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left px-4 py-2 font-medium text-slate-600">Data</th>
                        <th className="text-left px-4 py-2 font-medium text-slate-600">Descrição</th>
                        <th className="text-left px-4 py-2 font-medium text-slate-600">Origem</th>
                        <th className="text-left px-4 py-2 font-medium text-slate-600">Categoria</th>
                        <th className="text-right px-4 py-2 font-medium text-slate-600">Valor</th>
                        <th className="text-center px-4 py-2 font-medium text-slate-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {provs.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="px-4 py-2 text-slate-600">{format(parseISO(p.data), 'dd/MM/yyyy')}</td>
                          <td className="px-4 py-2">
                            <p className="font-medium text-slate-700">{p.descricao}</p>
                            <p className="text-xs text-slate-500">{p.congregacao}</p>
                          </td>
                          <td className="px-4 py-2 text-slate-600">
                            {format(parseISO(p.competencia + '-01'), 'MM/yyyy')}
                          </td>
                          <td className="px-4 py-2">
                            {p.categoriaDestino ? (
                              <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                                {getCategoryName(p.categoriaDestino)}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400">---</span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-right font-semibold text-slate-800">
                            {formatCurrency(p.valor)}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              p.status === 'PENDENTE' ? 'bg-amber-100 text-amber-700' :
                              p.status === 'UTILIZADA' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Agrupado por Categoria */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Provisões por Categoria de Destino</h2>
        <div className="space-y-4">
          {Object.entries(groupedByCategoria)
            .sort(([, a], [, b]) => b.total - a.total)
            .map(([categoria, { provisions: provs, total }]) => (
              <div key={categoria} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-700">{categoria}</h3>
                  <span className="text-lg font-bold text-indigo-600">{formatCurrency(total)}</span>
                </div>
                <div className="space-y-2">
                  {provs.map(p => (
                    <div key={p.id} className="flex items-center justify-between text-sm bg-slate-50 rounded-lg px-3 py-2">
                      <div className="flex-1">
                        <p className="font-medium text-slate-700">{p.descricao}</p>
                        <p className="text-xs text-slate-500">
                          {p.congregacao} • Origem: {format(parseISO(p.competencia + '-01'), 'MM/yyyy')} → Destino: {format(parseISO(p.competenciaDestino + '-01'), 'MM/yyyy')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-800">{formatCurrency(p.valor)}</p>
                        <p className="text-xs text-slate-500">{p.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      {provisions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <FileText size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Nenhuma provisão registrada</p>
          <p className="text-xs text-slate-400 mt-2">Cadastre provisões na página "Provisões"</p>
        </div>
      )}
    </div>
  );
}
