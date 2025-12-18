'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Button from '@/components/ui/button';
import Alert from '@/components/ui/alertas';
import QuestaoLista from '@/components/questao/questaoLista';
import { apiFetch } from '@/services/api';

export default function BancoDeQuestoesPage() {
  const params = useParams();
  const disciplinaId = params?.id;

  const [questoes, setQuestoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [professorNome, setProfessorNome] = useState('Professor');
  const [alertInfo, setAlertInfo] = useState(null);

  // Busca dados iniciais
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) setProfessorNome(storedName);

    if (disciplinaId) {
      fetchQuestoes();
    }
  }, [disciplinaId]);

  async function fetchQuestoes() {
    setLoading(true);
    try {
      // Endpoint GET assumido: /disciplinas/{id}/questoes
      const response = await apiFetch(`/disciplinas/${disciplinaId}/questoes`);
      if (response.ok) {
        const data = await response.json();
        setQuestoes(data);
      } 
    } catch (error) {
      console.error(error);
      setAlertInfo({ type: 'error', message: 'Não foi possível carregar as questões.' });
    } finally {
      setLoading(false);
    }
  }

  // Função para deletar questão
  const handleDelete = async (questaoId) => {
    if (!window.confirm("Tem certeza que deseja excluir esta questão? Isso pode afetar quizzes existentes.")) {
      return;
    }

    try {
      const response = await apiFetch(`/disciplinas/${disciplinaId}/questoes/${questaoId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Remove da lista localmente para não precisar recarregar tudo
        setQuestoes(prev => prev.filter(q => q.id !== questaoId));
        setAlertInfo({ type: 'success', message: 'Questão excluída com sucesso.', autoClose: true });
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao excluir questão.');
      }
    } catch (error) {
      setAlertInfo({ type: 'error', message: error.message });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isLoggedIn={true} userType="professor" userName={professorNome} />

      <main className="flex-1 container mx-auto max-w-5xl px-4 py-10">
        
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Banco de Questões</h1>
            <p className="text-gray-500 mt-1">Gerencie as questões desta disciplina</p>
          </div>

          <div className="flex gap-3">
             {/* Botão Voltar para Disciplina */}
             <Link href={`/professor/disciplina/${disciplinaId}`}>
              <Button variant="outline">Voltar</Button>
            </Link>

            {/* Botão Cadastrar Nova Questão */}
            <Link href={`/professor/disciplina/${disciplinaId}/questoes/cadastro`}>
              <Button variant="purple">
                + Nova Questão
              </Button>
            </Link>
          </div>
        </div>

        {/* Alertas */}
        {alertInfo && (
          <div className="mb-6">
            <Alert 
              type={alertInfo.type} 
              message={alertInfo.message} 
              onClose={() => setAlertInfo(null)} 
              autoClose={alertInfo.autoClose}
            />
          </div>
        )}

        {/* Lista de Questões */}
        <QuestaoLista 
          questoes={questoes} 
          loading={loading} 
          onDelete={handleDelete} 
          disciplinaId={disciplinaId}
        />

      </main>
      <Footer />
    </div>
  );
}