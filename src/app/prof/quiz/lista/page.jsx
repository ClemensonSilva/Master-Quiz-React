'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import LayoutProfessor from '@/components/layout/layoutProfessor';
import SectionHeader from '@/components/layout/sectionHeader';
import DataTable from '@/components/display/dataTable';
import LoadingState from '@/components/feedback/loadingState';
import Alert from '@/components/ui/alertas';

const mockQuizzes = [
  { id: 1, nome: 'Quiz 1', disciplina: 'Disciplina 1', numQuestoes: 10, respostas: '0/10' },
  { id: 2, nome: 'Quiz 2', disciplina: 'Disciplina 1', numQuestoes: 10, respostas: '0/10' },
  { id: 3, nome: 'Quiz 3', disciplina: 'Disciplina 2', numQuestoes: 10, respostas: '0/10' },
  { id: 4, nome: 'Quiz 4', disciplina: 'Disciplina 2', numQuestoes: 10, respostas: '0/10' },
];

export default function CadastroQuiz() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const disciplinaId = searchParams.get('disciplinaId');
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ type: 'info', title: '', message: '' });

  useEffect(() => {
    const loadQuizzes = () => {
      setLoading(true);
      setTimeout(() => {
        // Filtrar por disciplina se necessário
        const filtered = disciplinaId 
          ? mockQuizzes.filter(q => q.disciplina.includes(disciplinaId))
          : mockQuizzes;
        setQuizzes(filtered);
        setFilteredQuizzes(filtered);
        setLoading(false);
      }, 500);
    };

    loadQuizzes();
  }, [disciplinaId]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredQuizzes(quizzes);
      return;
    }

    const filtered = quizzes.filter(quiz =>
      quiz.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.disciplina.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuizzes(filtered);
  }, [searchTerm, quizzes]);

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este quiz?')) {
      setQuizzes(prev => prev.filter(q => q.id !== id));
      setFilteredQuizzes(prev => prev.filter(q => q.id !== id));
      
      setAlertInfo({
        type: 'success',
        title: 'Sucesso',
        message: 'Quiz excluído com sucesso.'
      });
      setShowAlert(true);
    }
  };

  const handleViewRelatorio = (quizId) => {
    router.push(`/professor/quiz/${quizId}/relatorio`);
  };

  const handleEditQuestoes = (quizId) => {
    router.push(`/professor/quiz/${quizId}/questoes`);
  };

  const handleAddQuiz = () => {
    const path = disciplinaId 
      ? `/professor/quiz/novo?disciplinaId=${disciplinaId}`
      : '/professor/quiz/novo';
    router.push(path);
  };

  const columns = [
    { 
      field: 'nome', 
      header: 'Nome',
      render: (row) => <div className="font-medium text-gray-900">{row.nome}</div>
    },
    { 
      field: 'disciplina', 
      header: 'Disciplina',
      render: (row) => <div className="text-gray-900">{row.disciplina}</div>
    },
    { 
      field: 'numQuestoes', 
      header: 'N° de Questões',
      render: (row) => <div className="text-gray-900">{row.numQuestoes}</div>
    },
    { 
      field: 'respostas', 
      header: 'Respostas',
      render: (row) => <div className="text-gray-900">{row.respostas}</div>
    },
    { 
      field: 'acoes', 
      header: 'Ações',
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => handleViewRelatorio(row.id)}
            className="text-gray-900 hover:text-gray-700 transition"
            title="Ver relatório"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button
            onClick={() => handleEditQuestoes(row.id)}
            className="text-gray-900 hover:text-gray-700 transition"
            title="Editar questões"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-gray-900 hover:text-red-600 transition"
            title="Excluir"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  return (
    <LayoutProfessor userName="Nome Professor">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <SectionHeader
          title={disciplinaId ? 'Quizzes da Disciplina' : 'Meus Quizzes'}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showSearch={true}
          showButton={true}
          buttonText="Cadastrar"
          buttonOnClick={handleAddQuiz}
        />

        {loading ? (
          <LoadingState message="Carregando quizzes..." />
        ) : (
          <DataTable
            columns={columns}
            data={filteredQuizzes}
            loading={false}
            searchTerm={searchTerm}
            emptyMessage="Nenhum quiz encontrado."
            className="p-0 overflow-hidden"
          />
        )}
      </div>

      {showAlert && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md">
          <Alert
            type={alertInfo.type}
            title={alertInfo.title}
            message={alertInfo.message}
            onClose={() => setShowAlert(false)}
            autoClose={true}
            duration={3000}
          />
        </div>
      )}
    </LayoutProfessor>
  );
}