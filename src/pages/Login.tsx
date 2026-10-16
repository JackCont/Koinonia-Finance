import { useState } from 'react';
import { Church, Lock, User, AlertCircle } from 'lucide-react';
import { authenticateUser } from '../store';
import { User as UserType } from '../types';

interface Props {
  onLogin: (user: UserType) => void;
}

export default function Login({ onLogin }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const user = authenticateUser(username, password);
      if (user) {
        onLogin(user);
      } else {
        setError('Usuário ou senha inválidos, ou conta desativada.');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Church size={32} className="text-amber-300" />
            </div>
            <h1 className="text-2xl font-bold text-white">Tesouraria Digital</h1>
            <p className="text-indigo-200 text-sm mt-1">Gestão Eclesiástica Integrada</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-indigo-200 mb-1.5 block">Usuário</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300/50 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all"
                  placeholder="Digite seu usuário"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-indigo-200 mb-1.5 block">Senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300/50 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all"
                  placeholder="Digite sua senha"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-400/30 rounded-xl text-red-200 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-white/10 text-center space-y-2">
            <p className="text-xs text-indigo-300/50">
              🔒 Acesso restrito a usuários autorizados
            </p>
            <button
              type="button"
              onClick={() => setShowHelp(true)}
              className="text-xs text-amber-300/80 hover:text-amber-300 underline transition-colors"
            >
              Primeiro acesso? Clique aqui
            </button>
          </div>
        </div>

        {/* Help Modal */}
        {showHelp && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setShowHelp(false)}>
            <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-slate-800 mb-4">👋 Bem-vindo ao Tesouraria Digital</h3>
              <div className="space-y-3 text-sm text-slate-600">
                <p><strong>1.</strong> Solicite suas credenciais ao administrador do sistema da sua igreja.</p>
                <p><strong>2.</strong> Digite o usuário e senha fornecidos nos campos acima.</p>
                <p><strong>3.</strong> Após o login, você terá acesso ao painel principal com todas as funcionalidades.</p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                  <p className="text-xs text-amber-800">
                    💡 <strong>Dica:</strong> Se você é o administrador e ainda não configurou o sistema, acesse as configurações após o login para cadastrar congregações, membros e regras de remessa.
                  </p>
                </div>
                <p className="text-xs text-slate-400 mt-4">
                  Precisa de ajuda? Entre em contato com o suporte técnico da sua região.
                </p>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="w-full mt-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
              >
                Entendi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
