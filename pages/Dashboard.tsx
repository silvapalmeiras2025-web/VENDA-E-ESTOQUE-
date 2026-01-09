
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Users, 
  AlertTriangle,
  ArrowUpRight,
  ShoppingCart
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getStorageData, INITIAL_PRODUCTS } from '../db';
import { Sale, Product, FinanceRecord } from '../types';

const DashboardCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-sm text-gray-500 font-medium mb-1 uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      {trend && (
        <div className={`mt-2 flex items-center text-xs font-semibold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? <ArrowUpRight size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
          {Math.abs(trend)}% em relação ao mês anterior
        </div>
      )}
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="text-white" size={24} />
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setSales(getStorageData('sales', []));
    setProducts(getStorageData('products', INITIAL_PRODUCTS));
  }, []);

  const totalSoldToday = sales
    .filter(s => s.date.startsWith(new Date().toISOString().split('T')[0]))
    .reduce((acc, curr) => acc + curr.total, 0);

  const totalMonthly = sales.reduce((acc, curr) => acc + curr.total, 0);
  const lowStockCount = products.filter(p => p.estoque_atual <= p.estoque_minimo).length;
  
  const chartData = [
    { name: 'Seg', valor: 4500 },
    { name: 'Ter', valor: 3200 },
    { name: 'Qua', valor: 6800 },
    { name: 'Qui', valor: 5100 },
    { name: 'Sex', valor: 7200 },
    { name: 'Sab', valor: 9500 },
    { name: 'Dom', valor: 2100 },
  ];

  const topProducts = [
    { name: 'Cimento CP II', qtd: 450, color: '#f97316' },
    { name: 'Areia Lavada', qtd: 320, color: '#fbbf24' },
    { name: 'Piso 60x60', qtd: 210, color: '#3b82f6' },
    { name: 'Viga Ferro', qtd: 150, color: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Vendas Hoje" 
          value={`R$ ${totalSoldToday.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={ShoppingCart} 
          color="bg-orange-500"
          trend={12.5}
        />
        <DashboardCard 
          title="Receita Mensal" 
          value={`R$ ${totalMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={TrendingUp} 
          color="bg-blue-500"
          trend={8.2}
        />
        <DashboardCard 
          title="Estoque Baixo" 
          value={lowStockCount}
          icon={AlertTriangle} 
          color="bg-red-500"
        />
        <DashboardCard 
          title="Novos Clientes" 
          value="42"
          icon={Users} 
          color="bg-emerald-500"
          trend={-2.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Faturamento Diário (R$)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="valor" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Produtos Mais Vendidos</h3>
          <div className="space-y-6">
            {topProducts.map((p, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-gray-500">{p.qtd} unid.</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full" 
                    style={{ width: `${(p.qtd / 500) * 100}%`, backgroundColor: p.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-2 text-sm font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors">
            Ver Relatório Completo
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Alertas de Reposição</h3>
          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase">Urgente</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4 text-center">Estoque Atual</th>
                <th className="px-6 py-4 text-center">Mínimo</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {products.filter(p => p.estoque_atual <= p.estoque_minimo).slice(0, 5).map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{p.nome_produto}</td>
                  <td className="px-6 py-4 text-gray-500">{p.categoria}</td>
                  <td className="px-6 py-4 text-center text-red-600 font-bold">{p.estoque_atual} {p.unidade_medida}</td>
                  <td className="px-6 py-4 text-center">{p.estoque_minimo} {p.unidade_medida}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-red-100 text-red-700">Comprar</span>
                  </td>
                </tr>
              ))}
              {products.filter(p => p.estoque_atual <= p.estoque_minimo).length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    Nenhum item abaixo do estoque mínimo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
