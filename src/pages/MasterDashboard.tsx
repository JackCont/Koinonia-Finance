import { useState, useMemo } from 'react';
import { Building2, Users, TrendingUp, DollarSign, Church, MapPin } from 'lucide-react';
import { getChurches, getCongregations, getMembers, getTransactions } from '../store';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function MasterDashboard() {
  const churches = getChurches();
  const congregations = getCongregations();
  const members = getMembers();
  const transactions = getTransactions();

  const stats = useMemo(() => {
    const totalChurches = churches.length;
    const activeChurches = churches.filter(c => c.ativo).length;
    const totalCongregations = congregations.length;
    const activeCongregations = congregations.filter(c => c.ativo).length;
    const totalMembers = members.filter(m => m.status === 'ATIVO').length;
    
    const currentMonth = format(new Date(), 'yyyy-MM');
    const monthTransactions = transactions.filter(t => 
      t.data.startsWith(currentMonth) && !t.estornada
    );
    
    const entradas = monthTransactions
      .filter(t => t.tipo === 'ENTRADA')
      .reduce((sum, t) => sum + t.valor, 0);
    
    const saidas = monthTransactions
      .filter(t => t.tipo === 'SAIDA')
      .reduce((sum, t) => sum + t.valor, 0);

    return {
      totalChurches,
      activeChurches,
      totalCongregations,
      activeCongregations,
      totalMembers,
      entradas,
      saidas,
      saldo: entradas - saidas,
    };
  }, [churches, congregations, members, transactions]);

  const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building2 size={28} />
          Painel Geral do Master
        </h1>
        <p className="text-indigo-100 mt-1">Visão consolidada de todas as igrejas e denominações</p>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total de Igrejas</p>
              <p className="text-2xl font-bold text-slate-800">{stats.totalChurches}</p>
              <p className="text-xs text-emerald-600 mt-1">{stats.activeChurches} ativas</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Building2 size={24} className="text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total de Congregações</p>
              <p className="text-2xl font-bold text-slate-800">{stats.totalCongregations}</p>
              <p className="text-xs text-emerald-600 mt-1">{stats.activeCongregations} ativas</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Church size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total de Membros</p>
              <p className="text-2xl font-bold text-slate-800">{stats.totalMembers}</p>
              <p className="text-xs text-slate-500 mt-1">Membros ativos</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Users size={24} className="text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Saldo do Mês</p>
              <p className={`text-2xl font-bold ${stats.saldo >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatCurrency(stats.saldo)}
              </p>
              <p className="text-xs text-slate-500 mt-1">{format(new Date(), 'MMMM/yyyy', { locale: ptBR })}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <DollarSign size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Igrejas */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Building2 size={20} className="text-indigo-600" />
          Igrejas Cadastradas
        </h2>
        
        {churches.length === 0 ? (
          <div className="text-center py-12">
            <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">Nenhuma igreja cadastrada</p>
            <p className="text-xs text-slate-400 mt-2">Acesse o menu "Igrejas" para cadastrar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {churches.map(church => {
              const churchCongregations = congregations.filter(c => c.churchId === church.id);
              const churchMembers = members.filter(m => 
                churchCongregations.some(c => c.nome === m.congregacao)
              );
              const activePastor = church.localPastors?.find(p => p.ativo);

              return (
                <div key={church.id} className={`border-2 rounded-xl p-4 transition-all hover:shadow-md ${
                  church.ativo ? 'border-emerald-200 bg-emerald-50/30' : 'border-red-200 bg-red-50/30 opacity-75'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800">{church.nome}</h3>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin size={12} />
                        {church.cidade} {church.setor && `• ${church.setor}`}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      church.ativo ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {church.ativo ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Congregações:</span>
                      <span className="font-semibold text-slate-800">{churchCongregations.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Membros:</span>
                      <span className="font-semibold text-slate-800">{churchMembers.length}</span>
                    </div>
                    {activePastor && (
                      <div className="pt-2 border-t border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">Pastor Atual:</p>
                        <p className="text-sm font-medium text-indigo-600">{activePastor.nome}</p>
                        <p className="text-xs text-slate-500">
                          Desde {format(parseISO(activePastor.dataInicio), 'dd/MM/yyyy')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fluxo de Caixa Consolidado */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-emerald-600" />
          Fluxo de Caixa Consolidado
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <p className="text-xs text-emerald-700 font-medium mb-1">Total de Entradas</p>
            <p className="text-2xl font-bold text-emerald-800">{formatCurrency(stats.entradas)}</p>
            <p className="text-xs text-emerald-600 mt-1">Mês atual</p>
          </div>

          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <p className="text-xs text-red-700 font-medium mb-1">Total de Saídas</p>
            <p className="text-2xl font-bold text-red-800">{formatCurrency(stats.saidas)}</p>
            <p className="text-xs text-red-600 mt-1">Mês atual</p>
          </div>

          <div className={`rounded-lg p-4 border ${
            stats.saldo >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'
          }`}>
            <p className={`text-xs font-medium mb-1 ${
              stats.saldo >= 0 ? 'text-blue-700' : 'text-orange-700'
            }`}>Saldo Consolidado</p>
            <p className={`text-2xl font-bold ${
              stats.saldo >= 0 ? 'text-blue-800' : 'text-orange-800'
            }`}>{formatCurrency(stats.saldo)}</p>
            <p className={`text-xs mt-1 ${
              stats.saldo >= 0 ? 'text-blue-600' : 'text-orange-600'
            }`}>Todas as igrejas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
