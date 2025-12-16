'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import QuizzesState from '@/components/quizzes/quizzes-orquestrador';
import { apiFetch } from '@/services/api';

export default function DashboardDisciplinaPage() {
  const router = useRouter();
  const params = useParams();
  const disciplinaId = params?.id; // O nome do arquivo é [id], então o param é 'id'

  // Estados de Dados
  const [aluno, setAluno] = useState({ nome: '', id: null });
  const [quizzes, setQuizzes] = useState([]);
  const [disciplina, setDisciplina] = useState(null);

  // Estados de Controle
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Como removemos a lógica de busca separada, usamos o loading geral ou criamos um isSearching só pra input
  // Para simplificar, vou filtrar no front-end (já que os dados já estão carregados)

  const urlDisciplina = `/disciplinas/${disciplinaId}`;
  const urlQuizzes = `/disciplinas/${disciplinaId}/quizes`;

  useEffect(() => {
    if (!disciplinaId) return;

    async function carregarTudo() {
      try {
        setLoading(true);
        const userEmail = localStorage.getItem('userEmail');
        
        if (!userEmail) {
           router.push('/auth/login'); 
           return;
        }

        const [resAluno, resDisc, resQuiz] = await Promise.all([
            apiFetch(`/usuarios/alunos/email/${encodeURIComponent(userEmail)}`),
            apiFetch(urlDisciplina),
            apiFetch(urlQuizzes)
        ]);

        if (resAluno.status === 401 || resDisc.status === 401 || resQuiz.status === 401) {
            router.push('/auth/login');
            return;
        }

        if (resAluno.ok && resDisc.ok && resQuiz.ok) {
            const alunoData = await resAluno.json();
            const discData = await resDisc.json();
            const quizData = await resQuiz.json();

            const quizzesFormatados = quizData.map(q => ({
                id: q.id,
                title: q.titulo, 
                progress: q.progresso || 0, 
                grade: q.nota || 0,
                reviewDate: q.dataRevisao || 'Pendente' 
            }));

            localStorage.setItem('userId', alunoData.id);
            setAluno(alunoData);
            setDisciplina(discData);
            setQuizzes(quizzesFormatados);
        } 

      } catch (error) {
        console.error("Erro fatal na conexão:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarTudo();
  }, [disciplinaId, router]);

  const quizzesFiltrados = quizzes.filter(q => 
    q.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header isLoggedIn={true} userName={aluno.nome || 'Aluno'} userType="aluno" />

      <main className="container mx-auto max-w-6xl px-6 py-8 flex-grow">
        <section className="mb-8">
          {loading ? (
            <div className="h-10 w-1/3 bg-gray-200 animate-pulse rounded mb-2"></div>
          ) : (
            <h1 className="text-3xl font-bold text-gray-900">
              {disciplina?.nome || 'Disciplina'}
            </h1>
          )}
        </section>

        <section className="mt-10">
          <QuizzesState
            loading={loading}
            hasAluno={!!aluno.id}
            quizzes={quizzesFiltrados} // Passamos a lista já filtrada
            searchTerm={searchTerm}
            texts={{
              loading: 'Carregando seus quizzes...',
              empty: 'Nenhum quiz encontrado nesta disciplina.',
              search: (term) => `Não encontramos quizzes com o termo "${term}".`,
            }}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}