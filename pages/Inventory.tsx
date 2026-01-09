
import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Edit,
  History,
  AlertCircle
} from 'lucide-react';
import { getStorageData, setStorageData } from '../db';
import { Product, UnitOfMeasure } from '../types';

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'low'>('all');

  useEffect(() => {
    setProducts(getStorageData('products', []));
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.nome_produto.toLowerCase().includes(searchTerm.toLowerCase()) || p.codigo.includes(searchTerm);
    const matchesFilter = filter === 'all' || p.estoque_atual <= p.estoque_minimo;
    return matchesSearch && matchesFilter;
  });

  const handleManualAdjustment = (id: string, newStock: number) => {
    const updated = products.map(p => p.id === id ? { ...p, estoque_atual: newStock } : p);
    setProducts(updated);
    setStorageData('products', updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="bg-white border border-gray-200 rounded-lg p-1 flex">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'all' ? 'bg-orange-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setFilter('low')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'low' ? 'bg-orange-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Estoque Baixo
            </button>
          </div>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar estoque..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Código</th>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Unidade</th>
                <th className="px-6 py-4 text-center">Mínimo</th>
                <th className="px-6 py-4 text-center">Estoque Atual</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-gray-500 text-xs">#{p.codigo}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{p.nome_produto}</div>
                    <div className="text-xs text-gray-400">{p.categoria}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{p.unidade_medida}</td>
                  <td className="px-6 py-4 text-center text-sm">{p.estoque_minimo}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${p.estoque_atual <= p.estoque_minimo ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {p.estoque_atual.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        title="Histórico"
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <History size={18} />
                      </button>
                      <button 
                        title="Ajuste Rápido"
                        className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                    Nenhum produto encontrado na busca.
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

export default Inventory;
