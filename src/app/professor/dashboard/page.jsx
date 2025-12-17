'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/button';
import { apiFetch } from '@/services/api';
import DisciplinesState from '@/components/disciplina/disciplina-orquestrador';
import DashboardTemplate from '@/components/templates/dashboardTemplate'; 

export default function DashboardAlunoPage() {
  const router = useRouter();
    // mantive como aluno mesmo, corrigir depois
  const [aluno, setAluno] = useState({ nome: '', id: null, avatar: null, type: 'aluno' });
  const [disciplinas, setDisciplinas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfessorData() {
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) throw new Error("Email não encontrado.");

        const professorResponse = await apiFetch(`/usuarios/professores/email/${encodeURIComponent(userEmail)}`);

        if (professorResponse.status === 401) {
            router.push('/auth/login'); 
            return;
        }
        if (!professorResponse.ok) throw new Error('Falha ao carregar perfil.');
        const professorData = await professorResponse.json();
        localStorage.setItem('userId', professorData.id); 
        setAluno({ ...professorData, type: 'professor' });

      } catch (err) {
        setError("Erro ao carregar perfil.");
        router.push('/auth/login');
        console.error(err);
      } finally {
        setLoadingInitial(false);
      }
    }
    fetchProfessorData();
  }, [router]);
  // mantive como aluno mesmo, corrigir depois
  useEffect(() => {
    if (!aluno.id) return;
    const delayDebounceFn = setTimeout(() => {
      fetchDisciplinas(aluno.id, searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, aluno.id]);

  async function fetchDisciplinas(professorId, query) {
    try {
      setIsSearching(true);
      const queryParam = query ? `?nome=${encodeURIComponent(query)}` : '';
      const url = `/usuarios/professores/${professorId}/disciplinas${queryParam}`;
      const response = await apiFetch(url);

      if (response.ok) {
        const data = await response.json();
        setDisciplinas(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  }
// TODO usar a url como fonte da verdade, adicionar o id do professor na url
  if (error) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => router.push('/auth/login')}>Refazer login</Button>
      </div>
    );
  }

  return (
    <DashboardTemplate
        user={aluno}
        loadingUser={loadingInitial}
        title="Minhas Disciplinas"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isSearching={isSearching}
        actionButton={
            <Link href={`/professor/${aluno.id}/disciplina/cadastro`}>
              <Button variant="purple" size="md">Adicionar Disciplina</Button>
            </Link>
        }
    >
        <DisciplinesState
            loading={loadingInitial}
            hasAluno={!!aluno.id}
            disciplinas={disciplinas}
            searchTerm={searchTerm}
            isSearching={isSearching}
            urlParaAcessar={`/professor/disciplina/`}
            texts={{
              loading: 'Carregando suas disciplinas...',
              empty: 'Você ainda não possui disciplinas cadastradas.',
              search: (term) => `Nenhuma disciplina chamada "${term}" foi encontrada.`,
            }}
          />   
    </DashboardTemplate>
  );
}