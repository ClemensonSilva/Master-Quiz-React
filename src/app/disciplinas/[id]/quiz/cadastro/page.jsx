"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Alert from '@/components/ui/alertas';
import { apiFetch } from '@/services/api';



import QuizForm from '@/components/quizzes/quizForm'; 

export default function CadastroQuiz() {
  const router = useRouter();
  const params = useParams();
  const disciplinaId = params?.id;

  const urlDashboard = `/professor/disciplina/${disciplinaId}`; 
  
  const [professorNome, setProfessorNome] = useState('Professor');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ type: 'success', title: '', message: '' });

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) setProfessorNome(storedName);
  }, []);

  
  const handleCreateQuiz = async (formData) => {
    setLoading(true);
    setShowAlert(false);

    try {
      if (!disciplinaId) {
        throw new Error("ID da disciplina não encontrado na URL.");
      }

      
      const payload = {
        titulo: formData.nome, 
        descricao: formData.descricao,
        disciplinaId: parseInt(disciplinaId) 
      };

      
      
      const response = await apiFetch(`/disciplinas/${disciplinaId}/quizes`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setAlertInfo({
          type: 'success',
          title: 'Sucesso!',
          message: 'Quiz cadastrado com sucesso.'
        });
        setShowAlert(true);

        setTimeout(() => {
          router.push(urlDashboard);
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao criar quiz.');
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
            Novo Quiz
          </h1>

          <QuizForm 
            initialData={{}} 
            onSubmit={handleCreateQuiz}
            onCancel={handleCancel}
            loading={loading}
            submitText="Salvar Quiz"
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