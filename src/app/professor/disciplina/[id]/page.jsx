'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Button from '@/components/ui/button';
import Link from 'next/link';
import QuizzesState from '@/components/quizzes/quizzes-orquestrador';
import { apiFetch } from '@/services/api';

export default function DashboardDisciplinaPage() {
  const router = useRouter();
  const params = useParams();
  const disciplinaId = params?.id;

  
  const [usuario, setUsuario] = useState({ nome: '', id: null });
  const [tipoUsuario, setTipoUsuario] = useState(null);

  const [quizzes, setQuizzes] = useState([]);
  const [disciplina, setDisciplina] = useState(null);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const urlDisciplina = `/disciplinas/${disciplinaId}`;
  const urlQuizzes = `/disciplinas/${disciplinaId}/quizes`;
const handleDeleteQuiz = async (quizId) => {
      
      const confirmou = window.confirm("Tem certeza que deseja excluir este quiz? Esta ação não pode ser desfeita.");

      if (!confirmou) return;

      try {
        
        const response = await apiFetch(`/disciplinas/${disciplinaId}/quizes/${quizId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          
          
          setQuizzes((prevQuizzes) => prevQuizzes.filter(q => q.id !== quizId));

          
          alert("Quiz excluído com sucesso!");
        } else {
          alert("Erro ao excluir o quiz.");
        }
      } catch (error) {
        console.error("Erro na exclusão:", error);
        alert("Erro de conexão ao tentar excluir.");
      }
    };

  useEffect(() => {
    if (!disciplinaId) return;
    
    
    async function carregarTudo() {
      try {
        setLoading(true);
        const userEmail = localStorage.getItem('userEmail');    
        
        const roleSalva = localStorage.getItem('userRole') || 'ALUNO';
        setTipoUsuario(roleSalva);

        if (!userEmail) {
          router.push('/auth/login');
          return;
        }

        
        let urlUsuario = '';
        if (roleSalva === 'ROLE_PROFESSOR') {
          urlUsuario = `/usuarios/professores/email/${encodeURIComponent(userEmail)}`;
        } else {
          urlUsuario = `/usuarios/alunos/email/${encodeURIComponent(userEmail)}`;
        }

        const [resUser, resDisc, resQuiz] = await Promise.all([
          apiFetch(urlUsuario),
          apiFetch(urlDisciplina),
          apiFetch(urlQuizzes)
        ]);

        if (resUser.status === 401 || resDisc.status === 401 || resQuiz.status === 401) {
          router.push('/auth/login');
          return;
        }

        if (resUser.ok && resDisc.ok && resQuiz.ok) {
          const userData = await resUser.json();
          const discData = await resDisc.json();
          const quizData = await resQuiz.json();

          console.log('Dados do Usuário:', userData);

          const quizzesFormatados = quizData.map(q => ({
            id: q.id,
            title: q.titulo,
            progress: roleSalva === 'ROLE_PROFESSOR' ? 0 : (q.progresso || 0),
            grade: roleSalva === 'ROLE_PROFESSOR' ? 0 : (q.nota || 0),
            disciplinaId: disciplinaId,
            reviewDate: q.dataRevisao || 'Pendente'
          }));

          localStorage.setItem('userId', userData.id);
          setUsuario(userData);
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
  console.log('Quizzes carregados:', quizzes);
  const quizzesFiltrados = quizzes.filter(q =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header
        isLoggedIn={true}
        userName={usuario.nome || 'Usuário'}
        
        userType={tipoUsuario === 'PROFESSOR' ? 'professor' : 'aluno'}
      />

      <main className="container mx-auto max-w-6xl px-6 py-8 flex-grow">
        <section className="mb-8 flex items-center justify-between">
          <div>
            {loading ? (
              <div className="h-10 w-48 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <h1 className="text-3xl font-bold text-gray-900">
                {disciplina?.nome || 'Disciplina'}
              </h1>
            )}
          </div>

          {tipoUsuario === 'ROLE_PROFESSOR' && (
            <Link href={`/disciplinas/${disciplinaId}/quiz/cadastro`}>
              <Button variant="purple" size="md">
                Adicionar Quiz à disciplina
              </Button>
            </Link>
          )}
        </section>

        <section className="mt-10">
          <QuizzesState
            loading={loading}
            hasUser={!!usuario.id}
            onDelete={handleDeleteQuiz}
            quizzes={quizzesFiltrados}
            searchTerm={searchTerm}
            userType={tipoUsuario}
            texts={{
              loading: 'Carregando dados...',
              empty: tipoUsuario === 'PROFESSOR'
                ? 'Nenhum quiz cadastrado nesta disciplina.'
                : 'Nenhum quiz disponível para você.',
              search: (term) => `Não encontramos nada com "${term}".`,
            }}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}