
import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Search, Phone, Mail, MapPin } from 'lucide-react';
import { getStorageData } from '../db';
import { Client } from '../types';

const Customers: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setClients(getStorageData('clients', []));
  }, []);

  const filtered = clients.filter(c => c.nome_razao.toLowerCase().includes(searchTerm.toLowerCase()) || c.cpf_cnpj.includes(searchTerm));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar cliente por nome ou CPF/CNPJ..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-lg font-bold flex items-center space-x-2 transition-all">
          <UserPlus size={20} />
          <span>Cadastrar Cliente</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(client => (
          <div key={client.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                {client.nome_razao.charAt(0)}
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${client.tipo_cliente === 'atacado' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                {client.tipo_cliente}
              </span>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-1">{client.nome_razao}</h4>
            <p className="text-sm text-gray-400 mb-4">{client.cpf_cnpj}</p>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <Phone size={14} className="mr-2 opacity-50" />
                <span>{client.telefone || 'Sem telefone'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin size={14} className="mr-2 opacity-50" />
                <span className="truncate">{client.endereco || 'Sem endereço'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Limite Crédito</p>
                <p className="text-sm font-bold text-gray-900">R$ {client.limite_credito.toFixed(2)}</p>
              </div>
              <button className="text-sm font-semibold text-blue-600 hover:underline">Ver Perfil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customers;
