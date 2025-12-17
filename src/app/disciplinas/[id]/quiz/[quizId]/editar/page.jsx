"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Alert from '@/components/ui/alertas';
import { apiFetch } from '@/services/api';
import QuizForm from '@/components/quizzes/quizForm';

export default function GerenciarQuizPage() {
  const router = useRouter();
  const params = useParams();
  
  
  const disciplinaId = params?.id;
  const quizId = params?.quizId; 

  
  const isEditing = !!quizId;

  const urlDashboard = `/professor/disciplina/${disciplinaId}`;

  const [professorNome, setProfessorNome] = useState('Professor');
  const [loading, setLoading] = useState(false); 
  const [fetchingData, setFetchingData] = useState(isEditing); 
  const [initialData, setInitialData] = useState({}); 

  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ type: 'success', title: '', message: '' });

  
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) setProfessorNome(storedName);
  }, []);

  
  useEffect(() => {
    if (!isEditing) return;

    async function fetchQuizData() {
      try {
        const response = await apiFetch(`/disciplinas/${disciplinaId}/quizes/${quizId}`);
        
        if (response.ok) {
          const data = await response.json();
          
          setInitialData({
            nome: data.titulo, 
            descricao: data.descricao,
          });
        } else {
          throw new Error('Não foi possível carregar os dados do quiz.');
        }
      } catch (error) {
        console.error(error);
        setAlertInfo({ type: 'error', title: 'Erro', message: 'Falha ao carregar quiz.' });
        setShowAlert(true);
      } finally {
        setFetchingData(false);
      }
    }

    fetchQuizData();
  }, [isEditing, quizId, disciplinaId]);

  
  const handleSaveQuiz = async (formData) => {
    setLoading(true);
    setShowAlert(false);

    try {
      if (!disciplinaId) throw new Error("ID da disciplina não encontrado.");

      const payload = {
        titulo: formData.nome,
        descricao: formData.descricao,
      };

      let response;

      if (isEditing) {
        response = await apiFetch(`/disciplinas/${disciplinaId}/quizes/${quizId}`, { 
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        } else {
        response = await apiFetch(`/disciplinas/${disciplinaId}/quizes`, {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        setAlertInfo({
          type: 'success',
          title: isEditing ? 'Atualizado!' : 'Sucesso!',
          message: isEditing ? 'Quiz alterado com sucesso.' : 'Quiz cadastrado com sucesso.'
        });
        setShowAlert(true);

        setTimeout(() => {
          router.push(urlDashboard);
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao salvar quiz.');
      }

    } catch (error) {
      setAlertInfo({
        type: 'error',
        title: 'Erro',
        message: error.message
      });
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(urlDashboard);
  };

  if (fetchingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        isLoggedIn={true}
        userType="professor"
        userName={professorNome}
      />

      <main className="flex-1 bg-white">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-10">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-10">
            {isEditing ? 'Editar Quiz' : 'Novo Quiz'}
          </h1>

          <QuizForm 
            initialData={initialData} 
            onSubmit={handleSaveQuiz}
            onCancel={handleCancel}
            loading={loading}
            submitText={isEditing ? "Atualizar Quiz" : "Salvar Quiz"}
          />
        </div>
      </main>

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

      <Footer />
    </div>
  );
}