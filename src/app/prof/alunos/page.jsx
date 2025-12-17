'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import SearchBar from '@/components/display/searchBar';
import Card from '@/components/display/card';

const mockAlunos = [
  { id: 1, nome: 'Aluno 1', email: 'aluno1@email.com', telefone: '00000-0001' },
  { id: 2, nome: 'Aluno 2', email: 'aluno2@email.com', telefone: '00000-0002' },
  { id: 3, nome: 'Aluno 3', email: 'aluno3@email.com', telefone: '00000-0003' },
  { id: 4, nome: 'Aluno 4', email: 'aluno4@email.com', telefone: '00000-0004' },
];

export default function Alunos() {
  const router = useRouter();
  const params = useParams();
  const disciplinaId = params.id;
  const [alunos, setAlunos] = useState([]);
  const [filteredAlunos, setFilteredAlunos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [disciplina, setDisciplina] = useState(null);

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      setTimeout(() => {
        setDisciplina({
          id: disciplinaId,
          nome: 'Matemática'
        });
        setAlunos(mockAlunos);
        setFilteredAlunos(mockAlunos);
        setLoading(false);
      }, 500);
    };

    loadData();
  }, [disciplinaId]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAlunos(alunos);
      return;
    }

    const filtered = alunos.filter(aluno =>
      aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAlunos(filtered);
  }, [searchTerm, alunos]);

  const handleBack = () => {
    router.push(`/professor/disciplinas/${disciplinaId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        isLoggedIn={true}
        userType="professor"
        userName="Nome Professor"
      />
      
      <main className="flex-1 bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                {disciplina ? `Alunos - ${disciplina.nome}` : 'Alunos'}
              </h1>
              <p className="text-gray-600">
                {alunos.length} aluno{alunos.length !== 1 ? 's' : ''} matriculado{alunos.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                isSearching={false}
                placeholder="Pesquisar Aluno"
              />
            </div>
          </div>

          <Card className="p-0 overflow-hidden">
            <div className="grid grid-cols-3 gap-4 items-center bg-quiz-light-gray px-6 py-4 border-b border-gray-200">
              <div className="text-sm font-semibold text-gray-600 uppercase">Nome</div>
              <div className="text-sm font-semibold text-gray-600 uppercase">Email</div>
              <div className="text-sm font-semibold text-gray-600 uppercase">Telefone</div>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="text-gray-500 mt-2">Carregando alunos...</p>
              </div>
            ) : filteredAlunos.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {searchTerm 
                  ? `Nenhum aluno encontrado com "${searchTerm}"`
                  : 'Nenhum aluno matriculado nesta disciplina.'
                }
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredAlunos.map((aluno) => (
                  <div key={aluno.id} className="grid grid-cols-3 gap-4 items-center px-6 py-4 hover:bg-gray-50">
                    <div className="font-medium text-gray-900">{aluno.nome}</div>
                    <div className="text-gray-600">{aluno.email}</div>
                    <div className="text-gray-600">{aluno.telefone}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleBack}
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              ← Voltar para disciplina
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}