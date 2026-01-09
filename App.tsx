
import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
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
  LogOut
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Inventory from './pages/Inventory';
import Customers from './pages/Customers';
import ProductsPage from './pages/ProductsPage';
import Finance from './pages/Finance';
import Reports from './pages/Reports';

const SidebarItem = ({ to, icon: Icon, label, active, collapsed }: { to: string, icon: any, label: string, active: boolean, collapsed: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-orange-600 text-white shadow-md' 
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`}
  >
    <Icon size={20} />
    {!collapsed && <span className="font-medium whitespace-nowrap">{label}</span>}
  </Link>
);

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 transition-all duration-300 flex flex-col z-50 shadow-xl`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-800 h-16 shrink-0">
          <div className={`flex items-center space-x-2 overflow-hidden ${!isSidebarOpen && 'hidden'}`}>
            <div className="bg-orange-600 p-1.5 rounded">
              <Package className="text-white" size={24} />
            </div>
            <span className="text-white font-bold text-xl truncate tracking-tight">ConstruFlow</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-800"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
          <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/'} collapsed={!isSidebarOpen} />
          <SidebarItem to="/pos" icon={ShoppingCart} label="PDV / Vendas" active={location.pathname === '/pos'} collapsed={!isSidebarOpen} />
          <SidebarItem to="/inventory" icon={Package} label="Estoque" active={location.pathname === '/inventory'} collapsed={!isSidebarOpen} />
          <SidebarItem to="/products" icon={Settings} label="Produtos" active={location.pathname === '/products'} collapsed={!isSidebarOpen} />
          <SidebarItem to="/customers" icon={Users} label="Clientes" active={location.pathname === '/customers'} collapsed={!isSidebarOpen} />
          <SidebarItem to="/finance" icon={DollarSign} label="Financeiro" active={location.pathname === '/finance'} collapsed={!isSidebarOpen} />
          <SidebarItem to="/reports" icon={BarChart3} label="Relatórios" active={location.pathname === '/reports'} collapsed={!isSidebarOpen} />
        </nav>

        <div className="p-4 border-t border-gray-800 shrink-0">
          <button className="flex items-center space-x-3 text-gray-400 hover:text-red-500 w-full px-4 py-3 transition-colors">
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium whitespace-nowrap">Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
          <h1 className="text-xl font-semibold text-gray-800 truncate pr-4">
            {location.pathname === '/' ? 'Dashboard' : 
             location.pathname === '/pos' ? 'Ponto de Venda' :
             location.pathname === '/inventory' ? 'Controle de Estoque' :
             location.pathname === '/customers' ? 'Cadastro de Clientes' :
             location.pathname === '/products' ? 'Gerenciamento de Produtos' :
             location.pathname === '/finance' ? 'Gestão Financeira' :
             'Relatórios Operacionais'}
          </h1>
          <div className="flex items-center space-x-4 shrink-0">
             <div className="hidden sm:flex flex-col items-end">
               <span className="text-sm font-semibold">João Silva</span>
               <span className="text-xs text-gray-500">Administrador</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold border border-orange-200">
               JS
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default App;
