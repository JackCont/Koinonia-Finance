import { useState, useMemo } from 'react';
import { getTransactions, getConfig, exportToCSV } from '../store';
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Printer, Download, TrendingUp, TrendingDown } from 'lucide-react';

export default function CashFlow() {
  const transactions = getTransactions();
  const config = getConfig();
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));

  const years = useMemo(() => {
    const dates = transactions.map(t => parseISO(t.data).getFullYear());
    const set = new Set(dates);
    set.add(new Date().getFullYear());
    return Array.from(set).sort((a, b) => b - a);
  }, [transactions]);

  const monthlyData = useMemo(() => {
    const months: { month: string; entradas: number; saidas: number; saldo: number; details: Record<string, { entradas: number; saidas: number }> }[] = [];
    
    for (let m = 1; m <= 12; m++) {
      const monthStr = `${year}-${m.toString().padStart(2, '0')}`;
      const monthTx = transactions.filter(t => {
        const d = parseISO(t.data);
        return t.data.startsWith(monthStr) && !t.estornada;
      });

      const entradas = monthTx.filter(t => t.tipo === 'ENTRADA').reduce((s, t) => s + t.valor, 0);
      const saidas = monthTx.filter(t => t.tipo === 'SAIDA').reduce((s, t) => s + t.valor, 0);

      const details: Record<string, { entradas: number; saidas: number }> = {};
      config.categories.forEach(c => {
        const catTx = monthTx.filter(t => t.categoria === c.nome);
        details[c.nome] = {
          entradas: catTx.filter(t => t.tipo === 'ENTRADA').reduce((s, t) => s + t.valor, 0),
          saidas: catTx.filter(t => t.tipo === 'SAIDA').reduce((s, t) => s + t.valor, 0),
        };
      });

      months.push({ month: monthStr, entradas, saidas, saldo: entradas - saidas, details });
    }
    return months;
  }, [transactions, year, config.categories]);

  const selectedMonthData = monthlyData[parseInt(selectedMonth) - 1];

  const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const handleExportCSV = () => {
    const csvData = monthlyData.map(m => ({
      'Mês': format(parseISO(m.month + '-01'), 'MMMM/yyyy', { locale: ptBR }),
      'Entradas': m.entradas.toFixed(2),
      'Saídas': m.saidas.toFixed(2),
      'Saldo': m.saldo.toFixed(2),
    }));
    exportToCSV(csvData, `fluxo_caixa_${year}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const cumulativeBalance = useMemo(() => {
    let balance = 0;
    return monthlyData.map(m => {
      balance += m.saldo;
      return { ...m, cumulativeBalance: balance };
    });
  }, [monthlyData]);

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <select value={year} onChange={e => setYear(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none">
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none">
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
            <option key={m} value={m.toString().padStart(2, '0')}>
              {format(new Date(parseInt(year), m - 1), 'MMMM', { locale: ptBR })}
            </option>
          ))}
        </select>
        <div className="flex-1" />
        <button onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors">
          <Download size={16} /> Exportar CSV
        </button>
        <button onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">
          <Printer size={16} /> Imprimir
        </button>
      </div>

      {/* Print header */}
      <div className="hidden print:block text-center mb-6">
        <h1 className="text-xl font-bold">{config.nomeIgreja}</h1>
        <p className="text-sm text-slate-600">Fluxo de Caixa - {year}</p>
        <p className="text-xs text-slate-400">Emitido em: {format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
      </div>

      {/* Monthly overview */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-slate-800">Visão Geral Mensal - {year}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Mês</th>
                <th className="text-right px-4 py-3 font-medium text-emerald-600">Entradas</th>
                <th className="text-right px-4 py-3 font-medium text-red-600">Saídas</th>
                <th className="text-right px-4 py-3 font-medium text-slate-600">Saldo</th>
                <th className="text-right px-4 py-3 font-medium text-indigo-600">Acumulado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cumulativeBalance.map((m, i) => (
                <tr key={m.month} className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                  (i + 1).toString().padStart(2, '0') === selectedMonth ? 'bg-indigo-50' : ''
                }`} onClick={() => setSelectedMonth((i + 1).toString().padStart(2, '0'))}>
                  <td className="px-4 py-3 font-medium text-slate-700">
                    {format(parseISO(m.month + '-01'), 'MMM', { locale: ptBR })}
                  </td>
                  <td className="px-4 py-3 text-right text-emerald-600">{formatCurrency(m.entradas)}</td>
                  <td className="px-4 py-3 text-right text-red-600">{formatCurrency(m.saidas)}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${m.saldo >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatCurrency(m.saldo)}
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold ${m.cumulativeBalance >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
                    {formatCurrency(m.cumulativeBalance)}
                  </td>
                </tr>
              ))}
              {/* Totals */}
              <tr className="bg-slate-100 font-bold">
                <td className="px-4 py-3 text-slate-800">TOTAL ANUAL</td>
                <td className="px-4 py-3 text-right text-emerald-700">
                  {formatCurrency(monthlyData.reduce((s, m) => s + m.entradas, 0))}
                </td>
                <td className="px-4 py-3 text-right text-red-700">
                  {formatCurrency(monthlyData.reduce((s, m) => s + m.saidas, 0))}
                </td>
                <td className="px-4 py-3 text-right text-slate-800">
                  {formatCurrency(monthlyData.reduce((s, m) => s + m.saldo, 0))}
                </td>
                <td className="px-4 py-3 text-right text-indigo-700">
                  {formatCurrency(cumulativeBalance[cumulativeBalance.length - 1]?.cumulativeBalance || 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected month detail */}
      {selectedMonthData && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-indigo-50">
            <h3 className="font-semibold text-indigo-800">
              Detalhamento - {format(parseISO(selectedMonthData.month + '-01'), "MMMM 'de' yyyy", { locale: ptBR })}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Categoria</th>
                  <th className="text-right px-4 py-3 font-medium text-emerald-600">Entradas</th>
                  <th className="text-right px-4 py-3 font-medium text-red-600">Saídas</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-600">Líquido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {config.categories.map(c => {
                  const detail = selectedMonthData.details[c.nome];
                  if (!detail || (detail.entradas === 0 && detail.saidas === 0)) return null;
                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.cor }} />
                          <span className="text-slate-700">{c.nome}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-emerald-600">{detail.entradas > 0 ? formatCurrency(detail.entradas) : '---'}</td>
                      <td className="px-4 py-3 text-right text-red-600">{detail.saidas > 0 ? formatCurrency(detail.saidas) : '---'}</td>
                      <td className={`px-4 py-3 text-right font-medium ${detail.entradas - detail.saidas >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {formatCurrency(detail.entradas - detail.saidas)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Visual bar chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Gráfico Mensal</h3>
        <div className="space-y-3">
          {monthlyData.map((m, i) => {
            const maxVal = Math.max(...monthlyData.map(d => Math.max(d.entradas, d.saidas)), 1);
            return (
              <div key={m.month} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-8">
                  {format(parseISO(m.month + '-01'), 'MMM', { locale: ptBR })}
                </span>
                <div className="flex-1 flex items-center gap-1">
                  <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden relative">
                    <div className="h-full bg-emerald-400 rounded-full transition-all" 
                      style={{ width: `${(m.entradas / maxVal) * 100}%` }} />
                  </div>
                  <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden relative">
                    <div className="h-full bg-red-400 rounded-full transition-all" 
                      style={{ width: `${(m.saidas / maxVal) * 100}%` }} />
                  </div>
                </div>
                <span className="text-xs text-slate-500 w-20 text-right">{formatCurrency(m.saldo)}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-400 rounded" /> Entradas</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-400 rounded" /> Saídas</span>
        </div>
      </div>
    </div>
  );
}
