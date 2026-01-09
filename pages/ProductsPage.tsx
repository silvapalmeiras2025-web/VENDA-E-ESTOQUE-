
import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { getStorageData, setStorageData } from '../db';
import { Product, UnitOfMeasure } from '../types';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setProducts(getStorageData('products', []));
  }, []);

  const filteredProducts = products.filter(p => 
    p.nome_produto.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.codigo.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar produto..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-lg font-bold flex items-center space-x-2 shadow-lg shadow-orange-900/10 transition-all">
          <Plus size={20} />
          <span>Novo Produto</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Código</th>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Preço Custo</th>
                <th className="px-6 py-4">Preço Venda</th>
                <th className="px-6 py-4">Margem</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredProducts.map(p => {
                const margin = ((p.preco_venda - p.preco_custo) / p.preco_custo) * 100;
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">#{p.codigo}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{p.nome_produto}</div>
                      <div className="text-xs text-gray-400">{p.categoria} | {p.unidade_medida}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">R$ {p.preco_custo.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-900 font-bold">R$ {p.preco_venda.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${margin > 30 ? 'text-green-600' : 'text-orange-600'}`}>
                        {margin.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600"><Edit size={16} /></button>
                        <button className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
