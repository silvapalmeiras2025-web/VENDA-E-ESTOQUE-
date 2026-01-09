
import React from 'react';
import { BarChart3, PieChart, TrendingUp, Download, FileText } from 'lucide-react';

const ReportCard = ({ title, description, icon: Icon }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-orange-300 transition-all cursor-pointer group">
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-gray-50 text-gray-400 group-hover:bg-orange-50 group-hover:text-orange-600 rounded-lg transition-colors">
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button className="p-2 text-gray-300 group-hover:text-gray-900">
        <Download size={20} />
      </button>
    </div>
  </div>
);

const Reports: React.FC = () => {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-bold mb-4 flex items-center">
          <TrendingUp size={20} className="mr-2 text-orange-600" />
          Vendas e Faturamento
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReportCard title="Resumo de Vendas" description="Total de vendas, ticket médio e volume por período." icon={BarChart3} />
          <ReportCard title="Vendas por Vendedor" description="Ranking de performance e comissões da equipe." icon={FileText} />
          <ReportCard title="Produtos Mais Lucrativos" description="Análise de margem de contribuição por item." icon={TrendingUp} />
          <ReportCard title="Formas de Pagamento" description="Distribuição entre Pix, Cartão e Fiado." icon={PieChart} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-4 flex items-center">
          <BarChart3 size={20} className="mr-2 text-blue-600" />
          Estoque e Operacional
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReportCard title="Posição de Estoque" description="Valuation do estoque e custos de reposição." icon={BarChart3} />
          <ReportCard title="Giro de Estoque" description="Velocidade de saída de cada categoria de material." icon={TrendingUp} />
          <ReportCard title="Relatório de Curva ABC" description="Classificação dos produtos por importância financeira." icon={FileText} />
          <ReportCard title="Histórico de Ajustes" description="Logs de perdas, quebras e entradas manuais." icon={PieChart} />
        </div>
      </section>
    </div>
  );
};

export default Reports;
