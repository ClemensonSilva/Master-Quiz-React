'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

import LayoutProfessor from '@/components/layout/layoutProfessor';
import SectionHeader from '@/components/layout/sectionHeader';
import Card from '@/components/display/card';
import PerformanceChart from '@/components/charts/performanceChart';
import ProgressBar from '@/components/display/progressBar';
import RankingTable from '@/components/tables/rankingTable';
import Button from '@/components/ui/button';

const mockQuestoes = [
  { id: 1, acertos: 80, cor: 'bg-green-500' },
  { id: 2, acertos: 25, cor: 'bg-red-500' },
  { id: 3, acertos: 50, cor: 'bg-yellow-500' },
  { id: 4, acertos: 80, cor: 'bg-green-500' },
  { id: 5, acertos: 65, cor: 'bg-green-500' },
];

const mockRanking = [
  { posicao: 1, nome: 'Aluno 1', info: 'Placeholder', acertos: '100%' },
  { posicao: 2, nome: 'Aluno 2', info: 'Placeholder', acertos: '100%' },
  { posicao: 3, nome: 'Aluno 3', info: 'Placeholder', acertos: '100%' },
  { posicao: 4, nome: 'Aluno 4', info: 'Placeholder', acertos: '100%' },
];

export default function RelatorioQuiz() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id;
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    const loadQuizData = () => {
      setLoading(true);
      setTimeout(() => {
        setQuizData({
          nome: 'Questionário 1',
          disciplina: 'Matemática',
          dataAplicacao: '08/12/2025',
        });
        setLoading(false);
      }, 500);
    };

    loadQuizData();
  }, [quizId]);

  const handleBack = () => {
    router.back();
  };

  return (
    <LayoutProfessor userName="Nome Professor">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            {loading ? 'Carregando...' : `${quizData?.nome} - Relatório`}
          </h1>
          {quizData && (
            <p className="text-gray-600">
              Disciplina: {quizData.disciplina} | Data: {quizData.dataAplicacao}
            </p>
          )}
        </div>

        <section className="mb-12">
          <SectionHeader
            title="Desempenho da Turma"
            showSearch={false}
            showButton={false}
          />
          
          <Card className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Porcentagem de Acertos por Questão</h3>
            <PerformanceChart questoes={mockQuestoes} />
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {mockQuestoes.map((questao) => (
              <Card key={questao.id}>
                <h4 className="text-md font-medium text-gray-900 mb-2">Questão {questao.id}</h4>
                <div className="mb-2">
                  <ProgressBar progress={questao.acertos} />
                  <span className="text-xs text-gray-600">{questao.acertos}% de acertos</span>
                </div>
                <p className="text-sm text-gray-600">
                  Detalhes da questão {questao.id} e estatísticas de desempenho.
                </p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <SectionHeader
            title="Ranking dos Alunos"
            showSearch={false}
            showButton={false}
          />
          
          <RankingTable ranking={mockRanking} loading={loading} />
        </section>

        <div className="mt-8 flex justify-end">
          <Button
            variant="outline"
            onClick={handleBack}
          >
            Voltar
          </Button>
        </div>
      </div>
    </LayoutProfessor>
  );
}