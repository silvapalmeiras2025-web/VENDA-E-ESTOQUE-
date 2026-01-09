
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Calculator, 
  UserPlus, 
  CreditCard, 
  DollarSign,
  CheckCircle2,
  X,
  // Added ShoppingCart to fix "Cannot find name 'ShoppingCart'" errors on lines 180 and 223
  ShoppingCart
} from 'lucide-react';
import { getStorageData, setStorageData } from '../db';
import { Product, Client, Sale, SaleItem, UnitOfMeasure, PaymentMethod, TransactionType, FinanceRecord } from '../types';

const POS: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.MONEY);
  const [discountGeneral, setDiscountGeneral] = useState(0);
  const [showM2Calc, setShowM2Calc] = useState<{ active: boolean; product: Product | null }>({ active: false, product: null });
  const [m2Inputs, setM2Inputs] = useState({ length: 0, width: 0, manual: 0 });
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    setProducts(getStorageData('products', []));
    setClients(getStorageData('clients', []));
    setSelectedClient(getStorageData('clients', [])[0] || null);
  }, []);

  const filteredProducts = products.filter(p => 
    p.ativo && (p.nome_produto.toLowerCase().includes(searchTerm.toLowerCase()) || p.codigo.includes(searchTerm))
  );

  const addToCart = (product: Product, quantity: number = 1) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.productId === product.id 
          ? { ...item, quantidade: item.quantidade + quantity, total: (item.quantidade + quantity) * item.preco_unitario }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        nome: product.nome_produto,
        quantidade: quantity,
        preco_unitario: product.preco_venda,
        desconto: 0,
        total: product.preco_venda * quantity
      }]);
    }
  };

  const handleM2Submit = () => {
    if (showM2Calc.product) {
      const quantity = m2Inputs.manual > 0 ? m2Inputs.manual : (m2Inputs.length * m2Inputs.width);
      if (quantity > 0) {
        addToCart(showM2Calc.product, quantity);
        setShowM2Calc({ active: false, product: null });
        setM2Inputs({ length: 0, width: 0, manual: 0 });
      }
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const subtotal = useMemo(() => cart.reduce((acc, curr) => acc + curr.total, 0), [cart]);
  const total = useMemo(() => Math.max(0, subtotal - discountGeneral), [subtotal, discountGeneral]);

  const handleFinishSale = () => {
    if (cart.length === 0 || !selectedClient) return;

    const newSale: Sale = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      clientId: selectedClient.id,
      clientName: selectedClient.nome_razao,
      items: cart,
      subtotal,
      desconto_geral: discountGeneral,
      total,
      forma_pagamento: paymentMethod,
      status: 'concluida'
    };

    // Update Storage
    const allSales = getStorageData<Sale[]>('sales', []);
    setStorageData('sales', [...allSales, newSale]);

    // Update Stock
    const allProducts = getStorageData<Product[]>('products', []);
    const updatedProducts = allProducts.map(p => {
      const soldItem = cart.find(item => item.productId === p.id);
      return soldItem ? { ...p, estoque_atual: p.estoque_atual - soldItem.quantidade } : p;
    });
    setStorageData('products', updatedProducts);

    // Update Finance
    const allFinance = getStorageData<FinanceRecord[]>('finance', []);
    const newFinance: FinanceRecord = {
      id: `FIN-${Date.now()}`,
      tipo: TransactionType.INCOME,
      categoria: 'Venda',
      valor: total,
      data: new Date().toISOString(),
      descricao: `Venda #${newSale.id} - ${selectedClient.nome_razao}`,
      status: paymentMethod === PaymentMethod.FIADO ? 'pendente' : 'pago',
      referencia_id: newSale.id
    };
    setStorageData('finance', [...allFinance, newFinance]);

    // Reset State
    setCart([]);
    setDiscountGeneral(0);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Products Selection */}
      <div className="flex-1 flex flex-col min-w-0 bg-white rounded-xl border border-gray-200 shadow-sm p-4 overflow-hidden">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Pesquisar produto por nome ou código..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="p-4 border border-gray-100 rounded-xl hover:border-orange-200 hover:shadow-md transition-all group relative cursor-pointer"
              onClick={() => {
                if (product.unidade_medida === UnitOfMeasure.M2 || product.unidade_medida === UnitOfMeasure.METRO) {
                  setShowM2Calc({ active: true, product });
                } else {
                  addToCart(product);
                }
              }}
            >
              <div className="mb-2">
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded uppercase">{product.categoria}</span>
              </div>
              <h4 className="font-semibold text-gray-800 line-clamp-2 mb-1">{product.nome_produto}</h4>
              <p className="text-xs text-gray-400 mb-3">Estoque: {product.estoque_atual} {product.unidade_medida}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-lg font-bold text-gray-900">R$ {product.preco_venda.toFixed(2)}</span>
                <button className="p-2 bg-orange-100 text-orange-600 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <Plus size={20} />
                </button>
              </div>
              {product.estoque_atual <= 0 && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-xl z-10">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">Sem Estoque</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-full lg:w-96 bg-gray-900 rounded-xl shadow-xl flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-lg flex items-center">
              <ShoppingCart size={20} className="mr-2 text-orange-500" />
              Carrinho
            </h3>
            <button onClick={() => setCart([])} className="text-gray-500 hover:text-red-400 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
          
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase">Cliente</label>
            <select 
              className="w-full bg-gray-800 border border-gray-700 rounded-lg text-white p-2 text-sm outline-none focus:ring-1 focus:ring-orange-500"
              value={selectedClient?.id || ''}
              onChange={(e) => setSelectedClient(clients.find(c => c.id === e.target.value) || null)}
            >
              {clients.map(c => <option key={c.id} value={c.id}>{c.nome_razao}</option>)}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.map(item => (
            <div key={item.productId} className="flex items-start space-x-3 bg-gray-800 p-3 rounded-lg group">
              <div className="flex-1 min-w-0">
                <h5 className="text-sm font-medium text-white truncate">{item.nome}</h5>
                <div className="flex items-center mt-1 space-x-2">
                  <span className="text-xs text-gray-400">R$ {item.preco_unitario.toFixed(2)}</span>
                  <span className="text-xs text-orange-500 font-bold">x {item.quantidade.toFixed(2)}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-white mb-1">R$ {item.total.toFixed(2)}</div>
                <button 
                  onClick={() => removeFromCart(item.productId)}
                  className="p-1 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-3">
              <ShoppingCart size={48} className="opacity-20" />
              <p>O carrinho está vazio</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-800 space-y-4 border-t border-gray-700">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-400 text-sm">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-gray-400 text-sm">
              <span>Desconto</span>
              <input 
                type="number" 
                className="w-20 bg-gray-700 border border-gray-600 rounded p-1 text-right text-white text-xs outline-none"
                value={discountGeneral}
                onChange={(e) => setDiscountGeneral(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="flex justify-between text-white font-bold text-xl pt-2 border-t border-gray-700">
              <span>Total</span>
              <span className="text-orange-500">R$ {total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <label className="col-span-2 text-xs font-bold text-gray-500 uppercase mb-1">Pagamento</label>
            {Object.values(PaymentMethod).map(method => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                  paymentMethod === method 
                  ? 'bg-orange-600 border-orange-600 text-white' 
                  : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                {method}
              </button>
            ))}
          </div>

          <button 
            disabled={cart.length === 0}
            onClick={handleFinishSale}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all ${
              cart.length === 0 
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20'
            }`}
          >
            <CheckCircle2 size={20} />
            <span>Finalizar Venda</span>
          </button>
        </div>
      </div>

      {/* Calculator Modal */}
      {showM2Calc.active && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-orange-600 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Cálculo de Metragem</h3>
                <p className="text-orange-100 text-sm">{showM2Calc.product?.nome_produto}</p>
              </div>
              <button onClick={() => setShowM2Calc({ active: false, product: null })} className="text-white hover:rotate-90 transition-transform">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase">Comprimento (m)</label>
                  <input 
                    type="number" 
                    className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="0.00"
                    value={m2Inputs.length || ''}
                    onChange={(e) => setM2Inputs({ ...m2Inputs, length: parseFloat(e.target.value) || 0, manual: 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase">Largura (m)</label>
                  <input 
                    type="number" 
                    className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="0.00"
                    value={m2Inputs.width || ''}
                    onChange={(e) => setM2Inputs({ ...m2Inputs, width: parseFloat(e.target.value) || 0, manual: 0 })}
                  />
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-100"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase text-gray-400 font-bold bg-white px-2">Ou informe manual</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase">Total Manual ({showM2Calc.product?.unidade_medida})</label>
                <input 
                  type="number" 
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="0.00"
                  value={m2Inputs.manual || ''}
                  onChange={(e) => setM2Inputs({ length: 0, width: 0, manual: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between">
                <span className="text-gray-600 font-medium">Resultado:</span>
                <span className="text-2xl font-black text-orange-600">
                  {(m2Inputs.manual > 0 ? m2Inputs.manual : (m2Inputs.length * m2Inputs.width)).toFixed(2)} {showM2Calc.product?.unidade_medida}
                </span>
              </div>
              <button 
                onClick={handleM2Submit}
                className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all"
              >
                Confirmar e Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl p-10 flex flex-col items-center text-center max-w-sm shadow-2xl">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <CheckCircle2 size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Venda Realizada!</h3>
            <p className="text-gray-500 mb-8">O cupom não fiscal foi gerado e o estoque atualizado com sucesso.</p>
            <button 
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all"
            >
              Próxima Venda
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;
