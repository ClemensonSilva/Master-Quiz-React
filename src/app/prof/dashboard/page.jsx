'use client';

import { useState, useEffect } from 'react';
import LayoutProfessor from '@/components/layout/layoutProfessor';
import ContinueQuizCard from '@/components/cards/continueQuizCard';
import SectionHeader from '@/components/layout/sectionHeader';
import LoadingState from '@/components/feedback/loadingState';
import EmptyState from '@/components/feedback/emptyState';
import DisciplinaCard from '@/components/cards/disciplinaCard';
import Alert from '@/components/ui/alertas';

// Mockup dos dados das disciplinas
const mockDisciplinas = [
  {
    id: 1,
    nome: 'Matemática',
    progresso: 33,
    descricao: 'Descrição dos quizzes',
    professor: 'Professor',
  },
  {
    id: 2,
    nome: 'Português',
    progresso: 43,
    descricao: 'Descrição dos quizzes',
    professor: 'Professor',
  },
  {
    id: 3,
    nome: 'Sistemas Operacionais',
    progresso: 0,
    descricao: 'Descrição dos quizzes',
    professor: 'Professor',
  },
  {
    id: 4,
    nome: 'Geografia',
    progresso: 10,
    descricao: 'Descrição dos quizzes',
    professor: 'Professor',
  },
  {
    id: 5,
    nome: 'LFA',
    progresso: 15,
    descricao: 'Descrição dos quizzes',
    professor: 'Professor',
  },
  {
    id: 6,
    nome: 'Biologia',
    progresso: 0,
    descricao: 'Descrição dos quizzes',
    professor: 'Professor',
  },
];

export default function DashboardProfessor() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [filteredDisciplinas, setFilteredDisciplinas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ type: 'success', title: '', message: '' });

  // Simulação de carregamento de dados
  useEffect(() => {
    const loadDisciplinas = () => {
      setLoading(true);
      setTimeout(() => {
        setDisciplinas(mockDisciplinas);
        setFilteredDisciplinas(mockDisciplinas);
        setLoading(false);
      }, 500);
    };

    loadDisciplinas();
  }, []);

  // Filtro de disciplinas
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDisciplinas(disciplinas);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeout = setTimeout(() => {
      const filtered = disciplinas.filter(disciplina =>
        disciplina.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disciplina.professor.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDisciplinas(filtered);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm, disciplinas]);

  const handleEstatisticas = () => {
    setAlertInfo({
      type: 'info',
      title: 'Estatísticas',
      message: 'Redirecionando para a página de estatísticas...',
    });
    setShowAlert(true);
  };

  const handleContinueQuiz = () => {
    setAlertInfo({
      type: 'success',
      title: 'Quiz',
      message: 'Redirecionando para o quiz...',
    });
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <LayoutProfessor userName="Nome Professor">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <ContinueQuizCard
          onButtonClick={handleContinueQuiz}
        />

        <SectionHeader
          title="Minhas Disciplinas"
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isSearching={isSearching}
          showSearch={true}
          showButton={true}
          buttonText="Cadastrar Disciplina"
          buttonHref="/professor/disciplinas/cadastrar"
          buttonVariant='outline'
        />

        {loading ? (
          <LoadingState message="Carregando disciplinas..." />
        ) : filteredDisciplinas.length === 0 ? (
          <EmptyState
            searchTerm={searchTerm}
            emptyMessage="Nenhuma disciplina cadastrada."
            searchMessage={(term) => `Nenhuma disciplina encontrada com "${term}"`}
          />
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${isSearching ? 'opacity-50' : 'opacity-100'}`}>
            {filteredDisciplinas.map((disciplina) => (
              <DisciplinaCard
                key={disciplina.id}
                disciplina={{
                  id: disciplina.id,
                  nome: disciplina.nome,
                  progresso: disciplina.progresso,
                  descricao: disciplina.descricao
                }}
              />
            ))}
          </div>
        )}
      </div>

      {showAlert && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md">
          <Alert
            type={alertInfo.type}
            title={alertInfo.title}
            message={alertInfo.message}
            onClose={handleCloseAlert}
            autoClose={true}
            duration={3000}
          />
        </div>
      )}
    </LayoutProfessor>
  );
}