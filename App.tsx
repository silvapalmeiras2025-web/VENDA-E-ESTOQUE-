import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  DollarSign, 
  BarChart3, 
  Settings,
  Menu,
  X,
  LogOut,
  Lock,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Inventory from './pages/Inventory';
import Customers from './pages/Customers';
import ProductsPage from './pages/ProductsPage';
import Finance from './pages/Finance';
import Reports from './pages/Reports';
import { User, UserProfile } from './types';
import { getStorageData, setStorageData } from './db';

const AuthScreen = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [isFirstRun, setIsFirstRun] = useState(false);
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const users = getStorageData<User[]>('users', []);
    setIsFirstRun(users.length === 0);
  }, []);

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!login || !senha) {
      setError('Informe login e senha.');
      return;
    }

    const users = getStorageData<User[]>('users', []);

    if (isFirstRun) {
      if (!nome) {
        setError('Informe o seu nome completo.');
        return;
      }
      const newUser: User = {
        id: Date.now().toString(),
        nome,
        login,
        senha,
        perfil: UserProfile.ADMIN,
        ativo: true
      };
      setStorageData('users', [...users, newUser]);
      onLogin(newUser);
    } else {
      const user = users.find(u => u.login.toLowerCase() === login.toLowerCase() && u.senha === senha);
      if (user) {
        if (!user.ativo) {
          setError('Este usuário está desativado.');
          return;
        }
        onLogin(user);
      } else {
        setError('Login ou senha incorretos.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-800">
        <div className="bg-orange-600 p-10 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Package size={120} />
          </div>
          <div className="relative z-10">
            <div className="inline-block p-4 bg-white/20 rounded-2xl mb-4 backdrop-blur-md">
              <Package size={40} />
            </div>
            <h1 className="text-3xl font-black tracking-tight">ConstruFlow</h1>
            <p className="text-orange-100 mt-2 font-medium">
              {isFirstRun ? 'Configuração do Administrador' : 'Gestão de Materiais de Construção'}
            </p>
          </div>
        </div>
        
        <form onSubmit={handleAction} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold border border-red-100 animate-pulse">
              {error}
            </div>
          )}

          {isFirstRun && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                  placeholder="Seu nome"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Usuário</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text"
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                placeholder="Ex: admin"
                value={login}
                onChange={e => setLogin(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password"
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                placeholder="••••••••"
                value={senha}
                onChange={e => setSenha(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-orange-200 transition-all flex items-center justify-center space-x-3 active:scale-95"
          >
            {isFirstRun ? <ShieldCheck size={22} /> : null}
            <span className="text-lg">{isFirstRun ? 'Finalizar Configuração' : 'Acessar ERP'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

const SidebarItem = ({ to, icon: Icon, label, active, collapsed }: any) => (
  <Link 
    to={to} 
    className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all ${
      active 
        ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' 
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`}
  >
    <Icon size={22} />
    {!collapsed && <span className="font-semibold whitespace-nowrap">{label}</span>}
  </Link>
);

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = sessionStorage.getItem('cf_session');
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch (e) {
        sessionStorage.removeItem('cf_session');
      }
    }
    setIsReady(true);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    sessionStorage.setItem('cf_session', JSON.stringify(user));
    navigate('/');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('cf_session');
    navigate('/');
  };

  if (!isReady) return null;

  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-24'} bg-gray-950 transition-all duration-500 ease-in-out flex flex-col z-50 shadow-2xl border-r border-white/5`}>
        <div className="p-6 flex items-center justify-between h-20 shrink-0">
          <div className={`flex items-center space-x-3 overflow-hidden transition-opacity duration-300 ${!isSidebarOpen && 'opacity-0'}`}>
            <div className="bg-orange-600 p-2 rounded-xl shadow-inner">
              <Package className="text-white" size={24} />
            </div>
            <span className="text-white font-black text-2xl tracking-tighter">ConstruFlow</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-500 hover:text-white p-2 rounded-xl hover:bg-gray-800 transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
          <SidebarItem to="/" icon={LayoutDashboard} label="Visão Geral" active={location.pathname === '/'} collapsed={!isSidebarOpen} />
          <SidebarItem to="/pos" icon={ShoppingCart} label="Caixa / PDV" active={location.pathname === '/pos'} collapsed={!isSidebarOpen} />
          <SidebarItem to="/inventory" icon={Package} label="Estoque" active={location.pathname === '/inventory'} collapsed={!isSidebarOpen} />
          <SidebarItem to="/products" icon={Settings} label="Config. Produtos" active={location.pathname === '/products'} collapsed={!isSidebarOpen} />
          <SidebarItem to="/customers" icon={Users} label="Clientes" active={location.pathname === '/customers'} collapsed={!isSidebarOpen} />
          <SidebarItem to="/finance" icon={DollarSign} label="Fluxo Financeiro" active={location.pathname === '/finance'} collapsed={!isSidebarOpen} />
          <SidebarItem to="/reports" icon={BarChart3} label="Relatórios" active={location.pathname === '/reports'} collapsed={!isSidebarOpen} />
        </nav>

        <div className="p-4 border-t border-white/5 bg-black/20">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 text-gray-500 hover:text-red-400 w-full px-4 py-4 rounded-xl transition-all hover:bg-red-400/10"
          >
            <LogOut size={22} />
            {isSidebarOpen && <span className="font-bold">Encerrar Sessão</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 shrink-0 z-40">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            {location.pathname === '/' ? 'Dashboard Analítico' : 
             location.pathname === '/pos' ? 'Ponto de Venda' :
             location.pathname === '/inventory' ? 'Controle de Materiais' :
             location.pathname === '/customers' ? 'Base de Clientes' :
             location.pathname === '/products' ? 'Catálogo Técnico' :
             location.pathname === '/finance' ? 'Gestão de Caixa' :
             'Relatórios Operacionais'}
          </h1>
          <div className="flex items-center space-x-5">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold text-gray-900 leading-none">{currentUser.nome}</p>
               <p className="text-[10px] text-orange-600 font-black uppercase tracking-widest mt-1">{currentUser.perfil}</p>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-orange-600/30">
               {currentUser.nome.substring(0, 1).toUpperCase()}
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pos" element={<POS />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;