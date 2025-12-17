'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

import LayoutProfessor from '@/components/layout/layoutProfessor';
import QuizForm from '@/components/forms/quizForm';
import Alert from '@/components/ui/alertas';

const mockDisciplinas = [
  { value: 'matematica', label: 'Matemática' },
  { value: 'portugues', label: 'Português' },
  { value: 'sistemas-operacionais', label: 'Sistemas Operacionais' },
  { value: 'geografia', label: 'Geografia' },
  { value: 'lfa', label: 'LFA' },
  { value: 'biologia', label: 'Biologia' },
];

export default function CadastroNovoQuiz() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const disciplinaId = params.id || searchParams.get('disciplinaId');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ type: 'success', title: '', message: '' });
  const [disciplinas, setDisciplinas] = useState([]);

  useEffect(() => {
    // Carregar disciplinas do professor
    setTimeout(() => {
      setDisciplinas(mockDisciplinas);
    }, 300);
  }, []);

  const handleSubmit = async (formData) => {
    if (!formData.nome.trim()) {
      setAlertInfo({
        type: 'error',
        title: 'Erro',
        message: 'O nome do quiz é obrigatório.'
      });
      setShowAlert(true);
      return;
    }

    if (!formData.disciplina) {
      setAlertInfo({
        type: 'error',
        title: 'Erro',
        message: 'Selecione uma disciplina.'
      });
      setShowAlert(true);
      return;
    }

    setLoading(true);

    try {
      // Simulação de API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAlertInfo({
        type: 'success',
        title: 'Sucesso!',
        message: 'Quiz cadastrado com sucesso.'
      });
      setShowAlert(true);
      
      // Redireciona para página de questões após 2 segundos
      setTimeout(() => {
        if (disciplinaId) {
          router.push(`/professor/disciplinas/${disciplinaId}/quiz/lista`);
        } else {
          router.push('/professor/quiz/lista');
        }
      }, 2000);
      
    } catch (error) {
      setAlertInfo({
        type: 'error',
        title: 'Erro',
        message: 'Ocorreu um erro ao cadastrar o quiz.'
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (disciplinaId) {
      router.push(`/professor/disciplinas/${disciplinaId}`);
    } else {
      router.push('/professor/quiz/lista');
    }
  };

  return (
    <LayoutProfessor userName="Nome Professor">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-10">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-10">
          Cadastrar Novo Quiz
        </h1>

        <QuizForm
          initialData={{ disciplina: disciplinaId || '' }}
          disciplinas={disciplinas}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
          submitText="Cadastrar Quiz"
        />
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