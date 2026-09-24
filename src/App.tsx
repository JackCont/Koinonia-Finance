import { useState } from 'react';
import { 
  LayoutDashboard, Users, ArrowLeftRight, TrendingUp, FileText, 
  Settings, Download, Upload, Menu, X, Church, ClipboardList
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Transactions from './pages/Transactions';
import CashFlow from './pages/CashFlow';
import Reports from './pages/Reports';
import SettingsPage from './pages/Settings';
import ImportExport from './pages/ImportExport';
import Commitments from './pages/Commitments';

type Page = 'dashboard' | 'members' | 'transactions' | 'cashflow' | 'reports' | 'settings' | 'importexport' | 'commitments';

const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Painel', icon: <LayoutDashboard size={20} /> },
  { id: 'members', label: 'Membros', icon: <Users size={20} /> },
  { id: 'transactions', label: 'Lançamentos', icon: <ArrowLeftRight size={20} /> },
  { id: 'commitments', label: 'Compromissos', icon: <ClipboardList size={20} /> },
  { id: 'cashflow', label: 'Fluxo de Caixa', icon: <TrendingUp size={20} /> },
  { id: 'reports', label: 'Relatórios', icon: <FileText size={20} /> },
  { id: 'importexport', label: 'Importar/Exportar', icon: <Download size={20} /> },
  { id: 'settings', label: 'Configurações', icon: <Settings size={20} /> },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentPage} />;
      case 'members': return <Members />;
      case 'transactions': return <Transactions />;
      case 'commitments': return <Commitments />;
      case 'cashflow': return <CashFlow />;
      case 'reports': return <Reports />;
      case 'settings': return <SettingsPage />;
      case 'importexport': return <ImportExport />;
      default: return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-indigo-900 via-indigo-800 to-purple-900 
        transform transition-transform duration-300 ease-in-out shadow-2xl
        lg:translate-x-0 lg:static lg:inset-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-indigo-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Church size={24} className="text-amber-300" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">Tesouraria</h1>
              <p className="text-indigo-300 text-xs">Gestão Eclesiástica</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setCurrentPage(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${currentPage === item.id 
                  ? 'bg-white/15 text-white shadow-lg shadow-indigo-900/30 backdrop-blur-sm' 
                  : 'text-indigo-200 hover:bg-white/8 hover:text-white'
                }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-700/50">
          <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-indigo-300 text-xs">Armazenamento Local</p>
            <p className="text-white text-xs mt-1">Dados salvos no navegador</p>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 min-h-screen overflow-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <h2 className="text-lg font-semibold text-slate-800">
                {navItems.find(n => n.id === currentPage)?.label || 'Painel'}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage('importexport')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Upload size={16} />
                <span className="hidden sm:inline">Backup</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 lg:p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
