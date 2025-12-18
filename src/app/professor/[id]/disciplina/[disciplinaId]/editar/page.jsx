'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Button from '@/components/ui/button';
import Card from '@/components/display/card';
import Alert from '@/components/ui/alertas';
import Input from '@/components/ui/input';
import { apiFetch } from '@/services/api';

export default function FormularioDisciplina() {
  const router = useRouter();
  const params = useParams(); 
  
  // params.id = ID do Professor (vem da pasta [id])
  // params.disciplinaId = ID da Disciplina (vem da pasta [disciplinaId] se for edição)
  const professorId = params?.id;
  const disciplinaId = params?.disciplinaId; // Assumindo que sua pasta de rota dinâmica se chama [disciplinaId]

  // Determina se é edição baseada na existência do ID
  const isEditing = !!disciplinaId;

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
  });

  const urlDashboard = '/professor/dashboard';
  const [professorNome, setProfessorNome] = useState('Professor');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(isEditing); // Loading inicial para buscar dados
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ type: 'success', title: '', message: '' });

  // 1. Carregar nome do professor e Dados da Disciplina (se for edição)
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) setProfessorNome(storedName);

    // Se for edição, busca os dados da disciplina para preencher o form
    if (isEditing) {
      const fetchDisciplina = async () => {
        try {
          // Ajuste a URL conforme seu Back-end (Ex: GET /disciplinas/{id})
          const response = await apiFetch(`/disciplinas/${disciplinaId}`); 
          if (response.ok) {
            const data = await response.json();
            setFormData({
              nome: data.nome,
              descricao: data.descricao
            });
          } else {
            throw new Error('Erro ao carregar dados da disciplina');
          }
        } catch (error) {
          setAlertInfo({
            type: 'error',
            title: 'Erro',
            message: 'Não foi possível carregar os dados para edição.'
          });
          setShowAlert(true);
        } finally {
          setDataLoading(false);
        }
      };
      fetchDisciplina();
    }
  }, [disciplinaId, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowAlert(false);

    try {
      let url, method, payload;

      // LÓGICA DE DECISÃO (CRIAR vs EDITAR)
      if (isEditing) {
        // EDICAO
        url = `/disciplinas/${disciplinaId}`; // Endpoint PUT padrão REST
        method = 'PUT';
        payload = {
            nome: formData.nome,
            descricao: formData.descricao,
            professorId: parseInt(professorId) 
        };
      } else {
        if (!professorId) throw new Error("ID do professor não encontrado na URL.");
        
        // Endpoint que você já usava
        url = `/usuarios/professores/${professorId}`; // Atenção: Verifique se essa rota cria disciplina no seu backend
        method = 'POST';
        payload = {
            nome: formData.nome,
            descricao: formData.descricao,
            professorId: parseInt(professorId)
        };
      }

      const response = await apiFetch(url, {
          method: method,
          body: JSON.stringify(payload)
      });
      
      if (response.ok) {
          setAlertInfo({
            type: 'success',
            title: 'Sucesso!',
            message: isEditing ? 'Disciplina atualizada com sucesso.' : 'Disciplina cadastrada com sucesso.'
          });
          setShowAlert(true);
          
          setTimeout(() => {
            router.push(urlDashboard); 
          }, 2000);
      } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Erro ao ${isEditing ? 'editar' : 'criar'} disciplina.`);
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

  // Se estiver carregando os dados da edição, mostra um loading simples antes de renderizar o form
  if (dataLoading) {
     return <div className="flex justify-center items-center h-screen">Carregando dados...</div>;
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
            {isEditing ? 'Editar Disciplina' : 'Nova Disciplina'}
          </h1>

          <Card className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <Input
                label="Nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: Engenharia de Software"
                required
                maxLength={25} 
                disabled={loading}
              />
              <span className="text-xs text-gray-400 block text-right mt-[-15px]">
                {formData.nome.length}/25
              </span>

              <div className="flex flex-col">
                  <Input
                    label="Descrição"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    placeholder="Objetivo da disciplina..."
                    required
                    maxLength={400} 
                    disabled={loading}
                  />
                  <span className="text-xs text-gray-400 text-right mt-1">
                    {formData.descricao.length}/400
                  </span>
              </div>

              <div className="flex space-x-4">
                <Link href={urlDashboard} className="flex-1">
                  <Button
                    variant="outline"
                    disabled={loading}
                    type="button"
                  >
                    Cancelar
                  </Button>
                </Link>
                
                <Button
                  variant="outline"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Cadastrar')}
                </Button>
              </div>
            </form>
          </Card>
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