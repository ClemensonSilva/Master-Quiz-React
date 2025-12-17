import DataTable from '@/components/display/dataTable';

export default function AlunosTable({ 
  alunos = [], 
  loading = false,
  searchTerm = ""
}) {
  const columns = [
    { field: 'nome', header: 'Nome' },
    { field: 'email', header: 'Email' },
    { field: 'telefone', header: 'Telefone' }
  ];

  return (
    <DataTable
      columns={columns}
      data={alunos}
      loading={loading}
      searchTerm={searchTerm}
      emptyMessage="Nenhum aluno matriculado nesta disciplina."
    />
  );
}