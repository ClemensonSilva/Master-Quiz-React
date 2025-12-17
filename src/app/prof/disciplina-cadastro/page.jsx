'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Button from '@/components/ui/button';
import Card from '@/components/display/card';
import Alert from '@/components/ui/alertas';
import Input from '@/components/ui/input';

export default function CadastroDisciplina() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',
    cargaHoraria: '',
  });
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ type: 'success', title: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      setAlertInfo({
        type: 'error',
        title: 'Erro',
        message: 'O nome da disciplina é obrigatório.'
      });
      setShowAlert(true);
      return;
    }

    setLoading(true);

    try {
      // Simulação de API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAlertInfo({
        type: 'success',
        title: 'Sucesso!',
        message: 'Disciplina cadastrada com sucesso.'
      });
      setShowAlert(true);
      
      // Redireciona após 2 segundos
      setTimeout(() => {
        router.push('/professor/dashboard');
      }, 2000);
      
    } catch (error) {
      setAlertInfo({
        type: 'error',
        title: 'Erro',
        message: 'Ocorreu um erro ao cadastrar a disciplina.'
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
        userName="Nome Professor"
      />
      
      <main className="flex-1 bg-white">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-10">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-10">
            Cadastro de Disciplina
          </h1>

          <Card className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Nome da disciplina"
                required
                disabled={loading}
              />

              <Input
                label="Carga Horária"
                name="cargaHoraria"
                value={formData.cargaHoraria}
                onChange={handleChange}
                placeholder="Ex: 60 horas"
                disabled={loading}
              />

              <div className="flex space-x-4">
                <Link href="/professor/dashboard" className="flex-1">
                  <Button
                    variant="outline"
                    fullWidth
                    disabled={loading}
                    type="button"
                  >
                    Cancelar
                  </Button>
                </Link>
                <Button
                  variant="dark"
                  fullWidth
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Cadastrando...' : 'Cadastrar'}
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