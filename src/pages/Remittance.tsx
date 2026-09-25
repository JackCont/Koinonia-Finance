import { useState, useMemo } from 'react';
import { getTransactions, getConfig, getActiveRemittancePercentual, getRemittanceRules, exportToCSV } from '../store';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Printer, Download, Calendar } from 'lucide-react';

export default function Remittance() {
  const config = getConfig();
  const transactions = getTransactions();
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [selectedCong, setSelectedCong] = useState('all');
  const [filterByCompetencia, setFilterByCompetencia] = useState(false);

  const congregations = config.congregacoes.length > 0 
    ? config.congregacoes 
    : [{ id: '1', nome: config.cidade || 'CONGREGAÇÃO', cidade: config.cidade, setor: config.setor, pastor: '', ativo: true }];

  const monthStart = startOfMonth(parseISO(selectedMonth + '-01'));
  const monthEnd = endOfMonth(monthStart);
  const remittancePercentual = getActiveRemittancePercentual(format(monthStart, 'yyyy-MM-dd'));

  const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const monthlyData = useMemo(() => {
    const monthTx = transactions.filter(t => {
      if (t.estornada) return false;
      
      if (filterByCompetencia) {
        // Filtrar por competência
        const comp = t.competencia || t.data.substring(0, 7);
        return comp === selectedMonth;
      } else {
        // Filtrar por data de pagamento
        const d = parseISO(t.data);
        return d >= monthStart && d <= monthEnd;
      }
    });

    const allData = congregations.map(cong => {
      const congTx = selectedCong === 'all' 
        ? monthTx.filter(t => t.congregacao === cong.nome || !t.congregacao)
        : monthTx.filter(t => t.congregacao === cong.nome);

      const dizimos = congTx.filter(t => t.categoria === 'DIZIMO').reduce((s, t) => s + t.valor, 0);
      const ofertas = congTx.filter(t => t.categoria === 'OFERTA').reduce((s, t) => s + t.valor, 0);
      const missoes = congTx.filter(t => t.categoria === 'MISSOES' || t.categoria === 'DESPESA_MISSIONARIA').reduce((s, t) => s + t.valor, 0);
      const receitaBruta = dizimos + ofertas;
      const remessa = receitaBruta * remittancePercentual / 100;

      // Expenses
      const agua = congTx.filter(t => t.categoria === 'DESPESA_AGUA').reduce((s, t) => s + t.valor, 0);
      const luz = congTx.filter(t => t.categoria === 'DESPESA_LUZ').reduce((s, t) => s + t.valor, 0);
      const aluguel = congTx.filter(t => t.categoria === 'DESPESA_ALUGUEL').reduce((s, t) => s + t.valor, 0);
      const iptu = congTx.filter(t => t.categoria === 'DESPESA_IPTU').reduce((s, t) => s + t.valor, 0);
      const jubilados = congTx.filter(t => t.categoria === 'DESPESA_JUBILADOS').reduce((s, t) => s + t.valor, 0);
      const matCeia = congTx.filter(t => t.categoria === 'DESPESA_CEIA').reduce((s, t) => s + t.valor, 0);
      const matSecretaria = congTx.filter(t => t.categoria === 'DESPESA_SECRETARIA').reduce((s, t) => s + t.valor, 0);
      const matLimpeza = congTx.filter(t => t.categoria === 'DESPESA_LIMPEZA').reduce((s, t) => s + t.valor, 0);
      const viagem = congTx.filter(t => t.categoria === 'DESPESA_VIAGEM').reduce((s, t) => s + t.valor, 0);
      const despDiversas = congTx.filter(t => t.categoria === 'DESPESA_DIVERSAS' || t.categoria === 'OUTRAS_DESPESAS').reduce((s, t) => s + t.valor, 0);
      const totalDespesas = agua + luz + aluguel + iptu + jubilados + matCeia + matSecretaria + matLimpeza + viagem + despDiversas;

      // Pastors
      const pastor = congTx.filter(t => t.categoria === 'DESPESA_PESSOAL' || t.descricao.toLowerCase().includes('pastor')).reduce((s, t) => s + t.valor, 0);

      const saldo = receitaBruta - remessa - totalDespesas - pastor;

      return {
        congregacao: cong.nome,
        dizimos, ofertas, receitaBruta, remessa, missoes,
        agua, luz, aluguel, iptu, jubilados, matCeia, matSecretaria, matLimpeza, viagem, despDiversas, totalDespesas,
        pastor, saldo,
      };
    });

    // Filtrar apenas congregações com movimentação financeira
    return allData.filter(row => 
      row.receitaBruta > 0 || row.totalDespesas > 0 || row.pastor > 0
    );
  }, [transactions, selectedMonth, selectedCong, congregations, remittancePercentual, monthStart, monthEnd]);

  const totals = useMemo(() => {
    return monthlyData.reduce((acc, row) => ({
      dizimos: acc.dizimos + row.dizimos,
      ofertas: acc.ofertas + row.ofertas,
      receitaBruta: acc.receitaBruta + row.receitaBruta,
      remessa: acc.remessa + row.remessa,
      missoes: acc.missoes + row.missoes,
      agua: acc.agua + row.agua,
      luz: acc.luz + row.luz,
      aluguel: acc.aluguel + row.aluguel,
      iptu: acc.iptu + row.iptu,
      jubilados: acc.jubilados + row.jubilados,
      matCeia: acc.matCeia + row.matCeia,
      matSecretaria: acc.matSecretaria + row.matSecretaria,
      matLimpeza: acc.matLimpeza + row.matLimpeza,
      viagem: acc.viagem + row.viagem,
      despDiversas: acc.despDiversas + row.despDiversas,
      totalDespesas: acc.totalDespesas + row.totalDespesas,
      pastor: acc.pastor + row.pastor,
      saldo: acc.saldo + row.saldo,
    }), { dizimos: 0, ofertas: 0, receitaBruta: 0, remessa: 0, missoes: 0, agua: 0, luz: 0, aluguel: 0, iptu: 0, jubilados: 0, matCeia: 0, matSecretaria: 0, matLimpeza: 0, viagem: 0, despDiversas: 0, totalDespesas: 0, pastor: 0, saldo: 0 });
  }, [monthlyData]);

  // Filtrar apenas congregações com despesas de pastor
  const pastorData = useMemo(() => {
    return monthlyData
      .filter(row => row.pastor > 0)
      .map(row => {
        const cong = congregations.find(c => c.nome === row.congregacao);
        return {
          ...row,
          pastorNome: cong?.pastor || ''
        };
      });
  }, [monthlyData, congregations]);

  const handlePrint = () => window.print();

  const handleExportCSV = () => {
    const rows = monthlyData.map((r, i) => ({
      'Ord.': i + 1,
      'Congregação': r.congregacao,
      'Dízimos': r.dizimos.toFixed(2),
      'Ofertas': r.ofertas.toFixed(2),
      'Receita Bruta': r.receitaBruta.toFixed(2),
      [`Remessa ${remittancePercentual}%`]: r.remessa.toFixed(2),
      'Missões': r.missoes.toFixed(2),
      'Água': r.agua.toFixed(2),
      'Luz': r.luz.toFixed(2),
      'Aluguel': r.aluguel.toFixed(2),
      'IPTU': r.iptu.toFixed(2),
      'Jubilados': r.jubilados.toFixed(2),
      'Mat. Ceia': r.matCeia.toFixed(2),
      'Mat. Secretaria': r.matSecretaria.toFixed(2),
      'Mat. Limpeza': r.matLimpeza.toFixed(2),
      'Viagem': r.viagem.toFixed(2),
      'Desp. Diversas': r.despDiversas.toFixed(2),
      'Total Despesas': r.totalDespesas.toFixed(2),
      'Pastor': r.pastor.toFixed(2),
      'Saldo': r.saldo.toFixed(2),
    }));
    exportToCSV(rows, `remessa_${selectedMonth}`);
  };

  const monthName = format(monthStart, 'MMMM', { locale: ptBR });
  const yearStr = format(monthStart, 'yyyy');
  const periodStart = format(monthStart, 'dd/MM/yyyy');
  const periodEnd = format(monthEnd, 'dd/MM/yyyy');

  return (
    <div className="space-y-6">
      {/* Controls - hidden on print */}
      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none" />
        <select value={selectedCong} onChange={e => setSelectedCong(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-400 outline-none">
          <option value="all">Todas as Congregações</option>
          {congregations.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
        </select>
        <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
          <button 
            onClick={() => setFilterByCompetencia(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              !filterByCompetencia ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'
            }`}>
            Data Pagamento
          </button>
          <button 
            onClick={() => setFilterByCompetencia(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterByCompetencia ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'
            }`}>
            Competência
          </button>
        </div>
        <div className="flex-1" />
        <button onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700">
          <Download size={16} /> Exportar CSV
        </button>
        <button onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 text-white rounded-xl text-sm font-medium hover:bg-slate-800">
          <Printer size={16} /> Imprimir
        </button>
      </div>

      {/* Remittance rules info */}
      <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 print:hidden">
        <p className="text-sm text-indigo-700">
          <strong>Percentual de Remessa vigente:</strong> {remittancePercentual}% 
          <span className="text-indigo-500 ml-2">
            (Configurável em Configurações → Regras de Remessa por Período)
          </span>
        </p>
        <p className="text-sm text-indigo-700 mt-2">
          <strong>Modo de filtro:</strong> {filterByCompetencia ? 'Competência Contábil' : 'Data de Pagamento'}
          <span className="text-indigo-500 ml-2">
            {filterByCompetencia 
              ? '(Mostra transações com competência no mês selecionado)' 
              : '(Mostra transações pagas no mês selecionado)'}
          </span>
        </p>
      </div>

      {/* PRINTABLE REPORT - Landscape */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto print:border-0 print:rounded-none print:shadow-none">
        <div className="p-6 min-w-[1200px] print:min-w-0 print:p-2" style={{ fontFamily: 'Arial, sans-serif' }}>
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-base font-bold uppercase tracking-wide">PLANILHA MENSAL DE MOVIMENTAÇÃO FINANCEIRA</h1>
          </div>

          {/* Church info */}
          <div className="grid grid-cols-3 gap-4 text-xs mb-4 border-b pb-3">
            <div className="flex gap-2">
              <span className="font-semibold">Região:</span>
              <span>{config.regiao}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Cidade:</span>
              <span>{config.cidade || congregations[0]?.cidade || '---'}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Setor:</span>
              <span>{config.setor || '---'}</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 text-xs mb-6 border-b pb-3">
            <div className="flex gap-2">
              <span className="font-semibold">Ano:</span>
              <span>{yearStr}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Mês:</span>
              <span className="capitalize">{monthName}</span>
            </div>
            <div className="flex gap-2 col-span-2">
              <span className="font-semibold">Período:</span>
              <span>{periodStart} a {periodEnd}</span>
            </div>
          </div>

          {/* RECEITAS */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase mb-2 bg-slate-100 px-2 py-1 print:bg-slate-200">RECEITAS DO PERÍODO</h2>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-300">
                  <th className="text-left py-1 px-1 w-8">ORD.</th>
                  <th className="text-left py-1 px-1">CONGREGAÇÃO</th>
                  <th className="text-right py-1 px-1">DÍZIMOS</th>
                  <th className="text-right py-1 px-1">OFERTAS</th>
                  <th className="text-right py-1 px-1">RECEITA BRUTA (A)</th>
                  <th className="text-right py-1 px-1">REMESSA {remittancePercentual}% (B)</th>
                  <th className="text-right py-1 px-1">MISSÕES</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-1 px-1">{i + 1}</td>
                    <td className="py-1 px-1 font-medium">{row.congregacao}</td>
                    <td className="py-1 px-1 text-right">{formatCurrency(row.dizimos)}</td>
                    <td className="py-1 px-1 text-right">{formatCurrency(row.ofertas)}</td>
                    <td className="py-1 px-1 text-right font-medium">{formatCurrency(row.receitaBruta)}</td>
                    <td className="py-1 px-1 text-right">{formatCurrency(row.remessa)}</td>
                    <td className="py-1 px-1 text-right">{formatCurrency(row.missoes)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-slate-400 font-bold bg-slate-50">
                  <td className="py-1.5 px-1" colSpan={2}>TOTAL:</td>
                  <td className="py-1.5 px-1 text-right">{formatCurrency(totals.dizimos)}</td>
                  <td className="py-1.5 px-1 text-right">{formatCurrency(totals.ofertas)}</td>
                  <td className="py-1.5 px-1 text-right">{formatCurrency(totals.receitaBruta)}</td>
                  <td className="py-1.5 px-1 text-right">{formatCurrency(totals.remessa)}</td>
                  <td className="py-1.5 px-1 text-right">{formatCurrency(totals.missoes)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* DESPESAS */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase mb-2 bg-slate-100 px-2 py-1 print:bg-slate-200">DESPESAS DO PERÍODO</h2>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-300">
                  <th className="text-left py-1 px-1 w-8">ORD.</th>
                  <th className="text-left py-1 px-1">CONGREGAÇÃO</th>
                  <th className="text-right py-1 px-1">ÁGUA</th>
                  <th className="text-right py-1 px-1">LUZ</th>
                  <th className="text-right py-1 px-1">ALUGUEL</th>
                  <th className="text-right py-1 px-1">IPTU</th>
                  <th className="text-right py-1 px-1">JUBILADOS</th>
                  <th className="text-right py-1 px-1">MAT. CEIA</th>
                  <th className="text-right py-1 px-1">MAT. SECRET.</th>
                  <th className="text-right py-1 px-1">MAT. LIMPEZA</th>
                  <th className="text-right py-1 px-1">VIAGEM</th>
                  <th className="text-right py-1 px-1">DESP. DIVERSAS</th>
                  <th className="text-right py-1 px-1">TOTAL DESP. (C)</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-1 px-1">{i + 1}</td>
                    <td className="py-1 px-1 font-medium">{row.congregacao}</td>
                    <td className="py-1 px-1 text-right">{formatCurrency(row.agua)}</td>
                    <td className="py-1 px-1 text-right">{formatCurrency(row.luz)}</td>
                    <td className="py-1 px-1 text-right">{formatCurrency(row.aluguel)}</td>
                    <td className="py-1 px-1 text-right">{formatCurrency(row.iptu)}</td>
                    <td className="py-1 px-1 text-right">{formatCurrency(row.jubilados)}</td>
                    <td className="py-1 px-1 text-right">{formatCurrency(row.matCeia)}</td>
                    <td className="py-1 px-1 text-right">{formatCurrency(row.matSecretaria)}</td>
                    <td className="py-1 px-1 text-right">{formatCurrency(row.matLimpeza)}</td>
                    <td className="py-1 px-1 text-right">{formatCurrency(row.viagem)}</td>
                    <td className="py-1 px-1 text-right">{formatCurrency(row.despDiversas)}</td>
                    <td className="py-1 px-1 text-right font-medium">{formatCurrency(row.totalDespesas)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-slate-400 font-bold bg-slate-50">
                  <td className="py-1.5 px-1" colSpan={2}>TOTAL:</td>
                  <td className="py-1.5 px-1 text-right">{formatCurrency(totals.agua)}</td>
                  <td className="py-1.5 px-1 text-right">{formatCurrency(totals.luz)}</td>
                  <td className="py-1.5 px-1 text-right">{formatCurrency(totals.aluguel)}</td>
                  <td className="py-1.5 px-1 text-right">{formatCurrency(totals.iptu)}</td>
                  <td className="py-1.5 px-1 text-right">{formatCurrency(totals.jubilados)}</td>
                  <td className="py-1.5 px-1 text-right">{formatCurrency(totals.matCeia)}</td>
                  <td className="py-1.5 px-1 text-right">{formatCurrency(totals.matSecretaria)}</td>
                  <td className="py-1.5 px-1 text-right">{formatCurrency(totals.matLimpeza)}</td>
                  <td className="py-1.5 px-1 text-right">{formatCurrency(totals.viagem)}</td>
                  <td className="py-1.5 px-1 text-right">{formatCurrency(totals.despDiversas)}</td>
                  <td className="py-1.5 px-1 text-right">{formatCurrency(totals.totalDespesas)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* PASTOR */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase mb-2 bg-slate-100 px-2 py-1 print:bg-slate-200">PASTOR</h2>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-300">
                  <th className="text-left py-1 px-1 w-8">ORD.</th>
                  <th className="text-left py-1 px-1">CONGREGAÇÃO</th>
                  <th className="text-left py-1 px-1">PASTOR</th>
                  <th className="text-right py-1 px-1">TOTAL PASTOR (D)</th>
                  <th className="text-left py-1 px-1 w-32"></th>
                  <th className="text-left py-1 px-1">TESOUREIRO SETORIAL</th>
                  <th className="text-left py-1 px-1 w-32"></th>
                  <th className="text-left py-1 px-1">PASTOR REGIONAL</th>
                </tr>
              </thead>
              <tbody>
                {pastorData.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-1 px-1">{i + 1}</td>
                    <td className="py-1 px-1">{row.congregacao}</td>
                    <td className="py-1 px-1">{row.pastorNome}</td>
                    <td className="py-1 px-1 text-right">{formatCurrency(row.pastor)}</td>
                    <td></td>
                    <td className="py-1 px-1"></td>
                    <td></td>
                    <td className="py-1 px-1"></td>
                  </tr>
                ))}
                <tr className="border-t-2 border-slate-400 font-bold bg-slate-50">
                  <td className="py-1.5 px-1" colSpan={3}>TOTAL:</td>
                  <td className="py-1.5 px-1 text-right">{formatCurrency(totals.pastor)}</td>
                  <td></td>
                  <td className="py-1.5 px-1 text-xs">PASTOR SETORIAL</td>
                  <td></td>
                  <td className="py-1.5 px-1 text-xs">TESOUREIRO SEDE</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* SALDO */}
          <div className="border-t-2 border-slate-400 pt-3 mt-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs font-bold">
                  SALDO (E = A - B - C - D): <span className="text-sm">{formatCurrency(totals.saldo)}</span>
                </p>
              </div>
              <div className="text-right text-xs">
                <p>{config.cidade || 'Cidade'}/{congregations[0]?.cidade?.split('-')[1] || 'UF'}, {new Date().getDate()} de {monthName} de {yearStr}.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
