import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, ArrowLeftRight, TrendingUp, FileText, 
  Settings, Download, Upload, Menu, X, Church, ClipboardList,
  Shield, LogOut, FileSpreadsheet, Palette, Calendar, DollarSign, Target, Building2
} from 'lucide-react';
import { getCurrentUser, logout, getTheme } from './store';
import { User } from './types';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Transactions from './pages/Transactions';
import CashFlow from './pages/CashFlow';
import Reports from './pages/Reports';
import SettingsPage from './pages/Settings';
import ImportExport from './pages/ImportExport';
import Commitments from './pages/Commitments';
import AdminUsers from './pages/AdminUsers';
import Remittance from './pages/Remittance';
import Customization from './pages/Customization';
import CultsManagement from './pages/CultsManagement';
import Congregations from './pages/Congregations';
import FixedValuesConfig from './pages/FixedValuesConfig';
import Provisions from './pages/Provisions';
import ProvisionsReport from './pages/ProvisionsReport';
import Churches from './pages/Churches';
import MasterDashboard from './pages/MasterDashboard';

type Page = 'dashboard' | 'masterdashboard' | 'members' | 'transactions' | 'cashflow' | 'reports' | 'settings' | 'importexport' | 'commitments' | 'admin' | 'remittance' | 'customization' | 'cults' | 'congregations' | 'fixedvalues' | 'provisions' | 'provisionsreport' | 'churches';

interface NavItem {
  id: Page;
  label: string;
  icon: React.ReactNode;
  roles: string[];
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Painel', icon: <LayoutDashboard size={20} />, roles: ['MASTER', 'ADMIN', 'TESOURARIA', 'CONSELHO', 'CONTADOR'] },
  { id: 'masterdashboard', label: 'Painel Master', icon: <Building2 size={20} />, roles: ['MASTER'] },
  { id: 'churches', label: 'Igrejas', icon: <Building2 size={20} />, roles: ['MASTER', 'ADMIN'] },
  { id: 'members', label: 'Membros', icon: <Users size={20} />, roles: ['MASTER', 'ADMIN', 'TESOURARIA'] },
  { id: 'congregations', label: 'Congregações', icon: <Church size={20} />, roles: ['MASTER', 'ADMIN', 'TESOURARIA'] },
  { id: 'transactions', label: 'Lançamentos', icon: <ArrowLeftRight size={20} />, roles: ['MASTER', 'ADMIN', 'TESOURARIA'] },
  { id: 'cults', label: 'Cultos', icon: <Calendar size={20} />, roles: ['MASTER', 'ADMIN', 'TESOURARIA'] },
  { id: 'commitments', label: 'Compromissos', icon: <ClipboardList size={20} />, roles: ['MASTER', 'ADMIN', 'TESOURARIA'] },
  { id: 'provisions', label: 'Provisões', icon: <FileText size={20} />, roles: ['MASTER', 'ADMIN', 'TESOURARIA'] },
  { id: 'provisionsreport', label: 'Rel. Provisões', icon: <FileText size={20} />, roles: ['MASTER', 'ADMIN', 'TESOURARIA', 'CONSELHO', 'CONTADOR'] },
  { id: 'remittance', label: 'Remessa Mensal', icon: <FileSpreadsheet size={20} />, roles: ['MASTER', 'ADMIN', 'TESOURARIA', 'CONTADOR'] },
  { id: 'cashflow', label: 'Fluxo de Caixa', icon: <TrendingUp size={20} />, roles: ['MASTER', 'ADMIN', 'TESOURARIA', 'CONSELHO', 'CONTADOR'] },
  { id: 'reports', label: 'Relatórios', icon: <FileText size={20} />, roles: ['MASTER', 'ADMIN', 'TESOURARIA', 'CONSELHO', 'CONTADOR'] },
  { id: 'fixedvalues', label: 'Valores Fixos', icon: <DollarSign size={20} />, roles: ['MASTER', 'ADMIN'] },
  { id: 'importexport', label: 'Importar/Exportar', icon: <Download size={20} />, roles: ['MASTER', 'ADMIN', 'TESOURARIA'] },
  { id: 'admin', label: 'Administração', icon: <Shield size={20} />, roles: ['MASTER', 'ADMIN'] },
  { id: 'settings', label: 'Configurações', icon: <Settings size={20} />, roles: ['MASTER', 'ADMIN'] },
  { id: 'customization', label: 'Personalizar', icon: <Palette size={20} />, roles: ['MASTER', 'ADMIN'] },
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const userNavItems = navItems.filter(item => item.roles.includes(user.role));

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentPage} />;
      case 'members': return <Members />;
      case 'transactions': return <Transactions />;
      case 'commitments': return <Commitments />;
      case 'remittance': return <Remittance />;
      case 'cashflow': return <CashFlow />;
      case 'reports': return <Reports />;
      case 'settings': return <SettingsPage />;
      case 'importexport': return <ImportExport />;
      case 'admin': return <AdminUsers />;
      case 'customization': return <Customization />;
      case 'cults': return <CultsManagement />;
      case 'congregations': return <Congregations />;
      case 'fixedvalues': return <FixedValuesConfig />;
      case 'provisions': return <Provisions />;
      case 'provisionsreport': return <ProvisionsReport />;
      case 'churches': return <Churches />;
      case 'masterdashboard': return <MasterDashboard />;
      default: return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  // Aplicar tema
  const theme = getTheme();

  const roleLabels: Record<string, string> = {
    MASTER: 'Master',
    ADMIN: 'Administrador',
    TESOURARIA: 'Tesouraria',
    CONSELHO: 'Conselho Fiscal',
    CONTADOR: 'Contador',
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex"
      style={{
        '--theme-primary': theme.primaryColor,
        '--theme-secondary': theme.secondaryColor,
        '--theme-accent': theme.accentColor,
        '--theme-button': theme.buttonPrimary,
        '--theme-button-hover': theme.buttonPrimaryHover,
      } as React.CSSProperties}
    >
      {/* Sidebar */}
      <aside 
        className={`
        fixed inset-y-0 left-0 z-50 w-64
        transform transition-transform duration-300 ease-in-out shadow-2xl
        lg:translate-x-0 lg:static lg:inset-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
        style={{
          background: `linear-gradient(to bottom, ${theme.sidebarGradientFrom}, ${theme.sidebarGradientVia}, ${theme.sidebarGradientTo})`
        }}
      >
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
        
        <nav className="p-4 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
          {userNavItems.map((item, index) => (
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
              <span className="flex-1 text-left">{item.label}</span>
              {index === 0 && currentPage !== 'dashboard' && (
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" title="Comece por aqui" />
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-700/50">
          <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-xs font-medium truncate">{user.nome}</p>
                <p className="text-indigo-300 text-xs">{roleLabels[user.role]}</p>
              </div>
              <button onClick={handleLogout} className="p-2 text-indigo-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Sair">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main className="flex-1 min-h-screen overflow-auto">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100">
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <h2 className="text-lg font-semibold text-slate-800">
                {userNavItems.find(n => n.id === currentPage)?.label || 'Painel'}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 hidden sm:block">
                {user.nome} • <span className="text-indigo-600 font-medium">{roleLabels[user.role]}</span>
              </span>
              <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Sair">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
