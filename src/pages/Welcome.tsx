import { Church, ArrowRight, Shield, Database, Users } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export default function Welcome({ onStart }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/30">
              <Church size={48} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">Tesouraria Digital</h1>
            <p className="text-xl text-indigo-200">Gestão Eclesiástica Integrada</p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-3">
                <Database size={20} className="text-emerald-400" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Armazenamento Seguro</h3>
              <p className="text-xs text-indigo-200/70">Dados locais com backup criptografado</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mb-3">
                <Users size={20} className="text-blue-400" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Multi-usuário</h3>
              <p className="text-xs text-indigo-200/70">Controle de acesso por perfis</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center mb-3">
                <Shield size={20} className="text-purple-400" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Auditoria Completa</h3>
              <p className="text-xs text-indigo-200/70">Trilha de alterações e integridade</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button
              onClick={onStart}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl font-bold text-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105"
            >
              <span>Acessar Sistema</span>
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-xs text-indigo-300/50 mt-4">
              Clique para fazer login e acessar o painel
            </p>
          </div>
        </div>

        {/* Version */}
        <div className="text-center mt-6">
          <p className="text-xs text-indigo-300/40">
            Versão 2.0.0 • Desenvolvido para igrejas evangélicas
          </p>
        </div>
      </div>
    </div>
  );
}
