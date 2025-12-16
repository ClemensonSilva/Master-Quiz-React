'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Componentes
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Button from '@/components/ui/button';
import SearchBar from '@/components/display/searchBar';
import DisciplineCard from '@/components/cards/disciplinaCard';
import { apiFetch } from '@/services/api';
import DisciplinesState from '@/components/disciplina/disciplina-orquestrador';

export default function DashboardAlunoPage() {
  const router = useRouter();

  const [aluno, setAluno] = useState({ nome: '', id: null, avatar: null });
  const [disciplinas, setDisciplinas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAlunoData() {
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) throw new Error("Email não encontrado na sessão.");

        const alunoResponse = await apiFetch(`/usuarios/alunos/email/${encodeURIComponent(userEmail)}`);

        if (alunoResponse.status === 401) {
          router.push('/auth/login');
          return;
        }

        if (!alunoResponse.ok) throw new Error('Falha ao carregar perfil.');

        const alunoData = await alunoResponse.json();
        localStorage.setItem('userId', alunoData.id); 
        setAluno(alunoData);

      } catch (err) {
        setError("Erro ao carregar perfil.");
        router.push('/auth/login');
      } finally {
        setLoadingInitial(false);
      }
    }

    fetchAlunoData();
  }, [router]);

  useEffect(() => {
    if (!aluno.id) return;

    const delayDebounceFn = setTimeout(() => {
      fetchDisciplinas(aluno.id, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, aluno.id]);

  // funcao para buscar disciplinas
  async function fetchDisciplinas(alunoId, query) {
    try {
      setIsSearching(true);
      const queryParam = query ? `?nome=${encodeURIComponent(query)}` : '';
      const url = `/usuarios/alunos/${alunoId}/disciplinas${queryParam}`;

      const response = await apiFetch(url);
      console.log("Fetch Disciplinas URL:", url);
      console.log("Response:", response);
      if (response.ok) {
        const data = await response.json();
        setDisciplinas(data);
      } else {
        console.error("Erro ao buscar disciplinas status:", response.status);
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
    } finally {
      setIsSearching(false);
    }
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => router.push('/auth/login')}>Rafazer login</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header isLoggedIn={true} userName={aluno.nome || 'Aluno'} userType="aluno" />

      <main className="container mx-auto max-w-7xl px-6 py-8 flex-grow">

        <section className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-200">
          <div className="mb-4 md:mb-0">
            {loadingInitial ? (
              <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <h2 className="text-3xl font-light text-gray-800">
                Olá, <span className="font-semibold">{aluno.nome}</span>
              </h2>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-100">
              <img
                src={aluno.avatar || `https://ui-avatars.com/api/?name=${aluno.nome || 'User'}&background=random`}
                alt="Avatar"
                className="object-cover w-full h-full"
              />
            </div>

            <Link href="/aluno/matricula">
              <Button variant="purple" size="sm">Matrícula</Button>
            </Link>
          </div>
        </section>


        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h3 className="text-2xl font-semibold text-gray-900">Minhas Disciplinas</h3>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} isSearching={isSearching} />
          </div>
          <DisciplinesState
            loading={loadingInitial}
            hasAluno={!!aluno.id}
            disciplinas={disciplinas}
            searchTerm={searchTerm}
            isSearching={isSearching}
            texts={{
              loading: 'Carregando suas disciplinas...',
              empty: 'Você ainda não possui disciplinas cadastradas.',
              search: (term) => `Nenhuma disciplina chamada "${term}" foi encontrada.`,
            }}
          />       
          </section>

      </main>
      <Footer />
    </div>
  );
}