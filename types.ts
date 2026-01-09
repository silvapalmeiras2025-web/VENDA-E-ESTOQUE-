
export enum UserProfile {
  ADMIN = 'ADMIN',
  VENDEDOR = 'VENDEDOR',
  FINANCEIRO = 'FINANCEIRO'
}

export enum UnitOfMeasure {
  UN = 'UN',
  KG = 'KG',
  SACO = 'SACO',
  METRO = 'METRO',
  M2 = 'M2'
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum PaymentMethod {
  MONEY = 'Dinheiro',
  PIX = 'Pix',
  DEBIT = 'Cartão Débito',
  CREDIT = 'Cartão Crédito',
  BOLETO = 'Boleto',
  FIADO = 'Fiado'
}

export interface User {
  id: string;
  nome: string;
  login: string;
  perfil: UserProfile;
  ativo: boolean;
}

export interface Product {
  id: string;
  codigo: string;
  nome_produto: string;
  categoria: string;
  unidade_medida: UnitOfMeasure;
  preco_custo: number;
  preco_venda: number;
  permite_fracionamento: boolean;
  estoque_atual: number;
  estoque_minimo: number;
  fornecedor_id: string;
  ativo: boolean;
}

export interface Client {
  id: string;
  nome_razao: string;
  cpf_cnpj: string;
  telefone: string;
  endereco: string;
  tipo_cliente: 'varejo' | 'atacado';
  limite_credito: number;
  ativo: boolean;
}

export interface Supplier {
  id: string;
  nome: string;
  cnpj: string;
  telefone: string;
  endereco: string;
}

export interface SaleItem {
  productId: string;
  nome: string;
  quantidade: number;
  preco_unitario: number;
  desconto: number;
  total: number;
}

export interface Sale {
  id: string;
  date: string;
  clientId: string;
  clientName: string;
  items: SaleItem[];
  subtotal: number;
  desconto_geral: number;
  total: number;
  forma_pagamento: PaymentMethod;
  status: 'concluida' | 'pendente' | 'cancelada';
}

export interface FinanceRecord {
  id: string;
  tipo: TransactionType;
  categoria: string;
  valor: number;
  data: string;
  descricao: string;
  status: 'pago' | 'pendente';
  referencia_id?: string; // ID da venda ou compra
}
