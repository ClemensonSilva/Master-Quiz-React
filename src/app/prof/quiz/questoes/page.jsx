'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

import LayoutProfessor from '@/components/layout/layoutProfessor';
import SectionHeader from '@/components/layout/sectionHeader';
import LoadingState from '@/components/feedback/loadingState';
import EmptyState from '@/components/feedback/emptyState';
import QuestaoCard from '@/components/cards/questaoCard';
import Alert from '@/components/ui/alertas';

const mockQuestoes = [
  { 
    id: 1, 
    titulo: 'Questão 1', 
    descricao: 'Descrição 1',
    alternativas: null 
  },
  { 
    id: 2, 
    titulo: 'Questão 2', 
    descricao: 'Descrição 2',
    alternativas: ['a) a', 'b) b', 'c) c', 'd) d'] 
  },
  { 
    id: 3, 
    titulo: 'Questão 3', 
    descricao: 'Descrição 3',
    alternativas: null 
  },
];

export default function Questoes() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id;
  const [questoes, setQuestoes] = useState([]);
  const [filteredQuestoes, setFilteredQuestoes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ type: 'info', title: '', message: '' });

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      setTimeout(() => {
        setQuiz({
          id: quizId,
          nome: 'Questionário 1',
          disciplina: 'Matemática'
        });
        setQuestoes(mockQuestoes);
        setFilteredQuestoes(mockQuestoes);
        setLoading(false);
      }, 500);
    };

    loadData();
  }, [quizId]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredQuestoes(questoes);
      return;
    }

    const filtered = questoes.filter(questao =>
      questao.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      questao.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuestoes(filtered);
  }, [searchTerm, questoes]);

  const handleDelete = (questaoId) => {
    if (window.confirm('Tem certeza que deseja excluir esta questão?')) {
      setQuestoes(prev => prev.filter(q => q.id !== questaoId));
      setFilteredQuestoes(prev => prev.filter(q => q.id !== questaoId));
      
      setAlertInfo({
        type: 'success',
        title: 'Sucesso',
        message: 'Questão excluída com sucesso.'
      });
      setShowAlert(true);
    }
  };

  const handleEdit = (questaoId) => {
    router.push(`/prof/quiz/${quizId}/questoes/${questaoId}/editar`);
  };

  const handleAddQuestao = () => {
    router.push(`/prof/quiz/${quizId}/questoes`);
  };

  const handleBack = () => {
    router.push(`/prof/quiz/${quizId}/quiz-relatorio`);
  };

  return (
    <LayoutProfessor userName="Nome Professor">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <SectionHeader
          title={quiz ? `${quiz.nome} - Questões` : 'Questões'}
          subtitle={quiz ? `Disciplina: ${quiz.disciplina} | ${questoes.length} questão${questoes.length !== 1 ? 'es' : ''}` : ''}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showSearch={true}
          showButton={true}
          buttonText="Adicionar Questão"
          buttonOnClick={handleAddQuestao}
          buttonVariant='outline'
        />

        {loading ? (
          <LoadingState 
            message="Carregando questões..." 
            size="lg"
          />
        ) : filteredQuestoes.length === 0 ? (
          <EmptyState
            searchTerm={searchTerm}
            emptyMessage="Nenhuma questão cadastrada neste quiz."
            searchMessage={(term) => `Nenhuma questão encontrada com "${term}"`}
            showButton={true}
            buttonText="Adicionar Primeira Questão"
            buttonOnClick={handleAddQuestao}
          />
        ) : (
          <div className="space-y-6">
            {filteredQuestoes.map((questao) => (
              <QuestaoCard
                key={questao.id}
                questao={questao}
                onEdit={() => handleEdit(questao.id)}
                onDelete={() => handleDelete(questao.id)}
              />
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleBack}
            className="text-gray-700 hover:text-gray-900 font-medium"
          >
            ← Voltar para o quiz
          </button>
        </div>
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