'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Alert from '@/components/ui/alertas';
import QuestaoForm from '@/components/questao/questaoForm';
import { apiFetch } from '@/services/api';

export default function NovaQuestaoPage() {
  const router = useRouter();
  const params = useParams();
  const disciplinaId = params?.id; // ID da disciplina vindo da URL

  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);

  // URL de destino após salvar (Ex: Dashboard da disciplina ou lista de questões)
  const urlRetorno = `/professor/disciplina/${disciplinaId}`;

  const handleCreate = async (questaoDTO) => {
    setLoading(true);
    setAlertInfo(null);

    try {
      // POST /disciplinas/{id}/questoes
      const response = await apiFetch(`/disciplinas/${disciplinaId}/questoes`, {
        method: 'POST',
        body: JSON.stringify(questaoDTO)
      });

      if (response.ok) {
        setAlertInfo({ type: 'success', message: 'Questão criada com sucesso!' });
        setTimeout(() => router.push(urlRetorno), 1500);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao criar questão.');
      }
    } catch (error) {
      setAlertInfo({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isLoggedIn={true} userType="professor" userName="Professor" />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Nova Questão
        </h1>

        {alertInfo && (
          <div className="mb-6 max-w-3xl mx-auto">
             <Alert type={alertInfo.type} message={alertInfo.message} onClose={() => setAlertInfo(null)} />
          </div>
        )}

        <QuestaoForm 
          onSubmit={handleCreate} 
          onCancel={() => router.push(urlRetorno)}
          loading={loading}
        />
      </main>
      <Footer />
    </div>
  );
}