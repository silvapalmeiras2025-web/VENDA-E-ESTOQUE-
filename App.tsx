
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Truck, 
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

const SidebarItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-orange-600 text-white' 
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
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
        } bg-gray-900 transition-all duration-300 flex flex-col z-50`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          <div className={`flex items-center space-x-2 overflow-hidden ${!isSidebarOpen && 'hidden'}`}>
            <div className="bg-orange-600 p-1.5 rounded">
              <Package className="text-white" size={24} />
            </div>
            <span className="text-white font-bold text-xl truncate">ConstruFlow</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-400 hover:text-white"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
          <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/'} />
          <SidebarItem to="/pos" icon={ShoppingCart} label="PDV / Vendas" active={location.pathname === '/pos'} />
          <SidebarItem to="/inventory" icon={Package} label="Estoque" active={location.pathname === '/inventory'} />
          <SidebarItem to="/products" icon={Settings} label="Produtos" active={location.pathname === '/products'} />
          <SidebarItem to="/customers" icon={Users} label="Clientes" active={location.pathname === '/customers'} />
          <SidebarItem to="/finance" icon={DollarSign} label="Financeiro" active={location.pathname === '/finance'} />
          <SidebarItem to="/reports" icon={BarChart3} label="Relatórios" active={location.pathname === '/reports'} />
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button className="flex items-center space-x-3 text-gray-400 hover:text-red-500 w-full px-4 py-3">
            <LogOut size={20} />
            <span className={`font-medium ${!isSidebarOpen && 'hidden'}`}>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <h1 className="text-xl font-semibold text-gray-800">
            {location.pathname === '/' ? 'Dashboard' : 
             location.pathname === '/pos' ? 'Ponto de Venda' :
             location.pathname === '/inventory' ? 'Controle de Estoque' :
             location.pathname === '/customers' ? 'Cadastro de Clientes' :
             location.pathname === '/products' ? 'Gerenciamento de Produtos' :
             location.pathname === '/finance' ? 'Gestão Financeira' :
             'Relatórios Operacionais'}
          </h1>
          <div className="flex items-center space-x-4">
             <div className="flex flex-col items-end">
               <span className="text-sm font-medium">João Silva</span>
               <span className="text-xs text-gray-500">Administrador</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold border border-orange-200">
               JS
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
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
