import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, ArrowUpRight, ArrowDownRight, BarChart3, PieChart, Target } from 'lucide-react';
import { getTransactions, getMembers, getCommitments, getConfig, getActiveRemittancePercentual } from '../store';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  onNavigate: (page: any) => void;
}

export default function Dashboard({ onNavigate }: Props) {
  const config = getConfig();
  const transactions = getTransactions();
  const members = getMembers();
  const commitments = getCommitments();

  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const prevMonthStart = startOfMonth(subMonths(now, 1));
    const prevMonthEnd = endOfMonth(subMonths(now, 1));

    const monthTx = transactions.filter(t => {
      const d = parseISO(t.data);
      return isWithinInterval(d, { start: monthStart, end: monthEnd }) && !t.estornada;
    });

    const prevMonthTx = transactions.filter(t => {
      const d = parseISO(t.data);
      return isWithinInterval(d, { start: prevMonthStart, end: prevMonthEnd }) && !t.estornada;
    });

    const entradas = monthTx.filter(t => t.tipo === 'ENTRADA').reduce((s, t) => s + t.valor, 0);
    const saidas = monthTx.filter(t => t.tipo === 'SAIDA').reduce((s, t) => s + t.valor, 0);
    const prevEntradas = prevMonthTx.filter(t => t.tipo === 'ENTRADA').reduce((s, t) => s + t.valor, 0);
    const prevSaidas = prevMonthTx.filter(t => t.tipo === 'SAIDA').reduce((s, t) => s + t.valor, 0);

    const totalEntradas = transactions.filter(t => t.tipo === 'ENTRADA' && !t.estornada).reduce((s, t) => s + t.valor, 0);
    const totalSaidas = transactions.filter(t => t.tipo === 'SAIDA' && !t.estornada).reduce((s, t) => s + t.valor, 0);

    const dizimos = monthTx.filter(t => t.categoria === 'DIZIMO').reduce((s, t) => s + t.valor, 0);
    const ofertas = monthTx.filter(t => t.categoria === 'OFERTA').reduce((s, t) => s + t.valor, 0);
    const remessa = dizimos * getActiveRemittancePercentual() / 100;

    // Top contributors this month
    const memberContribs: Record<string, { nome: string; total: number }> = {};
    monthTx.filter(t => t.memberId).forEach(t => {
      const member = members.find(m => m.id === t.memberId);
      if (!member) return;
      if (!memberContribs[t.memberId!]) memberContribs[t.memberId!] = { nome: member.nome, total: 0 };
      memberContribs[t.memberId!].total += t.valor;
    });
    const topContributors = Object.values(memberContribs).sort((a, b) => b.total - a.total).slice(0, 5);

    // Category breakdown
    const categoryBreakdown: Record<string, number> = {};
    monthTx.forEach(t => {
      categoryBreakdown[t.categoria] = (categoryBreakdown[t.categoria] || 0) + t.valor;
    });

    // Monthly trend (last 6 months)
    const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(now, 5 - i);
      const mStart = startOfMonth(date);
      const mEnd = endOfMonth(date);
      const mTx = transactions.filter(t => {
        const d = parseISO(t.data);
        return isWithinInterval(d, { start: mStart, end: mEnd }) && !t.estornada;
      });
      return {
        month: format(date, 'MMM', { locale: ptBR }),
        entradas: mTx.filter(t => t.tipo === 'ENTRADA').reduce((s, t) => s + t.valor, 0),
        saidas: mTx.filter(t => t.tipo === 'SAIDA').reduce((s, t) => s + t.valor, 0),
      };
    });

    const entradaTrend = prevEntradas > 0 ? ((entradas - prevEntradas) / prevEntradas * 100) : 0;

    return {
      entradas, saidas, saldo: entradas - saidas,
      totalEntradas, totalSaidas, saldoTotal: totalEntradas - totalSaidas,
      dizimos, ofertas, remessa,
      totalMembros: members.filter(m => m.status === 'ATIVO').length,
      compromissosPendentes: commitments.filter(c => c.status === 'PENDENTE').length,
      totalTransacoes: monthTx.length,
      topContributors, categoryBreakdown, monthlyTrend,
      entradaTrend,
    };
  }, [transactions, members, commitments]);

  const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const maxTrend = Math.max(...stats.monthlyTrend.map(m => Math.max(m.entradas, m.saidas)), 1);

  // Check if this is a fresh install
  const isFirstAccess = transactions.length === 0 && members.length === 0;

  return (
    <div className="space-y-6">
      {/* First access guide */}
      {isFirstAccess && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">👋</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-amber-900 text-lg">Bem-vindo ao Tesouraria Digital!</h3>
              <p className="text-amber-800 text-sm mt-1">Veja como começar a usar o sistema:</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button onClick={() => onNavigate('settings')} className="text-left p-3 bg-white rounded-xl border border-amber-200 hover:border-amber-400 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <span className="font-semibold text-sm text-slate-800">Configurar Igreja</span>
                  </div>
                  <p className="text-xs text-slate-500 ml-8">Cadastre dados da igreja, região e congregações</p>
                </button>
                <button onClick={() => onNavigate('members')} className="text-left p-3 bg-white rounded-xl border border-amber-200 hover:border-amber-400 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <span className="font-semibold text-sm text-slate-800">Cadastrar Membros</span>
                  </div>
                  <p className="text-xs text-slate-500 ml-8">Adicione dizimistas ou importe via CSV</p>
                </button>
                <button onClick={() => onNavigate('transactions')} className="text-left p-3 bg-white rounded-xl border border-amber-200 hover:border-amber-400 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <span className="font-semibold text-sm text-slate-800">Registrar Lançamentos</span>
                  </div>
                  <p className="text-xs text-slate-500 ml-8">Comece a registrar dízimos, ofertas e despesas</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200">
        <h1 className="text-2xl font-bold">{config.nomeIgreja}</h1>
        <p className="text-indigo-200 mt-1">
          {config.regiao} • {format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Entradas do Mês</p>
              <p className="text-xl font-bold text-slate-800">{formatCurrency(stats.entradas)}</p>
              {stats.entradaTrend !== 0 && (
                <p className={`text-xs mt-1 ${stats.entradaTrend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {stats.entradaTrend > 0 ? '↑' : '↓'} {Math.abs(stats.entradaTrend).toFixed(1)}% vs mês anterior
                </p>
              )}
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <TrendingUp size={20} className="text-emerald-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Saídas do Mês</p>
              <p className="text-xl font-bold text-slate-800">{formatCurrency(stats.saidas)}</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <TrendingDown size={20} className="text-red-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Saldo do Mês</p>
              <p className={`text-xl font-bold ${stats.saldo >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatCurrency(stats.saldo)}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stats.saldo >= 0 ? 'bg-blue-50' : 'bg-amber-50'}`}>
              <DollarSign size={20} className={stats.saldo >= 0 ? 'text-blue-500' : 'text-amber-500'} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Membros Ativos</p>
              <p className="text-xl font-bold text-slate-800">{stats.totalMembros}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Users size={20} className="text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
          <p className="text-xs text-emerald-600 font-medium">Dízimos (mês)</p>
          <p className="text-lg font-bold text-emerald-700">{formatCurrency(stats.dizimos)}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-xs text-blue-600 font-medium">Ofertas (mês)</p>
          <p className="text-lg font-bold text-blue-700">{formatCurrency(stats.ofertas)}</p>
        </div>
        <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
          <p className="text-xs text-indigo-600 font-medium">Remessa ({getActiveRemittancePercentual()}%)</p>
          <p className="text-lg font-bold text-indigo-700">{formatCurrency(stats.remessa)}</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <p className="text-xs text-amber-600 font-medium">Compromissos Pendentes</p>
          <p className="text-lg font-bold text-amber-700">{stats.compromissosPendentes}</p>
        </div>
      </div>

      {/* Charts and details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly trend */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 size={18} /> Tendência Mensal (últimos 6 meses)
          </h3>
          <div className="space-y-3">
            {stats.monthlyTrend.map(m => (
              <div key={m.month} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-10 capitalize">{m.month}</span>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${(m.entradas / maxTrend) * 100}%` }} />
                  </div>
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-400 rounded-full transition-all" style={{ width: `${(m.saidas / maxTrend) * 100}%` }} />
                  </div>
                </div>
                <span className="text-xs text-slate-500 w-24 text-right">{formatCurrency(m.entradas - m.saidas)}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-400 rounded" /> Entradas</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-400 rounded" /> Saídas</span>
          </div>
        </div>

        {/* Balance */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Target size={18} /> Saldo Acumulado
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Total Entradas</span>
              <span className="font-medium text-emerald-600">{formatCurrency(stats.totalEntradas)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Total Saídas</span>
              <span className="font-medium text-red-600">{formatCurrency(stats.totalSaidas)}</span>
            </div>
            <hr />
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-700">Saldo Total</span>
              <span className={`text-lg font-bold ${stats.saldoTotal >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatCurrency(stats.saldoTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top contributors & categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top contributors */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <ArrowUpRight size={18} /> Maiores Contribuintes do Mês
          </h3>
          {stats.topContributors.length > 0 ? (
            <div className="space-y-3">
              {stats.topContributors.map((c, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    <span className="text-sm text-slate-700">{c.nome}</span>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">{formatCurrency(c.total)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-4">Nenhum contribuinte registrado neste mês</p>
          )}
        </div>

        {/* Category breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <PieChart size={18} /> Movimentação por Categoria
          </h3>
          {Object.keys(stats.categoryBreakdown).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(stats.categoryBreakdown)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 6)
                .map(([cat, val]) => {
                  const total = Object.values(stats.categoryBreakdown).reduce((s, v) => s + v, 0);
                  const pct = (val / total * 100);
                  const catConfig = config.categories.find(c => c.nome === cat);
                  return (
                    <div key={cat} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: catConfig?.cor || '#64748b' }} />
                      <span className="text-xs text-slate-600 w-28 truncate">{cat}</span>
                      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: catConfig?.cor || '#64748b' }} />
                      </div>
                      <span className="text-xs text-slate-500 w-16 text-right">{formatCurrency(val)}</span>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-4">Nenhuma movimentação neste mês</p>
          )}
        </div>
      </div>

      {/* Quick actions - prominent */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
        <h3 className="text-sm font-semibold text-indigo-900 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs">⚡</span>
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button onClick={() => onNavigate('transactions')} className="group p-5 bg-white rounded-xl border-2 border-transparent hover:border-indigo-400 hover:shadow-lg transition-all text-center">
            <div className="w-12 h-12 bg-indigo-100 group-hover:bg-indigo-200 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors">
              <ArrowUpRight size={24} className="text-indigo-600" />
            </div>
            <p className="text-sm font-semibold text-slate-800">Novo Lançamento</p>
            <p className="text-xs text-slate-500 mt-1">Registrar dízimo, oferta ou despesa</p>
          </button>
          <button onClick={() => onNavigate('members')} className="group p-5 bg-white rounded-xl border-2 border-transparent hover:border-purple-400 hover:shadow-lg transition-all text-center">
            <div className="w-12 h-12 bg-purple-100 group-hover:bg-purple-200 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors">
              <Users size={24} className="text-purple-600" />
            </div>
            <p className="text-sm font-semibold text-slate-800">Cadastrar Membro</p>
            <p className="text-xs text-slate-500 mt-1">Adicionar ou gerenciar dizimistas</p>
          </button>
          <button onClick={() => onNavigate('remittance')} className="group p-5 bg-white rounded-xl border-2 border-transparent hover:border-emerald-400 hover:shadow-lg transition-all text-center">
            <div className="w-12 h-12 bg-emerald-100 group-hover:bg-emerald-200 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors">
              <DollarSign size={24} className="text-emerald-600" />
            </div>
            <p className="text-sm font-semibold text-slate-800">Gerar Remessa</p>
            <p className="text-xs text-slate-500 mt-1">Planilha mensal de movimentação</p>
          </button>
          <button onClick={() => onNavigate('reports')} className="group p-5 bg-white rounded-xl border-2 border-transparent hover:border-amber-400 hover:shadow-lg transition-all text-center">
            <div className="w-12 h-12 bg-amber-100 group-hover:bg-amber-200 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors">
              <BarChart3 size={24} className="text-amber-600" />
            </div>
            <p className="text-sm font-semibold text-slate-800">Relatórios</p>
            <p className="text-xs text-slate-500 mt-1">Balancetes e análises</p>
          </button>
        </div>
      </div>
    </div>
  );
}
