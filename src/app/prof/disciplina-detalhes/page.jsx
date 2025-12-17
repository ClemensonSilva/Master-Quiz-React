'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

import LayoutProfessor from '@/components/layout/layoutProfessor';
import SectionHeader from '@/components/layout/sectionHeader';
import LoadingState from '@/components/feedback/loadingState';
import EmptyState from '@/components/feedback/emptyState';
import Card from '@/components/display/card';
import QuizCard from '@/components/cards/quizCard';
import Button from '@/components/ui/button';
import AcertosErrosChart from '@/components/charts/acertosErrosChart';

const mockQuizzes = [
  { id: 1, nome: 'Sistemas Lineares', progresso: 33, descricao: 'Descrição dos quizzes', nota: '8/10', dataRevisao: '30/02/2026' },
  { id: 2, nome: 'Logaritmo', progresso: 43, descricao: 'Descrição dos quizzes', nota: '8/10', dataRevisao: '30/02/2026' },
  { id: 3, nome: 'Função exponencial', progresso: 0, descricao: 'Descrição dos quizzes', nota: '8/10', dataRevisao: '30/02/2026' },
  { id: 4, nome: 'Porcentagem', progresso: 33, descricao: 'Descrição dos quizzes', nota: '8/10', dataRevisao: '30/02/2026' },
  { id: 5, nome: 'Geometria', progresso: 15, descricao: 'Descrição dos quizzes', nota: '8/10', dataRevisao: '30/02/2026' },
  { id: 6, nome: 'Teoria dos números', progresso: 0, descricao: 'Descrição dos quizzes', nota: '8/10', dataRevisao: '30/02/2026' },
];

export default function DetalhesDisciplinaProfessor() {
  const router = useRouter();
  const params = useParams();
  const disciplinaId = params.id;
  const [disciplina, setDisciplina] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      setTimeout(() => {
        setDisciplina({
          id: disciplinaId,
          nome: 'Matemática',
          professor: {
            nome: 'Nome Professor',
            nickname: '@professor_nick',
            avatar: '/avatar.png'
          },
          estatisticas: {
            acertos: 40,
            erros: 60
          }
        });
        setQuizzes(mockQuizzes);
        setFilteredQuizzes(mockQuizzes);
        setLoading(false);
      }, 500);
    };

    loadData();
  }, [disciplinaId]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredQuizzes(quizzes);
      return;
    }

    const filtered = quizzes.filter(quiz =>
      quiz.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuizzes(filtered);
  }, [searchTerm, quizzes]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState size="lg" />
      </div>
    );
  }

  return (
    <LayoutProfessor userName={disciplina?.professor.nome}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">{disciplina?.nome}</h1>
            <p className="text-gray-600">Gerencie quizzes e acompanhe o desempenho</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-700 font-semibold">
                  {disciplina?.professor.nome.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-800">{disciplina?.professor.nome}</p>
                <p className="text-sm text-gray-500">{disciplina?.professor.nickname}</p>
              </div>
            </div>
            <Button variant="purple" size="sm">
              Resumo professor
            </Button>
            <Link href={`/professor/disciplinas/${disciplinaId}/alunos`}>
              <Button variant="purple" size="sm">
                Ver Alunos
              </Button>
            </Link>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Estatísticas da Turma</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Acertos x Erros</h3>
              <p className="text-sm text-gray-500 mb-6">From 1-8 Dec, 2025</p>
              
              <AcertosErrosChart 
                acertos={disciplina?.estatisticas.acertos}
                erros={disciplina?.estatisticas.erros}
                size={40}
              />
            </Card>

            <Card>
              <div className="flex items-start space-x-4">
                <svg className="w-6 h-6 text-yellow-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 0a12.06 12.06 0 0 0 4.5 0m-12.75 0a12.06 12.06 0 0 1 4.5 0m-4.5 0a12.06 12.06 0 0 0 4.5 0m.375 0a12.06 12.06 0 0 1 4.5 0m0 0a12.06 12.06 0 0 0 4.5 0m0 0a12.06 12.06 0 0 1-4.5 0m0 0a12.06 12.06 0 0 0-4.5 0m11.25-7.478a1.5 1.5 0 0 0-1.5-1.5h-6a1.5 1.5 0 0 0-1.5 1.5v.189A6.01 6.01 0 0 1 6 12.75a6.01 6.01 0 0 1 1.5-3.75m.375 7.478a6.01 6.01 0 0 0 1.5-.189m0 0A6.01 6.01 0 0 0 9 12.75m6 0a6.01 6.01 0 0 0-1.5-.189m1.5.189a6.01 6.01 0 0 1-1.5-.189" />
                </svg>
                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-2">Dicas de melhorias</h3>
                  <p className="text-sm text-gray-600">
                    Descrição com melhorias que podem ser feitas para avanço do desempenho do aluno com indicação de quais quizzes refazer, etc.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <SectionHeader
          title="Meus Quizzes"
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showSearch={true}
          showButton={true}
          buttonText="+ Cadastrar"
          buttonHref={`/professor/disciplinas/${disciplinaId}/quiz/novo`}
        />

        {filteredQuizzes.length === 0 ? (
          <EmptyState
            searchTerm={searchTerm}
            emptyMessage="Nenhum quiz cadastrado nesta disciplina."
            searchMessage={(term) => `Nenhum quiz encontrado com "${term}"`}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                showDetails={true}
                showEdit={true}
              />
            ))}
          </div>
        )}
      </div>
    </LayoutProfessor>
  );
}