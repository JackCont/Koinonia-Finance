import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getTransactions, getMembers, getCommitments, getConfig } from '../store';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
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

    const monthTransactions = transactions.filter(t => {
      const d = parseISO(t.data);
      return isWithinInterval(d, { start: monthStart, end: monthEnd }) && !t.estornada;
    });

    const entradas = monthTransactions
      .filter(t => t.tipo === 'ENTRADA')
      .reduce((sum, t) => sum + t.valor, 0);
    
    const saidas = monthTransactions
      .filter(t => t.tipo === 'SAIDA')
      .reduce((sum, t) => sum + t.valor, 0);

    const totalEntradas = transactions
      .filter(t => t.tipo === 'ENTRADA' && !t.estornada)
      .reduce((sum, t) => sum + t.valor, 0);
    
    const totalSaidas = transactions
      .filter(t => t.tipo === 'SAIDA' && !t.estornada)
      .reduce((sum, t) => sum + t.valor, 0);

    const dizimos = monthTransactions
      .filter(t => t.categoria === 'DIZIMO')
      .reduce((sum, t) => sum + t.valor, 0);

    const ofertas = monthTransactions
      .filter(t => t.categoria === 'OFERTA')
      .reduce((sum, t) => sum + t.valor, 0);

    const compromissosPendentes = commitments.filter(c => c.status === 'PENDENTE').length;

    return {
      entradas, saidas, saldo: entradas - saidas,
      totalEntradas, totalSaidas, saldoTotal: totalEntradas - totalSaidas,
      dizimos, ofertas,
      totalMembros: members.filter(m => m.status === 'ATIVO').length,
      compromissosPendentes,
      totalTransacoes: monthTransactions.length,
    };
  }, [transactions, members, commitments]);

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .filter(t => !t.estornada)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8);
  }, [transactions]);

  const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-6">
      {/* Church name */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200">
        <h1 className="text-2xl font-bold">{config.nomeIgreja}</h1>
        <p className="text-indigo-200 mt-1">
          {format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Entradas do Mês"
          value={formatCurrency(stats.entradas)}
          icon={<TrendingUp size={20} />}
          color="emerald"
          trend={stats.entradas > 0 ? 'up' : undefined}
        />
        <StatCard
          title="Saídas do Mês"
          value={formatCurrency(stats.saidas)}
          icon={<TrendingDown size={20} />}
          color="red"
          trend={stats.saidas > 0 ? 'down' : undefined}
        />
        <StatCard
          title="Saldo do Mês"
          value={formatCurrency(stats.saldo)}
          icon={<DollarSign size={20} />}
          color={stats.saldo >= 0 ? 'blue' : 'amber'}
        />
        <StatCard
          title="Membros Ativos"
          value={stats.totalMembros.toString()}
          icon={<Users size={20} />}
          color="purple"
        />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Dízimos (mês)</p>
              <p className="text-xl font-bold text-emerald-600">{formatCurrency(stats.dizimos)}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <ArrowUpRight size={20} className="text-emerald-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Ofertas (mês)</p>
              <p className="text-xl font-bold text-blue-600">{formatCurrency(stats.ofertas)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <ArrowUpRight size={20} className="text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Compromissos Pendentes</p>
              <p className="text-xl font-bold text-amber-600">{stats.compromissosPendentes}</p>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <ArrowDownRight size={20} className="text-amber-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Balance & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall balance */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">Saldo Acumulado</h3>
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
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Repasse ({config.taxaDenominacional}%)</span>
              <span className="font-medium text-indigo-600">
                {formatCurrency(stats.dizimos * config.taxaDenominacional / 100)}
              </span>
            </div>
          </div>
        </div>

        {/* Recent transactions */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Últimos Lançamentos</h3>
            <button 
              onClick={() => onNavigate('transactions')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Ver todos →
            </button>
          </div>
          <div className="space-y-2">
            {recentTransactions.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">Nenhum lançamento registrado</p>
            ) : (
              recentTransactions.map(t => (
                <div key={t.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${t.tipo === 'ENTRADA' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    <div>
                      <p className="text-sm font-medium text-slate-700">{t.descricao}</p>
                      <p className="text-xs text-slate-400">{format(parseISO(t.data), 'dd/MM/yyyy')}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${t.tipo === 'ENTRADA' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {t.tipo === 'ENTRADA' ? '+' : '-'}{formatCurrency(t.valor)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, trend }: { 
  title: string; value: string; icon: React.ReactNode; color: string; trend?: 'up' | 'down' 
}) {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-xl font-bold text-slate-800 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color] || colors.blue}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
