'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { apiFetch } from '@/services/api';

import DisciplineList from '@/components/disciplina/disciplina-lista';
import SearchBar from '@/components/display/searchBar';
export default function MatriculaPage() {
  const router = useRouter();
  
  const [disciplinas, setDisciplinas] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [processando, setProcessando] = useState(null); 

  useEffect(() => {
    async function carregarDados() {
      try {

        const storedUserId = localStorage.getItem('userId');

        if (!storedUserId) {
            alert("Sessão inválida. Por favor, faça login novamente.");
            router.push('/auth/login');
            return;
        }
        setLoading(true);
        const response = await apiFetch(`/disciplinas/alunos/${storedUserId}/disponiveis`); 

        if (response.ok) {
           const data = await response.json();
           setDisciplinas(data);
        } else {
           console.error("Erro ao buscar disciplinas");
        }
      } catch (error) {
        console.error("Erro de rede:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  // Lógica de Filtragem
  const disciplinasFiltradas = disciplinas.filter(disc => 
    disc.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const handleMatricula = async (disciplinaId) => {
    try {
        setProcessando(disciplinaId);
        const userId = localStorage.getItem('userId');

        if (!userId) {
            alert("Erro: Usuário não identificado. Faça login novamente.");
            router.push('/auth/login');
            return;
        }
      console.log("User id: " + userId + " Disciplina id: " + disciplinaId);

        const response = await apiFetch(`/usuarios/alunos/${userId}/disciplinas`, {
            method: 'POST',
            body: JSON.stringify({
                disciplinaId: disciplinaId
            })
        });

        if (response.ok) {
            alert("Matrícula realizada com sucesso!");
            setDisciplinas(prev => prev.filter(d => d.id !== disciplinaId));
        } else {
            const errorData = await response.json();
            alert(errorData.message || "Erro ao realizar matrícula.");
        }

    } catch (error) {
        console.error("Erro ao matricular:", error);
        alert("Erro de conexão.");
    } finally {
        setProcessando(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header isLoggedIn={true} userType="aluno" />

      <main className="container mx-auto max-w-5xl px-6 py-10 flex-grow">
        
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-10">Matrícula</h1>

      
        <SearchBar searchTerm={termoBusca} setSearchTerm={setTermoBusca} isSearching={loading} />
        

        <DisciplineList 
            disciplinas={disciplinasFiltradas}
            loading={loading}
            onMatricula={handleMatricula}
            processingId={processando}
        />

      </main>

      <Footer />
    </div>
  );
}