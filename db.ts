
import { Product, Client, Supplier, User, UserProfile, UnitOfMeasure, Sale, FinanceRecord } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  { id: '1', codigo: '001', nome_produto: 'Cimento CP II 50kg', categoria: 'Cimento', unidade_medida: UnitOfMeasure.SACO, preco_custo: 28.5, preco_venda: 35.0, permite_fracionamento: false, estoque_atual: 150, estoque_minimo: 50, fornecedor_id: 'f1', ativo: true },
  { id: '2', codigo: '002', nome_produto: 'Piso Cerâmico 60x60', categoria: 'Cerâmica', unidade_medida: UnitOfMeasure.M2, preco_custo: 18.0, preco_venda: 29.9, permite_fracionamento: true, estoque_atual: 200.5, estoque_minimo: 40, fornecedor_id: 'f2', ativo: true },
  { id: '3', codigo: '003', nome_produto: 'Areia Lavada', categoria: 'Areia', unidade_medida: UnitOfMeasure.METRO, preco_custo: 80.0, preco_venda: 120.0, permite_fracionamento: true, estoque_atual: 15, estoque_minimo: 5, fornecedor_id: 'f1', ativo: true },
];

export const INITIAL_CLIENTS: Client[] = [
  { id: 'c1', nome_razao: 'Consumidor Final', cpf_cnpj: '000.000.000-00', telefone: '', endereco: '', tipo_cliente: 'varejo', limite_credito: 0, ativo: true },
  { id: 'c2', nome_razao: 'Construtora Silva LTDA', cpf_cnpj: '12.345.678/0001-99', telefone: '(11) 98888-7777', endereco: 'Rua das Obras, 123', tipo_cliente: 'atacado', limite_credito: 5000, ativo: true },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 'f1', nome: 'Votorantim Cimentos', cnpj: '33.444.555/0001-22', telefone: '0800 123 456', endereco: 'Av Industrial, 500' },
  { id: 'f2', nome: 'Portobello Revestimentos', cnpj: '44.555.666/0001-33', telefone: '(48) 3333-2222', endereco: 'Rodovia SC, 401' },
];

export const getStorageData = <T,>(key: string, initial: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : initial;
  } catch (e) {
    console.error("Erro ao ler localStorage", e);
    return initial;
  }
};

export const setStorageData = <T,>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Erro ao salvar no localStorage", e);
  }
};

export const clearDB = () => localStorage.clear();
