import { useState, useMemo } from 'react';
import { getTransactions, getMembers, getConfig, exportToCSV } from '../store';
import { format, parseISO, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Printer, Download, Users, FileText, BarChart3 } from 'lucide-react';

type ReportType = 'balancete' | 'dizimistas' | 'individual' | 'resumo';

export default function Reports() {
  const [reportType, setReportType] = useState<ReportType>('balancete');
  const [startDate, setStartDate] = useState(format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedMember, setSelectedMember] = useState('');
  const [filterByCompetencia, setFilterByCompetencia] = useState(false);
  const [competenciaMonth, setCompetenciaMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [dizimistasSortBy, setDizimistasSortBy] = useState<'total-desc' | 'total-asc' | 'nome-asc' | 'nome-desc'>('total-desc');
  
  const transactions = getTransactions();
  const members = getMembers();
  const config = getConfig();

  const filteredTx = useMemo(() => {
    if (filterByCompetencia) {
      // Filtrar por competência
      return transactions.filter(t => {
        const comp = t.competencia || t.data.substring(0, 7);
        return comp === competenciaMonth && !t.estornada;
      });
    } else {
      // Filtrar por data
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      return transactions.filter(t => {
        const d = parseISO(t.data);
        return isWithinInterval(d, { start, end }) && !t.estornada;
      });
    }
  }, [transactions, startDate, endDate, filterByCompetencia, competenciaMonth]);

  const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Balancete data
  const balanceteData = useMemo(() => {
    const categories: Record<string, { nome: string; entradas: number; saidas: number; saldo: number }> = {};
    config.categories.forEach(c => {
      categories[c.nome] = { nome: c.nome, entradas: 0, saidas: 0, saldo: 0 };
    });

    filteredTx.forEach(t => {
      if (!categories[t.categoria]) {
        categories[t.categoria] = { nome: t.categoria, entradas: 0, saidas: 0, saldo: 0 };
      }
      if (t.tipo === 'ENTRADA') categories[t.categoria].entradas += t.valor;
      else categories[t.categoria].saidas += t.valor;
    });

    return Object.values(categories).filter(c => c.entradas > 0 || c.saidas > 0).map(c => ({
      ...c, saldo: c.entradas - c.saidas
    }));
  }, [filteredTx, config.categories]);

  // Dizimistas data
  const dizimistasData = useMemo(() => {
    const memberMap: Record<string, { nome: string; dizimos: number; ofertas: number; total: number; count: number; lastDate: string }> = {};
    
    filteredTx.filter(t => t.memberId && (t.categoria === 'DIZIMO' || t.categoria === 'OFERTA')).forEach(t => {
      if (!t.memberId) return;
      const member = members.find(m => m.id === t.memberId);
      if (!member) return;

      if (!memberMap[t.memberId]) {
        memberMap[t.memberId] = { nome: member.nome, dizimos: 0, ofertas: 0, total: 0, count: 0, lastDate: '' };
      }
      if (t.categoria === 'DIZIMO') memberMap[t.memberId].dizimos += t.valor;
      else memberMap[t.memberId].ofertas += t.valor;
      memberMap[t.memberId].total += t.valor;
      memberMap[t.memberId].count += 1;
      if (!memberMap[t.memberId].lastDate || t.data > memberMap[t.memberId].lastDate) {
        memberMap[t.memberId].lastDate = t.data;
      }
    });

    const sortedMembers = Object.values(memberMap);
    
    // Aplicar ordenação selecionada
    switch (dizimistasSortBy) {
      case 'total-desc':
        return sortedMembers.sort((a, b) => b.total - a.total);
      case 'total-asc':
        return sortedMembers.sort((a, b) => a.total - b.total);
      case 'nome-asc':
        return sortedMembers.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
      case 'nome-desc':
        return sortedMembers.sort((a, b) => b.nome.localeCompare(a.nome, 'pt-BR'));
      default:
        return sortedMembers.sort((a, b) => b.total - a.total);
    }
  }, [filteredTx, members, dizimistasSortBy]);

  // Individual member data
  const memberHistory = useMemo(() => {
    if (!selectedMember) return [];
    return filteredTx
      .filter(t => t.memberId === selectedMember)
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }, [filteredTx, selectedMember]);

  const memberSummary = useMemo(() => {
    if (!selectedMember) return { dizimos: 0, ofertas: 0, total: 0, count: 0 };
    const tx = filteredTx.filter(t => t.memberId === selectedMember);
    return {
      dizimos: tx.filter(t => t.categoria === 'DIZIMO').reduce((s, t) => s + t.valor, 0),
      ofertas: tx.filter(t => t.categoria === 'OFERTA').reduce((s, t) => s + t.valor, 0),
      total: tx.reduce((s, t) => s + t.valor, 0),
      count: tx.length,
    };
  }, [filteredTx, selectedMember]);

  const handleExportCSV = () => {
    let data: Record<string, any>[] = [];
    let filename = '';

    switch (reportType) {
      case 'balancete':
        data = balanceteData.map(b => ({
          'Categoria': b.nome,
          'Entradas': b.entradas.toFixed(2),
          'Saídas': b.saidas.toFixed(2),
          'Saldo': b.saldo.toFixed(2),
        }));
        filename = `balancete_${startDate}_${endDate}`;
        break;
      case 'dizimistas':
        data = dizimistasData.map(d => ({
          'Nome': d.nome,
          'Dízimos': d.dizimos.toFixed(2),
          'Ofertas': d.ofertas.toFixed(2),
          'Total': d.total.toFixed(2),
          'Contribuições': d.count,
          'Última Data': d.lastDate ? format(parseISO(d.lastDate), 'dd/MM/yyyy') : '',
        }));
        filename = `dizimistas_${startDate}_${endDate}`;
        break;
      case 'individual':
        data = memberHistory.map(t => ({
          'Data': format(parseISO(t.data), 'dd/MM/yyyy'),
          'Tipo': t.tipo,
          'Categoria': t.categoria,
          'Descrição': t.descricao,
          'Valor': t.valor.toFixed(2),
        }));
        filename = `historico_membro_${startDate}_${endDate}`;
        break;
      case 'resumo':
        const totalEntradas = filteredTx.filter(t => t.tipo === 'ENTRADA').reduce((s, t) => s + t.valor, 0);
        const totalSaidas = filteredTx.filter(t => t.tipo === 'SAIDA').reduce((s, t) => s + t.valor, 0);
        data = [{
          'Período': `${format(parseISO(startDate), 'dd/MM/yyyy')} a ${format(parseISO(endDate), 'dd/MM/yyyy')}`,
          'Total Entradas': totalEntradas.toFixed(2),
          'Total Saídas': totalSaidas.toFixed(2),
          'Saldo': (totalEntradas - totalSaidas).toFixed(2),
          'Total Lançamentos': filteredTx.length,
        }];
        filename = `resumo_${startDate}_${endDate}`;
        break;
    }
    exportToCSV(data, filename);
  };

  const handlePrint = () => window.print();

  const totalEntradas = filteredTx.filter(t => t.tipo === 'ENTRADA').reduce((s, t) => s + t.valor, 0);
  const totalSaidas = filteredTx.filter(t => t.tipo === 'SAIDA').reduce((s, t) => s + t.valor, 0);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 print:hidden">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Tipo de Relatório</label>
            <select value={reportType} onChange={e => setReportType(e.target.value as ReportType)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none">
              <option value="balancete">Balancete de Verificação</option>
              <option value="dizimistas">Listagem de Dizimistas</option>
              <option value="individual">Histórico Individual</option>
              <option value="resumo">Resumo Geral</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Data Início</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Data Fim</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="filterCompetencia" checked={filterByCompetencia} 
              onChange={e => setFilterByCompetencia(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded" />
            <label htmlFor="filterCompetencia" className="text-xs font-medium text-slate-600">
              Filtrar por Competência
            </label>
          </div>
          {filterByCompetencia && (
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Mês Competência</label>
              <input type="month" value={competenciaMonth} onChange={e => setCompetenciaMonth(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
            </div>
          )}
          {reportType === 'individual' && (
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Membro</label>
              <select value={selectedMember} onChange={e => setSelectedMember(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none min-w-[200px]">
                <option value="">Selecione um membro</option>
                {members.filter(m => m.status === 'ATIVO').sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')).map(m => (
                  <option key={m.id} value={m.id}>{m.nome}</option>
                ))}
              </select>
            </div>
          )}
          {reportType === 'dizimistas' && (
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Ordenar por</label>
              <select value={dizimistasSortBy} onChange={e => setDizimistasSortBy(e.target.value as any)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none">
                <option value="total-desc">Valor (Maior → Menor)</option>
                <option value="total-asc">Valor (Menor → Maior)</option>
                <option value="nome-asc">Nome (A → Z)</option>
                <option value="nome-desc">Nome (Z → A)</option>
              </select>
            </div>
          )}
          <div className="flex-1" />
          <button onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700">
            <Download size={16} /> CSV
          </button>
          <button onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 text-white rounded-xl text-sm font-medium hover:bg-slate-800">
            <Printer size={16} /> Imprimir
          </button>
        </div>
      </div>

      {/* Print header */}
      <div className="hidden print:block text-center mb-4 border-b pb-4">
        <h1 className="text-xl font-bold">{config.nomeIgreja}</h1>
        <p className="text-sm">CNPJ: {config.cnpj || '---'}</p>
        <p className="text-sm font-semibold mt-2">
          {reportType === 'balancete' && 'Balancete de Verificação'}
          {reportType === 'dizimistas' && 'Relação de Dizimistas e Ofertantes'}
          {reportType === 'individual' && `Histórico - ${members.find(m => m.id === selectedMember)?.nome || ''}`}
          {reportType === 'resumo' && 'Resumo Financeiro'}
        </p>
        <p className="text-xs text-slate-500">
          Período: {format(parseISO(startDate), 'dd/MM/yyyy')} a {format(parseISO(endDate), 'dd/MM/yyyy')}
        </p>
      </div>

      {/* Balancete */}
      {reportType === 'balancete' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 print:bg-white">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <FileText size={18} /> Balancete de Verificação
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {format(parseISO(startDate), 'dd/MM/yyyy')} a {format(parseISO(endDate), 'dd/MM/yyyy')}
            </p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Conta</th>
                <th className="text-right px-4 py-3 font-medium text-emerald-600">Débito (Entradas)</th>
                <th className="text-right px-4 py-3 font-medium text-red-600">Crédito (Saídas)</th>
                <th className="text-right px-4 py-3 font-medium text-slate-600">Saldo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {balanceteData.map(b => (
                <tr key={b.nome} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-700">{b.nome}</td>
                  <td className="px-4 py-3 text-right text-emerald-600">{b.entradas > 0 ? formatCurrency(b.entradas) : '---'}</td>
                  <td className="px-4 py-3 text-right text-red-600">{b.saidas > 0 ? formatCurrency(b.saidas) : '---'}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${b.saldo >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatCurrency(b.saldo)}
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-100 font-bold">
                <td className="px-4 py-3">TOTAIS</td>
                <td className="px-4 py-3 text-right text-emerald-700">{formatCurrency(totalEntradas)}</td>
                <td className="px-4 py-3 text-right text-red-700">{formatCurrency(totalSaidas)}</td>
                <td className={`px-4 py-3 text-right ${totalEntradas - totalSaidas >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                  {formatCurrency(totalEntradas - totalSaidas)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Dizimistas */}
      {reportType === 'dizimistas' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 print:bg-white">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Users size={18} /> Relação de Dizimistas e Ofertantes
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {format(parseISO(startDate), 'dd/MM/yyyy')} a {format(parseISO(endDate), 'dd/MM/yyyy')} | 
              Total: {dizimistasData.length} contribuintes
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">#</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Nome</th>
                  <th className="text-right px-4 py-3 font-medium text-emerald-600">Dízimos</th>
                  <th className="text-right px-4 py-3 font-medium text-blue-600">Ofertas</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-600">Total</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600">Contrib.</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-600">Última</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dizimistasData.map((d, i) => (
                  <tr key={d.nome} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">{d.nome}</td>
                    <td className="px-4 py-3 text-right text-emerald-600">{formatCurrency(d.dizimos)}</td>
                    <td className="px-4 py-3 text-right text-blue-600">{formatCurrency(d.ofertas)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">{formatCurrency(d.total)}</td>
                    <td className="px-4 py-3 text-center text-slate-500">{d.count}</td>
                    <td className="px-4 py-3 text-right text-slate-500">
                      {d.lastDate ? format(parseISO(d.lastDate), 'dd/MM/yyyy') : '---'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-bold">
                <tr>
                  <td className="px-4 py-3" colSpan={2}>TOTAIS</td>
                  <td className="px-4 py-3 text-right text-emerald-700">
                    {formatCurrency(dizimistasData.reduce((s, d) => s + d.dizimos, 0))}
                  </td>
                  <td className="px-4 py-3 text-right text-blue-700">
                    {formatCurrency(dizimistasData.reduce((s, d) => s + d.ofertas, 0))}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-800">
                    {formatCurrency(dizimistasData.reduce((s, d) => s + d.total, 0))}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600">
                    {dizimistasData.reduce((s, d) => s + d.count, 0)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Individual */}
      {reportType === 'individual' && (
        <div className="space-y-4">
          {selectedMember ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                  <p className="text-xs text-emerald-600">Total Dízimos</p>
                  <p className="text-lg font-bold text-emerald-700">{formatCurrency(memberSummary.dizimos)}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-xs text-blue-600">Total Ofertas</p>
                  <p className="text-lg font-bold text-blue-700">{formatCurrency(memberSummary.ofertas)}</p>
                </div>
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                  <p className="text-xs text-indigo-600">Total Geral</p>
                  <p className="text-lg font-bold text-indigo-700">{formatCurrency(memberSummary.total)}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <p className="text-xs text-purple-600">Contribuições</p>
                  <p className="text-lg font-bold text-purple-700">{memberSummary.count}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Data</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Tipo</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Descrição</th>
                      <th className="text-right px-4 py-3 font-medium text-slate-600">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {memberHistory.map(t => (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-600">{format(parseISO(t.data), 'dd/MM/yyyy')}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            t.categoria === 'DIZIMO' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                          }`}>{t.categoria}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{t.descricao}</td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-800">{formatCurrency(t.valor)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {memberHistory.length === 0 && (
                  <p className="text-center py-8 text-slate-400">Nenhum registro para este membro no período</p>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <BarChart3 size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">Selecione um membro para visualizar o histórico</p>
            </div>
          )}
        </div>
      )}

      {/* Resumo */}
      {reportType === 'resumo' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <FileText size={18} /> Resumo Geral do Período
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-emerald-50 rounded-xl p-4">
              <p className="text-xs text-emerald-600">Total Entradas</p>
              <p className="text-xl font-bold text-emerald-700">{formatCurrency(totalEntradas)}</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-xs text-red-600">Total Saídas</p>
              <p className="text-xl font-bold text-red-700">{formatCurrency(totalSaidas)}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-xs text-blue-600">Saldo</p>
              <p className={`text-xl font-bold ${totalEntradas - totalSaidas >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                {formatCurrency(totalEntradas - totalSaidas)}
              </p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <p className="text-xs text-purple-600">Lançamentos</p>
              <p className="text-xl font-bold text-purple-700">{filteredTx.length}</p>
            </div>
          </div>
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-slate-700 mb-3">Distribuição por Categoria</h4>
            <div className="space-y-2">
              {balanceteData.map(b => {
                const total = totalEntradas + totalSaidas;
                const pct = total > 0 ? ((b.entradas + b.saidas) / total * 100) : 0;
                return (
                  <div key={b.nome} className="flex items-center gap-3">
                    <span className="text-xs text-slate-600 w-40 truncate">{b.nome}</span>
                    <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-slate-500 w-20 text-right">{pct.toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
