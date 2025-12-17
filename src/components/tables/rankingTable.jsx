import DataTable from '@/components/display/dataTable';

export default function RankingTable({ 
  ranking = [], 
  loading = false 
}) {
  const columns = [
    { 
      field: 'posicao', 
      header: 'Posição',
      render: (row) => (
        <div className="font-medium text-gray-900">
          {row.posicao}. {row.nome}
        </div>
      )
    },
    { field: 'info', header: 'Outras informações' },
    { field: 'acertos', header: 'Total de Acertos' }
  ];

  return (
    <DataTable
      columns={columns}
      data={ranking}
      loading={loading}
      emptyMessage="Nenhum ranking disponível."
    />
  );
}