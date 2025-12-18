'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Importar useParams
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Button from '@/components/ui/button';
import Card from '@/components/display/card';
import Alert from '@/components/ui/alertas';
import Input from '@/components/ui/input';
import { apiFetch } from '@/services/api';

export default function CadastroDisciplina() {
  const router = useRouter();
  const params = useParams(); 
  
  // Assumindo que sua pasta se chama [professorId] ou [id]. 
  const professorId = params?.id ; 

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
  });
  const urlDashboard = '/professor/dashboard';
  const [professorNome, setProfessorNome] = useState('Professor'); // Apenas visual
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ type: 'success', title: '', message: '' });

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) setProfessorNome(storedName);
  }, []);

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
      if (!professorId) {
        throw new Error("ID do professor não encontrado na URL.");
      }

      const payload = {
          nome: formData.nome,
          descricao: formData.descricao,
          professorId: parseInt(professorId) // Converte para número (Long)
      };

      const response = await apiFetch(`/usuarios/professores/${professorId}`, {
          method: 'POST',
          body: JSON.stringify(payload)
      });
      
      if (response.ok) {
          setAlertInfo({
            type: 'success',
            title: 'Sucesso!',
            message: 'Disciplina cadastrada com sucesso.'
          });
          setShowAlert(true);
          
          setTimeout(() => {
            router.push(urlDashboard); 
          }, 2000);
      } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Erro ao criar disciplina.');
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
            Nova Disciplina
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
                  {loading ? 'Salvando...' : 'Cadastrar'}
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