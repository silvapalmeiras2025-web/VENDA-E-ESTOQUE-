
import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Calendar,
  Filter,
  Download,
  Wallet,
  Plus,
  X,
  CheckCircle2
} from 'lucide-react';
import { getStorageData, setStorageData } from '../db';
import { FinanceRecord, TransactionType } from '../types';

const Finance: React.FC = () => {
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    tipo: TransactionType.INCOME,
    descricao: '',
    categoria: '',
    valor: '',
    data: new Date().toISOString().split('T')[0],
    status: 'pago' as 'pago' | 'pendente'
  });

  useEffect(() => {
    setRecords(getStorageData('finance', []));
  }, []);

  const totalIn = records
    .filter(r => r.tipo === TransactionType.INCOME && r.status === 'pago')
    .reduce((acc, curr) => acc + curr.valor, 0);

  const totalOut = records
    .filter(r => r.tipo === TransactionType.EXPENSE && r.status === 'pago')
    .reduce((acc, curr) => acc + curr.valor, 0);

  const pending = records
    .filter(r => r.status === 'pendente')
    .reduce((acc, curr) => acc + (curr.tipo === TransactionType.INCOME ? curr.valor : -curr.valor), 0);

  const handleOpenModal = () => {
    setFormData({
      tipo: TransactionType.INCOME,
      descricao: '',
      categoria: '',
      valor: '',
      data: new Date().toISOString().split('T')[0],
      status: 'pago'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.descricao || !formData.valor || parseFloat(formData.valor) <= 0) return;

    const newRecord: FinanceRecord = {
      id: `FIN-MAN-${Date.now()}`,
      tipo: formData.tipo,
      descricao: formData.descricao,
      categoria: formData.categoria || 'Geral',
      valor: parseFloat(formData.valor),
      data: new Date(formData.data).toISOString(),
      status: formData.status
    };

    const updatedRecords = [...records, newRecord];
    setRecords(updatedRecords);
    setStorageData('finance', updatedRecords);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-end">
        <button 
          onClick={handleOpenModal}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-lg font-bold flex items-center space-x-2 shadow-lg shadow-orange-900/10 transition-all"
        >
          <Plus size={20} />
          <span>Novo Lançamento</span>
        </button>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-600 p-6 rounded-2xl text-white shadow-lg shadow-emerald-900/10 transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/20 rounded-lg"><ArrowUpCircle size={24} /></div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Entradas</span>
          </div>
          <p className="text-sm opacity-80 mb-1">Total Recebido</p>
          <h3 className="text-3xl font-bold">R$ {totalIn.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
        </div>

        <div className="bg-red-600 p-6 rounded-2xl text-white shadow-lg shadow-red-900/10 transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/20 rounded-lg"><ArrowDownCircle size={24} /></div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-100">Saídas</span>
          </div>
          <p className="text-sm opacity-80 mb-1">Total Pago</p>
          <h3 className="text-3xl font-bold">R$ {totalOut.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
        </div>

        <div className="bg-orange-600 p-6 rounded-2xl text-white shadow-lg shadow-orange-900/10 transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/20 rounded-lg"><Wallet size={24} /></div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-100">A Receber</span>
          </div>
          <p className="text-sm opacity-80 mb-1">Saldo Fiado/Pendentes</p>
          <h3 className="text-3xl font-bold">R$ {pending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold">Fluxo de Caixa</h3>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              <Calendar size={16} />
              <span>Março 2024</span>
            </button>
            <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
              <Download size={18} />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {[...records].reverse().map(record => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 text-gray-500">{new Date(record.data).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{record.descricao}</td>
                  <td className="px-6 py-4 text-gray-500">{record.categoria}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${record.status === 'pago' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${record.tipo === TransactionType.INCOME ? 'text-emerald-600' : 'text-red-600'}`}>
                    {record.tipo === TransactionType.INCOME ? '+' : '-'} R$ {record.valor.toFixed(2)}
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    Nenhuma transação financeira registrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Novo Lançamento</h3>
                <p className="text-gray-400 text-sm">Adicione uma conta a pagar ou receber</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tipo: TransactionType.INCOME })}
                  className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    formData.tipo === TransactionType.INCOME 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <ArrowUpCircle size={18} />
                  <span>Receita</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tipo: TransactionType.EXPENSE })}
                  className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    formData.tipo === TransactionType.EXPENSE 
                    ? 'bg-red-600 text-white shadow-md' 
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <ArrowDownCircle size={18} />
                  <span>Despesa</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase">Descrição</label>
                  <input 
                    type="text" 
                    required
                    className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    placeholder="Ex: Pagamento Fornecedor Areia"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase">Valor (R$)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                      placeholder="0.00"
                      value={formData.valor}
                      onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase">Data</label>
                    <input 
                      type="date" 
                      required
                      className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                      value={formData.data}
                      onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase">Categoria</label>
                    <select 
                      className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500 transition-all bg-white"
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    >
                      <option value="">Selecione...</option>
                      <option value="Venda">Venda</option>
                      <option value="Compra">Compra</option>
                      <option value="Salários">Salários</option>
                      <option value="Aluguel">Aluguel</option>
                      <option value="Impostos">Impostos</option>
                      <option value="Logística">Logística</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase">Status</label>
                    <div className="flex bg-gray-50 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, status: 'pago' })}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                          formData.status === 'pago' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-400'
                        }`}
                      >
                        Pago
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, status: 'pendente' })}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                          formData.status === 'pendente' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-400'
                        }`}
                      >
                        Pendente
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className={`flex-1 py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center space-x-2 ${
                    formData.tipo === TransactionType.INCOME 
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' 
                    : 'bg-red-600 hover:bg-red-700 shadow-red-200'
                  }`}
                >
                  <CheckCircle2 size={20} />
                  <span>Salvar Lançamento</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
